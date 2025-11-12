#!/bin/bash

set -euo pipefail

echo "🚀 Starting production deployment..."

# Ensure required environment variables are set
: "${DOCKER_HUB_USERNAME:?❌ DOCKER_HUB_USERNAME is not set}"
: "${DOCKER_ACCESS_TOKEN:?❌ DOCKER_ACCESS_TOKEN is not set}"

# Parse JSON arrays passed as arguments
BACKEND_SERVICES=$(echo "$1" | jq -r '.[]' || echo "")
FRONTEND_SERVICES=$(echo "$2" | jq -r '.[]' || echo "")

DOCKER_USER="${DOCKER_HUB_USERNAME:-redbasketapp}"

echo "🔧 Backend services: $BACKEND_SERVICES"
echo "🔧 Frontend services: $FRONTEND_SERVICES"

# Login to Docker Hub
echo "🔐 Logging into Docker Hub..."
echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Pull backend services
for SERVICE in $BACKEND_SERVICES; do
  echo "📦 Updating backend: $SERVICE"
  docker pull "$DOCKER_USER/$SERVICE:latest"
done

# Pull frontend services
for SERVICE in $FRONTEND_SERVICES; do
  echo "🎨 Updating frontend: $SERVICE"
  docker pull "$DOCKER_USER/$SERVICE:latest"
done

# Start/restart services using docker compose (v2)
if [ -f docker-compose.production.yaml ]; then
  echo "📦 Deploying services with docker compose..."
  docker-compose -f docker-compose.production.yaml up -d
else
  echo "⚠️ docker-compose.production.yaml not found — skipping compose deployment"
fi

# Health check function
check_health() {
  local unhealthy
  unhealthy=$(docker inspect --format='{{.Name}} {{.State.Health.Status}}' $(docker ps -q) 2>/dev/null | grep -v healthy || true)
  if [ -z "$unhealthy" ]; then
    return 0
  else
    echo "⚠️ Unhealthy containers detected:"
    echo "$unhealthy"
    return 1
  fi
}

# Retry loop for health checks
MAX_RETRIES=10
RETRY_INTERVAL=5
echo "⏳ Waiting for containers to be healthy..."
for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "🔍 Health check attempt $i/$MAX_RETRIES..."
  if check_health; then
    echo "✅ All containers are healthy."
    break
  fi
  sleep $RETRY_INTERVAL
done

if (( i > MAX_RETRIES )); then
  echo "❌ Some containers failed to become healthy after $MAX_RETRIES attempts."
  exit 1
fi

# Reload Nginx if running and api-gateway is healthy
if docker ps --format '{{.Names}}' | grep -q '^nginx-proxy$'; then
  echo "🔁 nginx-proxy is running."

  gateway_health=$(docker inspect -f '{{.State.Health.Status}}' api-gateway 2>/dev/null || echo "not_found")

  if [ "$gateway_health" = "healthy" ]; then
    echo "✅ api-gateway is healthy. Reloading Nginx config..."
    docker exec nginx-proxy nginx -t && docker exec nginx-proxy nginx -s reload
  else
    echo "⚠️ api-gateway is not healthy or not running — skipping Nginx reload"
  fi
else
  echo "⚠️ nginx-proxy not running — skipping reload"
fi

echo "✅ Deployment complete."