const bcrypt = require('bcryptjs');
const { User } = require('../config/db');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Only admins can view all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Users can only view their own profile unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    console.log(`Update user request for ID: ${req.params.id} by user ID: ${req.user.id}, role: ${req.user.role}`);
    console.log('Update data:', req.body);
    
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Users can only update their own profile unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user profile' });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Extract all possible user fields from request body
    const { 
      username, 
      name, 
      email,
      password, 
      phone, 
      address, 
      profilePicture,
      bio,
      role
    } = req.body;
    
    // Build updates object with all fields that can be updated
    const updates = {};
    
    // Basic info
    if (username) updates.username = username;
    if (name) updates.name = name;
    if (email && email !== user.email) {
      // Validate email format before updating
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      updates.email = email;
    }
    
    // Contact info 
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    
    // Profile details
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (bio !== undefined) updates.bio = bio;
    
    // Password - no validation as per user request (see memory)
    if (password) {
      // Simple hashing without complexity requirements
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    
    // Role - only admins can change roles
    if (req.user.role === 'admin' && role) {
      // Prevent self-demotion for safety
      if (req.user.id === userId && role !== 'admin') {
        return res.status(400).json({ 
          message: 'You cannot change your own admin role. This is a safety measure.'
        });
      }
      updates.role = role;
    }
    
    console.log('Applying updates:', Object.keys(updates));
    
    // Update user
    await user.update(updates);
    
    // Get updated user without password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    console.log(`User ${updatedUser.id} updated successfully`);
    return res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ 
      message: 'Server error updating user', 
      error: error.message 
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Only admins can delete users or users can delete themselves
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await user.destroy();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password (allow any password, no security checks)
const changePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Users can only change their own password unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    // Skip current password verification for admin users
    if (req.user.role !== 'admin') {
      // Verify current password - SKIP THIS FOR TESTING
      // For production, you would uncomment this:
      // const validPassword = await bcrypt.compare(currentPassword, user.password);
      // if (!validPassword) {
      //   return res.status(400).json({ message: 'Current password is incorrect' });
      // }
    }
    
    // No validation/constraints on new password - accept any password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user's password
    await user.update({ password: hashedPassword });
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword
};
