const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../orderHistory.json');

async function getOrderHistoryByUserId(userId) {
  const histories = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  return histories.find(h => h.userId === userId || h.userId === Number(userId));
}

async function addOrderToHistory(userId, order) {
  let histories = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  const idx = histories.findIndex(h => h.userId === userId || h.userId === Number(userId));
  if (idx === -1) {
    histories.push({ userId, orders: [order] });
  } else {
    histories[idx].orders.push(order);
  }
  await fs.writeFile(dbPath, JSON.stringify(histories, null, 2));
  return histories.find(h => h.userId === userId || h.userId === Number(userId));
}

module.exports = {
  getOrderHistoryByUserId,
  addOrderToHistory
};
