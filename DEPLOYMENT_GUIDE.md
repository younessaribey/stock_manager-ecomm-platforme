# Vercel Deployment Guide

## 🚀 Quick Fix for 404 Errors

### 1. Environment Variables Setup

Add these environment variables in your Vercel project settings:

#### Required Variables:
```env
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
```

#### Database Configuration (Choose one):

**Option A: Vercel Postgres (Recommended)**
```bash
# Add Vercel Postgres to your project
vercel addons create postgres
```
Then add:
```env
CNX_STRING=postgresql://username:password@host:port/database?sslmode=require
```

**Option B: External Database**
```env
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

**Option C: SQLite (Development only)**
```env
DB_TYPE=sqlite
DB_PATH=/tmp/database.sqlite
```

### 2. Vercel Project Settings

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables
4. Set them for Production, Preview, and Development

### 3. Build Settings

The `vercel.json` has been updated with:
- ✅ Proper build commands
- ✅ Function timeout settings
- ✅ Correct routing configuration

### 4. Deployment Steps

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **Vercel will automatically redeploy**

3. **Check deployment logs** in Vercel dashboard

### 5. Troubleshooting

#### If you still get 404 errors:

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on the latest deployment
   - Check the build logs for errors

2. **Check Function Logs:**
   - Go to Functions tab in Vercel dashboard
   - Look for server errors

3. **Test API endpoints:**
   - Try accessing `/api/products` directly
   - Check if the server is responding

#### Common Issues:

- **Database connection errors:** Add proper `CNX_STRING` or database credentials
- **JWT errors:** Ensure `JWT_SECRET` is set
- **Build failures:** Check that all dependencies are installed

### 6. Frontend-Only Deployment (Quick Start)

If you want to deploy just the frontend first:

1. **Update vercel.json** to remove server build:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build",
           "buildCommand": "npm run build"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/client/build/$1"
       }
     ]
   }
   ```

2. **Deploy and test frontend**

3. **Add backend later** when database is ready

## 🎯 Expected Results

After fixing these issues:
- ✅ Frontend will load without 404 errors
- ✅ API endpoints will work (with database)
- ✅ Authentication will function
- ✅ All features will be accessible

## 📞 Support

If you continue to have issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Ensure database is accessible
4. Test locally first with `npm run build`
