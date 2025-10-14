const express = require('express');
const { 
  getNewsContent,
  updateNewsContent,
  addYouTubeVideo,
  removeYouTubeVideo,
  updateSocialLinks,
  resetNewsContent
} = require('../controllers/newsController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getNewsContent);

// Protected routes (admin only)
router.put('/', authMiddleware, adminMiddleware, updateNewsContent);
router.post('/youtube', authMiddleware, adminMiddleware, addYouTubeVideo);
router.delete('/youtube/:index', authMiddleware, adminMiddleware, removeYouTubeVideo);
router.put('/social-links', authMiddleware, adminMiddleware, updateSocialLinks);
router.post('/reset', authMiddleware, adminMiddleware, resetNewsContent);

module.exports = router;


