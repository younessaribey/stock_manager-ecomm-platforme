# Supabase Database Setup for Vercel

## 🎯 Your Supabase Configuration

### Database Connection String:
```
postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres
```

### Project Details:
- **Project URL**: `https://xfqahkbvjbskepciciil.supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcWFoa2J2amJza2VwY2ljaWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTg5NDgsImV4cCI6MjA3NjAzNDk0OH0.k3k7GH6WXTni-hjjUFB_57jwxtIgDgPeFZP5UVLzEhc`

---

## 🚀 Vercel Environment Variables Setup

### Step 1: Go to Vercel Dashboard
1. Open your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables** in the left sidebar

### Step 2: Add These Variables

#### Database Connection:
```
Name: CNX_STRING
Value: postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres
Environment: Production, Preview, Development
```

#### JWT Configuration:
```
Name: JWT_SECRET
Value: stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789
Environment: Production, Preview, Development
```

```
Name: JWT_EXPIRE
Value: 7d
Environment: Production, Preview, Development
```

#### Node Environment:
```
Name: NODE_ENV
Value: production
Environment: Production
```

#### Frontend URL:
```
Name: CLIENT_URL
Value: https://your-app-name.vercel.app
Environment: Production
```

```
Name: FRONTEND_URL
Value: https://your-app-name.vercel.app
Environment: Production
```

---

## 🔧 Using Vercel CLI (Alternative)

If you prefer using the CLI:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add CNX_STRING
# Paste: postgresql://postgres:yo290699@db.xfqahkbvjbskepciciil.supabase.co:5432/postgres

vercel env add JWT_SECRET
# Paste: stock_manager_super_secret_jwt_key_2024_very_long_and_secure_123456789

vercel env add JWT_EXPIRE
# Paste: 7d

vercel env add NODE_ENV
# Paste: production
```

---

## 📋 Next Steps After Setting Environment Variables

1. **Redeploy your application** (Vercel will automatically redeploy when you add env vars)
2. **Test the database connection**
3. **Verify API endpoints are working**

---

## 🧪 Testing Your Setup

### Test Database Connection:
```bash
curl https://your-app.vercel.app/api/
```

### Test Products Endpoint:
```bash
curl https://your-app.vercel.app/api/products
```

### Test Authentication:
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🎯 Expected Results

After setting up the environment variables:
- ✅ Database connection will work
- ✅ API endpoints will respond
- ✅ Authentication will function
- ✅ Full-stack application will be live

---

## 🆘 Troubleshooting

### If you get database connection errors:
1. Verify the connection string is correct
2. Check that Supabase project is active
3. Ensure the password is correct: `yo290699`

### If you get JWT errors:
1. Verify JWT_SECRET is set
2. Check that JWT_EXPIRE is valid

### If API endpoints return 404:
1. Check that backend is deployed
2. Verify environment variables are set
3. Check Vercel function logs

---

## 📞 Support

Your Supabase database is ready to use! The connection string is configured and your server code will automatically connect to it once the environment variables are set in Vercel.
