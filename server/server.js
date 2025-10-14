// Load .env from project root if present, otherwise from server/.env
const path = require('path');
const fs = require('fs');
const dotenvPathRoot = path.resolve(__dirname, '../.env');
const dotenvPathServer = path.resolve(__dirname, '.env');
if (fs.existsSync(dotenvPathRoot)) {
  require('dotenv').config({ path: dotenvPathRoot });
  console.log('[dotenv] Loaded .env from project root');
} else {
  require('dotenv').config({ path: dotenvPathServer });
  console.log('[dotenv] Loaded .env from server directory');
}

// Import database models and verification function
const { verifyDatabaseStructure } = require('./config/dbSequelize');

const express = require('express');
const cors = require('cors');
// Only require 'path' once above
const http = require('http');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const imageRoutes = require('./routes/images');
const newsRoutes = require('./routes/news');
const { authMiddleware, adminMiddleware } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const fileUpload = require('express-fileupload');

// Initialize express app
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})); // Enable CORS for frontend

let PORT = process.env.PORT || 5050;


// Remove standard cors middleware as it might conflict
// Increased JSON payload limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cookie parser for reading cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Add support for token in query parameters (for file downloads)
app.use((req, res, next) => {
  // If token is in query parameters, add it to the auth header
  if (req.query.token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  next();
});

// Configure file upload middleware with proper limits and options
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static files for resources (images, etc.)
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// Serve React app's static files
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Removed authMiddleware to allow public access
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/settings', require('./routes/settings'));

// Simple ping route for CORS testing
app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});
app.use('/api/pending-approvals', require('./routes/pendingApprovals'));
app.use('/api/categories', categoryRoutes); // Remove auth middleware for public access
app.use('/api/orders', orderRoutes);
app.use('/api/algeria-orders', require('./routes/algeriaOrders')); // Simple orders for Algeria
app.use('/api/cart', authMiddleware, require('./routes/cart'));
app.use('/api/wishlist', authMiddleware, require('./routes/wishlist'));
app.use('/api/images', imageRoutes);
app.use('/api/profile', require('./routes/profile'));
app.use('/api/news', newsRoutes);

// Error handler middleware (should be after routes)
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Function to start server and handle port conflicts
const startServer = async (port) => {
  try {
    // First verify database structure
    console.log('Verifying database structure before starting server...');
    const dbVerified = await verifyDatabaseStructure();
    
    if (!dbVerified) {
      console.error('Database verification failed. Please check your database configuration and schema.');
      console.error('Server startup aborted.');
      process.exit(1);
    }
    
    // If database verification passes, start the server
    server.listen(port);
    console.log(`Database verification successful. Server running on port ${port}`);
  } catch (error) {
    console.error(`Failed to start server on port ${port}:`, error);
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying port ${port + 1}`);
      startServer(port + 1);
    }
  }
};

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use, trying port ${PORT + 1}`);
    PORT += 1;
    startServer(PORT);
  } else {
    console.error('Server error:', error);
  }
});

// Start the server
startServer(PORT);

module.exports = app;