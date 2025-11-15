const express = require('express');
const router = express.Router();

// Sample orders data
let orders = [
  {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { productId: 1, quantity: 2, price: 999.99 },
      { productId: 2, quantity: 1, price: 699.99 }
    ],
    total: 2699.97,
    status: 'pending',
    createdAt: new Date()
  }
];

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// POST /api/orders - Create new order
router.post('/', (req, res) => {
  try {
    const { customerName, customerEmail, items } = req.body;
    
    if (!customerName || !customerEmail || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
      id: orders.length + 1,
      customerName,
      customerEmail,
      items,
      total,
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(newOrder);
    
    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    
    res.json({
      success: true,
      data: orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

module.exports = router;
