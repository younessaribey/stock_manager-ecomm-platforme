const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../users.json');

async function getAllUsers() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function getUserById(id) {
  const users = await getAllUsers();
  return users.find(u => u.id === id || u.id === Number(id));
}

async function createUser(user) {
  const users = await getAllUsers();
  user.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push(user);
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  return user;
}

async function updateUser(id, updatedFields) {
  const users = await getAllUsers();
  const idx = users.findIndex(u => u.id === id || u.id === Number(id));
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updatedFields };
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  return users[idx];
}

async function deleteUser(id) {
  let users = await getAllUsers();
  const idx = users.findIndex(u => u.id === id || u.id === Number(id));
  if (idx === -1) return false;
  users.splice(idx, 1);
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  return true;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
