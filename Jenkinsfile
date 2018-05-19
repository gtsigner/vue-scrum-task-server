pipeline {
    agent {
        docker {
            image 'node:9.10-alpine'
            args '-p 3000:3000'
        }
    }
    environment {
       NODE_ENV = 'production'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm install eslint -g && npm install cross-env -g && npm run test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
}
