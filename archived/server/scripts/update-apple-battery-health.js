const { sequelize, Product, Category } = require('../config/dbSequelize');

async function updateAppleBatteryHealth() {
  try {
    console.log('🔋 Updating Apple products with battery health information...');
    
    // Find Apple category
    const appleCategory = await Category.findOne({ 
      where: { name: 'Apple' }
    });
    
    if (!appleCategory) {
      console.error('❌ Apple category not found.');
      return;
    }
    
    console.log(`✅ Found Apple category: ${appleCategory.name} (ID: ${appleCategory.id})`);
    
    // Update battery health for specific Apple products by name
    const batteryUpdates = [
      { name: 'iPhone 15 Pro Max', batteryHealth: 95 },
      { name: 'iPhone 15', batteryHealth: 98 },
      { name: 'iPhone 14 Pro', batteryHealth: 92 },
      { name: 'iPhone 13 mini', batteryHealth: 87 },
      { name: 'iPhone 12', batteryHealth: 78 },
      { name: 'iPhone 15 Pro Max - Refurbished', batteryHealth: 100 },
      { name: 'iPhone SE (3rd generation)', batteryHealth: 84 }
    ];
    
    for (const update of batteryUpdates) {
      try {
        const [affectedRows] = await Product.update(
          { batteryHealth: update.batteryHealth },
          {
            where: {
              name: update.name,
              categoryId: appleCategory.id
            }
          }
        );
        
        if (affectedRows > 0) {
          console.log(`✅ Updated ${update.name}: ${update.batteryHealth}% battery health`);
        } else {
          console.log(`⚠️  Product not found: ${update.name}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${update.name}:`, error.message);
      }
    }
    
    // Verify updates
    const appleProducts = await Product.findAll({
      where: { categoryId: appleCategory.id },
      attributes: ['id', 'name', 'batteryHealth']
    });
    
    console.log('\n📱 Apple products with battery health:');
    appleProducts.forEach(product => {
      const health = product.batteryHealth;
      const status = health >= 90 ? '🟢' : health >= 80 ? '🟡' : '🔴';
      console.log(`${status} ${product.name}: ${health || 'N/A'}%`);
    });
    
  } catch (error) {
    console.error('❌ Error updating Apple battery health:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the script
updateAppleBatteryHealth();
