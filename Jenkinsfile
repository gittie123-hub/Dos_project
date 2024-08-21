pipeline {
    agent {
        docker {
            image 'node:20'
            args '-v /var/jenkins_home:/home/node'
        }
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        // Add more stages as needed
    }
}