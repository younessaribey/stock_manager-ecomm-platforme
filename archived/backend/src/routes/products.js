const express = require('express');
const router = express.Router();

// Sample products data
let products = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop for business use',
    price: 999.99,
    stock: 50,
    category: 'Electronics',
    sku: 'LAP001',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    price: 699.99,
    stock: 100,
    category: 'Electronics',
    sku: 'PHN001',
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Office Chair',
    description: 'Ergonomic office chair for comfort',
    price: 299.99,
    stock: 25,
    category: 'Furniture',
    sku: 'CHR001',
    createdAt: new Date()
  }
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// POST /api/products - Create new product
router.post('/', (req, res) => {
  try {
    const { name, description, price, stock, category, sku } = req.body;
    
    if (!name || !price || !stock || !category || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const newProduct = {
      id: products.length + 1,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      sku,
      createdAt: new Date()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const { name, description, price, stock, category, sku } = req.body;
    
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      price: price ? parseFloat(price) : products[productIndex].price,
      stock: stock ? parseInt(stock) : products[productIndex].stock,
      category: category || products[productIndex].category,
      sku: sku || products[productIndex].sku,
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      data: products[productIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    products.splice(productIndex, 1);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

module.exports = router;
