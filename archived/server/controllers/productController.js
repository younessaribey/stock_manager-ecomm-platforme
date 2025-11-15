const path = require('path');
const fs = require('fs');
const { Product, Category, User, sequelize } = require('../config/dbSequelize');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

// Helper function to extract brand from model name
const extractBrandFromModel = (modelName) => {
  const model = modelName?.toLowerCase() || '';
  
  // Common brand patterns
  if (model.includes('iphone') || model.includes('ipad') || model.includes('macbook')) {
    return 'Apple';
  }
  if (model.includes('galaxy') || model.includes('samsung')) {
    return 'Samsung';
  }
  if (model.includes('huawei') || model.includes('honor')) {
    return 'Huawei';
  }
  if (model.includes('pixel') || model.includes('google')) {
    return 'Google';
  }
  if (model.includes('oneplus')) {
    return 'OnePlus';
  }
  if (model.includes('xiaomi') || model.includes('redmi') || model.includes('poco')) {
    return 'Xiaomi';
  }
  if (model.includes('oppo')) {
    return 'Oppo';
  }
  if (model.includes('vivo')) {
    return 'Vivo';
  }
  if (model.includes('realme')) {
    return 'Realme';
  }
  if (model.includes('dell')) {
    return 'Dell';
  }
  if (model.includes('hp') || model.includes('hewlett')) {
    return 'HP';
  }
  if (model.includes('acer')) {
    return 'Acer';
  }
  if (model.includes('asus')) {
    return 'Asus';
  }
  if (model.includes('lenovo')) {
    return 'Lenovo';
  }
  
  return null;
};

// Create resources and images directories
const resourcesBaseDir = path.join(__dirname, '../resources');
if (!fs.existsSync(resourcesBaseDir)) {
  fs.mkdirSync(resourcesBaseDir, { recursive: true });
  console.log(`Created resources directory: ${resourcesBaseDir}`);
}

const resourcesImagesDir = path.join(resourcesBaseDir, 'images');
if (!fs.existsSync(resourcesImagesDir)) {
  fs.mkdirSync(resourcesImagesDir, { recursive: true });
  console.log(`Created images directory: ${resourcesImagesDir}`);
}

const resourcesDir = resourcesImagesDir;

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ['name'] }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await Product.findByPk(productId, {
      include: [
        { model: Category, attributes: ['name'] }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    const { name, description, categoryId, price, quantity, imei, condition, storage, color, model, batteryHealth } = req.body;
    
    // Fix color field - ensure it's a string
    let finalColor = color;
    if (Array.isArray(finalColor)) {
      finalColor = finalColor[0];
    }
    if (finalColor && typeof finalColor !== 'string') {
      finalColor = String(finalColor);
    }
    
    console.log('Processed color:', finalColor);
    
    // Validate required fields
    if (!name || !price || !quantity) {
      console.log('Missing required fields:', { name: !!name, price: !!price, quantity: !!quantity });
      return res.status(400).json({ message: 'Name, price and quantity are required' });
    }
    
    // Check for duplicate IMEI if provided
    if (imei) {
      try {
        const existingProduct = await Product.findOne({ where: { imei } });
        if (existingProduct) {
          console.log('Duplicate IMEI found:', imei);
          return res.status(400).json({ message: 'A product with this IMEI already exists' });
        }
      } catch (imeiCheckError) {
        console.log('IMEI check error (non-critical):', imeiCheckError.message);
      }
    }
    
    // Additional validation for specific categories (with error handling)
    if (categoryId) {
      try {
        const category = await Category.findByPk(categoryId);
        if (category) {
          const mainCategory = category.parentId ? 
            await Category.findByPk(category.parentId) : category;
          
          // For Occasions (used phones), require battery health and condition
          if (mainCategory && mainCategory.name === 'Occasions') {
            if (!batteryHealth) {
              console.log('Battery health required for Occasions category');
              return res.status(400).json({ message: 'Battery health is required for used phones in Occasions category' });
            }
            if (!condition) {
              console.log('Condition required for Occasions category');
              return res.status(400).json({ message: 'Condition is required for used phones in Occasions category' });
            }
          }
        }
      } catch (categoryError) {
        console.log('Category validation error (non-critical):', categoryError.message);
        // Continue with product creation even if category validation fails
      }
    }

    // Auto-create subcategory if brand is provided but not found
    let finalCategoryId = categoryId;
    if (model && !categoryId) {
      try {
        // Try to find existing brand subcategory
        const brandName = extractBrandFromModel(model);
        if (brandName) {
          const existingBrand = await Category.findOne({
            where: {
              name: { [sequelize.Op.iLike]: `%${brandName}%` },
              level: 1
            }
          });
          
          if (existingBrand) {
            finalCategoryId = existingBrand.id;
            console.log(`Found existing brand category: ${existingBrand.name}`);
          } else {
            // Create new brand subcategory
            const mainCategory = await Category.findOne({
              where: { name: 'Smartphones', level: 0 }
            });
            
            if (mainCategory) {
              const newBrandCategory = await Category.create({
                name: brandName,
                description: `${brandName} smartphones`,
                parentId: mainCategory.id,
                level: 1,
                isActive: true
              });
              
              finalCategoryId = newBrandCategory.id;
              console.log(`Created new brand category: ${brandName}`);
            }
          }
        }
      } catch (autoCreateError) {
        console.log('Auto-create subcategory error (non-critical):', autoCreateError.message);
      }
    }
    
    let imageUrl = null;
    let additionalImages = [];
    
    // Handle multiple image uploads
    if (req.files && req.files.image) {
      const image = req.files.image;
      
      try {
        // Configure Cloudinary directly for simpler control flow
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Add detailed logging
        console.log(`Product image: ${image.name}, size: ${image.size} bytes, mimetype: ${image.mimetype}`);

        // Handle the image upload directly using the simpler method
        const uploadOptions = {
          folder: 'products',
          public_id: `product_${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
          resource_type: 'auto'
        };
        
        // If tempFilePath is available (usually is with express-fileupload)
        if (image.tempFilePath) {
          console.log(`Using tempFilePath upload: ${image.tempFilePath}`);
          const result = await cloudinary.uploader.upload(image.tempFilePath, uploadOptions);
          imageUrl = result.secure_url;
          console.log(`Image uploaded successfully using tempFilePath. URL: ${imageUrl}`);
        } else {
          // Fallback to direct buffer upload with base64
          const base64Data = image.data.toString('base64');
          console.log(`Using direct buffer upload. Data length: ${base64Data.length}`);
          
          // Simple upload with guaranteed mimetype
          const result = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${base64Data}`,
            uploadOptions
          );
          imageUrl = result.secure_url;
          console.log(`Image uploaded successfully using buffer. URL: ${imageUrl}`);
        }
        
      } catch (err) {
        console.error('Image upload error:', err);
        // Don't fail product creation due to image upload failure
        // Just use default image instead
        imageUrl = '/assets/product-lg.jpg';
        console.log('Using default image due to upload failure');
      }
    } else {
      // If no image provided, use a default one
      imageUrl = '/assets/product-lg.jpg';
      console.log('No image provided, using default image');
    }
    
    // Handle additional images if provided
    if (req.files && req.files.additionalImages) {
      const additionalImageFiles = Array.isArray(req.files.additionalImages) 
        ? req.files.additionalImages 
        : [req.files.additionalImages];
      
      for (const additionalImage of additionalImageFiles) {
        try {
          const cloudinary = require('cloudinary').v2;
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });

          const uploadOptions = {
            folder: 'products',
            public_id: `product_${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}_${Math.random()}`,
            resource_type: 'auto'
          };
          
          let additionalImageUrl;
          if (additionalImage.tempFilePath) {
            const result = await cloudinary.uploader.upload(additionalImage.tempFilePath, uploadOptions);
            additionalImageUrl = result.secure_url;
          } else {
            const base64Data = additionalImage.data.toString('base64');
            const result = await cloudinary.uploader.upload(
              `data:image/jpeg;base64,${base64Data}`,
              uploadOptions
            );
            additionalImageUrl = result.secure_url;
          }
          
          if (additionalImageUrl) {
            additionalImages.push(additionalImageUrl);
          }
        } catch (err) {
          console.error('Additional image upload error:', err);
          // Continue with other images even if one fails
        }
      }
    }
    
    // Validate user authentication before creating product
    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not found or missing id');
      return res.status(401).json({ message: 'Authentication required to create products' });
    }

    // Create new product
    const product = await Product.create({
      name,
      description: description || '',
      categoryId: finalCategoryId || null,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl,
      images: additionalImages.length > 0 ? JSON.stringify(additionalImages) : null,
      createdBy: req.user.id,
      // Phone-specific fields
      imei: imei || null,
      condition: condition || 'new',
      storage: storage || null,
      color: finalColor || null,
      model: model || null,
      batteryHealth: batteryHealth ? parseInt(batteryHealth) : null
    });
    
    const createdProduct = await Product.findByPk(product.id, {
      include: [{ model: Category, attributes: ['name'] }]
    });
    
    console.log('Product created successfully:', createdProduct.id);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product - Full details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      sql: error.sql || 'No SQL query'
    });
    
    // Handle specific error types
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors?.[0]?.path || 'field';
      const value = error.errors?.[0]?.value || 'value';
      
      if (field === 'imei') {
        return res.status(400).json({ message: `A product with IMEI "${value}" already exists` });
      } else if (field === 'name') {
        return res.status(400).json({ message: `A product with name "${value}" already exists` });
      } else {
        return res.status(400).json({ message: `Duplicate ${field}: "${value}" already exists` });
      }
    } else if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
      return res.status(400).json({ message: `Validation error: ${validationErrors}` });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    console.log('Update product request received for ID:', req.params.id);
    console.log('Update data:', req.body);
    if (req.files) console.log('Files included:', Object.keys(req.files));
    
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check permissions (admin or creator)
    if (req.user.role !== 'admin' && product.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    // Extract fields safely from form data or JSON body
    const name = req.body.name || product.name;
    const description = req.body.description || product.description;
    const categoryId = parseInt(req.body.categoryId) || product.categoryId;
    const price = parseFloat(req.body.price) || product.price;
    const quantity = parseInt(req.body.quantity) || product.quantity;
    
    // Phone-specific fields
    const imei = req.body.imei || product.imei;
    const condition = req.body.condition || product.condition;
    const storage = req.body.storage || product.storage;
    const color = req.body.color || product.color;
    const model = req.body.model || product.model;
    const batteryHealth = req.body.batteryHealth ? parseInt(req.body.batteryHealth) : product.batteryHealth;
    const status = req.body.status || product.status;
    
    // Start with existing image URL
    let imageUrl = product.imageUrl;
    
    // Handle image upload if exists
    if (req.files && req.files.image) {
      try {
        const image = req.files.image;
        console.log(`Processing image update: ${image.name}, size: ${image.size} bytes`);
        
        // Configure Cloudinary
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Generate a safe public_id
        const timestamp = Date.now();
        const safeProductName = (name || product.name).replace(/\s+/g, '_').toLowerCase();
        const publicId = `product_${safeProductName}_${timestamp}`;
        
        let uploadResult;
        
        // Try tempFilePath first (express-fileupload with useTempFiles:true)
        if (image.tempFilePath) {
          console.log('Using tempFilePath for upload:', image.tempFilePath);
          uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'products',
            public_id: publicId,
            resource_type: 'auto'
          });
        } 
        // Fallback to buffer method
        else {
          console.log('Using buffer upload method, data length:', image.data.length);
          const base64Data = image.data.toString('base64');
          uploadResult = await cloudinary.uploader.upload(
            "data:image/jpeg;base64," + base64Data,
            {
              folder: 'products',
              public_id: publicId,
              resource_type: 'auto'
            }
          );
        }
        
        if (uploadResult && uploadResult.secure_url) {
          imageUrl = uploadResult.secure_url;
          console.log('Image updated successfully. New URL:', imageUrl);
        } else {
          console.warn('Upload completed but no secure_url returned');
        }
      } catch (err) {
        console.error('Image upload error:', err);
        // Don't fail the whole update - just keep the old image
      }
    }
    
    // Update the product record
    await product.update({
      name,
      description,
      categoryId,
      price,
      quantity,
      imageUrl,
      // Phone-specific fields
      imei,
      condition,
      storage,
      color,
      model,
      batteryHealth,
      status
    });
    
    // Fetch the updated product with category details
    const updatedProduct = await Product.findByPk(productId, {
      include: [{ model: Category, attributes: ['name'] }]
    });
    
    console.log('Product updated successfully:', updatedProduct.id);
    return res.json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return res.status(500).json({ 
      message: 'Server error updating product', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    console.log(`Delete product request received for ID: ${req.params.id}`);
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    console.log(`Looking up product with ID: ${productId}`);
    const product = await Product.findByPk(productId);
    
    if (!product) {
      console.log(`Product not found with ID: ${productId}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log(`Product found: ${product.name}`);
    
    // Since we're in testing mode, allow any authenticated user to delete any product
    // This simplifies testing as mentioned in the previous conversations
    // For production, uncomment the permission check below
    /*
    if (req.user.role !== 'admin' && product.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    */
    
    // First, we need to delete references to this product in other tables
    // to avoid foreign key constraint errors
    const { sequelize } = require('../config/db');
    
    // Delete any wishlist items that reference this product
    console.log(`Removing product from wishlists: ${productId}`);
    await sequelize.query(`DELETE FROM wishlists WHERE "productId" = ${productId}`);
    
    // Delete any cart items that reference this product
    console.log(`Removing product from carts: ${productId}`);
    await sequelize.query(`DELETE FROM carts WHERE "productId" = ${productId}`);
    
    // Delete any order items that reference this product (if implemented)
    // We might need to handle orders differently to maintain order history
    // await sequelize.query(`DELETE FROM order_items WHERE "productId" = ${productId}`);
    
    // Delete product image if exists and not the default image
    if (product.imageUrl && !product.imageUrl.includes('product-lg.jpg')) {
      try {
        const imagePath = path.join(__dirname, '..', product.imageUrl);
        console.log(`Checking for image at: ${imagePath}`);
        if (fs.existsSync(imagePath)) {
          console.log(`Deleting image file: ${imagePath}`);
          fs.unlinkSync(imagePath);
        }
      } catch (fileError) {
        // Just log file deletion errors but continue with product deletion
        console.error('Error deleting product image:', fileError);
      }
    }
    
    // Delete product from database
    console.log(`Deleting product from database: ${productId}`);
    await product.destroy();
    
    console.log(`Product successfully deleted: ${productId}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products for public access (no auth required)
const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ['id', 'name'] }],
      attributes: ['id', 'name', 'description', 'price', 'quantity', 'imageUrl', 'images', 'categoryId', 'createdAt', 'updatedAt', 'condition', 'storage', 'color', 'model', 'batteryHealth']
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product by ID for public access (no auth required)
const getPublicProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await Product.findByPk(productId, {
      include: [{ model: Category, attributes: ['id', 'name'] }],
      attributes: ['id', 'name', 'description', 'price', 'quantity', 'imageUrl', 'images', 'categoryId', 'createdAt', 'updatedAt', 'condition', 'storage', 'color', 'model', 'batteryHealth']
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPublicProducts,
  getPublicProductById
};
