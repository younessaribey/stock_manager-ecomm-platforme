const express = require('express');
const router = express.Router();

// Sample categories data
let categories = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets' },
  { id: 2, name: 'Furniture', description: 'Office and home furniture' },
  { id: 3, name: 'Clothing', description: 'Apparel and accessories' },
  { id: 4, name: 'Books', description: 'Books and educational materials' }
];

// GET /api/categories - Get all categories
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', (req, res) => {
  try {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// POST /api/categories - Create new category
router.post('/', (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    const newCategory = {
      id: categories.length + 1,
      name,
      description: description || ''
    };
    
    categories.push(newCategory);
    
    res.status(201).json({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

module.exports = router;
