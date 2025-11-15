#!/bin/bash

# Test RDS PostgreSQL Connection
# Usage: ./test-rds-connection.sh [endpoint] [username] [password] [database]

set -e

if [ $# -lt 4 ]; then
    echo "Usage: ./test-rds-connection.sh <endpoint> <username> <password> <database>"
    echo "Example: ./test-rds-connection.sh stock-manager-db.xxxxx.rds.amazonaws.com postgres mypass stmg"
    exit 1
fi

ENDPOINT=$1
USERNAME=$2
PASSWORD=$3
DATABASE=$4

echo "Testing connection to RDS PostgreSQL..."
echo "Endpoint: $ENDPOINT"
echo "Database: $DATABASE"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Installing..."
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install postgresql
    # Linux
    else
        sudo apt-get update && sudo apt-get install -y postgresql-client
    fi
fi

# Test connection
echo "Connecting..."
PGPASSWORD="$PASSWORD" psql -h "$ENDPOINT" -U "$USERNAME" -d "$DATABASE" -c "\dt" && echo "" && echo "✅ Connection successful! Tables:" && PGPASSWORD="$PASSWORD" psql -h "$ENDPOINT" -U "$USERNAME" -d "$DATABASE" -c "\dt" || echo "❌ Connection failed. Check your credentials and security group settings."

