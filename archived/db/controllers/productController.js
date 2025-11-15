const path = require('path');
const fs = require('fs').promises;
const dbPath = path.join(__dirname, '../products.json');

async function getAllProducts() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function getProductById(id) {
  const products = await getAllProducts();
  return products.find(p => p.id === id || p.id === Number(id));
}

async function createProduct(product) {
  const products = await getAllProducts();
  product.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  products.push(product);
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
  return product;
}

async function updateProduct(id, updatedFields) {
  const products = await getAllProducts();
  const idx = products.findIndex(p => p.id === id || p.id === Number(id));
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updatedFields };
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
  return products[idx];
}

async function deleteProduct(id) {
  let products = await getAllProducts();
  const idx = products.findIndex(p => p.id === id || p.id === Number(id));
  if (idx === -1) return false;
  products.splice(idx, 1);
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
  return true;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
