#Build
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

#Production
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/apps/backend/dist ./dist
RUN mkdir -p /app/storage

EXPOSE 3000

CMD ["node","dist/main.js"]