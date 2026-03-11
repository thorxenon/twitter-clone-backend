pipeline {
    agent any

    stages {
        stage('Build Image') {
            steps {
                script {
                    // dockerapp = docker.build("twitter-clone-backend:${env.BUILD_ID}", "-f Dockerfile .")
                    dockerapp = docker.build("thorxenon/twitter-clone-backend:latest", "-f Dockerfile .")
                }
            }
        }
        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        dockerapp.push('latest')
                        dockerapp.push("${env.BUILD_ID}")
                    }
                }
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