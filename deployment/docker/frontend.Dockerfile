# Stage 1: Dependency Installation
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package.json and package-lock.json from the frontend directory
COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

# Stage 2: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the entire frontend directory content
COPY frontend ./

# Build the Next.js application
RUN npm run build

# Stage 3: Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user (best practice)
RUN addgroup -S appuser && adduser -S appuser -G appuser
USER appuser


# Copy necessary files for running the Next.js app
# This includes the .next directory, public assets, and package.json/next.config.js for npm start
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js listens on
EXPOSE 3000

# Command to start the Next.js production server
CMD ["npm", "start"]
