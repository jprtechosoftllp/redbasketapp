# -------- Build Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy monorepo-level dependency files
COPY apps/auth-service/package.json ./package.json
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy drizzle config
COPY drizzle.config.ts ./

# Copy workspace packages that auth-service depends on
COPY packages/backend ./packages/backend

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install dependencies
RUN pnpm install --prod --filter auth-service...

# Copy build application
COPY apps/auth-service/dist ./dist

# -------- Runtime Stage --------
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy built app and dependencies
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Optional: drizzle.config.ts if needed at runtime
COPY --from=builder --chown=nodejs:nodejs /app/drizzle.config.ts ./drizzle.config.ts

USER nodejs
EXPOSE 8081

CMD ["dumb-init", "node", "dist/main.js"]