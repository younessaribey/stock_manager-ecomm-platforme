const { Category, sequelize } = require('../config/dbSequelize');

async function addMacBookCategory() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Find the Laptop category
    const laptopCategory = await Category.findOne({
      where: { name: 'Laptop', level: 0 }
    });

    if (!laptopCategory) {
      console.error('❌ Laptop category not found!');
      return;
    }

    console.log(`✓ Found Laptop category (ID: ${laptopCategory.id})`);

    // Check if Apple MacBook already exists
    const existingMacBook = await Category.findOne({
      where: { 
        name: 'Apple MacBook',
        parentId: laptopCategory.id
      }
    });

    if (existingMacBook) {
      console.log('✓ Apple MacBook subcategory already exists');
    } else {
      // Create Apple MacBook subcategory
      const macBookCategory = await Category.create({
        name: 'Apple MacBook',
        description: 'Apple MacBook laptops',
        parentId: laptopCategory.id,
        level: 1,
        isActive: true
      });

      console.log(`✅ Added Apple MacBook subcategory (ID: ${macBookCategory.id})`);
    }

    // Show updated laptop subcategories
    const laptopSubcategories = await Category.findAll({
      where: { parentId: laptopCategory.id },
      order: [['name', 'ASC']]
    });

    console.log('\n📁 Laptop subcategories:');
    laptopSubcategories.forEach(sub => {
      console.log(`   ├── ${sub.name} (ID: ${sub.id})`);
    });

    console.log('\n✅ MacBook category setup completed!');
  } catch (error) {
    console.error('❌ Error adding MacBook category:', error.message);
  } finally {
    await sequelize.close();
  }
}

addMacBookCategory();
