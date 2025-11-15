const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getPublicProducts,
  getPublicProductById
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Public routes (no authentication required)
// Get all products for public view
router.get('/public', getPublicProducts);

// Get single product for public view
router.get('/:id/public', getPublicProductById);

// Protected routes (authentication required)
// Get all products (any authenticated user)
router.get('/', authMiddleware, getAllProducts);

// Get single product (any authenticated user)
router.get('/:id', authMiddleware, getProductById);

// Create product (any authenticated user)
router.post('/', authMiddleware, createProduct);

// Update product (owner or admin)
router.put('/:id', authMiddleware, updateProduct);

// Delete product (owner or admin)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
