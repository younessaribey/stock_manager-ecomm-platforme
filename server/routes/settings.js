const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Public route to fetch site settings (no auth required, with explicit CORS fallback)
router.get('/public', getSettings);

// Get all settings (admin only)
router.get('/', authMiddleware, adminMiddleware, getSettings);

// Update settings (admin only)
router.put('/', authMiddleware, adminMiddleware, updateSettings);

module.exports = router;
