const { Category, Product, sequelize } = require('../config/dbSequelize');

class CategoryReorganizer {
  constructor() {
    this.cleanupReport = {
      duplicatesRemoved: 0,
      productsReassigned: 0,
      categoriesRenamed: 0,
      errors: []
    };
  }

  async init() {
    try {
      await sequelize.authenticate();
      console.log('🔗 Database connection established');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async cleanupDuplicates() {
    console.log('\n🧹 Cleaning up duplicate categories...');
    
    // Handle Accessories/Accessoires duplication
    const accessories1 = await Category.findOne({ where: { name: 'Accessoires' } });
    const accessories2 = await Category.findOne({ where: { name: 'Accessories' } });
    
    if (accessories1 && accessories2) {
      console.log('   🔍 Found duplicate Accessories categories');
      
      // Move all products from old to new
      const products = await Product.findAll({ where: { categoryId: accessories1.id } });
      for (const product of products) {
        await product.update({ categoryId: accessories2.id });
        this.cleanupReport.productsReassigned++;
      }
      
      // Move all subcategories from old to new
      const subcats = await Category.findAll({ where: { parentId: accessories1.id } });
      for (const subcat of subcats) {
        await subcat.update({ parentId: accessories2.id });
      }
      
      // Delete the old one
      await accessories1.destroy();
      console.log('   ✅ Merged Accessoires into Accessories');
      this.cleanupReport.duplicatesRemoved++;
    }
    
    // Handle Laptop/Laptops duplication
    const laptop1 = await Category.findOne({ where: { name: 'Laptop' } });
    const laptop2 = await Category.findOne({ where: { name: 'Laptops' } });
    
    if (laptop1 && laptop2) {
      console.log('   🔍 Found duplicate Laptop categories');
      
      // Move all products from Laptop to Laptops
      const products = await Product.findAll({ where: { categoryId: laptop1.id } });
      for (const product of products) {
        await product.update({ categoryId: laptop2.id });
        this.cleanupReport.productsReassigned++;
      }
      
      // Move all subcategories from Laptop to Laptops
      const subcats = await Category.findAll({ where: { parentId: laptop1.id } });
      for (const subcat of subcats) {
        await subcat.update({ parentId: laptop2.id });
      }
      
      // Delete the old one
      await laptop1.destroy();
      console.log('   ✅ Merged Laptop into Laptops');
      this.cleanupReport.duplicatesRemoved++;
    }
  }

  async reorganizeByBrand() {
    console.log('\n🗂️ Reorganizing brands under correct main categories...');
    
    // Get main categories
    const smartphones = await Category.findOne({ where: { name: 'Smartphones', parentId: null } });
    const laptops = await Category.findOne({ where: { name: 'Laptops', parentId: null } });
    const tablets = await Category.findOne({ where: { name: 'Tablets', parentId: null } });
    const smartwatches = await Category.findOne({ where: { name: 'Smartwatches', parentId: null } });
    const accessories = await Category.findOne({ where: { name: 'Accessories', parentId: null } });
    
    // Define brand mappings
    const brandMappings = {
      // Smartphone brands
      'Apple': smartphones?.id,
      'Samsung': smartphones?.id,
      'Huawei': smartphones?.id,
      'Google': smartphones?.id,
      'OnePlus': smartphones?.id,
      'Xiaomi': smartphones?.id,
      'Honor': smartphones?.id,
      'Infinix': smartphones?.id,
      'Itel': smartphones?.id,
      'Oppo': smartphones?.id,
      'Realme': smartphones?.id,
      'Vivo': smartphones?.id,
      'Poco': smartphones?.id,
      
      // Tablet brands
      'Apple iPad': tablets?.id,
      'Samsung Galaxy Tab': tablets?.id,
      'Huawei MatePad': tablets?.id,
      'Lenovo Tab': tablets?.id,
      'Microsoft Surface': tablets?.id,
      
      // Laptop brands
      'Apple MacBook': laptops?.id,
      'HP': laptops?.id,
      'Dell': laptops?.id,
      'Asus': laptops?.id,
      'Lenovo': laptops?.id,
      'Acer': laptops?.id,
      'Samsung Laptop': laptops?.id,
      
      // Smartwatch brands
      'Apple Smartwatches': smartwatches?.id,
      'Samsung Smartwatches': smartwatches?.id,
      'Huawei Smartwatches': smartwatches?.id,
      'Xiaomi Smartwatches': smartwatches?.id,
      'Amazfit Smartwatches': smartwatches?.id,
      
      // Accessories
      'Airpods': accessories?.id,
      'Chargeur': accessories?.id,
      'Chargeurs': accessories?.id,
      'Wireless Charger': accessories?.id
    };
    
    // Update each brand
    for (const [brandName, correctParentId] of Object.entries(brandMappings)) {
      if (!correctParentId) continue;
      
      const brand = await Category.findOne({ where: { name: brandName } });
      if (brand && brand.parentId !== correctParentId) {
        await brand.update({ parentId: correctParentId, level: 1 });
        console.log(`   ✅ Moved ${brandName} to correct parent category`);
        this.cleanupReport.categoriesRenamed++;
      }
    }
  }

  async fixCategoryLevels() {
    console.log('\n📊 Fixing category levels...');
    
    // Set main categories to level 0
    const mainCategories = await Category.findAll({ where: { parentId: null } });
    for (const cat of mainCategories) {
      if (cat.level !== 0) {
        await cat.update({ level: 0 });
        console.log(`   ✅ Set ${cat.name} to level 0`);
      }
    }
    
    // Set subcategories to level 1
    const subcategories = await Category.findAll({ where: { parentId: { [sequelize.Sequelize.Op.not]: null } } });
    for (const cat of subcategories) {
      if (cat.level !== 1) {
        await cat.update({ level: 1 });
        console.log(`   ✅ Set ${cat.name} to level 1`);
      }
    }
  }

  async removeEmptyCategories() {
    console.log('\n🗑️ Removing empty categories...');
    
    const allCategories = await Category.findAll();
    
    for (const category of allCategories) {
      // Check if category has products
      const productCount = await Product.count({ where: { categoryId: category.id } });
      
      // Check if it's a parent category (has subcategories)
      const childCount = await Category.count({ where: { parentId: category.id } });
      
      // Don't delete main structural categories or categories with content
      const keepCategories = [
        'Smartphones', 'Tablets', 'Laptops', 'Smartwatches', 'Accessories',
        'Affaire du jour', "Brother's Packs", 'Livraison Gratuite', 'Occasions'
      ];
      
      if (productCount === 0 && childCount === 0 && !keepCategories.includes(category.name)) {
        console.log(`   🗑️ Deleting empty category: ${category.name}`);
        await category.destroy();
        this.cleanupReport.duplicatesRemoved++;
      }
    }
  }

  generateReport() {
    console.log('\n📊 Reorganization Report:');
    console.log('═'.repeat(50));
    console.log(`🗑️ Duplicates removed: ${this.cleanupReport.duplicatesRemoved}`);
    console.log(`📦 Products reassigned: ${this.cleanupReport.productsReassigned}`);
    console.log(`🏷️ Categories reorganized: ${this.cleanupReport.categoriesRenamed}`);
    console.log(`❌ Errors: ${this.cleanupReport.errors.length}`);
    
    if (this.cleanupReport.errors.length > 0) {
      console.log('\n🚨 Errors encountered:');
      this.cleanupReport.errors.forEach(error => console.log(`   - ${error}`));
    }
  }

  async showFinalStructure() {
    console.log('\n🎯 Final Category Structure:');
    console.log('═'.repeat(50));
    
    const mainCategories = await Category.findAll({ 
      where: { parentId: null },
      order: [['name', 'ASC']]
    });
    
    for (const mainCat of mainCategories) {
      const subcats = await Category.findAll({
        where: { parentId: mainCat.id },
        order: [['name', 'ASC']]
      });
      
      const productCount = await Product.count({ where: { categoryId: mainCat.id } });
      const totalProducts = await Product.count({
        include: [{
          model: Category,
          where: {
            [sequelize.Sequelize.Op.or]: [
              { id: mainCat.id },
              { parentId: mainCat.id }
            ]
          }
        }]
      });
      
      console.log(`📂 ${mainCat.name} (${totalProducts} products)`);
      
      for (const subcat of subcats) {
        const subProductCount = await Product.count({ where: { categoryId: subcat.id } });
        console.log(`   └─ ${subcat.name} (${subProductCount} products)`);
      }
      
      if (subcats.length === 0 && productCount > 0) {
        console.log(`   └─ ${productCount} direct products`);
      }
      
      console.log();
    }
  }

  async run() {
    try {
      console.log('🚀 Starting category reorganization...');
      
      await this.init();
      await this.cleanupDuplicates();
      await this.reorganizeByBrand();
      await this.fixCategoryLevels();
      await this.removeEmptyCategories();
      
      this.generateReport();
      await this.showFinalStructure();
      
      console.log('\n✅ Category reorganization completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Reorganization failed:', error);
      this.cleanupReport.errors.push(error.message);
      this.generateReport();
      process.exit(1);
    }
  }
}

// Run the reorganization
if (require.main === module) {
  const reorganizer = new CategoryReorganizer();
  reorganizer.run();
}

module.exports = CategoryReorganizer;
