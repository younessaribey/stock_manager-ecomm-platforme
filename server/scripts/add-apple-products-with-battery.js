const { sequelize, User, Category, Product } = require('../config/dbSequelize');

async function addAppleProductsWithBattery() {
  try {
    console.log('🔌 Adding Apple products with battery health information...');
    
    // Find admin user
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    // Find Apple subcategory
    const appleCategory = await Category.findOne({ 
      where: { name: 'Apple' },
      include: [{ model: Category, as: 'parent' }]
    });
    
    if (!appleCategory) {
      console.error('❌ Apple category not found. Please make sure Apple subcategory exists.');
      return;
    }
    
    console.log(`✅ Found Apple category: ${appleCategory.name} (ID: ${appleCategory.id})`);
    
    // Apple products with battery health
    const appleProducts = [
      {
        name: 'iPhone 14 Pro',
        description: 'Excellent condition iPhone 14 Pro with Dynamic Island, 48MP camera, and A16 Bionic chip. Previously owned device with good battery health.',
        price: 899.99,
        quantity: 3,
        categoryId: appleCategory.id,
        createdBy: adminUser.id,
        condition: 'used',
        storage: '128GB',
        color: 'Deep Purple',
        model: 'iPhone 14 Pro',
        imei: 'APL14PRO001234',
        batteryHealth: 92,
        imageUrl: '/resources/images/iphone-14-pro.jpg'
      },
      {
        name: 'iPhone 13 mini',
        description: 'Compact iPhone 13 mini in great condition. Perfect for one-handed use with powerful A15 Bionic chip.',
        price: 499.99,
        quantity: 2,
        categoryId: appleCategory.id,
        createdBy: adminUser.id,
        condition: 'used',
        storage: '256GB',
        color: 'Pink',
        model: 'iPhone 13 mini',
        imei: 'APL13MINI56789',
        batteryHealth: 87,
        imageUrl: '/resources/images/iphone-13-mini.jpg'
      },
      {
        name: 'iPhone 12',
        description: 'Reliable iPhone 12 with 5G capability and dual-camera system. Good overall condition with moderate battery wear.',
        price: 449.99,
        quantity: 4,
        categoryId: appleCategory.id,
        createdBy: adminUser.id,
        condition: 'used',
        storage: '64GB',
        color: 'Blue',
        model: 'iPhone 12',
        imei: 'APL12STD987654',
        batteryHealth: 78,
        imageUrl: '/resources/images/iphone-12.jpg'
      },
      {
        name: 'iPhone 15 Pro Max - Refurbished',
        description: 'Professionally refurbished iPhone 15 Pro Max with new battery. Premium titanium design with advanced camera system.',
        price: 1099.99,
        quantity: 1,
        categoryId: appleCategory.id,
        createdBy: adminUser.id,
        condition: 'refurbished',
        storage: '512GB',
        color: 'Natural Titanium',
        model: 'iPhone 15 Pro Max',
        imei: 'APL15PMREF2024',
        batteryHealth: 100,
        imageUrl: '/resources/images/iphone-15-pro-max.jpg'
      },
      {
        name: 'iPhone SE (3rd generation)',
        description: 'Budget-friendly iPhone SE with A15 Bionic chip. Classic design with modern performance and decent battery life.',
        price: 299.99,
        quantity: 5,
        categoryId: appleCategory.id,
        createdBy: adminUser.id,
        condition: 'used',
        storage: '128GB',
        color: 'Midnight',
        model: 'iPhone SE 3rd Gen',
        imei: 'APLSE3GEN12345',
        batteryHealth: 84,
        imageUrl: '/resources/images/iphone-se-3rd.jpg'
      }
    ];
    
    // Create products
    for (const productData of appleProducts) {
      try {
        const product = await Product.create(productData);
        console.log(`✅ Created: ${product.name} (Battery: ${product.batteryHealth}%)`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠️  Product already exists: ${productData.name}`);
        } else {
          console.error(`❌ Error creating ${productData.name}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Apple products with battery health added successfully!');
    console.log('\n📱 Battery Health Color Coding:');
    console.log('🟢 90-100%: Excellent (Green)');
    console.log('🟡 80-89%:  Good (Yellow)');
    console.log('🔴 <80%:    Fair (Red)');
    
  } catch (error) {
    console.error('❌ Error adding Apple products:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the script
addAppleProductsWithBattery();
