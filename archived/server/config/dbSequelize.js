require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with dynamic database configuration
let sequelize;

if (process.env.CNX_STRING) {
  // Production connection string
  sequelize = new Sequelize(process.env.CNX_STRING, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  });
} else if (process.env.DB_TYPE === 'sqlite') {
  // SQLite configuration for development
  const path = require('path');
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
  
  console.log(`Using SQLite database at: ${dbPath}`);
} else {
  // PostgreSQL configuration (default)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'stmg',
    process.env.DB_USER || 'mac',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5433,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        connectTimeout: 60000,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
  
  console.log(`Using PostgreSQL database: ${process.env.DB_NAME || 'stmg'} at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5433}`);
}

// Define relational models (3NF)
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  profilePicture: DataTypes.STRING,
  bio: DataTypes.TEXT,
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  approved: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  profileImage: DataTypes.STRING,
}, {
  tableName: 'users',
  timestamps: true,
});

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'categories', key: 'id' } },
  level: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 = main category, 1 = subcategory
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'categories',
  timestamps: true,
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL,
  quantity: DataTypes.INTEGER,
  imageUrl: DataTypes.STRING, // Primary image
  images: { type: DataTypes.TEXT, allowNull: true }, // JSON array of additional images
  // New fields for phone business
  imei: { type: DataTypes.STRING, unique: true, allowNull: true }, // IMEI or Serial Number
  condition: { type: DataTypes.ENUM('new', 'used', 'refurbished'), defaultValue: 'used' }, // Phone condition
  storage: DataTypes.STRING, // Storage capacity (64GB, 128GB, etc.)
  color: DataTypes.STRING, // Phone color
  model: DataTypes.STRING, // Specific model info
  batteryHealth: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 100 } }, // Battery health percentage (0-100)
  status: { type: DataTypes.ENUM('available', 'sold', 'pending'), defaultValue: 'available' }, // Product status
}, {
  tableName: 'products',
  timestamps: true,
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  total: DataTypes.DECIMAL,
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
  tableName: 'orders',
  timestamps: true,
});

// Order Item model with full product details
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  // Store product details at time of order
  productName: { type: DataTypes.STRING },
  productPrice: { type: DataTypes.DECIMAL(10, 2) },
  productImage: { type: DataTypes.STRING },
  productSku: { type: DataTypes.STRING },
  productDescription: { type: DataTypes.TEXT },
  // Calculated fields
  itemTotal: { type: DataTypes.DECIMAL(10, 2) }
}, {
  tableName: 'order_items',
  timestamps: false
});

const Wishlist = sequelize.define('Wishlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'wishlists',
  timestamps: false,
});

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: DataTypes.INTEGER,
}, {
  tableName: 'carts',
  timestamps: false,
});

// Associations
// Category self-referencing associations for subcategories
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
User.hasMany(Product, { foreignKey: 'createdBy' });
Product.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Wishlist associations (fix eager loading error)
Wishlist.belongsTo(Product, { foreignKey: 'productId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Wishlist, { foreignKey: 'userId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });

User.belongsToMany(Product, { through: Wishlist, as: 'wishlistedProducts', foreignKey: 'userId', otherKey: 'productId' });
Product.belongsToMany(User, { through: Wishlist, as: 'wishlistedByUsers', foreignKey: 'productId', otherKey: 'userId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Define Settings model
const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  siteName: DataTypes.STRING,
  contactEmail: DataTypes.STRING,
  itemsPerPage: DataTypes.INTEGER,
  lowStockThreshold: DataTypes.INTEGER
}, {
  tableName: 'settings',
  timestamps: true,
});

// Define ImgBBImage model to store imgBB image metadata
const ImgBBImage = sequelize.define('ImgBBImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  folder: { type: DataTypes.STRING, allowNull: false, defaultValue: 'general' },
  url: { type: DataTypes.STRING, allowNull: false },
  thumbnailUrl: { type: DataTypes.STRING },
  deleteUrl: { type: DataTypes.STRING },
  imgbbId: { type: DataTypes.STRING },
  meta: { type: DataTypes.TEXT },  // JSON stringified metadata from imgBB
  uploadedBy: { type: DataTypes.INTEGER }  // User ID reference
}, {
  tableName: 'imgbb_images',
  timestamps: true,
});

// Database verification function
async function verifyDatabaseStructure() {
  try {
    console.log('Verifying database structure...');
    
    // Check connection to database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Create tables if they don't exist and alter them if they exist but need changes
    // alter: true is safer than force: true as it won't drop tables
    await sequelize.sync({ alter: true });
    console.log('Database tables updated successfully.');
    
    // Verify that all models and their relations exist
    const models = [
      { model: User, name: 'User', requiredFields: ['id', 'email', 'password', 'role', 'approved'] },
      { model: Category, name: 'Category', requiredFields: ['id', 'name', 'level', 'isActive'] },
      { model: Product, name: 'Product', requiredFields: ['id', 'name', 'price', 'quantity', 'categoryId', 'createdBy', 'imei', 'condition', 'storage', 'color', 'model', 'batteryHealth', 'status'] },
      { model: Order, name: 'Order', requiredFields: ['id', 'total', 'status', 'userId'] },
      { model: OrderItem, name: 'OrderItem', requiredFields: ['id', 'quantity', 'orderId', 'productId'] },
      { model: Wishlist, name: 'Wishlist', requiredFields: ['id', 'userId', 'productId'] },
      { model: Cart, name: 'Cart', requiredFields: ['id', 'quantity', 'userId', 'productId'] },
      { model: ImgBBImage, name: 'ImgBBImage', requiredFields: ['id', 'title', 'folder', 'url', 'uploadedBy'] },
      { model: Setting, name: 'Setting', requiredFields: ['id', 'siteName', 'contactEmail'] },
    ];
    
    // Check each model and its required fields
    for (const { model, name, requiredFields } of models) {
      try {
        // Test a simple query to verify table exists
        await model.findOne();
        console.log(`✓ Table '${name}' exists`);
        
        // Verify table structure
        const tableInfo = await sequelize.getQueryInterface().describeTable(model.tableName);
        const missingFields = [];
        
        for (const field of requiredFields) {
          if (!tableInfo[field]) {
            missingFields.push(field);
          }
        }
        
        if (missingFields.length > 0) {
          console.error(`✗ Table '${name}' is missing required fields: ${missingFields.join(', ')}`);
          return false;
        } else {
          console.log(`✓ Table '${name}' has all required fields`);
        }
      } catch (error) {
        console.error(`✗ Error verifying table '${name}':`, error.message);
        return false;
      }
    }
    
    console.log('Database verification completed successfully!');
    return true;
  } catch (error) {
    console.error('Database verification failed:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Wishlist,
  Cart,
  ImgBBImage,
  Setting,
  verifyDatabaseStructure
};
