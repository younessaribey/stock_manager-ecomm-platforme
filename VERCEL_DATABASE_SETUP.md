# 🚀 Vercel Database Setup Guide

## Current Vercel Deployment Issue

Your Vercel deployment at:
```
https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app
```

Is currently **protected with authentication** and requires Vercel login to access.

---

## 🔐 Step 1: Disable Deployment Protection

To make your app publicly accessible:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find project: `stock-manager-ecomm-platforme-pc3puwks4`
3. Click **Settings** (left sidebar)
4. Click **Deployment Protection**
5. Change setting to:
   - **"Only Production Deployments"** (recommended for public app)
   - Or **"Disabled"** (if you want all deployments public)
6. Save changes

---

## 🗄️ Step 2: Set Up Environment Variables in Vercel

Your Supabase database is ready to use. Add these environment variables:

### Required Environment Variables:

#### 1. Database Connection
```
Name: CNX_STRING
Value: postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### 2. JWT Secret
```
Name: JWT_SECRET
Value: stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### 3. JWT Expiration
```
Name: JWT_EXPIRE
Value: 7d
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### 4. Node Environment
```
Name: NODE_ENV
Value: production
Environments: ✅ Production only
```

#### 5. Client URL (Production)
```
Name: CLIENT_URL
Value: https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app
Environments: ✅ Production
```

#### 6. Frontend URL
```
Name: FRONTEND_URL
Value: https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app
Environments: ✅ Production
```

### How to Add in Vercel Dashboard:

1. Go to your project in Vercel
2. Click **Settings**
3. Click **Environment Variables** (left sidebar)
4. Click **Add New**
5. Enter:
   - Name: (variable name)
   - Value: (variable value)
   - Select environments (Production/Preview/Development)
6. Click **Save**
7. Repeat for all 6 variables above

---

## 📦 Step 3: Import Data to Supabase Database

After setting environment variables, populate your Vercel/Supabase database:

### Option A: Using Scripts Locally

```bash
# 1. Set up categories (45 categories with subcategories)
CNX_STRING="postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" \
JWT_SECRET="stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789" \
node server/scripts/setup-final-categories.js

# 2. Create admin user
CNX_STRING="postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" \
JWT_SECRET="stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789" \
node server/scripts/create-admin.js

# 3. Add sample products (25 products)
CNX_STRING="postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" \
JWT_SECRET="stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789" \
node server/scripts/add-sample-products.js
```

### Option B: Import More Products

If you want to import products from Brothers Phone website:

```bash
CNX_STRING="postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres" \
JWT_SECRET="stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789" \
node server/scripts/import-brothers-phone-enhanced.js
```

This will import real product data from the Brothers Phone e-commerce site.

---

## 🔄 Step 4: Redeploy on Vercel

After adding environment variables:

### Automatic Redeployment:
Vercel will automatically redeploy when you add/change environment variables.

### Manual Redeployment:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"..."** (three dots)
4. Click **"Redeploy"**
5. Wait for deployment to complete

---

## ✅ Step 5: Verify Deployment

### Test Your Vercel API:

```bash
# Test main API
curl https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app/api/ping

# Test public settings
curl https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app/api/settings/public

# Test public products
curl https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app/api/products/public

# Test categories
curl https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app/api/categories
```

### Expected Responses:
- `/api/ping` → `{"pong":true}`
- `/api/settings/public` → `{"siteName":"...","contactEmail":"...",...}`
- `/api/products/public` → `[{product data}]`
- `/api/categories` → `[{category data}]`

---

## 🗄️ Supabase Database Info

Your Supabase database is already set up and ready:

- **Project URL**: `https://xfqahkbvjbskepciciil.supabase.co`
- **Connection String**: `postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres`
- **Database**: postgres
- **SSL**: Required (automatically handled)

### Database Contents (After Import):
- ✅ 45 categories (9 main + 36 subcategories)
- ✅ 25+ sample products
- ✅ 1 admin user (admin@example.com / admin123)
- ✅ All tables: users, products, categories, orders, cart, wishlist, settings

---

## 🔍 Current Status: Database Import

### Is the database imported in Vercel?

**Answer**: Not yet automatically. You need to run the import scripts.

**Why?**: 
- Your local database (PostgreSQL at localhost:5433) has the data
- Your Vercel/Supabase database is separate and currently empty
- The structure will auto-create on first deployment
- You must manually run scripts to populate it with data

**What Happens When You Deploy**:
1. ✅ Vercel deploys your code
2. ✅ Database tables are auto-created (via Sequelize sync)
3. ⏳ Data is NOT automatically copied (you must import)
4. ⏳ Admin user is NOT automatically created (you must create)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Authentication Required" Page
**Solution**: Disable deployment protection (Step 1 above)

### Issue 2: API Returns "Internal Server Error"
**Solution**: Make sure all 6 environment variables are set correctly

### Issue 3: "Database connection failed"
**Solution**: 
- Verify CNX_STRING is correct
- Check Supabase project is active at https://supabase.com
- Ensure password in connection string is: `yo290699`

### Issue 4: No Products/Categories Showing
**Solution**: Run the import scripts (Step 3 above)

### Issue 5: Can't Login with Admin Credentials
**Solution**: 
- Run create-admin.js script against Supabase
- Use credentials: admin@example.com / admin123

---

## 📋 Quick Checklist

- [ ] Disable Vercel deployment protection
- [ ] Add CNX_STRING environment variable
- [ ] Add JWT_SECRET environment variable
- [ ] Add JWT_EXPIRE environment variable
- [ ] Add NODE_ENV environment variable
- [ ] Add CLIENT_URL environment variable
- [ ] Add FRONTEND_URL environment variable
- [ ] Wait for automatic redeploy (or trigger manually)
- [ ] Run setup-final-categories.js with Supabase connection
- [ ] Run create-admin.js with Supabase connection
- [ ] Run add-sample-products.js with Supabase connection
- [ ] Test API endpoints with curl
- [ ] Visit frontend and verify it loads
- [ ] Login with admin credentials
- [ ] Verify products and categories show up

---

## 🎯 Final Result

After completing all steps:
- ✅ Frontend accessible at: https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app
- ✅ API responding at: https://stock-manager-ecomm-platforme-pc3puwks4.vercel.app/api
- ✅ Database connected to Supabase
- ✅ Products and categories loaded
- ✅ Admin login working
- ✅ Full e-commerce functionality live

---

## 📞 Need Help?

### Check Vercel Logs:
1. Go to Vercel Dashboard
2. Click on your project
3. Click on latest deployment
4. Click **"Functions"** tab
5. Click on any function to see logs
6. Look for error messages

### Check Supabase:
1. Go to https://supabase.com
2. Find project: xfqahkbvjbskepciciil
3. Click **"Table Editor"**
4. Verify tables exist: users, products, categories
5. Check if data is populated

---

**Created**: October 15, 2025
**Status**: ⏳ Awaiting Vercel Configuration
**Next Steps**: Follow Step 1-5 above


