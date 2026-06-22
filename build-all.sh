#!/bin/bash

# Build script for SmartLogix project
# Builds all Docker images locally before pushing to ECR

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_REGISTRY="${1:-smartlogix}"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}SmartLogix Build Script${NC}"
echo -e "${YELLOW}================================================${NC}"
echo -e "Registry: ${DOCKER_REGISTRY}"
echo -e "Build Date: ${BUILD_DATE}"
echo -e "Git Commit: ${GIT_COMMIT}"
echo -e "Git Branch: ${GIT_BRANCH}"
echo -e "${YELLOW}================================================${NC}\n"

# Function to build image
build_image() {
    local service_name=$1
    local dockerfile=$2
    local build_args=$3
    local image_name="${DOCKER_REGISTRY}-${service_name}:latest"

    echo -e "${YELLOW}Building ${service_name}...${NC}"

    if [ -z "$build_args" ]; then
        docker build -f "${dockerfile}" \
            -t "${image_name}" \
            -t "${DOCKER_REGISTRY}-${service_name}:${GIT_COMMIT}" \
            --label "build.date=${BUILD_DATE}" \
            --label "git.commit=${GIT_COMMIT}" \
            --label "git.branch=${GIT_BRANCH}" \
            .
    else
        docker build -f "${dockerfile}" \
            ${build_args} \
            -t "${image_name}" \
            -t "${DOCKER_REGISTRY}-${service_name}:${GIT_COMMIT}" \
            --label "build.date=${BUILD_DATE}" \
            --label "git.commit=${GIT_COMMIT}" \
            --label "git.branch=${GIT_BRANCH}" \
            .
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ${service_name} built successfully${NC}\n"
    else
        echo -e "${RED}✗ Failed to build ${service_name}${NC}\n"
        exit 1
    fi
}

# Build all services
echo -e "${YELLOW}Building Backend Services...${NC}\n"

# Eureka Server
build_image "eureka" "Backend/Dockerfile.eureka" ""

# Backend Microservices
build_image "usuario" "Backend/Dockerfile.backend" "--build-arg SERVICE_NAME=usuario --build-arg SERVICE_VERSION=1.0.0"
build_image "pedidos" "Backend/Dockerfile.backend" "--build-arg SERVICE_NAME=pedidos --build-arg SERVICE_VERSION=1.0.0"
build_image "inventory" "Backend/Dockerfile.backend" "--build-arg SERVICE_NAME=inventory --build-arg SERVICE_VERSION=1.0.0"
build_image "envios" "Backend/Dockerfile.eureka" ""

# Frontend
echo -e "${YELLOW}Building Frontend...${NC}"
docker build -f Frontend/Dockerfile \
    -t "${DOCKER_REGISTRY}-frontend:latest" \
    -t "${DOCKER_REGISTRY}-frontend:${GIT_COMMIT}" \
    --label "build.date=${BUILD_DATE}" \
    --label "git.commit=${GIT_COMMIT}" \
    --label "git.branch=${GIT_BRANCH}" \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}\n"
else
    echo -e "${RED}✗ Failed to build Frontend${NC}\n"
    exit 1
fi

# Summary
echo -e "${YELLOW}================================================${NC}"
echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${YELLOW}================================================${NC}\n"

echo -e "Images built:"
docker images --filter "reference=${DOCKER_REGISTRY}*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo -e "\n${YELLOW}To push images to ECR, use:${NC}"
echo -e "  ./push-to-ecr.sh <AWS_ACCOUNT_ID>"
