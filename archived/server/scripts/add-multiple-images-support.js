require('dotenv').config();
const { Product, sequelize } = require('../config/dbSequelize');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function addMultipleImagesToProducts() {
  try {
    console.log('🖼️  Adding multiple images to products...');
    console.log('======================================================');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, '../resources/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Get all products
    const products = await Product.findAll();
    console.log(`📱 Found ${products.length} products to update`);
    
    // Define 3 images for each phone product
    const phoneImages = {
      // iPhone products
      'iPhone 15 Pro Max': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895355658',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-back?wid=470&hei=556&fmt=png-alpha&.v=1692895355658',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-camera?wid=470&hei=556&fmt=png-alpha&.v=1692895355658'
      ],
      'iPhone 15': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pink-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895928677',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pink-back-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895928677',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pink-camera-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895928677'
      ],
      
      // Samsung products
      'Samsung Galaxy S24 Ultra': [
        'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzgaxaa-539359725?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzgaxaa-539359726?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzgaxaa-539359727?$650_519_PNG$'
      ],
      'Samsung Galaxy A54': [
        'https://images.samsung.com/is/image/samsung/p6pim/us/2302/gallery/us-galaxy-a54-5g-a546-sm-a546ulvdxaa-534852275?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2302/gallery/us-galaxy-a54-5g-a546-sm-a546ulvdxaa-534852276?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2302/gallery/us-galaxy-a54-5g-a546-sm-a546ulvdxaa-534852277?$650_519_PNG$'
      ],
      'Samsung Galaxy Watch 6': [
        'https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-watch6-w930-sm-r930nzkaxaa-539359725?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-watch6-w930-sm-r930nzkaxaa-539359726?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-watch6-w930-sm-r930nzkaxaa-539359727?$650_519_PNG$'
      ],
      'Samsung Galaxy Tab S9': [
        'https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-tab-s9-wifi-sm-x710nzkaxaa-539359725?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-tab-s9-wifi-sm-x710nzkaxaa-539359726?$650_519_PNG$',
        'https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-tab-s9-wifi-sm-x710nzkaxaa-539359727?$650_519_PNG$'
      ],
      
      // Xiaomi products
      'Xiaomi 14 Pro': [
        'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1710747853.30778606.png',
        'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1710747854.30778606.png',
        'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1710747855.30778606.png'
      ],
      
      // Google products
      'Google Pixel 8 Pro': [
        'https://lh3.googleusercontent.com/zMeCU5NQyHuwuVyANb-AqPF9QLfSHpOBbOHQI7dYbG5hIJ_P6F2xJdJT-uI6JFWKwO9_=w1000',
        'https://lh3.googleusercontent.com/zMeCU5NQyHuwuVyANb-AqPF9QLfSHpOBbOHQI7dYbG5hIJ_P6F2xJdJT-uI6JFWKwO9_=w1000',
        'https://lh3.googleusercontent.com/zMeCU5NQyHuwuVyANb-AqPF9QLfSHpOBbOHQI7dYbG5hIJ_P6F2xJdJT-uI6JFWKwO9_=w1000'
      ],
      
      // OnePlus products
      'OnePlus 12': [
        'https://image01.oneplus.net/ebp/202312/07/1-m00-50-39-rb8bwmd7yckaozvbaakyzjpx4ic859.png',
        'https://image01.oneplus.net/ebp/202312/07/1-m00-50-39-rb8bwmd7yckaozvbaakyzjpx4ic860.png',
        'https://image01.oneplus.net/ebp/202312/07/1-m00-50-39-rb8bwmd7yckaozvbaakyzjpx4ic861.png'
      ],
      
      // Apple Watch
      'Apple Watch Series 9': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-aluminum-midnight-nc-41?wid=470&hei=556&fmt=png-alpha&.v=1692895916242',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-aluminum-midnight-nc-42?wid=470&hei=556&fmt=png-alpha&.v=1692895916242',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-aluminum-midnight-nc-43?wid=470&hei=556&fmt=png-alpha&.v=1692895916242'
      ],
      
      // iPad
      'iPad Air': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=470&hei=556&fmt=png-alpha&.v=1645065732688',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203-back?wid=470&hei=556&fmt=png-alpha&.v=1645065732688',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203-camera?wid=470&hei=556&fmt=png-alpha&.v=1645065732688'
      ],
      'iPad Air 5th Gen': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=470&hei=556&fmt=png-alpha&.v=1645065732688',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203-back?wid=470&hei=556&fmt=png-alpha&.v=1645065732688',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203-camera?wid=470&hei=556&fmt=png-alpha&.v=1645065732688'
      ],
      
      // MacBook
      'MacBook Pro 14"': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310-back?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310-keyboard?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
      ],
      'MacBook Air M2': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606-back?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606-keyboard?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665'
      ],
      
      // Dell Laptop
      'Dell XPS 13': [
        'https://i.dell.com/sites/csdocuments/Shared-Content/data-sheets/en/Dell_XPS_13_Plus_9320_Product_Photo_1.jpg',
        'https://i.dell.com/sites/csdocuments/Shared-Content/data-sheets/en/Dell_XPS_13_Plus_9320_Product_Photo_2.jpg',
        'https://i.dell.com/sites/csdocuments/Shared-Content/data-sheets/en/Dell_XPS_13_Plus_9320_Product_Photo_3.jpg'
      ],
      
      // Honor phone
      'Honor X5B': [
        'https://www.hihonor.com/content/dam/honor/cn/products/phones/honor-x5b/images/hero/hero-1.png',
        'https://www.hihonor.com/content/dam/honor/cn/products/phones/honor-x5b/images/hero/hero-2.png',
        'https://www.hihonor.com/content/dam/honor/cn/products/phones/honor-x5b/images/hero/hero-3.png'
      ],
      
      // Huawei phone
      'Huawei Pura 80 Ultra': [
        'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/pura-80-ultra/images/pura-80-ultra-1.png',
        'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/pura-80-ultra/images/pura-80-ultra-2.png',
        'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/pura-80-ultra/images/pura-80-ultra-3.png'
      ],
      
      // AirPods
      'AIRPODS A9 PRO': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895916242',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2-case?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895916242',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2-charging?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895916242'
      ],
      
      // Apple Charger
      'Boite Chargeur Original Apple+Pochette': [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU7H2?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895916242',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU7H2-case?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895916242',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU7H2-packaging?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895916242'
      ]
    };
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      const productName = product.name;
      
      if (phoneImages[productName]) {
        try {
          // Convert array of images to JSON string
          const imagesArray = phoneImages[productName];
          const imagesJson = JSON.stringify(imagesArray);
          
          // Update the product with multiple images
          await product.update({
            images: imagesJson,
            imageUrl: imagesArray[0] // Set first image as primary
          });
          
          console.log(`✅ Updated ${productName} with ${imagesArray.length} images`);
          updatedCount++;
          
        } catch (error) {
          console.log(`❌ Failed to update ${productName}: ${error.message}`);
          skippedCount++;
        }
      } else {
        console.log(`⚠️  No images defined for ${productName}`);
        skippedCount++;
      }
    }
    
    console.log('\n📊 Multiple Images Update Summary:');
    console.log('=====================================');
    console.log(`✅ Products updated: ${updatedCount}`);
    console.log(`⚠️  Products skipped: ${skippedCount}`);
    console.log(`📱 Total products: ${products.length}`);
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { Op } = require('sequelize');
    const updatedProducts = await Product.findAll({
      where: {
        images: {
          [Op.ne]: null
        }
      }
    });
    
    console.log(`📸 Products with multiple images: ${updatedProducts.length}`);
    
    for (const product of updatedProducts.slice(0, 3)) { // Show first 3 as examples
      const images = JSON.parse(product.images || '[]');
      console.log(`  📱 ${product.name}: ${images.length} images`);
    }
    
    console.log('\n✅ Multiple images update completed successfully!');
    console.log('🎉 All phone products now have 3 demonstration images!');
    
  } catch (error) {
    console.error('❌ Error adding multiple images:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the script
addMultipleImagesToProducts();