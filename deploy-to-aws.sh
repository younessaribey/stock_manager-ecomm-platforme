#!/bin/bash

# AWS Deployment Script for Stock Manager
# Usage: ./deploy-to-aws.sh [environment]
# Example: ./deploy-to-aws.sh production

set -e

ENVIRONMENT=${1:-production}
REGION=${AWS_REGION:-us-east-1}
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO="stock-manager-api"
CLUSTER_NAME="stock-manager-cluster"
SERVICE_NAME="stock-manager-api"

echo "🚀 Starting deployment to AWS..."
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "Account ID: $ACCOUNT_ID"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build and push Docker image
echo -e "\n${YELLOW}Step 1: Building and pushing Docker image...${NC}"
cd server

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build image
echo "Building Docker image..."
docker build -t $ECR_REPO:latest .

# Tag image
docker tag $ECR_REPO:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest

# Push image
echo "Pushing image to ECR..."
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest

cd ..

# Step 2: Update ECS service
echo -e "\n${YELLOW}Step 2: Updating ECS service...${NC}"

# Get current task definition
TASK_DEF=$(aws ecs describe-task-definition --task-definition $ECR_REPO --query 'taskDefinition' --output json)

# Update image in task definition
NEW_TASK_DEF=$(echo $TASK_DEF | jq --arg IMAGE "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest" '.containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')

# Register new task definition
echo "Registering new task definition..."
NEW_TASK_DEF_ARN=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEF" --query 'taskDefinition.taskDefinitionArn' --output text)

# Update service
echo "Updating ECS service..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $NEW_TASK_DEF_ARN \
  --force-new-deployment \
  > /dev/null

echo -e "\n${GREEN}✅ Deployment initiated!${NC}"
echo "Service is updating with new task definition: $NEW_TASK_DEF_ARN"
echo ""
echo "Monitor deployment:"
echo "  aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME"
echo ""
echo "View logs:"
echo "  aws logs tail /ecs/stock-manager-api --follow"

