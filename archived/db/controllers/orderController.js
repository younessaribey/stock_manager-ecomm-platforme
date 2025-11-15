const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../orders.json');

async function getAllOrders() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function getOrderById(id) {
  const orders = await getAllOrders();
  return orders.find(o => o.id === id || o.id === Number(id));
}

async function createOrder(order) {
  const orders = await getAllOrders();
  order.id = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  orders.push(order);
  await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));
  return order;
}

async function updateOrder(id, updatedFields) {
  const orders = await getAllOrders();
  const idx = orders.findIndex(o => o.id === id || o.id === Number(id));
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updatedFields };
  await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));
  return orders[idx];
}

async function deleteOrder(id) {
  let orders = await getAllOrders();
  const idx = orders.findIndex(o => o.id === id || o.id === Number(id));
  if (idx === -1) return false;
  orders.splice(idx, 1);
  await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));
  return true;
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
