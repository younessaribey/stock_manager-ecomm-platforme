#!/bin/bash

# Frontend Deployment Script
# Deploys React build to S3 and invalidates CloudFront cache

set -e

BUCKET_NAME=${S3_BUCKET:-stock-manager-frontend}
CLOUDFRONT_ID=${CLOUDFRONT_DISTRIBUTION_ID:-""}
REGION=${AWS_REGION:-us-east-1}

echo "🚀 Deploying frontend to S3..."

# Build React app
echo "Building React app..."
cd client
npm install
npm run build

# Upload to S3
echo "Uploading to S3 bucket: $BUCKET_NAME"
aws s3 sync build/ s3://$BUCKET_NAME --delete --region $REGION

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$CLOUDFRONT_ID" ]; then
  echo "Invalidating CloudFront cache..."
  INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)
  
  echo "✅ CloudFront invalidation created: $INVALIDATION_ID"
fi

echo "✅ Frontend deployed successfully!"

