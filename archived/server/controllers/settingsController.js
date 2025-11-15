const { Setting } = require('../config/db');

// Get settings
const getSettings = async (req, res) => {
  try {
    // Find first settings record
    let settings = await Setting.findOne({ raw: true });
    
    // If no settings exist and this is not the public endpoint
    if (!settings && req.originalUrl !== '/api/settings/public') {
      // Create default settings
      settings = await Setting.create({
        siteName: 'Industrie Import',
        contactEmail: 'contact@example.com',
        itemsPerPage: 10,
        lowStockThreshold: 5
      });
    }
    
    // If still no settings, return sensible defaults
    if (!settings) {
      return res.json({
        siteName: 'Industrie Import',
        contactEmail: '',
        itemsPerPage: 10,
        lowStockThreshold: 5
      });
    }
    
    return res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create(req.body);
    else await settings.update(req.body);
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
