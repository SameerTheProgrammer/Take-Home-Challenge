<<<<<<< HEAD
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build



FROM node:18-alpine as production
# ENV NODE_ENV=prod
# ARG NODE_ENV=prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY --from=builder /app/dist ./
EXPOSE 3000
CMD ["pm2-runtime", "src/server.js"]
=======
# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:18-slim

WORKDIR /app

# Copy the build output and node_modules from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Copy the environment file
ARG NODE_ENV=prod
COPY .env.${NODE_ENV} ./.env

# Install a process manager (like pm2) for production use
RUN npm install -g pm2

# Expose the port the app runs on
EXPOSE 3000

# Start the application using pm2
CMD ["pm2-runtime", "dist/index.js"]
>>>>>>> 3c764623bf1fd513972ea8d991bb4b65bc2bf404
