require('dotenv').config();
const { Category, sequelize } = require('../config/dbSequelize');

async function addSubcategories() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database to apply schema changes
    await sequelize.sync({ alter: true });
    console.log('Database schema updated.');
    
    // Find the Smartphones parent category
    const smartphonesCategory = await Category.findOne({ 
      where: { name: 'Smartphones', level: 0 } 
    });
    
    if (!smartphonesCategory) {
      console.error('❌ Smartphones category not found! Please make sure it exists first.');
      return;
    }
    
    console.log(`✓ Found Smartphones category (ID: ${smartphonesCategory.id})`);
    
    // Smartphone subcategories to add
    const subcategories = [
      'Apple',
      'Vivo', 
      'Samsung',
      'Google',
      'Huawei',
      'Oppo',
      'Realme',
      'Xiaomi',
      'One plus',
      'Poco'
    ];
    
    console.log('Adding smartphone subcategories...');
    
    for (const subcategoryName of subcategories) {
      try {
        // Check if subcategory already exists
        const existingSubcategory = await Category.findOne({ 
          where: { 
            name: subcategoryName,
            parentId: smartphonesCategory.id 
          } 
        });
        
        if (existingSubcategory) {
          console.log(`✓ Subcategory "${subcategoryName}" already exists under Smartphones`);
        } else {
          // Create new subcategory
          await Category.create({ 
            name: subcategoryName,
            parentId: smartphonesCategory.id,
            level: 1,
            isActive: true
          });
          console.log(`✅ Added subcategory: "${subcategoryName}" under Smartphones`);
        }
      } catch (error) {
        console.error(`❌ Error adding subcategory "${subcategoryName}":`, error.message);
      }
    }
    
    // Display the category hierarchy
    console.log('\n📋 Category hierarchy:');
    
    // Get all main categories (level 0)
    const mainCategories = await Category.findAll({ 
      where: { level: 0 },
      include: [{ 
        model: Category, 
        as: 'subcategories',
        required: false 
      }],
      order: [['id', 'ASC'], [{ model: Category, as: 'subcategories' }, 'name', 'ASC']]
    });
    
    mainCategories.forEach((category) => {
      console.log(`\n📁 ${category.name} (ID: ${category.id})`);
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach((sub, index) => {
          console.log(`   ├── ${sub.name} (ID: ${sub.id})`);
        });
      } else {
        console.log('   └── (no subcategories)');
      }
    });
    
    console.log('\n✅ Subcategories setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
addSubcategories();
