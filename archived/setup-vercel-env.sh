#!/bin/bash

echo "🚀 Setting up Vercel Environment Variables for Supabase..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔑 Adding environment variables to Vercel..."

# Add database connection string
echo "Adding CNX_STRING..."
vercel env add CNX_STRING <<< "postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres"

# Add JWT secret
echo "Adding JWT_SECRET..."
vercel env add JWT_SECRET <<< "stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789"

# Add JWT expire
echo "Adding JWT_EXPIRE..."
vercel env add JWT_EXPIRE <<< "7d"

# Add Node environment
echo "Adding NODE_ENV..."
vercel env add NODE_ENV <<< "production"

echo "✅ Environment variables added successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Commit and push your changes"
echo "2. Vercel will automatically redeploy with the new environment variables"
echo "3. Test your API endpoints"
echo ""
echo "🧪 Test your deployment:"
echo "curl https://your-app.vercel.app/api/"
echo "curl https://your-app.vercel.app/api/products"
