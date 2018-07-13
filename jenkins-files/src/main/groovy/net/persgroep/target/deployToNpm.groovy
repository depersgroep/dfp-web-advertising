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
            sh 'npm clear cache --force'
            sh 'npm i'
        }

        stage('Bump version'){
            println("chosen semver type:" + env.VersionBump)
            sh 'npm version ' + env.VersionBump + ' -f -m "Bumped to a new ' + env.VersionBump +' version: %s"'
        }

        stage('Build script with new version number'){
                sh 'npm run jenkins-build'
        }

        stage('Push new version to NPM'){
            withNPM(npmrcConfig: 'NpmJsConfigFile') {
                sh 'npm publish --access public'
            }
        }

        stage('Push new version to GitHub'){
            general.runGitCommand('git push origin ' + env.Branch)
            general.runGitCommand('git push origin --tags')
        }


        general.hipChatNotifySuccessful()

    } catch (e) {
        
        general.hipChatNotifyFailed()
        println e.toString()
        currentBuild.result = "FAILURE"

    } finally {

        stage('Wipe workspace'){
            deleteDir()
        }

    }

}

