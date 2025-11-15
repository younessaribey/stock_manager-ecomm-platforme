const express = require('express');
const { getWishlistByUserId, updateWishlist } = require('../controllers/wishlistController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get wishlist for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wishlist = await getWishlistByUserId(req.user.id);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update wishlist for current user
router.put('/', authMiddleware, async (req, res) => {
  try {
    const items = req.body.items;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    const wishlist = await updateWishlist(req.user.id, items);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
