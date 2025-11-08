#!/bin/bash

set -euo pipefail  # Exit on error, undefined vars, or failed pipes

echo "🚀 Starting production deployment..."

# Ensure required environment variables are set
: "${DOCKER_HUB_USERNAME:?❌ DOCKER_HUB_USERNAME is not set}"
: "${DOCKER_HUB_PASSWORD:?❌ DOCKER_HUB_PASSWORD is not set}"
: "${CHANGED_BACKEND:?❌ CHANGED_BACKEND is not set}"
: "${CHANGED_FRONTEND:?❌ CHANGED_FRONTEND is not set}"

# Login to Docker Hub
echo "🔐 Logging into Docker Hub..."
echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Convert JSON arrays to bash lists
BACKEND_SERVICES=$(echo "$CHANGED_BACKEND" | jq -r '.[]?')
FRONTEND_SERVICES=$(echo "$CHANGED_FRONTEND" | jq -r '.[]?')

# Pull and restart backend services
if [ "$CHANGED_BACKEND" != "[]" ]; then
  echo "🔄 Pulling and restarting changed backend services..."
  for service in $BACKEND_SERVICES; do
    echo "🚀 Updating backend: $service"
    docker pull "$DOCKER_HUB_USERNAME/$service:latest"
    docker stop "$service" || echo "Service $service not running"
    docker rm "$service" || echo "Service $service not found"
    docker run -d --name "$service" "$DOCKER_HUB_USERNAME/$service:latest"
  done
else
  echo "✅ No backend changes detected."
fi

# Pull and restart frontend services
if [ "$CHANGED_FRONTEND" != "[]" ]; then
  echo "🔄 Pulling and restarting changed frontend services..."
  for service in $FRONTEND_SERVICES; do
    echo "🚀 Updating frontend: $service"
    docker pull "$DOCKER_HUB_USERNAME/$service:latest"
    docker stop "$service" || echo "Service $service not running"
    docker rm "$service" || echo "Service $service not found"
    docker run -d --name "$service" "$DOCKER_HUB_USERNAME/$service:latest"
  done
else
  echo "✅ No frontend changes detected."
fi

# Start/restart services using docker-compose
echo "📦 Deploying services with docker-compose..."
docker-compose -f docker-compose.production.yaml up -d

# Health check function
check_containers() {
  local nginx_status=$(docker inspect -f '{{.State.Running}}' meato-nginx-1 2>/dev/null)
  local gateway_status=$(docker inspect -f '{{.State.Running}}' meato-api-gateway-1 2>/dev/null)

  if [ "$nginx_status" = "true" ] && [ "$gateway_status" = "true" ]; then
    echo "✅ Both containers are running."
    return 0
  else
    echo "⚠️ One or both containers are not running."
    return 1
  fi
}

echo "⏳ Waiting for containers to be healthy..."
# until check_containers; do
#   sleep 5
# done

# # Deploy backend services with .env and fixed port mapping
# echo "📦 Deploying backend services..."
# for service in $BACKEND_SERVICES; do
#   echo "➡️ Deploying backend: $service"
#   if cd "apps/$service"; then
#     docker rm -f "$service" || true
#     case "$service" in
#       api-gateway)   port=8080 ;;
#       auth-service)  port=8081 ;;
#       product-service) port=8082 ;;
#       admin-service) port=8083 ;;
#       manager-service) port=8084 ;;
#       *) port=8090 ;; # fallback
#     esac
#     docker run -d --name "$service" --env-file .env -p "$port:$port" "$DOCKER_HUB_USERNAME/$service:latest"
#     cd - > /dev/null
#   else
#     echo "⚠️ Directory apps/$service not found. Skipping..."
#   fi
# done

# # Deploy frontend services with fixed port mapping
# echo "🎨 Deploying frontend services..."
# for ui in $FRONTEND_SERVICES; do
#   echo "➡️ Deploying frontend: $ui"
#   if cd "apps/$ui"; then
#     docker rm -f "$ui" || true
#     case "$ui" in
#       user-ui)    port=3000 ;;
#       admin-ui)   port=3001 ;;
#       manager-ui) port=3002 ;;
#       vendor-ui)  port=3003 ;;
#       *) port=3010 ;; # fallback
#     esac
#     docker run -d --name "$ui" -p "$port:80" "$DOCKER_HUB_USERNAME/$ui:latest"
#     cd - > /dev/null
#   else
#     echo "⚠️ Directory apps/$ui not found. Skipping..."
#   fi
# done

# echo "✅ Deployment complete!"