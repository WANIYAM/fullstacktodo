# Dockerization Specification for Next.js and FastAPI Applications

## 1. Introduction

This document outlines the specifications for Dockerizing a Next.js frontend and a FastAPI backend application. Dockerization provides a consistent, isolated, and portable environment for building, shipping, and running applications, facilitating development, testing, and deployment across various environments.

## 2. General Principles

*   **Multi-stage Builds:** Utilize multi-stage builds to create optimized and minimal Docker images. This separates build-time dependencies from runtime dependencies, resulting in smaller image sizes and reduced attack surfaces.
*   **.dockerignore:** Employ `.dockerignore` files in both the frontend and backend directories to exclude unnecessary files and directories (e.g., `node_modules`, `.git`, `__pycache__`) from the Docker build context. This speeds up builds and reduces image size.
*   **Non-root User:** Run containers as a non-root user to enhance security and mitigate potential vulnerabilities.
*   **Caching Layers:** Structure Dockerfiles to leverage Docker's build cache effectively. Place commands that change infrequently (e.g., dependency installation) in earlier layers.
*   **Environment Variables:** Use environment variables for configuration (e.g., database connection strings, API keys) instead of hardcoding values directly into the image. This allows for flexible configuration across different environments (development, staging, production).
*   **Health Checks:** Implement Docker health checks to ensure that containers are not just running but are also healthy and responsive.

## 3. Backend (FastAPI) Dockerfile Specification

The `Dockerfile` for the FastAPI backend will be located in the `backend/` directory.

### Example `backend/Dockerfile`

```dockerfile
# Stage 1: Build Stage
FROM python:3.10-slim-buster AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy only requirements.txt to leverage Docker cache
COPY ./backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime Stage
FROM python:3.10-slim-buster AS runner

WORKDIR /app

# Copy only necessary runtime dependencies from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn

# Create a non-root user
RUN adduser --system --group appuser
USER appuser

# Copy application code
COPY ./backend .

# Expose the port FastAPI listens on
EXPOSE 8000

# Command to run the FastAPI application using Uvicorn
# Assuming your main FastAPI app instance is named 'app' in 'main.py'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables (Backend)

*   `DATABASE_URL`: Connection string for the database (e.g., `postgresql://user:password@host:port/dbname`).
*   `SECRET_KEY`: A strong secret key for security (e.g., for JWTs).
*   `CORS_ORIGINS`: Comma-separated list of allowed CORS origins.
*   `PORT`: The port on which the FastAPI application will listen (default: `8000`).
*   Any other application-specific configuration.

## 4. Frontend (Next.js) Dockerfile Specification

The `Dockerfile` for the Next.js frontend will be located in the `frontend/` directory.

### Example `frontend/Dockerfile`

```dockerfile
# Stage 1: Dependency Installation
FROM node:18-alpine AS deps

WORKDIR /app

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci

# Stage 2: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY ./frontend ./

# Build the Next.js application
# If using a standalone output, you might need to adjust the copy commands in the final stage
# and the CMD command.
RUN npm run build

# Stage 3: Runner Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN adduser --system --group appuser
USER appuser

# Copy necessary files for running the Next.js app
# This includes the .next directory, public assets, and package.json/next.config.js for npm start
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# If using Next.js standalone output, copy the entire .next/standalone folder
# COPY --from=builder /app/.next/standalone ./

# Expose the port Next.js listens on
EXPOSE 3000

# Command to start the Next.js production server
# If using standalone output, use: CMD ["node", ".next/standalone/server.js"]
CMD ["npm", "start"]
```

### Environment Variables (Frontend)

*   `NODE_ENV`: Should be `production` for production builds.
*   `PORT`: The port on which the Next.js application will listen (default: `3000`).
*   `NEXT_PUBLIC_API_URL`: The URL of the backend API, accessible from the frontend.
*   Any other application-specific environment variables, prefixed with `NEXT_PUBLIC_` if they need to be exposed to the browser.

## 5. `.dockerignore` Files

### Example `backend/.dockerignore`

```
__pycache__/
*.pyc
*.log
.venv/
venv/
.git/
.gitignore
.DS_Store
*.swp
Dockerfile
```

### Example `frontend/.dockerignore`

```
node_modules/
.next/
out/
.git/
.gitignore
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.swp
Dockerfile
```

## 6. Next Steps and Considerations

*   **Docker Compose:** For local development, consider using Docker Compose to define and run multi-container Docker applications. This allows you to manage both the frontend and backend services (and potentially a database) with a single command.
*   **Orchestration:** For production deployments, consider container orchestration platforms like Kubernetes, which can manage scaling, load balancing, and self-healing of your Dockerized applications.
*   **CI/CD Integration:** Integrate Docker image builds into your Continuous Integration/Continuous Deployment (CI/CD) pipeline to automate the process of building and pushing images to a container registry.
*   **Security Scanning:** Regularly scan your Docker images for vulnerabilities using tools like Trivy or Clair.
*   **Resource Limits:** Define resource limits (CPU, memory) for your containers in production to prevent resource exhaustion.
