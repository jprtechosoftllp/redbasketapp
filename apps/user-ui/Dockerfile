# ---------- Builder Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only essential files for install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/user-ui/package.json ./apps/user-ui/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json

# Install only what's needed for user-ui and its deps (like frontend)
RUN pnpm install --frozen-lockfile --filter user-ui...

# Copy full source for build
COPY apps ./apps
COPY packages ./packages
COPY tsconfig.base.json nx.json ./

# Build the Next.js app
RUN pnpm nx build user-ui

---

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/apps/user-ui/package.json ./apps/user-ui/package.json
COPY --from=builder /app/packages/frontend/package.json ./packages/frontend/package.json

# Install production deps for user-ui and frontend
RUN pnpm install --prod --filter user-ui...

# Copy built output and public assets
COPY --from=builder /app/dist/apps/user-ui ./.next
COPY --from=builder /app/apps/user-ui/public ./public
COPY --from=builder /app/apps/user-ui/next.config.js ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start", "--filter", "user-ui"]