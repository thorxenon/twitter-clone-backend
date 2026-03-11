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

        stage('Deploy Load Balancer on Kubernetes') {
            steps {
                //deploying nginx load balancer on kubernetes cluster
                sh "kubectl apply -f k8s/nginx/pvc.yaml"
                sh "kubectl apply -f k8s/nginx/nginx.yaml"
                sh "kubectl apply -f k8s/nginx/service.yaml"
                sh "kubectl rollout restart deployment nginx-gateway -n nginx-gateway"
            }
        }

        stage('Deploy Database on Kubernetes'){
            steps {
                //deploying the database on kubernetes cluster
                withCredentials([
                    string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'db-user', variable: 'DB_USER'),
                    string(credentialsId: 'db-name', variable: 'DB_NAME'),
                    string(credentialsId: 'db-host', variable: 'DB_HOST'),
                    string(credentialsId: 'db-port', variable: 'DB_PORT')
                ]) {
                    
                    sh '''
                        kubectl create secret generic db-secret \
                        --from-literal=DB_PASSWORD=${DB_PASSWORD} \
                        --from-literal=DB_USER=${DB_USER} \
                        --from-literal=DB_NAME=${DB_NAME} \
                        --from-literal=DB_HOST=${DB_HOST} \
                        --from-literal=DB_PORT=${DB_PORT} \
                        -n postgres --dry-run=client -o yaml | kubectl apply -f -
                        '''
                }
                sh "kubectl apply -f k8s/database/postgres-pvc.yaml"
                sh "kubectl apply -f k8s/database/postgres.yaml"
                sh "kubectl apply -f k8s/database/postgres-service.yaml"
                sh "kubectl rollout restart statefulset postgres -n postgres"
            }
        }

        stage('Deploy Nest Api on Kubernetes') {
            steps {
                //deploying the app on kubernetes cluster
                withCredentials([
                    string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'db-user', variable: 'DB_USER'),
                    string(credentialsId: 'db-name', variable: 'DB_NAME'),
                    string(credentialsId: 'db-host-api', variable: 'DB_HOST'),
                    string(credentialsId: 'db-port', variable: 'DB_PORT'),
                    string(credentialsId: 'pepper', variable: 'PEPPER'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'admin-nickname', variable: 'ADMIN_NICKNAME'),
                    string(credentialsId: 'admin-password', variable: 'ADMIN_PASSWORD'),
                    string(credentialsId: 'admin-email', variable: 'ADMIN_EMAIL'),
                    string(credentialsId: 'admin-full-name', variable: 'ADMIN_FULL_NAME'),
                    string(credentialsId: 'admin-birth-date', variable: 'ADMIN_BIRTH_DATE')
                ]) {
                    
                    sh '''
                        kubectl create secret generic app-secret \
                        --from-literal=DB_PASSWORD=${DB_PASSWORD} \
                        --from-literal=DB_USER=${DB_USER} \
                        --from-literal=DB_NAME=${DB_NAME} \
                        --from-literal=DB_HOST=${DB_HOST} \
                        --from-literal=DB_PORT=${DB_PORT} \
                        --from-literal=PEPPER=${PEPPER} \
                        --from-literal=JWT_SECRET=${JWT_SECRET} \
                        --from-literal=ADMIN_NICKNAME=${ADMIN_NICKNAME} \
                        --from-literal=ADMIN_PASSWORD=${ADMIN_PASSWORD} \
                        --from-literal=ADMIN_EMAIL=${ADMIN_EMAIL} \
                        --from-literal=ADMIN_FULL_NAME=${ADMIN_FULL_NAME} \
                        --from-literal=ADMIN_BIRTH_DATE=${ADMIN_BIRTH_DATE} \
                        -n nestp-app \
                        --dry-run=client -o yaml | kubectl apply -f -
                        '''
                }
                sh "kind load docker-image thorxenon/twitter-clone-backend:latest"
                sh "kubectl apply -f k8s/app/configmap.yaml"
                sh "kubectl apply -f k8s/app/deployment.yaml"
                sh "kubectl apply -f k8s/app/app-service.yaml"
            }
        }
    }
}