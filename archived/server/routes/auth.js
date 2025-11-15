const express = require('express');
const { register, login, loginAdmin, getCurrentUser, googleAuth } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/login-admin', loginAdmin);
router.post('/google', googleAuth);


module.exports = router;
