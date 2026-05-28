# PDAGE Backend — Multi-stage Dockerfile
# Based on NestJS with production optimizations

# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json ./
COPY turbo.json ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/

# Copy shared packages
COPY packages/types/package.json ./packages/types/
COPY packages/configs/package.json ./packages/configs/

# Install all dependencies (including devDependencies for build)
RUN npm install --workspace=apps/backend --workspace=packages/types --workspace=packages/configs

# ─── Stage 2: builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy all source files
COPY . .

# Build NestJS application
RUN npm run build --workspace=apps/backend

# ─── Stage 3: runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy compiled output and production dependencies only
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json

# Install only production dependencies
RUN npm install --omit=dev

USER nestjs

EXPOSE 3001

ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main"]
