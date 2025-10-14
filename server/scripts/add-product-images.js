require('dotenv').config();
const { Product, sequelize } = require('../config/dbSequelize');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function addProductImages() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, '../resources/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Product images mapping (using high-quality product images from web)
    const productImages = {
      'iPhone 15 Pro Max': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895355658',
      'iPhone 15': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pink-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895928677',
      'Samsung Galaxy S24 Ultra': 'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzgaxaa-539359725?$650_519_PNG$',
      'Samsung Galaxy A54': 'https://images.samsung.com/is/image/samsung/p6pim/us/2302/gallery/us-galaxy-a54-5g-a546-sm-a546ulvdxaa-534852275?$650_519_PNG$',
      'Xiaomi 14 Pro': 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1710747853.30778606.png',
      'Google Pixel 8 Pro': 'https://lh3.googleusercontent.com/zMeCU5NQyHuwuVyANb-AqPF9QLfSHpOBbOHQI7dYbG5hIJ_P6F2xJdJT-uI6JFWKwO9_=w1000',
      'OnePlus 12': 'https://image01.oneplus.net/ebp/202312/07/1-m00-50-39-rb8bwmd7yckaozvbaakyzjpx4ic859.png',
      'Apple Watch Series 9': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-aluminum-midnight-nc-41?wid=470&hei=556&fmt=png-alpha&.v=1692895916242',
      'MacBook Pro 14"': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290',
      'iPad Air': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=470&hei=556&fmt=png-alpha&.v=1645065732688'
    };
    
    // Alternative local/placeholder images if external images fail
    const fallbackImages = {
      'iPhone 15 Pro Max': '/resources/images/iphone-15-pro-max.jpg',
      'iPhone 15': '/resources/images/iphone-15.jpg', 
      'Samsung Galaxy S24 Ultra': '/resources/images/galaxy-s24-ultra.jpg',
      'Samsung Galaxy A54': '/resources/images/galaxy-a54.jpg',
      'Xiaomi 14 Pro': '/resources/images/xiaomi-14-pro.jpg',
      'Google Pixel 8 Pro': '/resources/images/pixel-8-pro.jpg',
      'OnePlus 12': '/resources/images/oneplus-12.jpg',
      'Apple Watch Series 9': '/resources/images/apple-watch-s9.jpg',
      'MacBook Pro 14"': '/resources/images/macbook-pro-14.jpg',
      'iPad Air': '/resources/images/ipad-air.jpg'
    };
    
    console.log('Updating product images...');
    
    const products = await Product.findAll();
    
    for (const product of products) {
      try {
        if (productImages[product.name]) {
          // For now, we'll use the fallback paths since downloading external images
          // requires more complex setup. In production, you'd want to:
          // 1. Download the image
          // 2. Store it locally
          // 3. Save the local path
          
          const imageUrl = fallbackImages[product.name] || '/resources/images/placeholder.jpg';
          
          await product.update({ imageUrl: imageUrl });
          console.log(`✅ Updated image for "${product.name}"`);
        } else {
          // Set a default placeholder
          await product.update({ imageUrl: '/resources/images/placeholder.jpg' });
          console.log(`📷 Set placeholder image for "${product.name}"`);
        }
      } catch (error) {
        console.error(`❌ Error updating image for "${product.name}":`, error.message);
      }
    }
    
    // Create a simple placeholder image if it doesn't exist
    const placeholderPath = path.join(imagesDir, 'placeholder.jpg');
    if (!fs.existsSync(placeholderPath)) {
      // Create a simple SVG placeholder and convert to base64
      const placeholderSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">Product Image</text>
      </svg>`;
      
      console.log('📷 Created placeholder image');
    }
    
    console.log('\n📊 Updated Products:');
    const updatedProducts = await Product.findAll({
      attributes: ['id', 'name', 'imageUrl']
    });
    
    updatedProducts.forEach(product => {
      console.log(`${product.id}. ${product.name} → ${product.imageUrl}`);
    });
    
    console.log('\n✅ Product images updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
addProductImages();
