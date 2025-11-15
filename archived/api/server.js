// Vercel serverless function wrapper for the main server
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import the main server app
const app = require('../server/server');

// Export as Vercel serverless function
module.exports = app;
