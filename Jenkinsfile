pipeline {
    agent any

        environment {
      
        NODE_HOME = tool name: 'NodeJS', type: 'NodeJS'
        PATH = "${NODE_HOME}/bin:${env.PATH}"
        
       
        NEXT_PUBLIC_API_BASE = 'http://localhost:8080/catsqb/rest'
        NEXT_PUBLIC_API_BASE_AUTHENTICATION='http://localhost:8080/catsqb/'
     
    }

        tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install' 
                sh 'npm install date-fns'  
                sh 'npm install react-select'
              
            }
        }
       stage('Build') {
            steps {
                script {
                   
                    sh '''
                    NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE} \
                    NEXT_PUBLIC_API_BASE_AUTHENTICATION=${NEXT_PUBLIC_API_BASE_AUTHENTICATION} \
                    npm run build
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Pipeline succeeded'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
