const express = require('express');
const {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrdersStats
} = require('../controllers/algeriaOrderController');

const router = express.Router();

// Public routes - no authentication needed for simple commerce site
router.post('/', createOrder);              // Create new order
router.get('/stats', getOrdersStats);       // Get order statistics
router.get('/:id', getOrderById);           // Get order by ID

// Admin routes - you can add simple password protection later if needed
router.get('/', getAllOrders);              // Get all orders
router.put('/:id/status', updateOrderStatus); // Update order status

module.exports = router;
