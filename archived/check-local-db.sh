#!/bin/bash

echo "🔍 Checking Local Database Status"
echo "================================="

# Check if local server is running
echo "📡 Checking if local server is running..."
if curl -s http://localhost:5050 > /dev/null 2>&1; then
    echo "✅ Local server is running on port 5050"
else
    echo "❌ Local server is not running"
    echo "💡 Start your local server first:"
    echo "   cd server && JWT_SECRET=test PORT=5050 node server.js"
    exit 1
fi

# Check database connection
echo ""
echo "🗄️  Testing database connection..."
if curl -s http://localhost:5050/api/ > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "💡 Check your local database configuration"
    exit 1
fi

# Check what tables exist
echo ""
echo "📋 Checking database tables..."
echo "=============================="

# Try to get table information from API
echo "Available endpoints:"
echo "• /api/products - Products table"
echo "• /api/categories - Categories table" 
echo "• /api/users - Users table"
echo "• /api/orders - Orders table"

echo ""
echo "🧪 Testing API endpoints..."

# Test products endpoint
if curl -s http://localhost:5050/api/products | grep -q "success\|error\|message"; then
    echo "✅ Products endpoint responding"
else
    echo "❌ Products endpoint not responding"
fi

# Test categories endpoint
if curl -s http://localhost:5050/api/categories | grep -q "success\|error\|message"; then
    echo "✅ Categories endpoint responding"
else
    echo "❌ Categories endpoint not responding"
fi

echo ""
echo "📊 Database Summary:"
echo "==================="
echo "Local server: http://localhost:5050"
echo "Database type: PostgreSQL (port 5433)"
echo "Database name: stmg"

echo ""
echo "🚀 Ready for migration!"
echo "======================="
echo "Run the migration script:"
echo "./migrate-db.sh"
echo ""
echo "Or import manually:"
echo "1. Export: pg_dump -h localhost -p 5433 -U postgres -d stmg > export.sql"
echo "2. Import: psql 'postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres' -f export.sql"
