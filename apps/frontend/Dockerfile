FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY apps/frontend ./apps/frontend

RUN npm ci
RUN npx nx sync
RUN npx nx build frontend --prod


FROM nginx:alpine 

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx","-g","daemon off;"]
