require('dotenv').config();
const { Category, sequelize } = require('../config/dbSequelize');

async function addCategories() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Categories to add
    const categories = [
      'Occasions',
      'Smartphones',
      'Smartwatches',
      'Tablets',
      'Laptop',
      'Affaire du jour',
      'Accessoires',
      "Brother's Packs",
      'Livraison Gratuite'
    ];
    
    console.log('Adding categories...');
    
    for (const categoryName of categories) {
      try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ 
          where: { name: categoryName } 
        });
        
        if (existingCategory) {
          console.log(`✓ Category "${categoryName}" already exists`);
        } else {
          // Create new category
          await Category.create({ name: categoryName });
          console.log(`✅ Added category: "${categoryName}"`);
        }
      } catch (error) {
        console.error(`❌ Error adding category "${categoryName}":`, error.message);
      }
    }
    
    // Display all categories
    console.log('\n📋 All categories in database:');
    const allCategories = await Category.findAll({ order: [['id', 'ASC']] });
    allCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (ID: ${category.id})`);
    });
    
    console.log('\n✅ Categories setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
addCategories();

