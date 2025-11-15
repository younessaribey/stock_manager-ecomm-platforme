# Quick Start Guide - DigitalOcean Deployment

## Option 1: Full NestJS Migration (Recommended for Production)

### Prerequisites
```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Install dependencies
cd nestjs-backend
npm install
```

### Steps
1. **Create TypeORM entities** (see NESTJS_MIGRATION_GUIDE.md)
2. **Port Express routes to NestJS controllers**
3. **Build and deploy**:
```bash
npm run build
docker compose -f docker-compose.prod.yml up -d
```

## Option 2: Keep Express (Faster Setup)

### Update docker-compose.prod.yml

Change the `api` service to use Express:

```yaml
api:
  build:
    context: ./server
    dockerfile: Dockerfile
  # ... rest of config
```

### Create Express Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5050
CMD ["node", "server.js"]
```

## Option 3: Hybrid Approach

Run both Express (current) and NestJS (new) side-by-side:
- Express: Port 5050 (existing API)
- NestJS: Port 3000 (new API)
- Gradually migrate endpoints

## Recommended: Start with Express + Docker

1. **Dockerize existing Express app**
2. **Deploy to DigitalOcean**
3. **Gradually migrate to NestJS** (one module at a time)

This way you can deploy immediately and migrate incrementally.

