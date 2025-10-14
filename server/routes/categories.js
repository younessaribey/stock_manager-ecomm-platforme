const express = require('express');
const { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get all categories (any authenticated user)
router.get('/', getAllCategories);

// Get single category (any authenticated user)
router.get('/:id', getCategoryById);

// Create category (admin only)
router.post('/', adminMiddleware, createCategory);

// Update category (admin only)
router.put('/:id', adminMiddleware, updateCategory);

// Delete category (admin only)
router.delete('/:id', adminMiddleware, deleteCategory);

module.exports = router;
