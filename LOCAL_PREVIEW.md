# 🚀 LOCAL PREVIEW GUIDE - Step by Step

## ✅ Quick Start Commands

### **Step 1: Start All Services**
```bash
cd /Users/mac/Desktop/stock_manager-ecomm-platforme
docker compose up -d
```

**What this starts:**
- ✅ PostgreSQL database (port 5434)
- ✅ Redis cache (port 6379)
- ✅ RabbitMQ message queue (ports 5672, 15672)
- ✅ NestJS API (port 3000)

**Wait 30 seconds** for all services to be healthy.

---

### **Step 2: Check Service Status**
```bash
docker compose ps
```

**Expected output:**
All services should show `Up (healthy)` status.

---

### **Step 3: Test API Health**
```bash
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2025-11-15T..."}
```

---

### **Step 4: View API Logs**
```bash
# View all logs
docker compose logs -f

# View only API logs
docker compose logs api -f

# Press Ctrl+C to stop viewing logs
```

---

## 🧪 Test API Endpoints

### **1. Register a New User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

**Expected:** User created successfully

---

### **2. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Save the token** from the response (you'll need it for protected routes).

---

### **3. Get Public Products**
```bash
curl http://localhost:3000/api/products/public
```

**Expected:** Array of products

---

### **4. Get Categories**
```bash
curl http://localhost:3000/api/categories
```

**Expected:** Array of categories

---

### **5. Access Protected Route** (with token)
```bash
# Replace YOUR_TOKEN_HERE with actual token from login
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected:** Your cart items (or empty array)

---

## 🌐 Open in Browser

### **API Health Check:**
Open: http://localhost:3000/api/health

### **RabbitMQ Management UI:**
Open: http://localhost:15672
- **Username:** admin
- **Password:** admin123

### **Public API Endpoints:**
- Products: http://localhost:3000/api/products/public
- Categories: http://localhost:3000/api/categories
- Health: http://localhost:3000/api/health

---

## 🔍 Check Database

### **Connect to PostgreSQL:**
```bash
docker compose exec postgres psql -U postgres -d stmg
```

**Inside PostgreSQL:**
```sql
-- List all tables
\dt

-- View users
SELECT id, email, name, role FROM users;

-- View products
SELECT id, name, price, quantity FROM products;

-- Exit
\q
```

---

## 🔍 Check Redis

```bash
# Test Redis connection
docker compose exec redis redis-cli ping

# Expected: PONG

# View Redis keys
docker compose exec redis redis-cli keys "*"

# Get value from cache
docker compose exec redis redis-cli get "products:all"
```

---

## 🎨 Start Frontend (Optional)

If you want to see the full React frontend:

```bash
# Terminal 1: Keep Docker running
# (Already running from Step 1)

# Terminal 2: Start React frontend
cd /Users/mac/Desktop/stock_manager-ecomm-platforme/client
npm install
npm start
```

Frontend will open at: http://localhost:3001

---

## 📊 Service URLs & Ports

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| **NestJS API** | http://localhost:3000 | 3000 | Backend API |
| **PostgreSQL** | localhost:5434 | 5434 | Database |
| **Redis** | localhost:6379 | 6379 | Cache |
| **RabbitMQ** | localhost:5672 | 5672 | Message Queue |
| **RabbitMQ UI** | http://localhost:15672 | 15672 | Management |
| **React Frontend** | http://localhost:3001 | 3001 | Frontend (if started) |

---

## 🐛 Troubleshooting

### **API Not Responding:**
```bash
# Check API logs
docker compose logs api -f

# Restart API
docker compose restart api

# Rebuild if code changed
docker compose up -d --build api
```

### **Services Not Healthy:**
```bash
# Check all logs
docker compose logs

# Restart all services
docker compose restart

# Start fresh
docker compose down
docker compose up -d
```

### **Port Already in Use:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed (replace PID)
kill -9 PID
```

### **Database Connection Error:**
```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Verify port 5434 is accessible
docker compose exec postgres pg_isready -U postgres
```

---

## ✅ Verification Checklist

Run these commands to verify everything:

```bash
# 1. All services running?
docker compose ps
# ✅ All should be "Up (healthy)"

# 2. API responding?
curl http://localhost:3000/api/health
# ✅ Should return {"status":"ok"}

# 3. Can register user?
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"test123","name":"Test"}'
# ✅ Should create user

# 4. Can login?
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"test123"}'
# ✅ Should return token

# 5. Redis working?
docker compose exec redis redis-cli ping
# ✅ Should return PONG

# 6. PostgreSQL accessible?
docker compose exec postgres pg_isready -U postgres
# ✅ Should return "accepting connections"
```

---

## 🎯 Quick Test Script

Save this as `test-local.sh`:

```bash
#!/bin/bash

echo "🔍 Testing Local Setup..."

# Test API health
echo "1. Testing API health..."
curl -s http://localhost:3000/api/health | jq .

# Test Redis
echo "2. Testing Redis..."
docker compose exec -T redis redis-cli ping

# Test PostgreSQL
echo "3. Testing PostgreSQL..."
docker compose exec -T postgres pg_isready -U postgres

# Test products endpoint
echo "4. Testing products endpoint..."
curl -s http://localhost:3000/api/products/public | jq '. | length' && echo " products found"

echo "✅ All tests complete!"
```

Make it executable:
```bash
chmod +x test-local.sh
./test-local.sh
```

---

## 🚀 Next Steps

Once everything is running:

1. **Test all endpoints** (see commands above)
2. **Check RabbitMQ UI** at http://localhost:15672
3. **Create some data** (users, products, orders)
4. **Test authentication** (register, login, protected routes)
5. **Start frontend** (optional, for full UI)

---

**Your project is now running locally!** 🎉

Check the API at: http://localhost:3000/api/health

