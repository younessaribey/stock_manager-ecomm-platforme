# 🧪 Testing Guide - Unit Tests vs Integration Tests

## 📚 Two Types of Tests

### **1. Unit Tests** (Current - Uses Mocks) ⚡

**What:** Test one piece of code in isolation  
**How:** Mock all dependencies (Redis, Database)  
**Speed:** Fast (milliseconds)  
**Purpose:** Test business logic only  

**Run with:**
```bash
npm test          # Runs unit tests (uses mocks)
npm run test:unit # Explicitly run unit tests only
```

**Example:** `products.service.spec.ts`
- Tests ProductsService logic
- Mocks Redis (doesn't need real Redis)
- Mocks Database (doesn't need real PostgreSQL)
- Fast and isolated

---

### **2. Integration Tests** (Real Services) 🚀

**What:** Test how services work together  
**How:** Uses REAL Redis, REAL Database  
**Speed:** Slower (needs services running)  
**Purpose:** Test real connections and caching  

**Run with:**
```bash
# Make sure Docker services are running first!
docker compose up -d redis postgres

# Then run integration tests
npm run test:integration
```

**Example:** `products.integration.spec.ts`
- Tests ProductsService WITH real Redis
- Tests actual caching behavior
- Tests Redis connection
- More realistic

---

## 🎯 Why We Use Mocks in Unit Tests

### **Unit Test Goal:**
Test **ProductsService logic ONLY**, not Redis

### **With Mocks (Unit Tests):**
```
✅ Fast: 5ms per test
✅ Isolated: Only tests your code
✅ Independent: Works even if Redis is down
✅ Focused: Tests business logic, not infrastructure
```

### **With Real Redis (Integration Tests):**
```
✅ Realistic: Tests actual caching
✅ Comprehensive: Tests Redis connection
✅ End-to-end: Tests full flow
❌ Slower: 100ms per test (20x slower)
❌ Needs Redis: Must have Docker running
❌ Complex: If Redis fails, test fails (even if code is right)
```

---

## 💡 Best Practice: Both Types!

### **Unit Tests** (Fast, many tests)
- Test business logic
- Mock dependencies
- Run in CI/CD
- Catch bugs quickly

### **Integration Tests** (Realistic, fewer tests)
- Test real Redis caching
- Test database connections
- Test API endpoints
- Verify everything works together

---

## 🚀 How to Test Locally

### **Option 1: Unit Tests (Mocks - Fast)**

```bash
cd nestjs-backend

# Run unit tests (doesn't need services running)
npm test

# Expected: All tests pass in ~10 seconds
```

**When to use:**
- During development
- Before committing code
- In CI/CD pipeline
- Quick feedback

---

### **Option 2: Integration Tests (Real Services)**

```bash
# Step 1: Start Docker services
cd /Users/mac/Desktop/stock_manager-ecomm-platforme
docker compose up -d redis postgres

# Wait 10 seconds for services to be ready
docker compose ps  # Should show "healthy"

# Step 2: Run integration tests
cd nestjs-backend
npm run test:integration

# Expected: Tests connect to real Redis and cache data
```

**When to use:**
- Before deploying
- Testing Redis caching behavior
- Verifying connections work
- End-to-end testing

---

### **Option 3: E2E Tests (Full API)**

```bash
# Step 1: Start ALL services
docker compose up -d

# Step 2: Run E2E tests
cd nestjs-backend
npm run test:e2e

# Expected: Tests make real HTTP requests to API
```

**When to use:**
- Testing complete user flows
- Testing authentication
- Testing API endpoints
- Final verification

---

### **Option 4: Run All Tests**

```bash
# Make sure all Docker services are running
docker compose up -d

# Run everything
cd nestjs-backend
npm run test:all

# This runs:
# 1. Unit tests (mocked, fast)
# 2. Integration tests (real Redis)
# 3. E2E tests (real API)
```

---

## 🔍 Testing Locally - Step by Step

### **Quick Test (Unit Tests Only):**

```bash
cd nestjs-backend
npm test
```

**Result:** All unit tests pass ✅ (no services needed)

---

### **Full Test (All Services Running):**

```bash
# Terminal 1: Start services
cd /Users/mac/Desktop/stock_manager-ecomm-platforme
docker compose up -d

# Wait 30 seconds
docker compose ps  # All should be "healthy"

# Terminal 2: Run tests
cd nestjs-backend
npm run test:all
```

**Result:** 
- ✅ Unit tests pass (mocked)
- ✅ Integration tests pass (real Redis)
- ✅ E2E tests pass (real API)

---

## 📊 Test Comparison

| Test Type | Speed | Needs Services | Tests What | When to Use |
|-----------|-------|----------------|------------|-------------|
| **Unit** | ⚡ Fast | ❌ No | Business Logic | Development, CI/CD |
| **Integration** | 🐢 Slower | ✅ Yes | Real Redis | Before deploy |
| **E2E** | 🐌 Slowest | ✅ Yes | Full API | Final verification |

---

## 🎯 Practical Example

### **Unit Test (Mocked):**
```typescript
// Fast test, doesn't need Redis
it('should find product', async () => {
  mockRedisService.getOrSet.mockImplementation(async (_key, callback) => {
    return await callback(); // Skip cache, just call callback
  });
  
  const product = await service.findOne(1);
  expect(product).toBeDefined();
});
```

### **Integration Test (Real Redis):**
```typescript
// Slower test, needs Redis running
it('should cache product in Redis', async () => {
  // First call - fetches from database
  await service.findOne(1);
  
  // Check if actually cached in Redis
  const cached = await redisService.get('product:1');
  expect(cached).toBeDefined(); // Real Redis cache!
});
```

---

## 🚀 Quick Commands Reference

```bash
# Unit tests (fast, no services needed)
npm test

# Integration tests (needs Redis/PostgreSQL)
docker compose up -d redis postgres
npm run test:integration

# E2E tests (needs all services)
docker compose up -d
npm run test:e2e

# Run everything
npm run test:all

# Test with coverage
npm run test:cov
```

---

## 💡 Key Takeaways

1. **Unit Tests = Fast Development**
   - Use mocks
   - Test logic only
   - Run constantly during development

2. **Integration Tests = Real Verification**
   - Use real services
   - Test connections
   - Run before deployment

3. **Both Are Important!**
   - Unit tests: Catch bugs fast
   - Integration tests: Verify it works in reality

---

## ✅ Your Current Setup

- ✅ **Unit tests:** Working (with mocks)
- ✅ **E2E tests:** Working (with real API)
- ✅ **Integration tests:** Added (with real Redis)

**Run `npm run test:all` after starting Docker services!**

