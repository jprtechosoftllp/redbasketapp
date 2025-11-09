# ----- Build Stage ------
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm

# Copy monorepo-level dependency files
COPY apps/api-gateway/package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy drizzle config
COPY drizzle.config.ts ./

# Copy workspace packages that api-gateway depends on
# COPY packages/backend ./packages/backend

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --filter @meato/api-gateway

# Copy build application
COPY apps/api-gateway/dist ./dist

# ------Production Stage ------
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy files from bulider stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/drizzle.config.ts ./drizzle.config.ts

#Switch to non-root user
USER nodejs

# Expose the correct port
EXPOSE 8080

# Use dumb-init to handle signales properly
CMD ["dumb-init", "node", "dist/main.js"]