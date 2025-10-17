/**
 * Seed Data for Demo Mode
 * This data represents initial state for the portfolio demo
 */

export const seedData = {
  users: [
    {
      id: 1,
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: '$2a$10$YourHashedPasswordHere', // admin123
      role: 'admin',
      approved: true,
      phone: '+213 555 123 456',
      address: 'Algiers, Algeria',
      profilePicture: null,
      bio: 'System Administrator',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      name: 'Demo User',
      email: 'user@demo.com',
      password: '$2a$10$YourHashedPasswordHere', // user123
      role: 'user',
      approved: true,
      phone: '+213 555 789 012',
      address: 'Oran, Algeria',
      profilePicture: null,
      bio: 'Regular user',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z'
    }
  ],
  
  categories: [
    {
      id: 1,
      name: 'Smartphones',
      parentId: null,
      level: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      name: 'Apple',
      parentId: 1,
      level: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 3,
      name: 'Samsung',
      parentId: 1,
      level: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 4,
      name: 'Xiaomi',
      parentId: 1,
      level: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 5,
      name: 'Occasions',
      parentId: null,
      level: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 6,
      name: 'Laptops',
      parentId: null,
      level: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 7,
      name: 'Accessories',
      parentId: null,
      level: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  
  products: [
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      description: 'Latest Apple flagship with A16 Bionic chip, 48MP camera, and Dynamic Island',
      price: 85000,
      quantity: 5,
      imageUrl: 'https://images.unsplash.com/photo-1678652197950-57666bb97db9?w=500&h=500&fit=crop',
      images: null,
      categoryId: 2,
      createdBy: 1,
      imei: '353456789012345',
      condition: 'new',
      storage: '256GB',
      color: 'Deep Purple',
      model: 'iPhone 14 Pro Max',
      batteryHealth: 100,
      status: 'available',
      createdAt: '2024-01-05T00:00:00.000Z',
      updatedAt: '2024-01-05T00:00:00.000Z'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S23 Ultra',
      description: 'Premium Samsung flagship with S Pen, 200MP camera, and Snapdragon 8 Gen 2',
      price: 75000,
      quantity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
      images: null,
      categoryId: 3,
      createdBy: 1,
      imei: '353567890123456',
      condition: 'new',
      storage: '512GB',
      color: 'Phantom Black',
      model: 'Galaxy S23 Ultra',
      batteryHealth: 100,
      status: 'available',
      createdAt: '2024-01-06T00:00:00.000Z',
      updatedAt: '2024-01-06T00:00:00.000Z'
    },
    {
      id: 3,
      name: 'iPhone 13',
      description: 'Used iPhone 13 in excellent condition, battery health 87%',
      price: 45000,
      quantity: 3,
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop',
      images: null,
      categoryId: 5,
      createdBy: 1,
      imei: '353678901234567',
      condition: 'used',
      storage: '128GB',
      color: 'Midnight',
      model: 'iPhone 13',
      batteryHealth: 87,
      status: 'available',
      createdAt: '2024-01-07T00:00:00.000Z',
      updatedAt: '2024-01-07T00:00:00.000Z'
    },
    {
      id: 4,
      name: 'Xiaomi 13 Pro',
      description: 'Flagship Xiaomi with Leica camera system and powerful Snapdragon 8 Gen 2',
      price: 55000,
      quantity: 10,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
      images: null,
      categoryId: 4,
      createdBy: 1,
      imei: '353789012345678',
      condition: 'new',
      storage: '256GB',
      color: 'Ceramic White',
      model: 'Xiaomi 13 Pro',
      batteryHealth: 100,
      status: 'available',
      createdAt: '2024-01-08T00:00:00.000Z',
      updatedAt: '2024-01-08T00:00:00.000Z'
    },
    {
      id: 5,
      name: 'Samsung Galaxy A54',
      description: 'Mid-range Samsung with great camera and 5G connectivity',
      price: 32000,
      quantity: 15,
      imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop',
      images: null,
      categoryId: 3,
      createdBy: 1,
      imei: '353890123456789',
      condition: 'new',
      storage: '128GB',
      color: 'Awesome Violet',
      model: 'Galaxy A54 5G',
      batteryHealth: 100,
      status: 'available',
      createdAt: '2024-01-09T00:00:00.000Z',
      updatedAt: '2024-01-09T00:00:00.000Z'
    }
  ],
  
  orders: [
    {
      id: 1,
      userId: 2,
      total: 85000,
      status: 'completed',
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-01-10T00:00:00.000Z'
    },
    {
      id: 2,
      userId: 2,
      total: 32000,
      status: 'pending',
      createdAt: '2024-01-11T00:00:00.000Z',
      updatedAt: '2024-01-11T00:00:00.000Z'
    }
  ],
  
  orderItems: [
    {
      id: 1,
      orderId: 1,
      productId: 1,
      quantity: 1,
      productName: 'iPhone 14 Pro Max',
      productPrice: 85000,
      productImage: '/assets/product-lg.jpg',
      productSku: null,
      productDescription: 'Latest Apple flagship with A16 Bionic chip',
      itemTotal: 85000
    },
    {
      id: 2,
      orderId: 2,
      productId: 5,
      quantity: 1,
      productName: 'Samsung Galaxy A54',
      productPrice: 32000,
      productImage: '/assets/product-lg.jpg',
      productSku: null,
      productDescription: 'Mid-range Samsung with great camera',
      itemTotal: 32000
    }
  ],
  
  wishlists: [],
  
  carts: [],
  
  settings: [
    {
      id: 1,
      siteName: 'STMG Store',
      contactEmail: 'contact@stmg-store.com',
      itemsPerPage: 12,
      lowStockThreshold: 5,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
};

/**
 * Initialize localStorage with seed data
 */
export const initializeDemoData = () => {
  // Check if data already exists
  const existingProducts = localStorage.getItem('demo_products');
  
  if (!existingProducts) {
    // Initialize all collections
    Object.keys(seedData).forEach(key => {
      localStorage.setItem(`demo_${key}`, JSON.stringify(seedData[key]));
    });
    
    // Set initialization flag
    localStorage.setItem('demo_initialized', 'true');
    localStorage.setItem('demo_initialized_at', new Date().toISOString());
    
    console.log('Demo data initialized successfully');
  } else {
    console.log('Demo data already exists in localStorage');
  }
};

/**
 * Reset demo data to initial state
 */
export const resetDemoData = () => {
  Object.keys(seedData).forEach(key => {
    localStorage.setItem(`demo_${key}`, JSON.stringify(seedData[key]));
  });
  localStorage.setItem('demo_initialized_at', new Date().toISOString());
  console.log('Demo data reset to initial state');
};

/**
 * Clear all demo data
 */
export const clearDemoData = () => {
  Object.keys(seedData).forEach(key => {
    localStorage.removeItem(`demo_${key}`);
  });
  localStorage.removeItem('demo_initialized');
  localStorage.removeItem('demo_initialized_at');
  console.log('Demo data cleared');
};

