const { sequelize } = require('../config/dbSequelize');

async function forceDatabaseSync() {
  try {
    console.log('🔄 Forcing database synchronization to add new fields...');
    
    // Force sync with alter: true to add new columns
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database synchronization completed successfully!');
    console.log('📱 Battery health field should now be available for Apple products.');
    
  } catch (error) {
    console.error('❌ Error during database sync:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the script
forceDatabaseSync();
