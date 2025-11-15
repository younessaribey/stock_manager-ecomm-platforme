# Vercel Environment Variables Setup Guide

## 🚀 Required Environment Variables for Backend

### How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables** in the left sidebar
4. Add each variable below

---

## 📋 Required Variables:

### 1. JWT Configuration (Required for Authentication)
```
Name: JWT_SECRET
Value: your_super_secret_jwt_key_here_change_in_production_make_it_long_and_random
Environment: Production, Preview, Development
```

```
Name: JWT_EXPIRE
Value: 7d
Environment: Production, Preview, Development
```

### 2. Node Environment
```
Name: NODE_ENV
Value: production
Environment: Production
```

### 3. Database Configuration (Choose ONE option)

#### Option A: Vercel Postgres (Recommended - Easiest)
```bash
# In Vercel CLI or Dashboard:
vercel addons create postgres
```
This automatically creates the `CNX_STRING` variable

#### Option B: External PostgreSQL Database
```
Name: CNX_STRING
Value: postgresql://username:password@host:port/database?sslmode=require
Environment: Production, Preview, Development
```

#### Option C: Individual Database Credentials
```
Name: DB_HOST
Value: your-database-host.com
Environment: Production, Preview, Development

Name: DB_PORT
Value: 5432
Environment: Production, Preview, Development

Name: DB_NAME
Value: your_database_name
Environment: Production, Preview, Development

Name: DB_USER
Value: your_database_user
Environment: Production, Preview, Development

Name: DB_PASSWORD
Value: your_database_password
Environment: Production, Preview, Development
```

### 4. Client/Frontend URL
```
Name: CLIENT_URL
Value: https://your-app-name.vercel.app
Environment: Production

Name: CLIENT_URL
Value: https://your-app-name-preview.vercel.app
Environment: Preview

Name: CLIENT_URL
Value: http://localhost:3000
Environment: Development
```

```
Name: FRONTEND_URL
Value: https://your-app-name.vercel.app
Environment: Production
```

### 5. Cloudinary (Optional - for image uploads)
```
Name: CLOUDINARY_CLOUD_NAME
Value: your_cloudinary_cloud_name
Environment: Production, Preview, Development

Name: CLOUDINARY_API_KEY
Value: your_cloudinary_api_key
Environment: Production, Preview, Development

Name: CLOUDINARY_API_SECRET
Value: your_cloudinary_api_secret
Environment: Production, Preview, Development
```

---

## 🎯 Minimum Required Variables to Start:

To get the backend working, you **MUST** set these:

1. **JWT_SECRET** (for authentication)
2. **JWT_EXPIRE** (for token expiration)
3. **CNX_STRING** or database credentials (for database connection)
4. **NODE_ENV** (for production mode)

---

## 🔧 Quick Setup Commands:

### Using Vercel CLI:
```bash
# Add JWT Secret
vercel env add JWT_SECRET

# Add JWT Expire
vercel env add JWT_EXPIRE

# Add Vercel Postgres (easiest option)
vercel addons create postgres

# Add Node Environment
vercel env add NODE_ENV
```

---

## 📝 Example Values:

### For Development/Testing:
```env
JWT_SECRET=dev_secret_key_change_this_in_production_make_it_very_long_and_random_12345678
JWT_EXPIRE=7d
NODE_ENV=production
CNX_STRING=postgresql://user:password@host:5432/dbname?sslmode=require
CLIENT_URL=https://your-app.vercel.app
```

---

## ⚠️ Important Notes:

1. **JWT_SECRET should be long and random** - use a password generator
2. **Never commit .env files** - they're in .gitignore
3. **Set variables for all environments** - Production, Preview, Development
4. **Redeploy after adding variables** - Vercel needs to rebuild with new env vars

---

## 🚀 After Setting Variables:

1. **Redeploy your application**:
   ```bash
   git commit -m "Enable backend with environment variables"
   git push origin main
   ```

2. **Or trigger redeploy in Vercel dashboard**:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## 🧪 Testing the Backend:

Once deployed with environment variables, test:

```bash
# Test main API endpoint
curl https://your-app.vercel.app/api/

# Test products endpoint (might need authentication)
curl https://your-app.vercel.app/api/products
```

---

## 🆘 Troubleshooting:

### Backend not responding?
- Check that all required env vars are set
- Check Vercel function logs for errors
- Ensure database is accessible

### Authentication errors?
- Verify JWT_SECRET is set
- Check that JWT_EXPIRE is valid

### Database connection errors?
- Verify CNX_STRING or DB credentials are correct
- Check that database allows connections from Vercel IPs
- Ensure SSL mode is properly configured

---

## 📞 Support:

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Test the database connection separately
4. Check the Vercel function logs
