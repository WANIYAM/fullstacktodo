# Todo App Constitution – Hackathon II

## Purpose
This system implements Phase II of the Hackathon II "Evolution of Todo".
The goal is to build a minimal, stable full-stack web application using
Spec-Driven Development.

## Non-Negotiable Constraints
- Code MUST be generated via spec-driven instructions
- No manual feature coding outside specs
- Monorepo structure is required
- Backend and frontend must be separate services

## Phase Scope
- Phase II only
- No chatbot
- No MCP
- No Kubernetes
- No Kafka
- No Dapr

## Technology Constraints
- Frontend: Next.js (App Router)
- Backend: FastAPI (Python)
- ORM: SQLModel
- Database: Neon PostgreSQL
- Authentication: JWT via Better Auth

## Functional Guarantees
- Each task belongs to exactly one authenticated user
- Users can only access their own tasks
- All task operations are CRUD-based
- Persistence is required

## Quality Bar
- Working API endpoints are higher priority than UI polish
- Partial authentication is acceptable if documented
- Stability > features

## Definition of Done (Phase II)
- REST API works locally
- Frontend can create and list tasks
- Data persists in database
- Specs folder fully reflects implementation