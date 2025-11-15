const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../dashboard.json');

async function getDashboardStats() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

module.exports = {
  getDashboardStats
};
