#!/bin/bash

# 🚀 Deploy to Vercel - Demo Mode
# This script commits and pushes changes to trigger Vercel deployment

echo "🚀 Deploying Stock Manager to Vercel..."
echo ""

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Fix: Enable demo mode for Vercel deployment

- Updated appConfig to default to DEMO MODE
- Created vercel.json with environment configuration
- Fixed CORS errors by using localStorage instead of backend API
- Added deployment documentation"

# Push to GitHub (triggers Vercel deployment)
echo "🌐 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "🔍 Monitor deployment at: https://vercel.com/dashboard"
echo "🌐 Your site: https://stock-manager-ecomm-platforme.vercel.app"
echo ""
echo "⏱️  Deployment usually takes 1-2 minutes"
echo ""
echo "✨ After deployment, check for:"
echo "   - NO CORS errors"
echo "   - Console shows: '🎨 Running in DEMO MODE'"
echo "   - All features work without backend"
echo ""
echo "🎯 Demo Credentials:"
echo "   Admin: admin@demo.com / admin123"
echo "   User: user@demo.com / user123"
echo ""

