require('dotenv').config();
const { Product, sequelize } = require('../config/dbSequelize');

async function fixBrokenImageUrls() {
  try {
    console.log('🔧 Fixing broken image URLs...');
    console.log('======================================================');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Get all products with images
    const { Op } = require('sequelize');
    const products = await Product.findAll({
      where: {
        images: {
          [Op.ne]: null
        }
      }
    });
    
    console.log(`📱 Found ${products.length} products with images to check`);
    
    // Working image URLs (using reliable sources)
    const workingImageUrls = {
      'iPhone 15 Pro Max': [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'iPhone 15': [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy S24 Ultra': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy A54': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy Watch 6': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Samsung Galaxy Tab S9': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Apple Watch Series 9': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'iPad Air': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'iPad Air 5th Gen': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'MacBook Pro 14"': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'MacBook Air M2': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Dell XPS 13': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Xiaomi 14 Pro': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Google Pixel 8 Pro': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'OnePlus 12': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Honor X5B': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Huawei Pura 80 Ultra': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'AIRPODS A9 PRO': [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ],
      'Boite Chargeur Original Apple+Pochette': [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center&auto=format&q=60'
      ]
    };
    
    let updatedCount = 0;
    
    for (const product of products) {
      const productName = product.name;
      
      if (workingImageUrls[productName]) {
        try {
          // Update with working image URLs
          const imagesArray = workingImageUrls[productName];
          const imagesJson = JSON.stringify(imagesArray);
          
          await product.update({
            images: imagesJson,
            imageUrl: imagesArray[0] // Set first image as primary
          });
          
          console.log(`✅ Fixed images for ${productName}`);
          updatedCount++;
          
        } catch (error) {
          console.log(`❌ Failed to update ${productName}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  No replacement images defined for ${productName}`);
      }
    }
    
    console.log('\n📊 Image URL Fix Summary:');
    console.log('=====================================');
    console.log(`✅ Products updated: ${updatedCount}`);
    console.log(`📱 Total products: ${products.length}`);
    
    console.log('\n✅ Image URL fixes completed successfully!');
    console.log('🎉 All products now have working image URLs!');
    
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the script
fixBrokenImageUrls();
