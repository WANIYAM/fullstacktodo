# Kubernetes Deployment Specification

## Components

### Frontend Deployment
- Replicas: 2
- Image: todo-frontend:latest
- Service: NodePort (for Minikube access)
- Resources: 256Mi memory, 200m CPU

### Backend Deployment
- Replicas: 2
- Image: todo-backend:latest
- Service: ClusterIP
- Resources: 512Mi memory, 500m CPU

### Secrets
- DATABASE_URL
- OPENAI_API_KEY
- BETTER_AUTH_SECRET

## Deliverables
All manifests in deployment/k8s/