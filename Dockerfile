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
FROM nginx:1.25-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
