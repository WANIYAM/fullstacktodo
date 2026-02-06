# Stage 1: Dependency Installation
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

# Build the Next.js application
RUN npm run build

# Stage 3: Runner Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN adduser --system --group appuser
USER appuser

# Copy necessary files for running the Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js listens on
EXPOSE 3000

# Command to start the Next.js production server
CMD ["npm", "start"]
