# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY apps/frontend ./apps/frontend

RUN npm ci
RUN npx nx sync
RUN npx nx build frontend --prod

# Production stage
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
