FROM node:18-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies)
COPY package*.json ./
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

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"] 