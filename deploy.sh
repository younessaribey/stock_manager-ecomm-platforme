#!/bin/bash

# Deployment script for Vercel
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🌐 Ready for deployment to Vercel"
    echo ""
    echo "Next steps:"
    echo "1. Set up your environment variables in Vercel dashboard"
    echo "2. Connect your GitHub repository to Vercel"
    echo "3. Deploy!"
    echo ""
    echo "Required environment variables:"
    echo "- DATABASE_URL (PostgreSQL connection string)"
    echo "- JWT_SECRET (strong secret key)"
    echo "- CLIENT_URL (your production domain)"
    echo "- CLOUDINARY_* (for image uploads)"
    echo "- ADMIN_EMAIL and ADMIN_PASSWORD"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
