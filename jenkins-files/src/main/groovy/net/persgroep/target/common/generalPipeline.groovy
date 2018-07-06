package main.groovy.net.persgroep.target.common

def hipchatNotifyStarted() {
    hipchatSend (color: 'GREEN', notify: true,
            message: "Build Started: <a href='${env.BUILD_URL}'>${env.JOB_NAME}</a>"
    )
}

def hipChatNotifySuccessful() {
    hipchatSend (color: 'GREEN', notify: true,
            message: "Build Successful: <a href='${env.BUILD_URL}'>${env.JOB_NAME}</a>"
    )
}

def hipChatNotifyFailed() {
    hipchatSend (color: 'RED', notify: true,
            message: "Build Failed: <a href='${env.BUILD_URL}'>${env.JOB_NAME}</a>"
    )
}

def runGitCommand(String gitCommand) {
    sshagent(['github-ssh']) {
        sh '' + gitCommand
    }
}

return this

