const bcrypt = require('bcryptjs');
const { User } = require('../config/db');
const { generateToken } = require('../utils/jwt');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username, email, password: hashedPassword, name: name || username, role: 'user' });
    const userObj = newUser.toJSON();
    const { password: _, ...userWithoutPassword } = userObj;
    const token = generateToken(userWithoutPassword);
    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const userObj = user.toJSON();
    const { password: _, ...userWithoutPassword } = userObj;
    const token = generateToken(userWithoutPassword);
    return res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('[authController] login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { raw: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    console.error('[authController] getCurrentUser error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google OAuth login/register
const googleAuth = async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: {
        username: email.split('@')[0],
        email,
        name: name || email.split('@')[0],
        role: 'user',
        profilePicture: picture
      }
    });
    const userObj = user.toJSON();
    const { password: _, ...userWithoutPassword } = userObj;
    const token = generateToken(userWithoutPassword);
    return res.json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin login endpoint
const loginAdmin = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ where: { email, role: 'admin' } });
    if (!user) return res.status(401).json({ message: 'Invalid admin credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });
    const userObj = user.toJSON();
    const { password: _, ...adminWithoutPassword } = userObj;
    const token = generateToken(adminWithoutPassword);
    return res.json({ user: adminWithoutPassword, token });
  } catch (error) {
    console.error('[authController] loginAdmin error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  googleAuth,
  loginAdmin
}
