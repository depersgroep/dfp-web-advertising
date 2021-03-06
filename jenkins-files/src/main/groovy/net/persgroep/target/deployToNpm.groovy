package main.groovy.net.persgroep.target

String basePath = '/jenkins-files/src/main/groovy/net/persgroep/target/'

node('java-1.8') {

    stage('Checkout branch') {
        println('Checking out branch: ' + env.Branch)
        git credentialsId: 'github-ssh', url: 'git@github.com:depersgroep/dfp-web-advertising.git', branch: env.Branch
    }

    def workspace = pwd()
    def general = load "${workspace}" + basePath + "common/generalPipeline.groovy"

    try {

        stage('Install dependencies'){
            sh 'npm cache clean --force'
            sh 'npm i'
        }

        stage('Execute Tests'){
            withCredentials([
                    string(credentialsId: 'BROWSERSTACK_KEY', variable: 'BROWSERSTACK_KEY'),
                    string(credentialsId: 'BROWSERSTACK_USR', variable: 'BROWSERSTACK_USR')
            ]) {
                sh 'npm run test-browserstack'
            }
        }

        stage('Bump version') {
            println("chosen semver type:" + env.VersionBump)
            sh 'npm version ' + env.VersionBump + ' -f -m "Bumped to a new ' + env.VersionBump + ' version: %s"'
        }

        stage('Push new version to GitHub'){
            general.runGitCommand('git push origin ' + env.Branch)
            general.runGitCommand('git push origin --tags')
        }

        stage('Push new version to NPM'){
            withNPM(npmrcConfig: 'NpmJsConfigFile') {
                sh 'npm publish --access public'
            }
        }

        general.hipChatNotifySuccessful()

    } catch (e) {
        
        general.hipChatNotifyFailed()
        println e.toString()
        currentBuild.result = "FAILURE"

    } finally {

        stage('Create XML reports'){
            junit 'junitResults/*.xml'
        }

        stage('check coverage reports') {
            cobertura coberturaReportFile: 'coverage/**/*.xml'
        }

        stage('Wipe workspace'){
            deleteDir()
        }

    }

}

