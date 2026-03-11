pipeline {
    agent any

    stages {
        stage('Build Image') {
            steps {
                sh 'echo "Building..."'
                // Add your build commands here
            }
        }
        stage('Push Image') {
            steps {
                sh 'echo "Pushing image..."'
                // Add your push commands here
            }
        }
        stage('Deploy on Kubernetes') {
            steps {
                sh 'echo "Deploying on Kubernetes..."'
                // Add your deploy commands here
            }
        }
    }
}