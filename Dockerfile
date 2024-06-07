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