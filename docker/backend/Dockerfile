# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/
COPY packages/configs/package.json ./packages/configs/

RUN npm install --workspace=apps/backend --workspace=packages/types --workspace=packages/configs

# ─── Stage 2: builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client antes do build
RUN cd apps/backend && ./../../node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

RUN npm run build --workspace=apps/backend

# ─── Stage 3: runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Binário compilado
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json

# Schema Prisma (necessário para migrate/db push)
COPY --from=builder /app/apps/backend/prisma ./prisma

# Instala somente deps de produção
RUN npm install --omit=dev

# Copia o client Prisma gerado (específico para linux-musl-openssl-3.0.x)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cria pasta de uploads com permissão para o usuário nestjs
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs

EXPOSE 3001
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main"]
