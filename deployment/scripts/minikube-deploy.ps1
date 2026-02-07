Write-Host "🚀 Building and Deploying to Minikube..." -ForegroundColor Green

# Step 1: Connect to Minikube Docker
Write-Host "`n📦 Connecting to Minikube Docker daemon..." -ForegroundColor Yellow
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Verify connection
$dockerInfo = docker info 2>&1 | Select-String "Name:"
Write-Host "Connected to: $dockerInfo" -ForegroundColor Cyan

# Step 2: Build images
Write-Host "`n🔨 Building Docker images in Minikube..." -ForegroundColor Yellow

Write-Host "Building backend..." -ForegroundColor Cyan
docker build -f deployment/docker/backend.Dockerfile -t todo-backend:latest .

Write-Host "`nBuilding frontend..." -ForegroundColor Cyan
docker build -f deployment/docker/frontend.Dockerfile -t todo-frontend:latest .

# Step 3: Verify images
Write-Host "`n✅ Images built in Minikube:" -ForegroundColor Yellow
docker images | Select-String "todo"

# Step 4: Apply secrets
Write-Host "`n🔐 Applying secrets..." -ForegroundColor Yellow
kubectl apply -f deployment/k8s/database-secret.yaml

# Step 5: Delete old deployments
Write-Host "`n🗑️ Deleting old deployments..." -ForegroundColor Yellow
kubectl delete deployment todo-backend --ignore-not-found
kubectl delete deployment todo-frontend --ignore-not-found

# Wait for cleanup
Start-Sleep -Seconds 5

# Step 6: Deploy
Write-Host "`n🎯 Deploying to Kubernetes..." -ForegroundColor Yellow
kubectl apply -f deployment/k8s/backend-deployment.yaml
kubectl apply -f deployment/k8s/frontend-deployment.yaml

# Step 7: Wait and check status
Write-Host "`n⏳ Waiting for pods to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n📊 Deployment Status:" -ForegroundColor Green
kubectl get pods
kubectl get services

Write-Host "`n✨ Deployment complete!" -ForegroundColor Green
Write-Host "`n🌐 To access the app, run:" -ForegroundColor Cyan
Write-Host "   minikube service todo-frontend --url" -ForegroundColor White