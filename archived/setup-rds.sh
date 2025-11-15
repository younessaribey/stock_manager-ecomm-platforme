#!/bin/bash

# RDS PostgreSQL Setup Script
# This script helps you create and configure RDS PostgreSQL for Stock Manager

set -e

REGION=${AWS_REGION:-us-east-1}
DB_INSTANCE_ID="stock-manager-db"
DB_NAME="stmg"
DB_USER="postgres"

echo "🚀 RDS PostgreSQL Setup for Stock Manager"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if logged in
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Not logged in to AWS. Run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Gathering information...${NC}"

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $ACCOUNT_ID"

# Get default VPC
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region $REGION)
if [ "$VPC_ID" == "None" ] || [ -z "$VPC_ID" ]; then
    echo -e "${YELLOW}⚠️  No default VPC found. You'll need to specify VPC manually.${NC}"
    read -p "Enter VPC ID: " VPC_ID
fi
echo "VPC ID: $VPC_ID"

# Get default subnets
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region $REGION | tr '\t' ',')
echo "Subnets: $SUBNET_IDS"

# Get default security group
DEFAULT_SG=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=group-name,Values=default" --query 'SecurityGroups[0].GroupId' --output text --region $REGION)
echo "Default Security Group: $DEFAULT_SG"

echo ""
echo -e "${YELLOW}Step 2: Database password${NC}"
read -sp "Enter master database password (min 8 chars): " DB_PASSWORD
echo ""

if [ ${#DB_PASSWORD} -lt 8 ]; then
    echo -e "${RED}❌ Password must be at least 8 characters${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Checking if RDS instance already exists...${NC}"

if aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --region $REGION &> /dev/null; then
    echo -e "${YELLOW}⚠️  RDS instance '$DB_INSTANCE_ID' already exists.${NC}"
    read -p "Do you want to continue with setup? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 0
    fi
else
    echo -e "${GREEN}✓ No existing instance found. Creating new RDS instance...${NC}"
    
    # Create DB subnet group if it doesn't exist
    SUBNET_GROUP="default"
    if ! aws rds describe-db-subnet-groups --db-subnet-group-name $SUBNET_GROUP --region $REGION &> /dev/null; then
        echo "Creating DB subnet group..."
        aws rds create-db-subnet-group \
            --db-subnet-group-name $SUBNET_GROUP \
            --db-subnet-group-description "Default subnet group for RDS" \
            --subnet-ids $SUBNET_IDS \
            --region $REGION &> /dev/null
    fi
    
    # Create RDS instance
    echo "Creating RDS PostgreSQL instance (this takes 5-10 minutes)..."
    aws rds create-db-instance \
        --db-instance-identifier $DB_INSTANCE_ID \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.4 \
        --master-username $DB_USER \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --storage-type gp2 \
        --vpc-security-group-ids $DEFAULT_SG \
        --db-subnet-group-name $SUBNET_GROUP \
        --backup-retention-period 7 \
        --publicly-accessible \
        --storage-encrypted \
        --region $REGION \
        > /dev/null
    
    echo -e "${GREEN}✓ RDS instance creation initiated!${NC}"
    echo "Waiting for instance to be available (this may take 5-10 minutes)..."
    
    # Wait for instance to be available
    aws rds wait db-instance-available \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $REGION
    
    echo -e "${GREEN}✓ RDS instance is now available!${NC}"
fi

# Get endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text \
    --region $REGION)

echo ""
echo -e "${GREEN}✓ RDS Endpoint: $DB_ENDPOINT${NC}"

# Configure security group to allow PostgreSQL
echo ""
echo -e "${YELLOW}Step 4: Configuring security group...${NC}"

# Get security group ID from RDS instance
RDS_SG=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --query 'DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId' \
    --output text \
    --region $REGION)

echo "RDS Security Group: $RDS_SG"

# Check if rule already exists
RULE_EXISTS=$(aws ec2 describe-security-groups \
    --group-ids $RDS_SG \
    --filters "Name=ip-permission.from-port,Values=5432" "Name=ip-permission.to-port,Values=5432" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $REGION)

if [ "$RULE_EXISTS" == "None" ] || [ -z "$RULE_EXISTS" ]; then
    echo "Adding PostgreSQL (5432) rule to security group..."
    # Allow from anywhere (for testing - restrict in production!)
    aws ec2 authorize-security-group-ingress \
        --group-id $RDS_SG \
        --protocol tcp \
        --port 5432 \
        --cidr 0.0.0.0/0 \
        --region $REGION &> /dev/null || echo "Rule may already exist"
    echo -e "${GREEN}✓ Security group configured${NC}"
else
    echo -e "${GREEN}✓ Security group already configured${NC}"
fi

# Create database if it doesn't exist
echo ""
echo -e "${YELLOW}Step 5: Creating database '$DB_NAME'...${NC}"

# Check if psql is available
if command -v psql &> /dev/null; then
    echo "Creating database (if it doesn't exist)..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_ENDPOINT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database may already exist"
    echo -e "${GREEN}✓ Database ready${NC}"
else
    echo -e "${YELLOW}⚠️  psql not found. Please create database manually:${NC}"
    echo "  psql -h $DB_ENDPOINT -U $DB_USER -d postgres"
    echo "  CREATE DATABASE $DB_NAME;"
fi

# Store in Secrets Manager
echo ""
echo -e "${YELLOW}Step 6: Storing credentials in AWS Secrets Manager...${NC}"

SECRET_NAME="stock-manager/db-credentials"
SECRET_STRING="{\"DB_HOST\":\"$DB_ENDPOINT\",\"DB_PORT\":\"5432\",\"DB_NAME\":\"$DB_NAME\",\"DB_USER\":\"$DB_USER\",\"DB_PASSWORD\":\"$DB_PASSWORD\"}"

if aws secretsmanager describe-secret --secret-id $SECRET_NAME --region $REGION &> /dev/null; then
    echo "Updating existing secret..."
    aws secretsmanager update-secret \
        --secret-id $SECRET_NAME \
        --secret-string "$SECRET_STRING" \
        --region $REGION > /dev/null
else
    echo "Creating new secret..."
    aws secretsmanager create-secret \
        --name $SECRET_NAME \
        --description "RDS PostgreSQL credentials for Stock Manager" \
        --secret-string "$SECRET_STRING" \
        --region $REGION > /dev/null
fi

echo -e "${GREEN}✓ Credentials stored in Secrets Manager${NC}"

# Summary
echo ""
echo -e "${GREEN}=========================================="
echo "✅ RDS Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Database Endpoint: $DB_ENDPOINT"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Secret Name: $SECRET_NAME"
echo ""
echo "Connection String:"
echo "postgres://$DB_USER:****@$DB_ENDPOINT:5432/$DB_NAME?sslmode=require"
echo ""
echo "Next Steps:"
echo "1. Update ecs-task-definition.json with your account ID"
echo "2. Deploy your application: ./deploy-to-aws.sh"
echo "3. The app will automatically create all tables on first startup"
echo ""

