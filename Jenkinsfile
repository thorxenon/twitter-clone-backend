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
                //deploying nginx load balancer on kubernetes cluster
                sh "kubectl apply -f k8s/pvc.yaml"
                sh "kubectl apply -f k8s/nginx/nginx-deployment.yaml"
                sh "kubectl rollout restart deployment app -n nest-app"
                sh "kubectl rollout restart deployment nginx-gateway -n nginx-gateway"

                //deploying the database on kubernetes cluster
                sh "kubectl apply -f k8s/database/secret.yaml"
                sh "kubectl apply -f k8s/database/postgres-pvc.yaml"
                sh "kubectl apply -f k8s/database/postgres.yaml"
                sh "kubectl apply -f k8s/database/postgres-service.yaml"
                sh "kubectl rollout restart deployment postgres -n postgres"

                //deploying the app on kubernetes cluster
                sh "kind load docker-image thorxenon/twitter-clone-backend:latest"
                sh "kubectl apply -f k8s/app/configmap.yaml"
                sh "kubectl apply -f k8s/app/secret.yaml"
                sh "kubectl apply -f k8s/app/app-deployment.yaml"
                sh "kubectl apply -f k8s/app/app-service.yaml"
                sh "kubectl rollout restart deployment app -n nest-app"
            }
        }
    }
}