# System Architecture – Phase II

## Overview
The system is a two-service architecture:

- Frontend (Next.js)
- Backend (FastAPI)

Services communicate via REST over HTTP.

## Frontend Responsibilities
- User authentication using Better Auth
- UI rendering
- API requests with JWT attached

## Backend Responsibilities
- JWT verification
- Task CRUD operations
- Database access
- User isolation

## Authentication Flow
1. User authenticates via Better Auth (frontend)
2. JWT is issued
3. Frontend sends JWT in Authorization header
4. Backend verifies token using shared secret

## Data Flow
User → Frontend → Backend → Database

Backend is stateless.