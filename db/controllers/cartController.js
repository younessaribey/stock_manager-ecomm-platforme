const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../cart.json');

async function getCartByUserId(userId) {
  const carts = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  return carts.find(c => c.userId === userId || c.userId === Number(userId));
}

async function updateCart(userId, items) {
  let carts = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  const idx = carts.findIndex(c => c.userId === userId || c.userId === Number(userId));
  if (idx === -1) {
    carts.push({ userId, items });
  } else {
    carts[idx].items = items;
  }
  await fs.writeFile(dbPath, JSON.stringify(carts, null, 2));
  return carts.find(c => c.userId === userId || c.userId === Number(userId));
}

module.exports = {
  getCartByUserId,
  updateCart
};
