#!/bin/bash

# DigitalOcean Deployment Script
# Usage: ./deploy-digitalocean.sh [droplet-ip] [user]

set -e

DROPLET_IP=${1:-""}
DROPLET_USER=${2:-"root"}

if [ -z "$DROPLET_IP" ]; then
    echo "❌ Error: Droplet IP required"
    echo "Usage: ./deploy-digitalocean.sh <droplet-ip> [user]"
    echo "Example: ./deploy-digitalocean.sh 123.45.67.89 root"
    exit 1
fi

echo "🚀 Deploying to DigitalOcean Droplet..."
echo "IP: $DROPLET_IP"
echo "User: $DROPLET_USER"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        echo -e "${YELLOW}Please edit .env.production with your production values${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create .env.production manually${NC}"
        exit 1
    fi
fi

# Build NestJS application locally
echo -e "\n${YELLOW}Step 1: Building NestJS application...${NC}"
cd nestjs-backend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Building application..."
npm run build

cd ..

# Create deployment package
echo -e "\n${YELLOW}Step 2: Creating deployment package...${NC}"
DEPLOY_DIR="deploy-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
echo "Copying files..."
cp -r nestjs-backend/dist "$DEPLOY_DIR/"
cp -r nestjs-backend/package.json "$DEPLOY_DIR/"
cp -r nestjs-backend/package-lock.json "$DEPLOY_DIR/"
cp docker-compose.prod.yml "$DEPLOY_DIR/docker-compose.yml"
cp .env.production "$DEPLOY_DIR/.env"
cp -r nginx "$DEPLOY_DIR/" 2>/dev/null || true

# Create deployment script on server
cat > "$DEPLOY_DIR/deploy.sh" << 'DEPLOYSCRIPT'
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Stop existing containers
docker compose down || true

# Install production dependencies
cd dist
npm ci --only=production
cd ..

# Start services
docker compose up -d --build

echo "✅ Deployment complete!"
echo "Check status: docker compose ps"
echo "View logs: docker compose logs -f"
DEPLOYSCRIPT

chmod +x "$DEPLOY_DIR/deploy.sh"

# Transfer to droplet
echo -e "\n${YELLOW}Step 3: Transferring files to droplet...${NC}"
scp -r "$DEPLOY_DIR" "$DROPLET_USER@$DROPLET_IP:/root/stock-manager-deploy"

# Run deployment on server
echo -e "\n${YELLOW}Step 4: Running deployment on server...${NC}"
ssh "$DROPLET_USER@$DROPLET_IP" << 'ENDSSH'
cd /root/stock-manager-deploy
chmod +x deploy.sh
./deploy.sh
ENDSSH

# Cleanup
echo -e "\n${YELLOW}Step 5: Cleaning up...${NC}"
rm -rf "$DEPLOY_DIR"

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Access your application:"
echo "  API: http://$DROPLET_IP:3000/api"
echo "  Health: http://$DROPLET_IP:3000/api/health"
echo ""
echo "SSH into droplet:"
echo "  ssh $DROPLET_USER@$DROPLET_IP"
echo ""
echo "View logs:"
echo "  ssh $DROPLET_USER@$DROPLET_IP 'cd /root/stock-manager-deploy && docker compose logs -f'"

