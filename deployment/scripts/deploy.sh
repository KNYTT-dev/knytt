#!/bin/bash
# Deploy Knytt infrastructure to GCP using Terraform

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${ENVIRONMENT:-"dev"}
AUTO_APPROVE=false
PLAN_ONLY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --auto-approve)
            AUTO_APPROVE=true
            shift
            ;;
        --plan)
            PLAN_ONLY=true
            shift
            ;;
        --destroy)
            DESTROY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: ./deploy.sh [--env ENV] [--auto-approve] [--plan] [--destroy]"
            exit 1
            ;;
    esac
done

TERRAFORM_DIR="deployment/gcp"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Knytt Infrastructure Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo "Environment: $ENVIRONMENT"
echo ""

# Check if terraform.tfvars exists
if [ ! -f "${TERRAFORM_DIR}/terraform.tfvars" ]; then
    echo -e "${RED}Error: terraform.tfvars not found!${NC}"
    echo "Please create ${TERRAFORM_DIR}/terraform.tfvars from terraform.tfvars.example"
    exit 1
fi

# Navigate to Terraform directory
cd $TERRAFORM_DIR

# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
terraform init -upgrade

# Validate configuration
echo -e "${YELLOW}Validating Terraform configuration...${NC}"
terraform validate

if [ "$PLAN_ONLY" = true ]; then
    # Plan only
    echo -e "${YELLOW}Creating Terraform plan...${NC}"
    terraform plan -var="environment=${ENVIRONMENT}"
    echo ""
    echo -e "${GREEN}Plan complete! Review the changes above.${NC}"
    echo "To apply these changes, run: ./deploy.sh --env ${ENVIRONMENT}"
    exit 0
fi

if [ "$DESTROY" = true ]; then
    # Destroy infrastructure
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}WARNING: Destroying Infrastructure${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "This will destroy all resources in environment: $ENVIRONMENT"

    if [ "$AUTO_APPROVE" = false ]; then
        read -p "Are you sure? Type 'yes' to continue: " -r
        echo
        if [[ ! $REPLY =~ ^yes$ ]]; then
            echo "Destroy cancelled."
            exit 0
        fi
    fi

    terraform destroy -var="environment=${ENVIRONMENT}" ${AUTO_APPROVE:+-auto-approve}
    echo -e "${GREEN}Infrastructure destroyed successfully!${NC}"
    exit 0
fi

# Plan the deployment
echo -e "${YELLOW}Planning deployment...${NC}"
terraform plan -var="environment=${ENVIRONMENT}" -out=tfplan

# Apply the deployment
if [ "$AUTO_APPROVE" = true ]; then
    echo -e "${YELLOW}Applying changes (auto-approved)...${NC}"
    terraform apply tfplan
else
    echo ""
    echo -e "${YELLOW}Review the plan above.${NC}"
    read -p "Do you want to apply these changes? (yes/no): " -r
    echo
    if [[ $REPLY =~ ^yes$ ]]; then
        terraform apply tfplan
    else
        echo "Deployment cancelled."
        rm tfplan
        exit 0
    fi
fi

# Clean up plan file
rm -f tfplan

# Get outputs
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Show important outputs
echo -e "${YELLOW}Important Outputs:${NC}"
terraform output

# Additional instructions
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update your .env file with the outputs above"
echo "2. Configure Cloudflare DNS to point to the API URL"
echo "3. Deploy your frontend to Cloudflare Pages"
echo "4. Run Supabase migrations: supabase db push"
echo "5. Test the API: curl \$(terraform output -raw api_url)/health"
echo ""
