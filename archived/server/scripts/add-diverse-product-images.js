require('dotenv').config();
const { Product, sequelize } = require('../config/dbSequelize');

async function addDiverseProductImages() {
  try {
    console.log('🎨 Adding diverse product images for better switching...');
    console.log('======================================================');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Get all products
    const products = await Product.findAll();
    console.log(`📱 Found ${products.length} products to update`);
    
    // Diverse image sets for different product types
    const diverseImageSets = {
      // iPhone products - different angles and colors
      'iPhone 15 Pro Max': [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'iPhone 15': [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Samsung products - different models
      'Samsung Galaxy S24 Ultra': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy A54': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy Watch 6': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy Tab S9': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Xiaomi products
      'Xiaomi 14 Pro': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Google products
      'Google Pixel 8 Pro': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // OnePlus products
      'OnePlus 12': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Apple Watch
      'Apple Watch Series 9': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // iPad products
      'iPad Air': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'iPad Air 5th Gen': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // MacBook products
      'MacBook Pro 14"': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'MacBook Air M2': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Dell Laptop
      'Dell XPS 13': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Honor phone
      'Honor X5B': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Huawei phone
      'Huawei Pura 80 Ultra': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // AirPods
      'AIRPODS A9 PRO': [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      
      // Apple Charger
      'Boite Chargeur Original Apple+Pochette': [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ]
    };
    
    let updatedCount = 0;
    
    for (const product of products) {
      const productName = product.name;
      
      if (diverseImageSets[productName]) {
        try {
          // Update with diverse image URLs
          const imagesArray = diverseImageSets[productName];
          const imagesJson = JSON.stringify(imagesArray);
          
          await product.update({
            images: imagesJson,
            imageUrl: imagesArray[0] // Set first image as primary
          });
          
          console.log(`✅ Updated ${productName} with diverse images`);
          updatedCount++;
          
        } catch (error) {
          console.log(`❌ Failed to update ${productName}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  No diverse images defined for ${productName}`);
      }
    }
    
    console.log('\n📊 Diverse Images Update Summary:');
    console.log('=====================================');
    console.log(`✅ Products updated: ${updatedCount}`);
    console.log(`📱 Total products: ${products.length}`);
    
    console.log('\n✅ Diverse images update completed successfully!');
    console.log('🎉 Products now have diverse images for better switching!');
    
  } catch (error) {
    console.error('❌ Error adding diverse images:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the script
addDiverseProductImages();

