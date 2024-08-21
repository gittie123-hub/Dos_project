pipeline {
    agent {
        docker {
            image 'node:20'
            args '-v /var/jenkins_home:/home/node'
        }
    }
    stages {
        stage('Check Node.js and npm Versions') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Install Dependencies - Admin') {
            steps {
                dir('admin') {
                    sh 'npm install'
                }
            }
        }
        stage('Build - Admin') {
            steps {
                dir('admin') {
                    sh 'npm run build'
                }
            }
        }
        stage('Install Dependencies - Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        stage('Build - Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Install Dependencies - Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        stage('Build - Backend') {
            steps {
                dir('backend') {
                    sh 'npm run build'
                }
            }
        }
        // Add more stages as needed
    }
}