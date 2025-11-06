# #!/bin/bash

# set -e  # Exit on error

# echo "🚀 Starting production deployment..."

# # Ensure required environment variables are set
# if [ -z "$DOCKER_HUB_USERNAME" ]; then
#   echo "❌ DOCKER_HUB_USERNAME is not set"
#   exit 1
# fi

# if [ -z "$DOCKER_HUB_PASSWORD" ]; then
#   echo "❌ DOCKER_HUB_PASSWORD is not set"
#   exit 1
# fi

# if [ -z "$CHANGED_BACKEND" ] && [ -z "$CHANGED_FRONTEND" ]; then
#   echo "❌ CHANGED_BACKEND and CHANGED_FRONTEND are not set"
#   exit 1
# fi

# # Login to Docker Hub
# echo "🔐 Logging into Docker Hub..."
# echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# # Convert JSON arrays to bash arrays
# BACKEND_SERVICES=$(echo "$CHANGED_BACKEND" | jq -r '.[]')
# FRONTEND_SERVICES=$(echo "$CHANGED_FRONTEND" | jq -r '.[]')

# # Pull and restart backend services
# if [ "$CHANGED_BACKEND" != "[]" ]; then
#   echo "🔄 Pulling and restarting changed backend services..."
#   for service in $BACKEND_SERVICES; do
#     echo "🚀 Updating backend: $service"
#     docker pull "$DOCKER_HUB_USERNAME/$service:latest"
#     docker stop "$service" || echo "Service $service not running"
#     docker rm "$service" || echo "Service $service not found"
#     docker run -d --name "$service" "$DOCKER_HUB_USERNAME/$service:latest"
#   done
# else
#   echo "✅ No backend changes detected."
# fi

# # Pull and restart frontend services
# if [ "$CHANGED_FRONTEND" != "[]" ]; then
#   echo "🔄 Pulling and restarting changed frontend services..."
#   for service in $FRONTEND_SERVICES; do
#     echo "🚀 Updating frontend: $service"
#     docker pull "$DOCKER_HUB_USERNAME/$service:latest"
#     docker stop "$service" || echo "Service $service not running"
#     docker rm "$service" || echo "Service $service not found"
#     docker run -d --name "$service" "$DOCKER_HUB_USERNAME/$service:latest"
#   done
# else
#   echo "✅ No frontend changes detected."
# fi

# # Deploy backend services with .env and port mapping
# echo "📦 Deploying backend services..."
# for service in $BACKEND_SERVICES; do
#   echo "➡️ Deploying backend: $service"
#   if cd "apps/$service"; then
#     docker rm -f "$service" || true
#     docker run -d --name "$service" --env-file .env -p 3000:3000 "$DOCKER_HUB_USERNAME/$service:latest"
#     cd - > /dev/null
#   else
#     echo "⚠️ Directory apps/$service not found. Skipping..."
#   fi
# done

# # Deploy frontend services with port mapping
# echo "🎨 Deploying frontend services..."
# for ui in $FRONTEND_SERVICES; do
#   echo "➡️ Deploying frontend: $ui"
#   if cd "apps/$ui"; then
#     docker rm -f "$ui" || true
#     docker run -d --name "$ui" -p 4000:80 "$DOCKER_HUB_USERNAME/$ui:latest"
#     cd - > /dev/null
#   else
#     echo "⚠️ Directory apps/$ui not found. Skipping..."
#   fi
# done

# echo "✅ Deployment complete!"

#!/bin/bash

set -e  # Exit on error

echo "🚀 Starting production deployment..."

# Ensure required environment variables are set
if [ -z "$DOCKER_HUB_USERNAME" ]; then
  echo "❌ DOCKER_HUB_USERNAME is not set"
  exit 1
fi

if [ -z "$DOCKER_HUB_PASSWORD" ]; then
  echo "❌ DOCKER_HUB_PASSWORD is not set"
  exit 1
fi

if [ -z "$CHANGED_BACKEND" ] && [ -z "$CHANGED_FRONTEND" ]; then
  echo "❌ CHANGED_BACKEND and CHANGED_FRONTEND are not set"
  exit 1
fi

# Login to Docker Hub
echo "🔐 Logging into Docker Hub..."
echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Convert JSON arrays to bash arrays
BACKEND_SERVICES=$(echo "$CHANGED_BACKEND" | jq -r '.[]')
FRONTEND_SERVICES=$(echo "$CHANGED_FRONTEND" | jq -r '.[]')

# Pull and restart backend services
if [ "$CHANGED_BACKEND" != "[]" ]; then
  echo "🔄 Pulling and restarting changed backend services..."
  for service in $BACKEND_SERVICES; do
    echo "🚀 Updating backend: $service"
    docker pull "$DOCKER_HUB_USERNAME/$service:latest"
    docker stop "$service" || echo "Service $service not running"
    docker rm "$service" || echo "Service $service not found"
    docker run -d --name "$service" --env-file apps/$service/.env -p 3000:3000 "$DOCKER_HUB_USERNAME/$service:latest"
  done
else
  echo "✅ No backend changes detected."
fi

# Pull and restart frontend services
if [ "$CHANGED_FRONTEND" != "[]" ]; then
  echo "🔄 Pulling and restarting changed frontend services..."
  for ui in $FRONTEND_SERVICES; do
    echo "🚀 Updating frontend: $ui"
    docker pull "$DOCKER_HUB_USERNAME/$ui:latest"
    docker stop "$ui" || echo "Service $ui not running"
    docker rm "$ui" || echo "Service $ui not found"

    # Run frontend container behind Nginx
    docker run -d --name "$ui" \
      -v /etc/nginx/conf.d:/etc/nginx/conf.d:ro \
      -v /var/www/$ui:/usr/share/nginx/html:ro \
      "$DOCKER_HUB_USERNAME/$ui:latest"
  done

  echo "🔁 Reloading Nginx..."
  docker exec nginx nginx -s reload || echo "⚠️ Nginx reload failed"
else
  echo "✅ No frontend changes detected."
fi

echo "✅ Deployment complete!"