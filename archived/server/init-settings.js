// Init script to create settings in the database
require('dotenv').config({ path: '../.env' });
const { Setting, sequelize } = require('./config/db');

async function initializeSettings() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Checking for existing settings...');
    const existingSettings = await Setting.findOne();
    
    if (existingSettings) {
      console.log('Settings already exist in database:');
      console.log(existingSettings.toJSON());
      console.log('Updating site name to "Industrie Import"...');
      
      await existingSettings.update({
        siteName: 'Industrie Import'
      });
      
      console.log('Settings updated successfully!');
    } else {
      console.log('No settings found, creating default settings...');
      
      const newSettings = await Setting.create({
        siteName: 'Industrie Import',
        contactEmail: 'contact@example.com',
        itemsPerPage: 10,
        lowStockThreshold: 5
      });
      
      console.log('Settings created successfully:');
      console.log(newSettings.toJSON());
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  } finally {
    process.exit(0);
  }
}

// Run the function
initializeSettings();
