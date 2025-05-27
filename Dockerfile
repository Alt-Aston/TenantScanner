FROM node:18-alpine AS builder

WORKDIR /app

# Update npm to a specific version known to work
RUN npm install -g npm@10.2.4

# Copy package files first for better caching
COPY package.json package-lock.json ./
COPY tsconfig*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Verify the build output exists
RUN test -d dist && echo "Build output verified"

# Start a new stage for production
FROM node:18-alpine

WORKDIR /app

# Update npm to same version as builder
RUN npm install -g npm@10.2.4

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY server.js .

# Verify the copied files
RUN test -f server.js && test -d dist && echo "Production files verified"

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start the server
CMD ["node", "server.js"] 