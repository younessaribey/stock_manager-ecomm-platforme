const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  generateOrderDocument
} = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get all orders (any authenticated user)
router.get('/', authMiddleware, getAllOrders);

// Get single order (any authenticated user)
router.get('/:id', authMiddleware, getOrderById);

// Create order (any authenticated user)
router.post('/', authMiddleware, createOrder);

// Update order (any authenticated user)
router.put('/:id', authMiddleware, updateOrder);

// Delete order (admin only, for safety)
router.delete('/:id', authMiddleware, deleteOrder);

// Generate and download order document (PDF invoice)
router.get('/:id/document', authMiddleware, generateOrderDocument);

module.exports = router;
