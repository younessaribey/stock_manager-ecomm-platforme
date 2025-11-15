# Demo Mode Guide

This application supports two modes of operation:
- **Demo Mode**: Uses browser localStorage for all data (perfect for portfolio demos)
- **Production Mode**: Uses backend API with database (for actual deployment)

## 🎨 Quick Switch Between Modes

### Switch to Demo Mode (Portfolio/Demo)

1. Open `client/src/config/appConfig.js`
2. Set `DEMO_MODE: true`
3. Restart the frontend application
4. No backend server needed!

```javascript
const APP_CONFIG = {
  DEMO_MODE: true,  // ← Set to true for demo
  // ...
};
```

### Switch to Production Mode (Live Deployment)

1. Open `client/src/config/appConfig.js`
2. Set `DEMO_MODE: false`
3. Ensure backend server is running
4. Restart the frontend application

```javascript
const APP_CONFIG = {
  DEMO_MODE: false,  // ← Set to false for production
  // ...
};
```

## 📚 Demo Mode Features

### What Works in Demo Mode

✅ **All CRUD Operations**: Create, Read, Update, Delete
✅ **Authentication**: Login, Register, Session management
✅ **Product Management**: Full product lifecycle
✅ **Order Management**: Create and manage orders
✅ **Cart & Wishlist**: Shopping cart and wishlist functionality
✅ **Categories**: Category management
✅ **Dashboard Stats**: Real-time statistics
✅ **User Management**: Admin and user roles
✅ **Settings**: Application settings

### Limitations in Demo Mode

❌ **Image Uploads**: Uses default placeholder images (no Cloudinary)
❌ **Email Notifications**: Not available in demo mode
❌ **Data Persistence**: Data only persists in browser localStorage
❌ **Multi-device Sync**: Each browser/device has its own data
❌ **Performance**: Large datasets may be slower than database
❌ **Real-time Updates**: No websocket/real-time features

## 🔑 Demo Credentials

When running in demo mode, use these credentials:

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

## 📊 Initial Demo Data

Demo mode comes pre-populated with:
- **2 Users** (1 admin, 1 regular user)
- **7 Categories** (smartphones, brands, etc.)
- **5 Products** (sample phones with various specs)
- **2 Sample Orders**
- **Site Settings**

## 🔧 Advanced Operations

### Reset Demo Data

To reset data to initial state:

```javascript
import { resetDemoData } from './data/seedData';
resetDemoData();
```

Or in browser console:
```javascript
localStorage.clear();
location.reload();
```

### Clear Demo Data

To completely clear all demo data:

```javascript
import { clearDemoData } from './data/seedData';
clearDemoData();
```

### Backup Demo Data

To backup your demo data:

```javascript
// Export all data
const backup = {};
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('demo_')) {
    backup[key] = localStorage.getItem(key);
  }
});
console.log(JSON.stringify(backup, null, 2));
```

### Restore Demo Data

```javascript
// Restore from backup
const backup = { /* your backup data */ };
Object.keys(backup).forEach(key => {
  localStorage.setItem(key, backup[key]);
});
location.reload();
```

## 🏗️ Architecture

### File Structure

```
client/src/
├── config/
│   └── appConfig.js          # Mode configuration
├── data/
│   └── seedData.js            # Initial demo data
├── utils/
│   ├── api.js                 # API abstraction (auto-switches)
│   ├── demoAPI.js             # Demo API implementation
│   └── localStorage.js        # LocalStorage utilities
└── App.js                     # Initializes demo data
```

### How It Works

1. **Configuration**: `appConfig.js` controls which mode is active
2. **API Layer**: `api.js` automatically routes to either:
   - Real backend API (production mode)
   - Demo API using localStorage (demo mode)
3. **Data Storage**: 
   - Demo mode: Browser localStorage with `demo_*` prefix
   - Production mode: Backend database (SQLite/PostgreSQL)
4. **Initialization**: App.js initializes demo data on first load

### Storage Schema

Demo data is stored in localStorage with these keys:

```
demo_users          - User accounts
demo_products       - Product catalog
demo_categories     - Product categories
demo_orders         - Customer orders
demo_orderItems     - Order line items
demo_wishlists      - User wishlists
demo_carts          - Shopping carts
demo_settings       - Application settings
demo_initialized    - Initialization flag
demo_initialized_at - Timestamp of initialization
```

## 🚀 Deployment Strategies

### For Portfolio/Demo Sites

1. Set `DEMO_MODE: true`
2. Deploy only the frontend (e.g., Vercel, Netlify)
3. No backend infrastructure needed
4. Perfect for showcasing UI/UX

### For Production

1. Set `DEMO_MODE: false`
2. Deploy frontend and backend separately
3. Configure environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-api.com/api
   ```
4. Ensure database is properly configured

### Hybrid Approach

You can deploy both versions:
- `demo.yoursite.com` → Demo mode enabled
- `app.yoursite.com` → Production mode enabled

## 🐛 Troubleshooting

### Data Not Persisting

- **Check mode**: Ensure `DEMO_MODE` is set correctly
- **Check localStorage**: Open DevTools → Application → localStorage
- **Clear cache**: Try clearing browser cache and localStorage

### Login Issues

- **Demo mode**: Use demo credentials (admin@demo.com / admin123)
- **Production mode**: Ensure backend is running and accessible
- **Token expired**: Clear localStorage and try again

### API Errors

```javascript
// Check current mode
import APP_CONFIG from './config/appConfig';
console.log('Current mode:', APP_CONFIG.DEMO_MODE ? 'DEMO' : 'PRODUCTION');
```

### Performance Issues

- Demo mode stores everything in localStorage
- Large datasets (1000+ items) may be slow
- Consider pagination or filtering
- For production-scale data, use production mode

## 📝 Development Tips

### Testing Both Modes

```javascript
// Test demo mode
localStorage.clear();
// Set DEMO_MODE: true
// Test features

// Test production mode
// Set DEMO_MODE: false
// Start backend server
// Test features
```

### Adding New Features

When adding new features, implement both:

1. **Production API** in backend controllers
2. **Demo API** in `client/src/utils/demoAPI.js`

Example:
```javascript
// In demoAPI.js
export const demoNewFeatureAPI = {
  getData: async () => {
    const data = newFeatureDB.getAll();
    return simulateAsync(data);
  },
  // ... other methods
};

// In api.js
export const newFeatureAPI = APP_CONFIG.DEMO_MODE ? demoNewFeatureAPI : {
  getData: () => api.get('/new-feature'),
  // ... other methods
};
```

### Best Practices

1. **Always test both modes** before deploying
2. **Keep seed data realistic** but not sensitive
3. **Document mode-specific limitations**
4. **Use meaningful console logs** to indicate current mode
5. **Keep demo data small** for fast loading

## 🔄 Migration Path

### From Demo to Production

1. Export current data structure from localStorage
2. Create database migration scripts
3. Import data into production database
4. Switch `DEMO_MODE` to `false`
5. Configure backend environment variables
6. Test thoroughly

### From Production to Demo

1. Export database data as JSON
2. Update `seedData.js` with real data
3. Switch `DEMO_MODE` to `true`
4. Test all features work with localStorage

## 📞 Support

For issues or questions:
- Check console logs for mode indicators
- Verify localStorage data structure
- Ensure backend is running (production mode)
- Clear browser data and retry

## 🎯 Summary

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| Data Storage | localStorage | Database |
| Backend Required | ❌ No | ✅ Yes |
| Image Upload | ⚠️ Limited | ✅ Full |
| Data Persistence | Browser only | Server-side |
| Multi-user | ❌ No | ✅ Yes |
| Scalability | Limited | Full |
| Setup Complexity | Low | Medium |
| Best For | Portfolio, Demos | Live Apps |

---

**Current Mode Check**: Open browser console on app startup to see which mode is active!

