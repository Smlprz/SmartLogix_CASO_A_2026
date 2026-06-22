#!/bin/bash

# Push script for SmartLogix project
# Pushes all Docker images to AWS ECR

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_ACCOUNT_ID=${1}
AWS_REGION=${2:-us-east-1}
LOCAL_REGISTRY="smartlogix"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Validate inputs
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}Error: AWS_ACCOUNT_ID is required${NC}"
    echo "Usage: $0 <AWS_ACCOUNT_ID> [AWS_REGION]"
    exit 1
fi

echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}SmartLogix ECR Push Script${NC}"
echo -e "${YELLOW}================================================${NC}"
echo -e "AWS Account: ${AWS_ACCOUNT_ID}"
echo -e "AWS Region: ${AWS_REGION}"
echo -e "ECR Registry: ${ECR_REGISTRY}"
echo -e "Git Commit: ${GIT_COMMIT}"
echo -e "${YELLOW}================================================${NC}\n"

# Check AWS credentials
echo -e "${BLUE}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity --region ${AWS_REGION} > /dev/null 2>&1; then
    echo -e "${RED}Error: AWS credentials not configured or invalid${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS credentials valid${NC}\n"

# Login to ECR
echo -e "${BLUE}Logging in to AWS ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
echo -e "${GREEN}✓ Logged in to ECR${NC}\n"

# Function to push image
push_image() {
    local service_name=$1
    local local_image="${LOCAL_REGISTRY}-${service_name}:latest"
    local ecr_image="${ECR_REGISTRY}/${LOCAL_REGISTRY}-${service_name}:latest"
    local ecr_image_commit="${ECR_REGISTRY}/${LOCAL_REGISTRY}-${service_name}:${GIT_COMMIT}"

    echo -e "${YELLOW}Pushing ${service_name}...${NC}"

    # Check if local image exists
    if ! docker image inspect "${local_image}" > /dev/null 2>&1; then
        echo -e "${RED}✗ Local image ${local_image} not found${NC}"
        echo -e "  Please run ./build-all.sh first"
        return 1
    fi

    # Tag image for ECR
    docker tag "${local_image}" "${ecr_image}"
    docker tag "${local_image}" "${ecr_image_commit}"

    # Push to ECR
    docker push "${ecr_image}"
    docker push "${ecr_image_commit}"

    echo -e "${GREEN}✓ ${service_name} pushed successfully${NC}"
    echo -e "  Latest: ${ecr_image}"
    echo -e "  Commit: ${ecr_image_commit}\n"
}

# Create ECR repositories if they don't exist
echo -e "${BLUE}Ensuring ECR repositories exist...${NC}"
for service in frontend usuario pedidos envios inventory eureka; do
    repo_name="${LOCAL_REGISTRY}-${service}"
    if ! aws ecr describe-repositories --repository-names "${repo_name}" --region ${AWS_REGION} > /dev/null 2>&1; then
        echo "Creating ECR repository: ${repo_name}"
        aws ecr create-repository \
            --repository-name "${repo_name}" \
            --region ${AWS_REGION} \
            --encryption-configuration encryptionType=AES > /dev/null
    fi
done
echo -e "${GREEN}✓ All repositories ready${NC}\n"

# Push all images
echo -e "${YELLOW}Pushing images to ECR...${NC}\n"

push_image "eureka" || exit 1
push_image "usuario" || exit 1
push_image "pedidos" || exit 1
push_image "envios" || exit 1
push_image "inventory" || exit 1
push_image "frontend" || exit 1

# Summary
echo -e "${YELLOW}================================================${NC}"
echo -e "${GREEN}All images pushed successfully!${NC}"
echo -e "${YELLOW}================================================${NC}\n"

echo -e "Pushed images:"
aws ecr describe-repositories --region ${AWS_REGION} \
    --query "repositories[?contains(repositoryName, '${LOCAL_REGISTRY}')].{Name:repositoryName, URI:repositoryUri}" \
    --output table

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Update ECS task definitions with the new image URIs"
echo -e "2. Update ECS services to use the new task definitions"
echo -e "3. Monitor CloudWatch for deployment status"
