FROM node:20-alpine AS deps

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend ./

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copy everything needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

CMD ["npm", "start"]