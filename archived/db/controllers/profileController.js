const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../profile.json');

async function getProfileByUserId(userId) {
  const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  return (data.users || []).find(p => p.id === userId || p.id === Number(userId));
}

async function updateProfile(userId, updatedFields) {
  let data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  const idx = (data.users || []).findIndex(p => p.id === userId || p.id === Number(userId));
  if (idx === -1) return null;
  data.users[idx] = { ...data.users[idx], ...updatedFields };
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  return data.users[idx];
}

module.exports = {
  getProfileByUserId,
  updateProfile
};
