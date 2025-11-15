# RDS PostgreSQL Setup Guide

This guide walks you through setting up Amazon RDS PostgreSQL for your Stock Manager application.

## Quick Overview

Your app **automatically creates all database tables** on first startup via `sequelize.sync({ alter: true })`. You just need to:
1. Create the RDS instance
2. Configure connection settings
3. Let the app initialize the schema

## Step 1: Create RDS PostgreSQL Instance

### Option A: Using AWS Console (Recommended for beginners)

1. **Go to AWS Console** → RDS → Create database
2. **Choose configuration:**
   - **Engine**: PostgreSQL
   - **Version**: 15.4 (or latest stable)
   - **Template**: Free tier (if eligible) or Production
   - **DB instance identifier**: `stock-manager-db`
   - **Master username**: `postgres` (or your choice)
   - **Master password**: Create a strong password (save it!)
   - **DB instance class**: `db.t3.micro` (free tier) or `db.t3.small` (production)
   - **Storage**: 20 GB (gp2)
   - **VPC**: Default VPC (or your custom VPC)
   - **Public access**: Yes (for initial setup, restrict later)
   - **Security group**: Create new or use existing
   - **Database name**: `stmg` (or leave blank, app will create)

3. **Click "Create database"**
4. **Wait 5-10 minutes** for instance to be available
5. **Note the endpoint**: `stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com`

### Option B: Using AWS CLI

```bash
# Create RDS instance
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
  --storage-encrypted \
  --region us-east-1
```

**Replace:**
- `sg-xxxxxxxxx` with your security group ID
- `YourSecurePassword123!` with a strong password

## Step 2: Configure Security Group

Allow PostgreSQL (port 5432) access:

### Via Console:
1. Go to EC2 → Security Groups
2. Find your RDS security group
3. Add inbound rule:
   - **Type**: PostgreSQL
   - **Port**: 5432
   - **Source**: Your ECS security group (for production) OR `0.0.0.0/0` (for testing only - **NOT recommended for production**)

### Via CLI:
```bash
# Get your security group ID from RDS instance details
# Then allow access from your IP (for testing)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr YOUR_IP/32

# Or allow from ECS security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-ecs-security-group-id
```

## Step 3: Test Connection Locally

```bash
# Install PostgreSQL client (if not installed)
# macOS:
brew install postgresql

# Linux:
sudo apt-get install postgresql-client

# Test connection
psql -h stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d postgres
```

Enter your password when prompted. If successful, you'll see:
```
postgres=>
```

Type `\q` to exit.

## Step 4: Create Database (if not created during RDS setup)

```bash
# Connect to RDS
psql -h stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com -U postgres -d postgres

# Create database
CREATE DATABASE stmg;

# Exit
\q
```

## Step 5: Store Credentials in AWS Secrets Manager

### Option A: Using Console
1. Go to AWS Secrets Manager → Store a new secret
2. Select "Credentials for Amazon RDS database"
3. Enter:
   - **Username**: `postgres`
   - **Password**: Your RDS password
   - **Database**: `stmg`
   - **Server address**: Your RDS endpoint
   - **Port**: `5432`
4. Secret name: `stock-manager/db-credentials`
5. Click "Store"

### Option B: Using CLI

```bash
# Create secret with database credentials
aws secretsmanager create-secret \
  --name stock-manager/db-credentials \
  --description "RDS PostgreSQL credentials for Stock Manager" \
  --secret-string '{
    "DB_HOST": "stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com",
    "DB_PORT": "5432",
    "DB_NAME": "stmg",
    "DB_USER": "postgres",
    "DB_PASSWORD": "YourSecurePassword123!"
  }' \
  --region us-east-1
```

**Replace:**
- `stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com` with your RDS endpoint
- `YourSecurePassword123!` with your actual password

## Step 6: Update ECS Task Definition

Update `ecs-task-definition.json` with your account ID and region, then the secrets will be automatically injected.

## Step 7: Database Auto-Initialization

**Good news!** Your app automatically:
- ✅ Connects to the database
- ✅ Creates all tables (users, products, categories, orders, etc.)
- ✅ Sets up relationships and indexes
- ✅ Verifies the structure

This happens on first server startup via `server/config/dbSequelize.js` → `verifyDatabaseStructure()`

## Step 8: Verify Database Schema

After your ECS service starts, verify tables were created:

```bash
# Connect to RDS
psql -h stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com -U postgres -d stmg

# List tables
\dt

# Should see:
# - users
# - products
# - categories
# - orders
# - order_items
# - wishlists
# - carts
# - imgbb_images
# - settings

# Check a table structure
\d users

# Exit
\q
```

## Migration from Local Database (Optional)

If you have existing data in a local PostgreSQL database:

### Export Local Data

```bash
# Export schema and data
pg_dump -h localhost -U postgres -d stmg > local_backup.sql

# Or just data (if schema already exists)
pg_dump -h localhost -U postgres -d stmg --data-only > local_data.sql
```

### Import to RDS

```bash
# Import to RDS (after app creates schema)
psql -h stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d stmg \
     -f local_backup.sql
```

**Note**: The app will create the schema automatically, so you might only need to import data.

## Connection String Format

For direct connection string (CNX_STRING):

```
postgres://postgres:YourPassword@stock-manager-db.xxxxx.us-east-1.rds.amazonaws.com:5432/stmg?sslmode=require
```

## Troubleshooting

### Can't connect to RDS

1. **Check security group**: Ensure port 5432 is open
2. **Check public access**: RDS must have "Publicly accessible" = Yes (or be in same VPC as ECS)
3. **Check endpoint**: Verify the endpoint URL is correct
4. **Check credentials**: Verify username/password

### Tables not created

1. **Check ECS logs**: `aws logs tail /ecs/stock-manager-api --follow`
2. **Look for errors**: Database connection errors will appear in logs
3. **Verify secrets**: Ensure Secrets Manager has correct credentials
4. **Check permissions**: ECS task role needs `secretsmanager:GetSecretValue`

### SSL Connection Errors

Your code already handles SSL with `rejectUnauthorized: false`. If you get SSL errors:
- Ensure `sslmode=require` in connection string
- Or add SSL config in individual DB_* variables

## Cost Optimization

- **Free Tier**: `db.t3.micro` is free for 12 months (750 hours/month)
- **Backup Retention**: 7 days is good for production
- **Storage**: Start with 20GB, scale as needed
- **Multi-AZ**: Disable for dev/test (saves 2x cost)

## Next Steps

Once RDS is set up:
1. Update ECS task definition with secret ARNs
2. Deploy your application
3. Monitor CloudWatch logs for database initialization
4. Verify tables were created successfully

