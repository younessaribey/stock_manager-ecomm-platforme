const express = require('express');
const router = express.Router();

// Sample users data
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    createdAt: new Date()
  }
];

// GET /api/users - Get all users
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    const newUser = {
      id: users.length + 1,
      name,
      email,
      role: role || 'customer',
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

module.exports = router;
