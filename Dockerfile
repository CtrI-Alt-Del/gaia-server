# Multi-stage build for production optimization
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install ALL dependencies (including devDependencies) for building
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=src/infra/database/prisma/schema.prisma

# Build the application
RUN npm run build

# Production image, copy all the files and run nest
FROM base AS runner
WORKDIR /app

# Instala fontes necessárias para o pdfmake funcionar no Alpine
# RUN apk add --no-cache font-noto font-noto-emoji ttf-dejavu
RUN apt-get update && \
  apt-get install -y fonts-dejavu-core && \
  rm -rf /var/lib/apt/lists/*

# Diz ao pdfmake onde estão as fontes
ENV PDF_FONTS_DIR=/usr/share/fonts/truetype/dejavu
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json


# Copy Prisma schema (optional, useful for migrations at runtime)
COPY --from=builder --chown=nestjs:nodejs /app/src/infra/database/prisma ./src/infra/database/prisma

USER nestjs

EXPOSE 3333

ENV NODE_ENV=production
ENV PORT=3333

CMD ["sh", "-c", "npx prisma migrate reset --schema=src/infra/database/prisma/schema.prisma --force && node dist/src/infra/main.js"]