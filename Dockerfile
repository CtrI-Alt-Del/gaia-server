# Multi-stage build for production optimization
FROM node:22-alpine AS base

# ----------------------
# deps: dependências de produção
# ----------------------
FROM base AS deps
# libc6-compat às vezes é necessário para algumas libs nativas
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instala apenas dependências de produção
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# ----------------------
# builder: build da aplicação
# ----------------------
FROM base AS builder
WORKDIR /app

# Instala TODAS as dependências (incluindo dev) para build
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=src/infra/database/prisma/schema.prisma

# Build the application
RUN npm run build

# ----------------------
# runner: imagem final de produção
# ----------------------
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copia apenas o que é necessário para rodar
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=deps    --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Copy Prisma schema (opcional, útil para migrations em runtime)
COPY --from=builder --chown=nestjs:nodejs /app/src/infra/database/prisma ./src/infra/database/prisma

USER nestjs

EXPOSE 3333

ENV NODE_ENV=production
ENV PORT=3333

# ⚠ cuidado: migrate reset apaga o banco inteiro sempre que o container sobe
CMD ["sh", "-c", "npx prisma migrate reset --schema=src/infra/database/prisma/schema.prisma --force && node dist/src/infra/main.js"]
