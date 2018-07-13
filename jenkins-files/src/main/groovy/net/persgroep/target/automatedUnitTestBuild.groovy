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
            sh 'npm i --verbose'
        }

        stage('Execute unit tests') {
            withCredentials([
                    string(credentialsId: 'BROWSERSTACK_KEY', variable: 'BROWSERSTACK_KEY'),
                    string(credentialsId: 'BROWSERSTACK_USR', variable: 'BROWSERSTACK_USR')
            ]) {

                sh 'npm run test-browserstack'

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
    }

}

