# Deployment Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Or use the launch script:**
   ```bash
   CNX_STRING="" DB_HOST=localhost DB_PORT=5433 DB_USER=mac DB_PASSWORD="" DB_NAME=stmg npm run dev
   ```

## Environment Variables

### Local Development (.env)
- `NODE_ENV=development`
- `DB_TYPE=sqlite` (for local development)
- `JWT_SECRET=your-super-secret-jwt-key`
- `PORT=5050`
- `CLIENT_URL=http://localhost:3000`

### Production Environment Variables for Vercel

Set these in your Vercel dashboard:

1. **Database:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `DB_TYPE=postgres`

2. **Security:**
   - `JWT_SECRET` - A strong secret key for JWT tokens

3. **Server:**
   - `PORT` - Server port (Vercel will set this automatically)
   - `CLIENT_URL` - Your production domain

4. **Cloudinary (for image uploads):**
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. **Admin:**
   - `ADMIN_EMAIL` - Admin email
   - `ADMIN_PASSWORD` - Admin password

## Vercel Deployment

### Option 1: Deploy Full Stack App

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy** - Vercel will use the root `vercel.json`

### Option 2: Deploy Frontend Only (Recommended)

1. **Deploy the client folder separately:**
   ```bash
   cd client
   vercel --prod
   ```

2. **Deploy the server separately:**
   ```bash
   cd server
   vercel --prod
   ```

### Option 3: Deploy with Custom Domain

1. **Set up your domain in Vercel**
2. **Update CLIENT_URL in environment variables**
3. **Deploy both client and server**

## Database Setup

### For Production (PostgreSQL):
1. Create a PostgreSQL database (recommended: Railway, Supabase, or Neon)
2. Set `DATABASE_URL` in Vercel environment variables
3. Run the admin creation script after deployment

### For Local Development (SQLite):
- SQLite database will be created automatically
- No additional setup required

## Build Commands

- `npm run build` - Build both client and server
- `npm run build:client` - Build only client
- `npm run build:server` - Build only server
- `npm run vercel-build` - Vercel build command

## Troubleshooting

1. **Database connection issues:**
   - Check your `DATABASE_URL` format
   - Ensure database is accessible from Vercel

2. **Build failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed

3. **Environment variables:**
   - Verify all required variables are set
   - Check variable names match exactly

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Regularly rotate API keys and secrets
- Enable HTTPS in production
