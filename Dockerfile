# Base stage for installing dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Development stage
FROM base AS development
COPY . .
# Expose the Vite dev port
EXPOSE 5173
# Start Vite dev server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage for production
FROM base AS build
COPY . .
RUN npm run build

# Production stage
FROM caddy:2.7-alpine AS production
COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80

