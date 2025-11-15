# 🎨 Demo Mode Setup - Quick Start

This guide will help you quickly set up the application in demo mode for your portfolio.

## ⚡ Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
cd client
npm install
```

This will install `bcryptjs` and other required dependencies.

### Step 2: Verify Demo Mode is Enabled

Open `client/src/config/appConfig.js` and ensure:

```javascript
const APP_CONFIG = {
  DEMO_MODE: true,  // ← Should be true
  // ...
};
```

### Step 3: Start the Application

```bash
npm start
```

That's it! The app will:
- ✅ Run on `http://localhost:3000`
- ✅ Automatically initialize demo data
- ✅ Work completely offline (no backend needed)

## 🔑 Login Credentials

### Admin Account
```
Email: admin@demo.com
Password: admin123
```

### User Account
```
Email: user@demo.com
Password: user123
```

## 📱 What You Can Demo

✅ **Product Management** - Add, edit, delete products
✅ **Order Processing** - Create and manage orders
✅ **User Management** - Admin and user roles
✅ **Shopping Cart** - Add to cart functionality
✅ **Wishlist** - Save favorite products
✅ **Categories** - Organize products
✅ **Dashboard** - View statistics and analytics
✅ **Settings** - Configure application settings

## 🌐 Deployment to Vercel/Netlify

### For Vercel:

```bash
cd client
vercel
```

### For Netlify:

```bash
cd client
npm run build
# Then drag & drop the 'build' folder to Netlify
```

**Important**: Make sure `DEMO_MODE: true` is set before building!

## 🔄 Switch to Production Mode Later

When you're ready to use a real database:

1. Open `client/src/config/appConfig.js`
2. Change `DEMO_MODE: true` to `DEMO_MODE: false`
3. Set up and start the backend server
4. Configure environment variables:
   ```
   REACT_APP_API_URL=https://your-backend.com/api
   ```

## 📊 Pre-loaded Demo Data

Your demo comes with:
- 2 users (1 admin, 1 regular user)
- 7 product categories
- 5 sample products (smartphones)
- 2 sample orders
- Application settings

## 🛠️ Troubleshooting

### "bcryptjs not found" Error

```bash
cd client
npm install bcryptjs
```

### Demo data not showing

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. You should see items starting with `demo_`
4. If not, clear localStorage and refresh

### Can't login

1. Make sure you're using the correct credentials:
   - Admin: `admin@demo.com` / `admin123`
   - User: `user@demo.com` / `user123`
2. Check browser console for errors
3. Clear localStorage and refresh

## 🎯 Perfect for Portfolio

Demo mode is ideal for:
- 🎨 **Portfolio projects** - Show off your UI/UX skills
- 📱 **Live demos** - Let visitors try the app without setup
- 🚀 **Quick prototypes** - Test ideas quickly
- 📊 **Presentations** - Demo without backend dependencies
- 🎓 **Learning projects** - Focus on frontend without database complexity

## 📞 Need Help?

Check the full documentation: `DEMO_MODE_GUIDE.md`

---

**Remember**: Demo mode uses browser localStorage. Data persists only in your browser and is reset when you clear browser data.

