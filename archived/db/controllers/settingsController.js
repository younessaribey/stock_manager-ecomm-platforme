const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../settings.json');

async function getSettings() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function updateSettings(newSettings) {
  await fs.writeFile(dbPath, JSON.stringify(newSettings, null, 2));
  return newSettings;
}

module.exports = {
  getSettings,
  updateSettings
};
