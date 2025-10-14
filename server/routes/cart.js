const express = require('express');
const { getCart, updateCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get current user's cart
router.get('/', authMiddleware, getCart);

// Update current user's cart
router.put('/', authMiddleware, updateCart);

module.exports = router;
