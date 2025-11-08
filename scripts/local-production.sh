#!/usr/bin/env bash
set -e

# ------------------------------------------------------------------------------
# 🎨 Colors
# ------------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No color

# ------------------------------------------------------------------------------
# 🧩 Service Configuration
# ------------------------------------------------------------------------------
declare -A SERVICES=(
  ["api-gateway"]="8080"
  ["auth-service"]="8081"
  ["product-service"]="8082"
  ["admin-service"]="8083"
  ["manager-service"]="8084"
  # ["vendor-service"]="8085"
  ["user-ui"]="3000"
  # ["admin-ui"]="3001"
  # ["vendor-ui"]="3002"
  # ["manager-ui"]="3003"

)

# ------------------------------------------------------------------------------
# 🧰 Helper Functions
# ------------------------------------------------------------------------------
usage() {
  echo -e "${BLUE}Usage:${NC} bash scripts/local-production.sh [--build-only|--run-only|--stop|--logs|--clean] [service-name]"
  echo -e "Example: bash scripts/local-production.sh --build-only auth-service"
  exit 1
}

check_service() {
  if [ -z "$SERVICE_NAME" ]; then
    echo -e "${RED}❌ No service specified!${NC}"
    usage
  fi

  if [ -z "${SERVICES[$SERVICE_NAME]}" ]; then
    echo -e "${RED}❌ Unknown service: ${SERVICE_NAME}${NC}"
    echo -e "${YELLOW}Available services:${NC} ${!SERVICES[*]}"
    exit 1
  fi
}

build_image() {
  echo -e "${BLUE}🚀 Building image for ${SERVICE_NAME}...${NC}"
  local image_name="redbasketapp/${SERVICE_NAME}"
  local dockerfile="apps/${SERVICE_NAME}/Dockerfile"

  docker build -t "${image_name}:latest" -f "${dockerfile}" .
  echo -e "${GREEN}✅ Build complete for ${SERVICE_NAME}!${NC}"

  # Optional: Push to Docker Hub
  if [ "$PUSH" == "true" ]; then
    echo -e "${BLUE}📦 Pushing ${image_name}:latest to Docker Hub...${NC}"
    docker push "${image_name}:latest"
    echo -e "${GREEN}✅ Image pushed to Docker Hub!${NC}"
  fi
}

run_container() {
  echo -e "${BLUE}🏃 Starting container for ${SERVICE_NAME}...${NC}"
  local port="${SERVICES[$SERVICE_NAME]}"
  local image_name="redbasketapp/${SERVICE_NAME}"
  local container_name="${SERVICE_NAME}-container"

  docker rm -f "${container_name}" 2>/dev/null || true
  docker run -d --name "${container_name}" -p ${port}:${port} "${image_name}:latest"
  echo -e "${GREEN}✅ ${SERVICE_NAME} running at http://localhost:${port}${NC}"
}

stop_container() {
  local container_name="${SERVICE_NAME}-container"
  echo -e "${YELLOW}🛑 Stopping ${container_name}...${NC}"
  docker rm -f "${container_name}" 2>/dev/null || true
  echo -e "${GREEN}✅ ${container_name} stopped and removed.${NC}"
}

show_logs() {
  local container_name="${SERVICE_NAME}-container"
  echo -e "${BLUE}📜 Showing logs for ${container_name}...${NC}"
  docker logs -f "${container_name}"
}

clean_docker() {
  local image_name="redbasketapp/${SERVICE_NAME}"
  local container_name="${SERVICE_NAME}-container"
  echo -e "${YELLOW}🧹 Cleaning up ${SERVICE_NAME}...${NC}"
  docker rm -f "${container_name}" 2>/dev/null || true
  docker rmi -f "${image_name}:latest" 2>/dev/null || true
  echo -e "${GREEN}✅ Cleaned up ${SERVICE_NAME}.${NC}"
}

# ------------------------------------------------------------------------------
# 🧭 Command Handling
# ------------------------------------------------------------------------------
ACTION="$1"
SERVICE_NAME="$2"
PUSH="${3:-false}" # Optional third argument to push image

if [ -z "$ACTION" ]; then
  usage
fi

if [ "$ACTION" != "--clean" ]; then
  check_service
fi

case "$ACTION" in
  --build-only)
    build_image
    ;;
  --run-only)
    run_container
    ;;
  --stop)
    stop_container
    ;;
  --logs)
    show_logs
    ;;
  --clean)
    if [ -z "$SERVICE_NAME" ]; then
      echo -e "${YELLOW}⚠️  Cleaning all services...${NC}"
      for s in "${!SERVICES[@]}"; do
        SERVICE_NAME="$s"
        clean_docker
      done
    else
      check_service
      clean_docker
    fi
    ;;
  *)
    # Default: build + stop old + run new
    build_image
    stop_container
    run_container
    ;;
esac

#  npm run docker:prod -- --service api-gateway
#  docker push redbasketapp/product-service:latest -f apps/product-service/Dockerfile .
#  docker build -t redbasketapp/vendor-ui:latest -f apps/vendor-ui/Dockerfile .