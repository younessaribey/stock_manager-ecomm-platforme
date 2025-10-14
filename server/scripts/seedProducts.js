const fs = require('fs');
const path = require('path');
const db = require('../config/db');

// Path to db.json
const dbFilePath = path.join(__dirname, '../db/administration.json');

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation and long battery life.',
    category: 'Electronics',
    price: 79.99,
    quantity: 25,
    imageUrl: '/resources/images/product1.jpg',
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'USB-C Charging Cable',
    description: 'Durable braided USB-C cable for fast charging and data transfer.',
    category: 'Accessories',
    price: 24.99,
    quantity: 50,
    imageUrl: '/resources/images/product2.jpg',
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360° sound and 20-hour battery life.',
    category: 'Electronics',
    price: 59.99,
    quantity: 15,
    imageUrl: '/resources/images/product3.jpg',
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Smartwatch with Health Monitoring',
    description: 'Advanced smartwatch with heart rate, sleep tracking and notifications.',
    category: 'Wearables',
    price: 149.99,
    quantity: 10,
    imageUrl: '/resources/images/product-lg.jpg',
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'Accessories',
    price: 49.99,
    quantity: 30,
    imageUrl: '/resources/images/product-md.jpg',
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample categories
const sampleCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Accessories',
    description: 'Device accessories and add-ons',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Wearables',
    description: 'Wearable technology and smart devices',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function seedProducts() {
  try {
    // Read the current database
    const rawData = fs.readFileSync(dbFilePath, 'utf8');
    const dbData = JSON.parse(rawData);
    
    // Add products if none exist
    if (!dbData.products || dbData.products.length === 0) {
      console.log('Adding sample products to database...');
      dbData.products = sampleProducts;
    } else {
      console.log(`Database already has ${dbData.products.length} products. Skipping product seed.`);
    }
    
    // Add categories if none exist
    if (!dbData.categories || dbData.categories.length === 0) {
      console.log('Adding sample categories to database...');
      dbData.categories = sampleCategories;
    } else {
      console.log(`Database already has ${dbData.categories.length} categories. Skipping category seed.`);
    }
    
    // Write the updated data back to the file
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
    
    console.log('Database seeded successfully!');
    console.log(`Total products: ${dbData.products.length}`);
    console.log(`Total categories: ${dbData.categories.length}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the function
seedProducts();
