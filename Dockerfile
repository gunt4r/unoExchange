# syntax=docker/dockerfile:1

# 1. Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 2. Production stage
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl tzdata
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files
COPY --from=builder /app/package*.json ./

# Install ALL dependencies (required for TypeORM CLI with TS)
# НЕ используйте --omit=dev, иначе сломаются миграции
RUN npm ci && npm cache clean --force

# Copy built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./

# Copy TypeORM config and migrations (ВАЖНО: копируем до смены пользователя)
COPY --from=builder --chown=nextjs:nodejs /app/typeorm.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/src/migrations ./src/migrations
COPY --from=builder --chown=nextjs:nodejs /app/src/models ./src/models
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.typeorm.json ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./


# Switch to non-root user
USER nextjs

EXPOSE 3000

# Run migrations first, then start the app
CMD ["sh", "-c", "npm run migration:run && npm start"]