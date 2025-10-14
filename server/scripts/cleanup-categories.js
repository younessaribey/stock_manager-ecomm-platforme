require('dotenv').config();
const { Category, sequelize } = require('../config/dbSequelize');

async function cleanupCategories() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Remove the weird category with name 'J"J"J"'
    const weirdCategory = await Category.findOne({ 
      where: { name: 'J"J"J"' } 
    });
    
    if (weirdCategory) {
      await weirdCategory.destroy();
      console.log('✅ Removed weird category: J"J"J"');
    } else {
      console.log('✓ No weird category found');
    }
    
    // Display final category hierarchy
    console.log('\n📋 Final category hierarchy:');
    
    // Get all main categories (level 0)
    const mainCategories = await Category.findAll({ 
      where: { level: 0, isActive: true },
      include: [{ 
        model: Category, 
        as: 'subcategories',
        where: { isActive: true },
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
    
    console.log('\n✅ Categories cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
cleanupCategories();
