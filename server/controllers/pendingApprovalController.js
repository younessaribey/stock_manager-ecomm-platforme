const { User } = require('../config/db');

// Get all pending approval requests (admin only)
const getPendingApprovals = async (req, res) => {
  try {
    // Only admins can view pending approvals
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Find users with approved: false
    const pendingUsers = await User.findAll({ 
      where: { 
        approved: false,
        role: 'user'
      },
      attributes: { exclude: ['password'] }
    });
    
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a user by ID
const approveUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const userId = parseInt(req.params.id);
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.approved === true) {
      return res.status(400).json({ message: 'User already approved' });
    }
    
    await user.update({ approved: true });
    
    const userObj = user.toJSON();
    const { password, ...userWithoutPassword } = userObj;
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject a user by ID (delete)
const rejectUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const userId = parseInt(req.params.id);
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    res.json({ message: 'User rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPendingApprovals,
  approveUser,
  rejectUser
};
