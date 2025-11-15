const express = require('express');
const { getPendingApprovals, approveUser, rejectUser } = require('../controllers/pendingApprovalController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get all pending approvals
router.get('/', authMiddleware, adminMiddleware, getPendingApprovals);
// Approve user
router.post('/:id/approve', authMiddleware, adminMiddleware, approveUser);
// Reject user
router.delete('/:id/reject', authMiddleware, adminMiddleware, rejectUser);

module.exports = router;
