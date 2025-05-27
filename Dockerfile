FROM node:18-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies)
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --include=dev

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Start a new stage for production
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY server.js .

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8080

# Start the server
CMD ["node", "server.js"] 