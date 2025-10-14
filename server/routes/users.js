const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  changePassword
} = require('../controllers/userController');
const { adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', adminMiddleware, getAllUsers);

// Get user by ID (own profile or admin)
router.get('/:id', getUserById);

// Update user (own profile or admin)
router.put('/:id', updateUser);

// Delete user (own profile or admin)
router.delete('/:id', deleteUser);

// Change password (own profile or admin)
router.put('/:id/change-password', changePassword);

module.exports = router;
