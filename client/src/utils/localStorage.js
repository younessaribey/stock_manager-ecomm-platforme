/**
 * LocalStorage Abstraction Layer for Demo Mode
 * Provides database-like operations using localStorage
 */

/**
 * Generic CRUD operations for localStorage
 */
class LocalStorageDB {
  constructor(collectionName) {
    this.collection = `demo_${collectionName}`;
  }

  // Get all items
  getAll() {
    try {
      const data = localStorage.getItem(this.collection);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${this.collection}:`, error);
      return [];
    }
  }

  // Get by ID
  getById(id) {
    const items = this.getAll();
    return items.find(item => item.id === parseInt(id));
  }

  // Get by field value
  getByField(field, value) {
    const items = this.getAll();
    return items.find(item => item[field] === value);
  }

  // Get all by field value
  getAllByField(field, value) {
    const items = this.getAll();
    return items.filter(item => item[field] === value);
  }

  // Create new item
  create(item) {
    const items = this.getAll();
    
    // Generate ID if not provided
    if (!item.id) {
      const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
      item.id = maxId + 1;
    }
    
    // Add timestamps
    const now = new Date().toISOString();
    item.createdAt = item.createdAt || now;
    item.updatedAt = now;
    
    items.push(item);
    this.saveAll(items);
    
    return item;
  }

  // Update item
  update(id, updates) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    items[index] = {
      ...items[index],
      ...updates,
      id: items[index].id, // Preserve ID
      createdAt: items[index].createdAt, // Preserve creation time
      updatedAt: new Date().toISOString()
    };
    
    this.saveAll(items);
    return items[index];
  }

  // Delete item
  delete(id) {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== parseInt(id));
    
    if (filtered.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    this.saveAll(filtered);
    return true;
  }

  // Delete by field
  deleteByField(field, value) {
    const items = this.getAll();
    const filtered = items.filter(item => item[field] !== value);
    this.saveAll(filtered);
    return items.length - filtered.length; // Return count of deleted items
  }

  // Save all items
  saveAll(items) {
    try {
      localStorage.setItem(this.collection, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving ${this.collection}:`, error);
      throw error;
    }
  }

  // Clear collection
  clear() {
    localStorage.removeItem(this.collection);
  }
}

/**
 * Authentication utilities for demo mode
 */
export const authUtils = {
  // Generate mock JWT token
  generateToken: (user) => {
    // In demo mode, we just create a base64 encoded JSON
    // In production, use real JWT
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
    return btoa(JSON.stringify(tokenData));
  },

  // Verify and decode token
  verifyToken: (token) => {
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp && decoded.exp < Date.now()) {
        return null; // Token expired
      }
      return decoded;
    } catch {
      return null;
    }
  },

  // Get current user from token
  getCurrentUser: () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;
    
    const decoded = authUtils.verifyToken(token);
    if (!decoded) return null;
    
    const usersDB = new LocalStorageDB('users');
    const user = usersDB.getById(decoded.id);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }
};

/**
 * Specific database collections
 */
export const usersDB = new LocalStorageDB('users');
export const productsDB = new LocalStorageDB('products');
export const categoriesDB = new LocalStorageDB('categories');
export const ordersDB = new LocalStorageDB('orders');
export const orderItemsDB = new LocalStorageDB('orderItems');
export const wishlistsDB = new LocalStorageDB('wishlists');
export const cartsDB = new LocalStorageDB('carts');
export const settingsDB = new LocalStorageDB('settings');

/**
 * Helper function to populate product with category data
 */
export const populateProduct = (product) => {
  if (!product) return null;
  
  const category = product.categoryId ? categoriesDB.getById(product.categoryId) : null;
  
  return {
    ...product,
    Category: category ? { id: category.id, name: category.name } : null
  };
};

/**
 * Helper function to populate order with user and items
 */
export const populateOrder = (order) => {
  if (!order) return null;
  
  const user = order.userId ? usersDB.getById(order.userId) : null;
  const items = orderItemsDB.getAllByField('orderId', order.id);
  
  return {
    ...order,
    User: user ? { id: user.id, name: user.name, email: user.email } : null,
    OrderItems: items.map(item => {
      const product = productsDB.getById(item.productId);
      return {
        ...item,
        Product: product
      };
    })
  };
};

export default LocalStorageDB;

