const express = require('express');
const { uploadImage, getImagesList, deleteImage, getImage, getImageByUrl } = require('../controllers/imageController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/get/:id', getImage); // Get image by ID
router.get('/by-url', getImageByUrl); // Get image by URL

// Admin only routes
router.post('/upload', authMiddleware, adminMiddleware, uploadImage);
router.get('/list', authMiddleware, adminMiddleware, getImagesList);
router.delete('/:id', authMiddleware, adminMiddleware, deleteImage);

module.exports = router;
