#!/bin/bash

echo "🔧 Setting up PostgreSQL for STMG project..."

# Add PostgreSQL to PATH permanently
echo 'export PATH="/usr/local/Cellar/postgresql@15/15.14/bin:$PATH"' >> ~/.zshrc

# Source the updated PATH
export PATH="/usr/local/Cellar/postgresql@15/15.14/bin:$PATH"

# Test connection
echo "Testing PostgreSQL connection..."
psql -h localhost -p 5433 -U mac -d postgres -c "SELECT version();"

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL connection successful!"
    
    # Create/update database and user
    echo "Setting up STMG database..."
    psql -h localhost -p 5433 -U mac -d postgres -c "
        -- Create database if not exists
        SELECT 'CREATE DATABASE stmg' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'stmg')\gexec
        
        -- Grant privileges
        GRANT ALL PRIVILEGES ON DATABASE stmg TO mac;
    "
    
    echo "✅ Database setup completed!"
    echo ""
    echo "🚀 You can now start the project with:"
    echo "CNX_STRING=\"\" DB_HOST=localhost DB_PORT=5433 DB_USER=mac DB_PASSWORD=\"\" DB_NAME=stmg npm run dev"
    
else
    echo "❌ PostgreSQL connection failed. Please check if PostgreSQL is running."
    echo "Try: brew services restart postgresql@15"
fi
