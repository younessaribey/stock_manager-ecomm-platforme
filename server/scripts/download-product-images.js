require('dotenv').config();
const { Product, sequelize } = require('../config/dbSequelize');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadProductImages() {
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
    
    // Real product images from the web (using more accessible URLs)
    const productImages = {
      'iPhone 15 Pro Max': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
      'iPhone 15': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
      'Samsung Galaxy S24 Ultra': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-5g-1.jpg',
      'Samsung Galaxy A54': 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a54-1.jpg',
      'Xiaomi 14 Pro': 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-pro-1.jpg',
      'Google Pixel 8 Pro': 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
      'OnePlus 12': 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg',
      'Apple Watch Series 9': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series-9-1.jpg',
      'MacBook Pro 14"': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-pro-14-m3-2023-1.jpg',
      'iPad Air': 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-air-5-1.jpg'
    };
    
    console.log('Downloading product images...');
    
    const products = await Product.findAll();
    
    for (const product of products) {
      try {
        if (productImages[product.name]) {
          const imageUrl = productImages[product.name];
          const fileName = `${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
          const filePath = path.join(imagesDir, fileName);
          
          console.log(`📥 Downloading image for "${product.name}"...`);
          
          try {
            const response = await axios({
              method: 'GET',
              url: imageUrl,
              responseType: 'stream',
              timeout: 10000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
              }
            });
            
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            
            // Update product with local image path
            await product.update({ imageUrl: `/resources/images/${fileName}` });
            console.log(`✅ Downloaded and updated image for "${product.name}"`);
            
          } catch (downloadError) {
            console.log(`⚠️  Failed to download image for "${product.name}", using placeholder`);
            await product.update({ imageUrl: '/resources/images/placeholder.jpg' });
          }
        } else {
          // Set a default placeholder
          await product.update({ imageUrl: '/resources/images/placeholder.jpg' });
          console.log(`📷 Set placeholder image for "${product.name}"`);
        }
        
        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error updating image for "${product.name}":`, error.message);
      }
    }
    
    // Create a placeholder image
    const placeholderPath = path.join(imagesDir, 'placeholder.jpg');
    if (!fs.existsSync(placeholderPath)) {
      // Create a simple colored rectangle as placeholder
      const placeholderContent = Buffer.from(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#e5e7eb"/>
          <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">Product</text>
          <text x="200" y="160" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">Image</text>
        </svg>
      `);
      
      // For now, just create an empty file as placeholder
      fs.writeFileSync(placeholderPath, '');
      console.log('📷 Created placeholder image file');
    }
    
    console.log('\n📊 Final Product Images:');
    const updatedProducts = await Product.findAll({
      attributes: ['id', 'name', 'imageUrl']
    });
    
    updatedProducts.forEach(product => {
      console.log(`${product.id}. ${product.name} → ${product.imageUrl}`);
    });
    
    console.log('\n✅ Product images download completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
downloadProductImages();
