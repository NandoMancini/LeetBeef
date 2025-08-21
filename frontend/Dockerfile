# 1. Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Serve stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx.conf for SPA fallback
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
