/**
 * Application Configuration
 * 
 * DEMO_MODE: true - uses localStorage for data (portfolio demo)
 * DEMO_MODE: false - uses backend API with database (production)
 * 
 * To switch modes:
 * 1. Change DEMO_MODE value below
 * 2. For production: ensure backend server is running
 * 3. For demo: data will be stored in browser localStorage
 */

const envDemoValue = process.env.REACT_APP_DEMO_MODE?.toLowerCase();
const isDemoMode = envDemoValue ? envDemoValue === 'true' : false; // default to real backend locally

const APP_CONFIG = {
  // Set to true for portfolio demo (localStorage), false for production (database)
  DEMO_MODE: isDemoMode,
  
  // API URL (only used when DEMO_MODE is false)
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  
  // Default admin credentials for demo mode
  DEMO_ADMIN: {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Demo Admin',
    role: 'admin'
  },
  
  // Default user credentials for demo mode
  DEMO_USER: {
    email: 'user@demo.com',
    password: 'user123',
    name: 'Demo User',
    role: 'user'
  }
};

export default APP_CONFIG;

