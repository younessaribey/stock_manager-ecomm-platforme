/**
 * Demo API Implementation using LocalStorage
 * Mimics the backend API structure for seamless switching
 */

import {
  usersDB,
  productsDB,
  categoriesDB,
  ordersDB,
  orderItemsDB,
  wishlistsDB,
  cartsDB,
  settingsDB,
  authUtils,
  populateProduct,
  populateOrder
} from './localStorage';

/**
 * Simulate async API response
 */
const simulateAsync = (data, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

/**
 * Simulate API error
 */
const simulateError = (message, status = 400) => {
  return Promise.reject({
    response: {
      status,
      data: { message }
    }
  });
};

/**
 * Products Demo API
 */
export const demoProductsAPI = {
  getAll: async () => {
    const products = productsDB.getAll().map(populateProduct);
    return simulateAsync(products);
  },

  getById: async (id) => {
    const product = productsDB.getById(id);
    if (!product) {
      return simulateError('Product not found', 404);
    }
    return simulateAsync(populateProduct(product));
  },

  create: async (productData) => {
    try {
      // Check for duplicate IMEI
      if (productData.imei) {
        const existing = productsDB.getByField('imei', productData.imei);
        if (existing) {
          return simulateError('A product with this IMEI already exists');
        }
      }

      const product = productsDB.create({
        ...productData,
        status: productData.status || 'available',
        condition: productData.condition || 'new'
      });

      return simulateAsync(populateProduct(product));
    } catch (error) {
      return simulateError(error.message);
    }
  },

  createWithImage: async (formData) => {
    // In demo mode, we can't actually upload images to Cloudinary
    // So we'll just use the default image
    const productData = {};
    
    for (let [key, value] of formData.entries()) {
      if (key !== 'image' && key !== 'additionalImages') {
        productData[key] = value;
      }
    }
    
    productData.imageUrl = '/assets/product-lg.jpg';
    return demoProductsAPI.create(productData);
  },

  update: async (id, productData) => {
    try {
      const product = productsDB.update(id, productData);
      return simulateAsync(populateProduct(product));
    } catch (error) {
      return simulateError(error.message, 404);
    }
  },

  updateWithImage: async (id, formData) => {
    const productData = {};
    
    for (let [key, value] of formData.entries()) {
      if (key !== 'image' && key !== 'additionalImages') {
        productData[key] = value;
      }
    }
    
    return demoProductsAPI.update(id, productData);
  },

  delete: async (id) => {
    try {
      // Delete related wishlist and cart items
      wishlistsDB.deleteByField('productId', parseInt(id));
      cartsDB.deleteByField('productId', parseInt(id));
      
      productsDB.delete(id);
      return simulateAsync({ message: 'Product deleted successfully' });
    } catch (error) {
      return simulateError(error.message, 404);
    }
  }
};

/**
 * Categories Demo API
 */
export const demoCategoriesAPI = {
  getAll: async () => {
    const categories = categoriesDB.getAll();
    return simulateAsync(categories);
  },

  getById: async (id) => {
    const category = categoriesDB.getById(id);
    if (!category) {
      return simulateError('Category not found', 404);
    }
    return simulateAsync(category);
  },

  create: async (categoryData) => {
    try {
      const category = categoriesDB.create(categoryData);
      return simulateAsync(category);
    } catch (error) {
      return simulateError(error.message);
    }
  },

  update: async (id, categoryData) => {
    try {
      const category = categoriesDB.update(id, categoryData);
      return simulateAsync(category);
    } catch (error) {
      return simulateError(error.message, 404);
    }
  },

  delete: async (id) => {
    try {
      // Check if any products use this category
      const products = productsDB.getAllByField('categoryId', parseInt(id));
      if (products.length > 0) {
        return simulateError('Cannot delete category with existing products');
      }
      
      categoriesDB.delete(id);
      return simulateAsync({ message: 'Category deleted successfully' });
    } catch (error) {
      return simulateError(error.message, 404);
    }
  }
};

/**
 * Auth Demo API
 */
export const demoAuthAPI = {
  login: async (credentials) => {
    const { email, password } = credentials;
    
    if (!email || !password) {
      return simulateError('Email and password are required');
    }

    const user = usersDB.getByField('email', email);
    
    if (!user) {
      return simulateError('Invalid credentials', 401);
    }

    // In demo mode, simple password check
    // Accept known demo passwords or check plain text
    const isValid = password === 'admin123' || password === 'user123' || password === user.password;
    
    if (!isValid) {
      return simulateError('Invalid credentials', 401);
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = authUtils.generateToken(userWithoutPassword);

    return simulateAsync({ user: userWithoutPassword, token });
  },

  register: async (userData) => {
    const { username, email, password, name } = userData;
    
    if (!username || !email || !password) {
      return simulateError('All fields are required');
    }

    const existing = usersDB.getByField('email', email);
    if (existing) {
      return simulateError('User already exists');
    }

    // In demo mode, store password as-is (not secure, just for demo)
    const newUser = usersDB.create({
      username,
      email,
      password: password, // Plain text for demo simplicity
      name: name || username,
      role: 'user',
      approved: true // Auto-approve in demo mode
    });

    const { password: _, ...userWithoutPassword } = newUser;
    const token = authUtils.generateToken(userWithoutPassword);

    return simulateAsync({ user: userWithoutPassword, token });
  },

  getCurrentUser: async () => {
    const user = authUtils.getCurrentUser();
    
    if (!user) {
      return simulateError('Not authenticated', 401);
    }

    return simulateAsync(user);
  }
};

/**
 * Users Demo API
 */
export const demoUsersAPI = {
  getAll: async () => {
    const users = usersDB.getAll().map(({ password, ...user }) => user);
    return simulateAsync(users);
  },

  getById: async (id) => {
    const user = usersDB.getById(id);
    if (!user) {
      return simulateError('User not found', 404);
    }
    const { password, ...userWithoutPassword } = user;
    return simulateAsync(userWithoutPassword);
  },

  update: async (id, userData) => {
    try {
      // Don't allow password to be updated this way
      const { password, ...safeUpdates } = userData;
      const user = usersDB.update(id, safeUpdates);
      const { password: _, ...userWithoutPassword } = user;
      return simulateAsync(userWithoutPassword);
    } catch (error) {
      return simulateError(error.message, 404);
    }
  },

  delete: async (id) => {
    try {
      usersDB.delete(id);
      return simulateAsync({ message: 'User deleted successfully' });
    } catch (error) {
      return simulateError(error.message, 404);
    }
  }
};

/**
 * Orders Demo API
 */
export const demoOrdersAPI = {
  getAll: async () => {
    const orders = ordersDB.getAll().map(populateOrder);
    return simulateAsync(orders);
  },

  getById: async (id) => {
    const order = ordersDB.getById(id);
    if (!order) {
      return simulateError('Order not found', 404);
    }
    return simulateAsync(populateOrder(order));
  },

  create: async (orderData) => {
    try {
      const user = authUtils.getCurrentUser();
      if (!user) {
        return simulateError('Authentication required', 401);
      }

      const { items, ...orderInfo } = orderData;
      
      // Calculate total
      let total = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = productsDB.getById(item.productId);
        if (!product) {
          return simulateError(`Product ${item.productId} not found`, 404);
        }
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl,
          productDescription: product.description,
          itemTotal
        });
      }
      
      // Create order
      const order = ordersDB.create({
        ...orderInfo,
        userId: user.id,
        total,
        status: orderInfo.status || 'pending'
      });
      
      // Create order items
      orderItems.forEach(item => {
        orderItemsDB.create({
          ...item,
          orderId: order.id
        });
      });
      
      return simulateAsync(populateOrder(order));
    } catch (error) {
      return simulateError(error.message);
    }
  },

  update: async (id, orderData) => {
    try {
      const order = ordersDB.update(id, orderData);
      return simulateAsync(populateOrder(order));
    } catch (error) {
      return simulateError(error.message, 404);
    }
  },

  delete: async (id) => {
    try {
      // Delete order items first
      const items = orderItemsDB.getAllByField('orderId', parseInt(id));
      items.forEach(item => orderItemsDB.delete(item.id));
      
      ordersDB.delete(id);
      return simulateAsync({ message: 'Order deleted successfully' });
    } catch (error) {
      return simulateError(error.message, 404);
    }
  }
};

/**
 * Pending Approvals Demo API
 */
export const demoPendingApprovalsAPI = {
  getAll: async () => {
    const users = usersDB.getAll()
      .filter(user => !user.approved)
      .map(({ password, ...user }) => user);
    return simulateAsync(users);
  },

  approve: async (id) => {
    try {
      const user = usersDB.update(id, { approved: true });
      const { password, ...userWithoutPassword } = user;
      return simulateAsync(userWithoutPassword);
    } catch (error) {
      return simulateError(error.message, 404);
    }
  },

  reject: async (id) => {
    try {
      usersDB.delete(id);
      return simulateAsync({ message: 'User rejected and deleted' });
    } catch (error) {
      return simulateError(error.message, 404);
    }
  }
};

/**
 * Settings Demo API
 */
export const demoSettingsAPI = {
  get: async () => {
    const settings = settingsDB.getAll();
    const setting = settings[0] || {
      siteName: 'STMG Store',
      contactEmail: 'contact@stmg-store.com',
      itemsPerPage: 12,
      lowStockThreshold: 5
    };
    return simulateAsync(setting);
  },

  getPublic: async () => {
    return demoSettingsAPI.get();
  },

  update: async (settingsData) => {
    const settings = settingsDB.getAll();
    let setting;
    
    if (settings.length > 0) {
      setting = settingsDB.update(settings[0].id, settingsData);
    } else {
      setting = settingsDB.create(settingsData);
    }
    
    return simulateAsync(setting);
  }
};

/**
 * Cart Demo API
 */
export const demoCartAPI = {
  get: async () => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      return simulateError('Authentication required', 401);
    }
    
    const cartItems = cartsDB.getAllByField('userId', user.id);
    const itemsWithProducts = cartItems.map(item => {
      const product = productsDB.getById(item.productId);
      return {
        ...item,
        Product: product
      };
    });
    
    return simulateAsync({ items: itemsWithProducts });
  },

  update: async ({ items }) => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      return simulateError('Authentication required', 401);
    }
    
    // Clear existing cart
    const existingItems = cartsDB.getAllByField('userId', user.id);
    existingItems.forEach(item => cartsDB.delete(item.id));
    
    // Add new items
    const newItems = items.map(item => 
      cartsDB.create({
        userId: user.id,
        productId: item.productId,
        quantity: item.quantity
      })
    );
    
    const itemsWithProducts = newItems.map(item => {
      const product = productsDB.getById(item.productId);
      return {
        ...item,
        Product: product
      };
    });
    
    return simulateAsync({ items: itemsWithProducts });
  }
};

/**
 * Wishlist Demo API
 */
export const demoWishlistAPI = {
  get: async () => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      return simulateError('Authentication required', 401);
    }
    
    const wishlistItems = wishlistsDB.getAllByField('userId', user.id);
    const itemsWithProducts = wishlistItems.map(item => {
      const product = productsDB.getById(item.productId);
      return {
        ...item,
        Product: product
      };
    });
    
    return simulateAsync({ items: itemsWithProducts });
  },

  update: async ({ items }) => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      return simulateError('Authentication required', 401);
    }
    
    // Clear existing wishlist
    const existingItems = wishlistsDB.getAllByField('userId', user.id);
    existingItems.forEach(item => wishlistsDB.delete(item.id));
    
    // Add new items
    const newItems = items.map(item => 
      wishlistsDB.create({
        userId: user.id,
        productId: item.productId
      })
    );
    
    const itemsWithProducts = newItems.map(item => {
      const product = productsDB.getById(item.productId);
      return {
        ...item,
        Product: product
      };
    });
    
    return simulateAsync({ items: itemsWithProducts });
  }
};

/**
 * Dashboard Demo API
 */
export const demoDashboardAPI = {
  getStats: async () => {
    const products = productsDB.getAll();
    const orders = ordersDB.getAll();
    const users = usersDB.getAll();
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    const lowStockProducts = products.filter(p => p.quantity < 5);
    const pendingApprovals = users.filter(u => !u.approved).length;
    
    // Get recent orders with user info
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => {
        const user = usersDB.getById(order.userId);
        return {
          id: order.id,
          user: user ? user.name : 'Unknown',
          date: new Date(order.createdAt).toLocaleDateString(),
          total: order.total,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
        };
      });
    
    // Generate chart data
    const salesChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      }]
    };
    
    const ordersChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Orders',
        data: [3, 5, 4, 7, 6, 9, 8],
        backgroundColor: 'rgb(99, 102, 241)'
      }]
    };
    
    const categories = categoriesDB.getAll();
    const categorySalesData = {
      labels: categories.slice(0, 5).map(c => c.name),
      datasets: [{
        label: 'Sales by Category',
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(168, 85, 247)',
          'rgb(192, 132, 252)',
          'rgb(216, 180, 254)'
        ]
      }]
    };
    
    return simulateAsync({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts,
      pendingApprovals: pendingApprovals,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      recentOrders: recentOrders,
      salesChartData,
      ordersChartData,
      categorySalesData
    });
  },

  getRecentActivity: async () => {
    const orders = ordersDB.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(populateOrder);
    
    return simulateAsync(orders);
  },

  getUserStats: async () => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      return simulateError('Authentication required', 401);
    }
    
    const orders = ordersDB.getAllByField('userId', user.id);
    const wishlist = wishlistsDB.getAllByField('userId', user.id);
    const cart = cartsDB.getAllByField('userId', user.id);
    
    return simulateAsync({
      totalOrders: orders.length,
      wishlistCount: wishlist.length,
      cartCount: cart.length,
      completedOrders: orders.filter(o => o.status === 'completed').length
    });
  }
};

