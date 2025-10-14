// Simplified server without database verification for testing
const express = require('express');
const cors = require('cors');
const path = require('path');

// Database setup
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Simple Product model for testing
const { DataTypes } = require('sequelize');
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL,
  quantity: DataTypes.INTEGER,
  imageUrl: DataTypes.STRING,
  condition: { type: DataTypes.ENUM('new', 'used', 'refurbished'), defaultValue: 'new' },
  storage: DataTypes.STRING,
  color: DataTypes.STRING,
  model: DataTypes.STRING,
  batteryHealth: DataTypes.INTEGER,
}, {
  tableName: 'products',
  timestamps: true,
});

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
  level: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'categories',
  timestamps: true,
});

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'resources')));

// Routes
app.get('/api/products/public', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Test endpoint
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  try {
    // Simple database sync
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');
    
    app.listen(PORT, () => {
      console.log(`🚀 Simple server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

startServer();
