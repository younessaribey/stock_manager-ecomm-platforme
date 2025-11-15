const { Category, Product } = require('../config/dbSequelize');

// Get all categories with subcategories
const getAllCategories = async (req, res) => {
  try {
    // Fetch ALL categories for admin interface
    const allCategories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    // For simple admin interface, just return all categories with basic info
    const enriched = await Promise.all(allCategories.map(async category => {
      const productCount = await Product.count({ where: { categoryId: category.id } });
      
      return {
        id: category.id,
        name: category.name,
        description: category.description,
        level: category.level || 0,
        isActive: category.isActive !== false, // Default to true if undefined
        parentId: category.parentId,
        productCount: productCount,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      };
    }));
    
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await Category.findByPk(categoryId, { raw: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, description, parentId, level = 0, isActive = true } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // If parentId is provided, validate it exists and set level to 1
    let categoryLevel = level;
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
      categoryLevel = 1; // Subcategory
    }
    
    // Check if category with same name already exists in the same level/parent
    const whereClause = parentId 
      ? { name, parentId } 
      : { name, level: categoryLevel };
    
    const existingCategory = await Category.findOne({ where: whereClause });
    if (existingCategory) {
      return res.status(400).json({ 
        message: parentId 
          ? 'A subcategory with this name already exists under this parent' 
          : 'A category with this name already exists' 
      });
    }
    
    const newCategory = await Category.create({ 
      name, 
      description: description || null,
      parentId: parentId || null,
      level: categoryLevel,
      isActive 
    });
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check permissions (admin only)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update categories' });
    }
    
    const { name, description, isActive } = req.body;
    
    // Check if updated name already exists in another category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory && existingCategory.id !== categoryId) {
        return res.status(400).json({ message: 'A category with this name already exists' });
      }
    }
    
    // Update category
    const updates = {
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      isActive: isActive !== undefined ? isActive : category.isActive,
      updatedAt: new Date().toISOString()
    };
    
    await category.update(updates);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check permissions (admin only)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete categories' });
    }
    
    // Check if category is in use by any products
    const count = await Product.count({ where: { categoryId: category.id } });
    if (count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is in use by products',
        productsCount: count
      });
    }
    
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
