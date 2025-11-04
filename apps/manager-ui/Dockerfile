# ---------- DEPS STAGE ----------
FROM node:22-alpine AS deps
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate

# Copy root + workspace configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# Copy only required package manifests
COPY apps/manager-ui/package.json ./apps/manager-ui/
COPY packages/frontend ./packages/frontend

# Install all dependencies (workspace-aware)
RUN pnpm install --filter manager-ui... --frozen-lockfile

# 🧩 Ensure node_modules exists (even if only partial)
RUN mkdir -p /app/node_modules

# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.18.2 --activate

# Copy all dependencies from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/packages/frontend ./packages/frontend


# Copy only essential workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json tsconfig.json ./
# ✅ Ensure Nx CLI and workspace tools are available


# Copy manager-ui source code
COPY apps/manager-ui ./apps/manager-ui

# # Build using Nx
# RUN npx nx build manager-ui

# ---------- RUNNER STAGE ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production dependencies only (root)
COPY --from=deps /app/node_modules ./node_modules

# Copy built app & required assets
COPY --from=builder /app/apps/manager-ui/.next ./apps/manager-ui/.next
COPY --from=builder /app/apps/manager-ui/public ./apps/manager-ui/public
COPY --from=builder /app/apps/manager-ui/package.json ./apps/manager-ui/package.json

EXPOSE 3002

USER node

CMD ["pnpm", "--filter", "manager-ui", "start"]