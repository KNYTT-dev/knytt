#!/bin/bash
# Build and push Docker images to GCP Artifact Registry

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-""}
REGION=${GCP_REGION:-"us-central1"}
ENVIRONMENT=${ENVIRONMENT:-"dev"}
REPOSITORY="knytt-${ENVIRONMENT}"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            PROJECT_ID="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --env)
            ENVIRONMENT="$2"
            REPOSITORY="knytt-${ENVIRONMENT}"
            shift 2
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate required variables
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: GCP_PROJECT_ID is not set${NC}"
    echo "Usage: ./build-and-push.sh --project YOUR_PROJECT_ID [--region REGION] [--env ENV] [--tag TAG]"
    exit 1
fi

# Set default tag to git commit hash or 'latest'
if [ -z "$TAG" ]; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        TAG=$(git rev-parse --short HEAD)
    else
        TAG="latest"
    fi
fi

REGISTRY="${REGION}-docker.pkg.dev"
IMAGE_BASE="${REGISTRY}/${PROJECT_ID}/${REPOSITORY}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building and Pushing Knytt Images${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Environment: $ENVIRONMENT"
echo "Repository: $REPOSITORY"
echo "Tag: $TAG"
echo ""

# Authenticate with GCP
echo -e "${YELLOW}Authenticating with GCP...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Create repository if it doesn't exist
echo -e "${YELLOW}Ensuring Artifact Registry repository exists...${NC}"
gcloud artifacts repositories describe $REPOSITORY \
    --project=$PROJECT_ID \
    --location=$REGION 2>/dev/null || \
gcloud artifacts repositories create $REPOSITORY \
    --project=$PROJECT_ID \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Knytt ${ENVIRONMENT}"

# Build and push API image
echo -e "${YELLOW}Building API image...${NC}"
docker build \
    -f deployment/docker/Dockerfile.api \
    -t ${IMAGE_BASE}/knytt-api:${TAG} \
    -t ${IMAGE_BASE}/knytt-api:latest \
    .

echo -e "${YELLOW}Pushing API image...${NC}"
docker push ${IMAGE_BASE}/knytt-api:${TAG}
docker push ${IMAGE_BASE}/knytt-api:latest

# Build and push Worker image
echo -e "${YELLOW}Building Worker image...${NC}"
docker build \
    -f deployment/docker/Dockerfile.worker \
    -t ${IMAGE_BASE}/knytt-worker:${TAG} \
    -t ${IMAGE_BASE}/knytt-worker:latest \
    .

echo -e "${YELLOW}Pushing Worker image...${NC}"
docker push ${IMAGE_BASE}/knytt-worker:${TAG}
docker push ${IMAGE_BASE}/knytt-worker:latest

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Build and Push Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Images built and pushed:"
echo "  - ${IMAGE_BASE}/knytt-api:${TAG}"
echo "  - ${IMAGE_BASE}/knytt-api:latest"
echo "  - ${IMAGE_BASE}/knytt-worker:${TAG}"
echo "  - ${IMAGE_BASE}/knytt-worker:latest"
echo ""
echo "Next steps:"
echo "  1. Update deployment/gcp/terraform.tfvars with image URLs"
echo "  2. Run: cd deployment/gcp && terraform apply"
echo ""
