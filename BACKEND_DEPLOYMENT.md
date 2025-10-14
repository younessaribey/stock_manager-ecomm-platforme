# Backend Deployment Options

The frontend is currently deployed successfully on Vercel. For the backend, you have several options:

## Option 1: Deploy Backend Separately (Recommended)

Deploy the backend as a separate service:

### Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd server
railway login
railway init
railway up
```

### Render
1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set root directory to `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables

### Heroku
```bash
# Install Heroku CLI
cd server
heroku create your-app-name
git subtree push --prefix server heroku main
```

## Option 2: Use Vercel Serverless Functions

To deploy backend on Vercel (more complex setup):

1. Move server code to `/api` directory
2. Create individual API routes as serverless functions
3. Each route needs to be a separate file in `/api`

Example structure:
```
api/
  products.js  (handles /api/products)
  users.js     (handles /api/users)
  orders.js    (handles /api/orders)
```

## Option 3: Run Backend Locally

For development, run the backend locally:

```bash
cd server
JWT_SECRET=your_secret PORT=5050 node server.js
```

Then update your frontend to point to `http://localhost:5050` for API calls.

## Recommended Approach

**For production:** Deploy backend on Railway or Render (separate from frontend)
**For development:** Run backend locally

## Environment Variables

Whichever option you choose, you'll need these environment variables:
- JWT_SECRET
- JWT_EXPIRE  
- CNX_STRING (or individual DB credentials)
- NODE_ENV
- CLIENT_URL / FRONTEND_URL

See VERCEL_ENV_SETUP.md for details.
