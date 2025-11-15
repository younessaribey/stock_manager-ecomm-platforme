// server/config/db.js
require('dotenv').config()

// Sequelize models and instance
const { sequelize, User, Category, Product, Order, OrderItem, Wishlist, Cart, Setting } = require('./dbSequelize');

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Wishlist,
  Cart,
  Setting,
};

/*const fs = require('fs');
const path = require('path');

// Database abstraction layer
class Database {
  constructor(dbFile) {
    this.dbFile = dbFile;
    this.data = this.loadData();
  }

  // Load data from JSON file
  loadData() {
    if (!fs.existsSync(this.dbFile)) {
      // Initialize with default structure if file doesn't exist
      const initialData = {
        users: [],
        products: [],
        categories: [],
        transactions: []
      };
      fs.writeFileSync(this.dbFile, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    
    return JSON.parse(fs.readFileSync(this.dbFile, 'utf-8'));
  }

  // Save data to JSON file
  saveData() {
    fs.writeFileSync(this.dbFile, JSON.stringify(this.data, null, 2));
  }

  // Generic CRUD operations
  findAll(collection) {
    return this.data[collection] || [];
  }

  findById(collection, id) {
    const items = this.data[collection] || [];
    return items.find(item => item.id === id);
  }

  findByField(collection, field, value) {
    const items = this.data[collection] || [];
    return items.find(item => item[field] === value);
  }

  findAllByField(collection, field, value) {
    const items = this.data[collection] || [];
    return items.filter(item => item[field] === value);
  }

  create(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    
    // Generate ID if not provided
    if (!item.id) {
      const items = this.data[collection];
      const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
      item.id = maxId + 1;
    }
    
    this.data[collection].push(item);
    this.saveData();
    return item;
  }

  update(collection, id, updates) {
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      this.saveData();
      return this.data[collection][index];
    }
    return null;
  }

  delete(collection, id) {
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = this.data[collection].splice(index, 1)[0];
      this.saveData();
      return deleted;
    }
    return null;
  }
}

// Create separate database instances
const administrationDB = new Database(path.join(__dirname, '../../db/administration.json'));
const productsDB = new Database(path.join(__dirname, '../../db/products.json'));
const categoriesDB = new Database(path.join(__dirname, '../../db/categories.json'));
const ordersDB = new Database(path.join(__dirname, '../../db/orders.json'));
const wishlistDB = new Database(path.join(__dirname, '../../db/wishlist.json'));
const cartDB = new Database(path.join(__dirname, '../../db/carts.json'));

module.exports = {
  administrationDB,
  productsDB,
  categoriesDB,
  ordersDB,
  wishlistDB,
  cartDB
};
*/
// Migration path to PostgreSQL:
/*
To migrate to PostgreSQL:
1. Install dependencies: npm install pg sequelize
2. Create a new db.js file or modify this one to use Sequelize ORM
3. Define models using Sequelize schema
4. Implement the same interface methods but backed by PostgreSQL

Example structure (not implemented):

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@localhost:5432/stock_db');

// Define models
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: DataTypes.STRING,
  // other fields
});

// Implement same interface methods
class PostgresDatabase {
  async findAll(collection) {
    const model = this.getModel(collection);
    return await model.findAll();
  }
  // other methods...
}
*/ 
