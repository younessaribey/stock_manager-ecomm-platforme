# AWS Deployment Guide

This guide walks you through deploying the Stock Manager E-commerce Platform to AWS.

## Architecture Overview

- **Backend API**: ECS Fargate (containerized Express server)
- **Database**: Amazon RDS PostgreSQL
- **Frontend**: S3 + CloudFront (static React build)
- **Load Balancer**: Application Load Balancer (ALB)
- **Secrets**: AWS Secrets Manager

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured (`aws configure`)
3. Docker installed locally
4. Node.js 18+ installed

## Step 1: Set Up RDS PostgreSQL Database

### 1.1 Create RDS Instance

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier stock-manager-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --publicly-accessible \
  --storage-encrypted
```

**Important**: 
- Replace `sg-xxxxxxxxx` with your security group ID
- Note the endpoint URL (e.g., `stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com`)
- Save the master password securely

### 1.2 Configure Security Group

Allow inbound PostgreSQL (port 5432) from:
- Your ECS security group
- Your local IP (for initial setup/testing)

```bash
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 0.0.0.0/0  # Restrict this to your VPC in production
```

### 1.3 Test Connection Locally

```bash
# Install PostgreSQL client
brew install postgresql  # macOS
# or
sudo apt-get install postgresql-client  # Linux

# Test connection
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d postgres
```

## Step 2: Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name stock-manager-api \
  --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

## Step 3: Build and Push Docker Image

```bash
cd server

# Build image
docker build -t stock-manager-api:latest .

# Tag for ECR
docker tag stock-manager-api:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/stock-manager-api:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/stock-manager-api:latest
```

## Step 4: Store Secrets in AWS Secrets Manager

```bash
# Create secret for database connection
aws secretsmanager create-secret \
  --name stock-manager/db-credentials \
  --secret-string '{
    "DB_HOST": "your-rds-endpoint.rds.amazonaws.com",
    "DB_PORT": "5432",
    "DB_NAME": "stmg",
    "DB_USER": "postgres",
    "DB_PASSWORD": "YourSecurePassword123!"
  }'

# Create secret for JWT and app config
aws secretsmanager create-secret \
  --name stock-manager/app-config \
  --secret-string '{
    "JWT_SECRET": "your-super-secret-jwt-key-change-this",
    "CLIENT_URL": "https://your-domain.com"
  }'
```

## Step 5: Create ECS Cluster and Task Definition

### 5.1 Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name stock-manager-cluster
```

### 5.2 Create Task Definition

See `ecs-task-definition.json` for the full task definition. Create it:

```bash
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
```

## Step 6: Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name stock-manager-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxxxxxx

# Note the DNS name and ARN
```

## Step 7: Create ECS Service

```bash
aws ecs create-service \
  --cluster stock-manager-cluster \
  --service-name stock-manager-api \
  --task-definition stock-manager-api:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:region:account:targetgroup/stock-manager-tg/xxxxx,containerName=stock-manager-api,containerPort=5050"
```

## Step 8: Deploy Frontend to S3 + CloudFront

### 8.1 Build React App

```bash
cd client
npm install
npm run build
```

### 8.2 Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://stock-manager-frontend --region us-east-1

# Enable static website hosting
aws s3 website s3://stock-manager-frontend \
  --index-document index.html \
  --error-document index.html

# Upload build
aws s3 sync build/ s3://stock-manager-frontend --delete

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket stock-manager-frontend --policy file://s3-bucket-policy.json
```

### 8.3 Create CloudFront Distribution

```bash
# Create CloudFront distribution (use AWS Console or CloudFormation)
# Origin: S3 bucket (stock-manager-frontend)
# Default root object: index.html
# Error pages: 404 -> /index.html (for React Router)
```

## Step 9: Update Environment Variables

Update your ECS task definition with the CloudFront URL:

```bash
# Update CLIENT_URL in Secrets Manager
aws secretsmanager update-secret \
  --secret-id stock-manager/app-config \
  --secret-string '{
    "JWT_SECRET": "your-super-secret-jwt-key-change-this",
    "CLIENT_URL": "https://your-cloudfront-url.cloudfront.net"
  }'
```

## Step 10: Initialize Database Schema

The server will automatically create tables on first startup via `sequelize.sync({ alter: true })`.

To verify:

```bash
# Connect to RDS
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d stmg

# Check tables
\dt

# Should see: users, products, categories, orders, order_items, etc.
```

## Step 11: Test Deployment

1. **Test API Health**: `curl https://your-alb-dns-name.elb.amazonaws.com/api/ping`
2. **Test Frontend**: Visit your CloudFront URL
3. **Test Login**: Try logging in through the frontend

## Monitoring and Logs

### View ECS Logs

```bash
# Get log group
aws logs describe-log-groups --log-group-name-prefix /ecs/stock-manager

# View logs
aws logs tail /ecs/stock-manager-api --follow
```

### Set Up CloudWatch Alarms

- CPU utilization > 80%
- Memory utilization > 80%
- Task count < 1

## Troubleshooting

### Database Connection Issues

- Check security group rules
- Verify RDS endpoint is correct
- Test connection from ECS task: `psql -h endpoint -U user -d dbname`

### Container Won't Start

- Check ECS task logs in CloudWatch
- Verify secrets are accessible
- Check task definition environment variables

### Frontend Can't Connect to API

- Verify CORS settings in `server/server.js`
- Check `CLIENT_URL` matches your CloudFront domain
- Verify ALB security group allows HTTPS (443)

## Cost Optimization

- Use `db.t3.micro` for RDS (free tier eligible)
- Use Fargate Spot for ECS (up to 70% savings)
- Enable S3 lifecycle policies for old logs
- Use CloudFront caching to reduce API calls

## Next Steps

1. Set up CI/CD pipeline (GitHub Actions)
2. Add database backups automation
3. Set up monitoring dashboards
4. Configure auto-scaling
5. Add WAF rules for security

