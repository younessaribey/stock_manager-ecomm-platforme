// Script to update site settings
require('dotenv').config({ path: '../.env' });
const { Setting } = require('./config/db');

async function updateSiteSettings() {
  try {
    console.log('Attempting to update site settings...');
    
    // Find existing settings or create new
    let settings = await Setting.findOne();
    
    if (!settings) {
      console.log('No settings found, creating new settings...');
      settings = await Setting.create({
        siteName: 'Industrie Import',
        contactEmail: 'contact@industrieimport.com',
        itemsPerPage: 10,
        lowStockThreshold: 5
      });
      console.log('Created new settings with name: Industrie Import');
    } else {
      console.log('Updating existing settings...');
      await settings.update({
        siteName: 'Industrie Import'
      });
      console.log('Updated site name to: Industrie Import');
    }
    
    console.log('Settings update complete!');
  } catch (error) {
    console.error('Error updating settings:', error);
  } finally {
    process.exit(0);
  }
}

updateSiteSettings();
