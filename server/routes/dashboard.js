const express = require('express');
const { 
  getDashboardStats, 
  getRecentActivity, 
  getUserDashboardStats 
} = require('../controllers/dashboardController');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get user dashboard statistics
router.get('/user-stats', getUserDashboardStats);

// Get recent activity
router.get('/activity', getRecentActivity);

module.exports = router;
