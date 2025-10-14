const { sequelize, Category } = require('../config/dbSequelize');

async function organizeCategories() {
  try {
    console.log('🏗️ Organizing categories...');

    // Find the main categories
    const tablets = await Category.findOne({ where: { name: 'Tablets', parentId: null } });
    const laptop = await Category.findOne({ where: { name: 'Laptop', parentId: null } });

    if (!tablets || !laptop) {
      console.error('❌ Could not find Tablets or Laptop categories');
      return;
    }

    console.log(`📱 Found Tablets category (ID: ${tablets.id})`);
    console.log(`💻 Found Laptop category (ID: ${laptop.id})`);

    // Add Apple subcategory to Tablets
    const [tabletsApple, tabletsAppleCreated] = await Category.findOrCreate({
      where: { 
        name: 'Apple iPad',
        parentId: tablets.id
      },
      defaults: {
        name: 'Apple iPad',
        parentId: tablets.id,
        level: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (tabletsAppleCreated) {
      console.log('✅ Added Apple iPad subcategory to Tablets');
    } else {
      console.log('ℹ️ Apple iPad subcategory already exists under Tablets');
    }

    // Add Apple subcategory to Laptop
    const [laptopApple, laptopAppleCreated] = await Category.findOrCreate({
      where: { 
        name: 'Apple MacBook',
        parentId: laptop.id
      },
      defaults: {
        name: 'Apple MacBook',
        parentId: laptop.id,
        level: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (laptopAppleCreated) {
      console.log('✅ Added Apple MacBook subcategory to Laptop');
    } else {
      console.log('ℹ️ Apple MacBook subcategory already exists under Laptop');
    }

    // Add HP subcategory to Laptop
    const [laptopHP, laptopHPCreated] = await Category.findOrCreate({
      where: { 
        name: 'HP',
        parentId: laptop.id
      },
      defaults: {
        name: 'HP',
        parentId: laptop.id,
        level: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (laptopHPCreated) {
      console.log('✅ Added HP subcategory to Laptop');
    } else {
      console.log('ℹ️ HP subcategory already exists under Laptop');
    }

    // Add Dell subcategory to Laptop
    const [laptopDell, laptopDellCreated] = await Category.findOrCreate({
      where: { 
        name: 'Dell',
        parentId: laptop.id
      },
      defaults: {
        name: 'Dell',
        parentId: laptop.id,
        level: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (laptopDellCreated) {
      console.log('✅ Added Dell subcategory to Laptop');
    } else {
      console.log('ℹ️ Dell subcategory already exists under Laptop');
    }

    // Add Asus subcategory to Laptop
    const [laptopAsus, laptopAsusCreated] = await Category.findOrCreate({
      where: { 
        name: 'Asus',
        parentId: laptop.id
      },
      defaults: {
        name: 'Asus',
        parentId: laptop.id,
        level: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (laptopAsusCreated) {
      console.log('✅ Added Asus subcategory to Laptop');
    } else {
      console.log('ℹ️ Asus subcategory already exists under Laptop');
    }

    // Add Lenovo subcategory to Laptop
    const [laptopLenovo, laptopLenovoCreated] = await Category.findOrCreate({
      where: { 
        name: 'Lenovo',
        parentId: laptop.id
      },
      defaults: {
        name: 'Lenovo',
        parentId: laptop.id,
        level: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (laptopLenovoCreated) {
      console.log('✅ Added Lenovo subcategory to Laptop');
    } else {
      console.log('ℹ️ Lenovo subcategory already exists under Laptop');
    }

    console.log('🎉 Category organization completed!');
    
    // Display the updated structure
    console.log('\n📂 Updated Category Structure:');
    const allCategories = await Category.findAll({
      include: [{
        model: Category,
        as: 'subcategories'
      }],
      where: { parentId: null },
      order: [['name', 'ASC']]
    });

    allCategories.forEach(cat => {
      console.log(`${cat.name} (ID: ${cat.id})`);
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`  └── ${sub.name} (ID: ${sub.id})`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Error organizing categories:', error);
  } finally {
    await sequelize.close();
  }
}

organizeCategories();
