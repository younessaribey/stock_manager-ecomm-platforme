# 🔄 How to Switch Between Demo and Production Modes

## 🎨 Demo Mode → 🚀 Production Mode

### Current: Demo Mode (Portfolio)
Your app is currently set to **DEMO MODE**, which means:
- ✅ Uses browser localStorage for all data
- ✅ No backend server needed
- ✅ Perfect for portfolio demonstrations
- ✅ Can deploy to Vercel/Netlify for free

### Want to Switch to Production Mode?

**Step 1:** Open this file:
```
client/src/config/appConfig.js
```

**Step 2:** Change this line:
```javascript
// FROM:
DEMO_MODE: true,

// TO:
DEMO_MODE: false,
```

**Step 3:** Start your backend server:
```bash
cd server
npm start
```

**Step 4:** Restart your frontend:
```bash
cd client
npm start
```

Done! Your app now uses the database.

---

## 🚀 Production Mode → 🎨 Demo Mode

### Current: Production Mode
Your app is using:
- Backend API with database
- Server infrastructure
- Real data persistence

### Want to Switch to Demo Mode?

**Step 1:** Open this file:
```
client/src/config/appConfig.js
```

**Step 2:** Change this line:
```javascript
// FROM:
DEMO_MODE: false,

// TO:
DEMO_MODE: true,
```

**Step 3:** Restart your frontend:
```bash
cd client
npm start
```

Done! Your app now uses localStorage (no backend needed).

---

## 📍 Quick Check: What Mode Am I In?

1. Open your app in the browser
2. Open Developer Console (F12)
3. Look for startup message:

**Demo Mode:**
```
🎨 Running in DEMO MODE - Using localStorage for data
📚 Demo credentials:
  Admin: admin@demo.com / admin123
  User: user@demo.com / user123
```

**Production Mode:**
```
🚀 Running in PRODUCTION MODE - Using backend API
```

---

## ⚡ Quick Reference

| Mode | File to Edit | Line to Change | Backend Needed? |
|------|--------------|----------------|-----------------|
| **Demo** | `client/src/config/appConfig.js` | `DEMO_MODE: true` | ❌ No |
| **Production** | `client/src/config/appConfig.js` | `DEMO_MODE: false` | ✅ Yes |

---

## 🎯 Which Mode Should I Use?

### Use Demo Mode When:
- 📱 Deploying to portfolio
- 🎨 Showing to clients/recruiters
- 🚀 Quick prototyping
- 💻 Working on frontend only
- 🆓 Want free hosting (Vercel/Netlify)

### Use Production Mode When:
- 🏢 Building real application
- 👥 Supporting multiple users
- 💾 Need persistent data across devices
- 📧 Need email notifications
- 🖼️ Need image uploads (Cloudinary)

---

**Need More Help?**
- Quick Start: See `DEMO_MODE_SETUP.md`
- Full Guide: See `DEMO_MODE_GUIDE.md`
- Implementation Details: See `IMPLEMENTATION_SUMMARY.md`

