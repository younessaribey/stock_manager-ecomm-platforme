# Local Development Setup Guide

## Overview

This guide walks through setting up the project for local development with proper environment configuration.

---

## Prerequisites

- **Docker Desktop** installed and running
- **Node.js 18+** installed
- **Git** configured

---

## Quick Start

### Step 1: Clone and Install

```bash
cd /Users/mac/Desktop/stock_manager-ecomm-platforme
cd nestjs-backend
npm install
```

### Step 2: Start Backend Services

```bash
cd /Users/mac/Desktop/stock_manager-ecomm-platforme
docker compose up -d
```

This starts:
- PostgreSQL (port 5434)
- Redis (port 6379)
- RabbitMQ (ports 5672, 15672)

Wait 20 seconds for services to initialize.

### Step 3: Verify Services

```bash
docker compose ps
```

All services should show "Up (healthy)".

### Step 4: Start API

```bash
cd nestjs-backend
npm run start:dev
```

The API will be available at http://localhost:3000

---

## Environment Configuration

The project requires a `.env` file in `nestjs-backend/` directory.

### Creating .env File

```bash
cat > nestjs-backend/.env << 'EOF'
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=stmg
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
EOF
```

**Important:** The `.env` file is gitignored and contains local configuration.

---

## Testing the API

### Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-11-15T..."}
```

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Get Products

```bash
curl http://localhost:3000/api/products/public
```

---

## Architecture

### What Runs Where

**Docker Services (docker compose):**
- PostgreSQL database on port 5434
- Redis cache on port 6379
- RabbitMQ message broker on ports 5672, 15672

**Host Machine (your Mac):**
- NestJS API on port 3000
- React frontend on port 3001 (optional)

### Why This Setup?

Running the API on the host machine provides:
- Faster hot reload
- Better debugging experience
- No Docker volume mount issues
- Direct access to logs

Backend services run in Docker to:
- Keep your Mac clean
- Match production environment
- Easy start/stop with one command

---

## Common Issues Fixed

### 1. Password Authentication Failed

**Problem:** API couldn't connect to PostgreSQL due to missing `.env` file.

**Solution:** Created `.env` file with correct credentials matching Docker services.

### 2. Dependency Injection Error

**Problem:** `DashboardService` couldn't resolve `OrdersService` dependency.

**Solution:** Added `exports: [OrdersService]` to `OrdersModule` to make the service available to other modules.

### 3. Port Conflict

**Problem:** PostgreSQL port 5432 was already in use by Mac's local PostgreSQL.

**Solution:** Changed Docker PostgreSQL external port to 5434.

---

## Development Workflow

### Daily Startup

```bash
# Terminal 1: Start Docker services
docker compose up -d

# Terminal 2: Start API
cd nestjs-backend
npm run start:dev

# Terminal 3 (optional): Start frontend
cd client
npm start
```

### Making Changes

1. Edit files in `nestjs-backend/src/`
2. API automatically reloads (hot reload enabled)
3. Check logs in terminal for errors
4. Test endpoints with curl or Postman

### Stopping Services

```bash
# Stop API: Press Ctrl+C in API terminal
# Stop Docker services:
docker compose down
```

---

## Database Access

### Connect to PostgreSQL

```bash
docker compose exec postgres psql -U postgres -d stmg
```

### Useful Commands

```sql
\dt                    -- List all tables
SELECT * FROM users;   -- View users
\d users              -- Describe users table
\q                    -- Exit
```

---

## Monitoring Services

### Check RabbitMQ

Open http://localhost:15672 in browser:
- Username: `admin`
- Password: `admin123`

### Check Redis

```bash
docker compose exec redis redis-cli ping
# Expected: PONG

docker compose exec redis redis-cli -a redis123 keys "*"
# Shows all cached keys
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f rabbitmq
```

---

## Project Structure

```
nestjs-backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── products/       # Product management
│   ├── categories/     # Category management
│   ├── orders/         # Order management
│   ├── cart/           # Shopping cart
│   ├── wishlist/       # User wishlist
│   ├── dashboard/      # Admin dashboard
│   ├── settings/       # App settings
│   ├── images/         # Image management
│   ├── news/           # News articles
│   ├── redis/          # Redis caching
│   ├── rabbitmq/       # Message queue
│   ├── monitoring/     # Performance monitoring
│   └── common/         # Shared utilities
├── test/               # E2E tests
├── .env               # Local environment (gitignored)
├── .env.example       # Environment template
└── package.json       # Dependencies

client/
├── src/
│   ├── pages/         # React pages
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   └── utils/         # Utilities
└── package.json
```

---

## Git Workflow

### Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ...

# Stage changes
git add .

# Commit with conventional commit format
git commit -m "feat(module): add new feature

Detailed description of what changed and why."

# Push to GitHub
git push origin feature/your-feature-name
```

### Commit Message Format

```
type(scope): brief description

Optional detailed explanation
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

---

## Troubleshooting

### API Won't Start

1. Check if `.env` file exists in `nestjs-backend/`
2. Verify Docker services are running: `docker compose ps`
3. Check if dependencies installed: `cd nestjs-backend && npm install`
4. Review API logs for specific errors

### Can't Connect to Database

1. Verify PostgreSQL is healthy: `docker compose ps postgres`
2. Test connection: `docker compose exec postgres pg_isready -U postgres`
3. Check credentials in `.env` match `docker-compose.yml`

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

---

## Next Steps

1. **Explore the API:** Test all endpoints using Postman or curl
2. **Review code:** Check module structure in `nestjs-backend/src/`
3. **Run tests:** `cd nestjs-backend && npm test`
4. **Deploy:** Follow `DIGITALOCEAN_DEPLOYMENT_GUIDE.md` when ready

---

## Additional Resources

- **API Documentation:** http://localhost:3000/api
- **RabbitMQ UI:** http://localhost:15672
- **NestJS Docs:** https://docs.nestjs.com
- **TypeORM Docs:** https://typeorm.io
- **Docker Docs:** https://docs.docker.com

---

## Summary

The project is configured for efficient local development:

✅ Backend services isolated in Docker containers  
✅ API runs on host for fast development  
✅ Environment properly configured  
✅ Database connection working  
✅ Hot reload enabled  
✅ Ready for development

**Start developing!** All services are configured and ready to use.

