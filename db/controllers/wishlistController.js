const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../wishlist.json');

async function getWishlistByUserId(userId) {
  const wishlists = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  return wishlists.find(w => w.userId === userId || w.userId === Number(userId));
}

async function updateWishlist(userId, items) {
  let wishlists = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  const idx = wishlists.findIndex(w => w.userId === userId || w.userId === Number(userId));
  if (idx === -1) {
    wishlists.push({ userId, items });
  } else {
    wishlists[idx].items = items;
  }
  await fs.writeFile(dbPath, JSON.stringify(wishlists, null, 2));
  return wishlists.find(w => w.userId === userId || w.userId === Number(userId));
}

module.exports = {
  getWishlistByUserId,
  updateWishlist
};
