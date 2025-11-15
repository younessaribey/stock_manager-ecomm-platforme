# 🚀 LOCAL PREVIEW - Quick Start Guide

## ✅ Simple Solution: Run API on Your Mac

**The Problem:** Docker volume mounting causes issues with node_modules

**The Solution:** Run API on your Mac, Docker runs backend services only

---

## 📝 Step-by-Step:

### **Step 1: Start Backend Services (PostgreSQL, Redis, RabbitMQ)**
```bash
cd /Users/mac/Desktop/stock_manager-ecomm-platforme
docker compose up -d
```

This starts:
- ✅ PostgreSQL (port 5433)
- ✅ Redis (port 6379)
- ✅ RabbitMQ (ports 5672, 15672)

**Wait 20 seconds** for services to be healthy.

---

### **Step 2: Check Services Are Running**
```bash
docker compose ps
```

All should show `Up (healthy)` (no API service needed!)

---

### **Step 3: Start NestJS API on Your Mac**
```bash
# Open new terminal window/tab
cd /Users/mac/Desktop/stock_manager-ecomm-platforme/nestjs-backend

# Install dependencies (if not already done)
npm install

# Start API in development mode
npm run start:dev
```

**Expected output:**
```
[Nest] INFO  [NestFactory] Starting Nest application...
[Nest] INFO  [InstanceLoader] AppModule dependencies initialized
[Nest] INFO  [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] INFO  [NestApplication] Nest application successfully started
```

**API will run on:** http://localhost:3000

---

### **Step 4: Test API**
```bash
# In another terminal
curl http://localhost:3000/api/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

---

## 🌐 Access URLs

| Service | URL | Port |
|---------|-----|------|
| **NestJS API** | http://localhost:3000 | 3000 |
| **API Health** | http://localhost:3000/api/health | 3000 |
| **RabbitMQ UI** | http://localhost:15672 | 15672 |
| **Products** | http://localhost:3000/api/products/public | 3000 |
| **Categories** | http://localhost:3000/api/categories | 3000 |

**RabbitMQ Login:**
- Username: `admin`
- Password: `admin123`

---

## 🧪 Test API Endpoints

### **1. Health Check**
```bash
curl http://localhost:3000/api/health
```

### **2. Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### **3. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Copy the token** from response!

### **4. Get Products**
```bash
curl http://localhost:3000/api/products/public
```

### **5. Protected Route** (with token)
```bash
# Replace YOUR_TOKEN_HERE with actual token
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 Start Frontend (Optional)

If you want to see the React frontend:

```bash
# Terminal 1: Keep Docker services running
# Terminal 2: Keep API running (npm run start:dev)
# Terminal 3: Start React frontend

cd /Users/mac/Desktop/stock_manager-ecomm-platforme/client
npm install
npm start
```

Frontend opens at: http://localhost:3001

---

## 🔍 Check Database

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U postgres -d stmg

# Inside PostgreSQL:
\dt              # List tables
SELECT * FROM users;  # View users
\q               # Exit
```

---

## 🔍 Check Redis

```bash
# Test Redis
docker compose exec redis redis-cli ping
# Expected: PONG

# View keys
docker compose exec redis redis-cli keys "*"
```

---

## 📊 Development Setup Summary

**What Runs Where:**

### **Docker (docker compose up -d):**
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ RabbitMQ message queue

### **Your Mac (npm run start:dev):**
- ✅ NestJS API (port 3000)
- ✅ Hot reload enabled
- ✅ Easy debugging

---

## 🛑 Stop Everything

### **Stop API:**
Press `Ctrl+C` in the terminal where API is running

### **Stop Docker Services:**
```bash
docker compose down
```

### **Stop Everything:**
```bash
# Stop API (Ctrl+C)
# Stop Docker services
docker compose down
```

---

## 🔧 Troubleshooting

### **API Won't Start - Missing .env File:**
If you see `password authentication failed for user "postgres"`:

```bash
# Create .env file
cat > /Users/mac/Desktop/stock_manager-ecomm-platforme/nestjs-backend/.env << 'EOF'
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5433
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

# Then restart API
cd nestjs-backend
npm run start:dev
```

### **API Won't Start:**
```bash
# Check if dependencies installed
cd nestjs-backend
ls node_modules | head -5

# Install if needed
npm install

# Check if services are running
docker compose ps
```

### **API Can't Connect to Database:**
```bash
# Verify PostgreSQL is running
docker compose ps postgres

# Should show "Up (healthy)"

# Check connection
docker compose exec postgres pg_isready -U postgres

# Test connection with credentials
docker compose exec postgres psql -U postgres -d stmg -c "SELECT 1;"
```

### **Port 3000 Already in Use:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID)
kill -9 PID

# Or change port in nestjs-backend/.env:
PORT=3001
```

---

## ✅ Quick Verification

Run these commands to verify everything:

```bash
# 1. Services running?
docker compose ps
# ✅ Should show 3 services healthy (postgres, redis, rabbitmq)

# 2. API running?
curl http://localhost:3000/api/health
# ✅ Should return {"status":"ok",...}

# 3. Can register?
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"test123","name":"Test"}'
# ✅ Should create user

# 4. Can login?
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"test123"}'
# ✅ Should return token

# 5. Products available?
curl http://localhost:3000/api/products/public
# ✅ Should return array of products
```

---

## 🎯 Why This Approach?

**Benefits of Running API on Host:**

✅ **No Volume Mount Issues** - Dependencies work correctly  
✅ **Better Hot Reload** - Changes reflect immediately  
✅ **Easier Debugging** - Use VS Code debugger  
✅ **Faster Startup** - No Docker container overhead  
✅ **Better Logs** - See logs directly in terminal  

**Backend Services in Docker:**
✅ **Isolated** - Don't pollute your Mac  
✅ **Easy Setup** - One command starts everything  
✅ **Consistent** - Same as production  

---

## 📝 Quick Commands Reference

```bash
# Start backend services (Docker)
docker compose up -d

# Start API (Your Mac)
cd nestjs-backend && npm run start:dev

# Check services
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down

# Test API
curl http://localhost:3000/api/health
```

---

## 🎉 You're All Set!

**Your development setup:**
- ✅ Docker runs backend services
- ✅ API runs on your Mac
- ✅ Hot reload enabled
- ✅ Easy debugging

**API running at:** http://localhost:3000  
**Health check:** http://localhost:3000/api/health  
**RabbitMQ UI:** http://localhost:15672 (admin/admin123)

**Start coding!** 🚀

