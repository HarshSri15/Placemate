# ===============================
# Build stage
# ===============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# ✅ install ALL deps (typescript needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build



# ===============================
# Production stage
# ===============================
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# ✅ only production deps here (smaller image)
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files only
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/server.js"]
