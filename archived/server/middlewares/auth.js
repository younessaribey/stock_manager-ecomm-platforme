const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to authenticate users via JWT token
 */
const authMiddleware = (req, res, next) => {
  // Get token from header or cookie
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Set user info in request object
  req.user = decoded;

  next();
};

/**
 * Middleware to check if user has admin role
 */
const adminMiddleware = (req, res, next) => {

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
