require('dotenv').config();
const { Product, Category, User, sequelize } = require('../config/dbSequelize');

async function addSampleProducts() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Find the admin user to assign as product creator
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.error('No admin user found! Please create an admin user first.');
      return;
    }
    
    // Sample products for different subcategories
    const sampleProducts = [
      // iPhone products (Apple subcategory)
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
        price: 1199.99,
        quantity: 25,
        subcategoryName: 'Apple'
      },
      {
        name: 'iPhone 15',
        description: 'The new iPhone 15 with USB-C, 48MP main camera, and Dynamic Island.',
        price: 799.99,
        quantity: 30,
        subcategoryName: 'Apple'
      },
      
      // Samsung products
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Samsung flagship with S Pen, advanced AI features, and 200MP camera.',
        price: 1299.99,
        quantity: 20,
        subcategoryName: 'Samsung'
      },
      {
        name: 'Samsung Galaxy A54',
        description: 'Mid-range Samsung phone with great camera and long battery life.',
        price: 449.99,
        quantity: 40,
        subcategoryName: 'Samsung'
      },
      
      // Xiaomi products  
      {
        name: 'Xiaomi 14 Pro',
        description: 'Flagship Xiaomi phone with Snapdragon 8 Gen 3 and Leica cameras.',
        price: 899.99,
        quantity: 15,
        subcategoryName: 'Xiaomi'
      },
      
      // Google products
      {
        name: 'Google Pixel 8 Pro',
        description: 'Google\'s flagship with advanced AI photography and Magic Eraser.',
        price: 999.99,
        quantity: 18,
        subcategoryName: 'Google'
      },
      
      // OnePlus products
      {
        name: 'OnePlus 12',
        description: 'Fast charging flagship with OxygenOS and flagship performance.',
        price: 799.99,
        quantity: 22,
        subcategoryName: 'One plus'
      },
      
      // Products for other main categories
      {
        name: 'Apple Watch Series 9',
        description: 'Latest Apple smartwatch with health monitoring and fitness tracking.',
        price: 399.99,
        quantity: 35,
        mainCategoryName: 'Smartwatches'
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Professional laptop with M3 chip for developers and creators.',
        price: 1999.99,
        quantity: 12,
        mainCategoryName: 'Laptop'
      },
      {
        name: 'iPad Air',
        description: 'Powerful tablet perfect for productivity and creativity.',
        price: 599.99,
        quantity: 28,
        mainCategoryName: 'Tablets'
      }
    ];
    
    console.log('Adding sample products...');
    
    for (const productData of sampleProducts) {
      try {
        let categoryId;
        
        if (productData.subcategoryName) {
          // Find subcategory
          const subcategory = await Category.findOne({ 
            where: { name: productData.subcategoryName, level: 1 } 
          });
          if (!subcategory) {
            console.log(`⚠️  Subcategory "${productData.subcategoryName}" not found, skipping ${productData.name}`);
            continue;
          }
          categoryId = subcategory.id;
        } else if (productData.mainCategoryName) {
          // Find main category
          const mainCategory = await Category.findOne({ 
            where: { name: productData.mainCategoryName, level: 0 } 
          });
          if (!mainCategory) {
            console.log(`⚠️  Main category "${productData.mainCategoryName}" not found, skipping ${productData.name}`);
            continue;
          }
          categoryId = mainCategory.id;
        }
        
        // Check if product already exists
        const existingProduct = await Product.findOne({ 
          where: { name: productData.name } 
        });
        
        if (existingProduct) {
          console.log(`✓ Product "${productData.name}" already exists`);
        } else {
          // Create new product
          await Product.create({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            quantity: productData.quantity,
            categoryId: categoryId,
            createdBy: adminUser.id,
            imageUrl: null // Will be added manually through the UI
          });
          console.log(`✅ Added product: "${productData.name}"`);
        }
      } catch (error) {
        console.error(`❌ Error adding product "${productData.name}":`, error.message);
      }
    }
    
    // Display summary
    console.log('\n📊 Product Summary:');
    const categories = await Category.findAll({
      where: { level: 0 },
      include: [{
        model: Category,
        as: 'subcategories',
        required: false
      }],
      order: [['name', 'ASC']]
    });
    
    for (const category of categories) {
      const mainCategoryProducts = await Product.count({ where: { categoryId: category.id } });
      console.log(`\n📁 ${category.name}: ${mainCategoryProducts} products`);
      
      if (category.subcategories && category.subcategories.length > 0) {
        for (const subcategory of category.subcategories) {
          const subProducts = await Product.count({ where: { categoryId: subcategory.id } });
          console.log(`   ├── ${subcategory.name}: ${subProducts} products`);
        }
      }
    }
    
    const totalProducts = await Product.count();
    console.log(`\n✅ Total products in database: ${totalProducts}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
addSampleProducts();
