# Build stage
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./

COPY apps/backend ./apps/backend

RUN npm ci
RUN npx nx sync
RUN npx nx build backend --prod

# Production stage
FROM node:20-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist

# Create storage directory with proper permissions
RUN mkdir -p /app/storage && chown -R nestjs:nodejs /app/storage

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["node", "dist/main.js"]