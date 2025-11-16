#!/bin/bash

echo "🚀 Starting NestJS API..."
echo ""

# Check if Docker services are running
if ! docker compose ps | grep -q "Up (healthy)"; then
    echo "⚠️  Docker services not running. Starting them..."
    docker compose up -d
    echo "⏳ Waiting 20 seconds for services to be healthy..."
    sleep 20
fi

# Check if node_modules exist
if [ ! -d "nestjs-backend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd nestjs-backend
    npm install
    cd ..
fi

echo "✅ Starting API on http://localhost:3000"
echo ""
cd nestjs-backend
npm run start:dev

