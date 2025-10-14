const { Category, Product, sequelize } = require('../config/dbSequelize');

// Intelligent category structure based on Brothers Phone website
const intelligentCategoryStructure = {
  // Main Categories
  mainCategories: [
    { name: 'Smartphones', description: 'Mobile phones and smartphones' },
    { name: 'Tablets', description: 'Tablets and iPads' },
    { name: 'Laptops', description: 'Laptops and notebooks' },
    { name: 'Smartwatches', description: 'Smart watches and wearables' },
    { name: 'Accessories', description: 'Phone and tech accessories' },
    { name: 'Occasions', description: 'Used and refurbished devices' }
  ],
  
  // Subcategories with proper parent mapping
  subcategories: {
    'Smartphones': [
      'Apple', 'Samsung', 'Huawei', 'Google', 'OnePlus', 'Xiaomi', 
      'Oppo', 'Realme', 'Vivo', 'Honor', 'Infinix', 'Itel', 'Poco'
    ],
    'Tablets': [
      'Apple iPad', 'Samsung Galaxy Tab', 'Huawei MatePad', 'Lenovo Tab', 
      'Microsoft Surface'
    ],
    'Laptops': [
      'Apple MacBook', 'HP', 'Dell', 'Asus', 'Lenovo', 'Acer', 'Samsung Laptop'
    ],
    'Smartwatches': [
      'Apple Smartwatches', 'Samsung Smartwatches', 'Huawei Smartwatches', 
      'Xiaomi Smartwatches', 'Amazfit Smartwatches'
    ],
    'Accessories': [
      'Airpods', 'Chargeurs', 'Câbles', 'Adaptateurs', 'Power Bank', 
      'Chargeur laptop', 'Support', 'Pochettes', 'Baffles', 'Caméras', 
      'Glasses', 'Kitman', 'Wireless Charger'
    ]
  },
  
  // Special categories that don't need subcategories
  specialCategories: [
    { name: 'Affaire du jour', description: 'Daily deals and special offers' },
    { name: "Brother's Packs", description: 'Bundled products and packages' },
    { name: 'Livraison Gratuite', description: 'Free delivery products' }
  ]
};

class IntelligentCategoryRestructurer {
  constructor() {
    this.mainCategoryMap = new Map();
    this.subcategoryMap = new Map();
    this.migrationReport = {
      categoriesCreated: 0,
      categoriesUpdated: 0,
      productsMigrated: 0,
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

  async backupExistingData() {
    console.log('\n📋 Creating backup of existing data...');
    
    const existingCategories = await Category.findAll();
    const existingProducts = await Product.findAll();
    
    console.log(`   📂 Found ${existingCategories.length} existing categories`);
    console.log(`   📦 Found ${existingProducts.length} existing products`);
    
    return {
      categories: existingCategories,
      products: existingProducts
    };
  }

  async createMainCategories() {
    console.log('\n🗂️ Creating main categories...');
    
    for (const mainCat of intelligentCategoryStructure.mainCategories) {
      try {
        const [category, created] = await Category.findOrCreate({
          where: { name: mainCat.name, parentId: null },
          defaults: {
            name: mainCat.name,
            description: mainCat.description,
            level: 0,
            isActive: true,
            parentId: null
          }
        });
        
        this.mainCategoryMap.set(mainCat.name, category);
        
        if (created) {
          console.log(`   ✅ Created main category: ${mainCat.name}`);
          this.migrationReport.categoriesCreated++;
        } else {
          console.log(`   ♻️  Updated main category: ${mainCat.name}`);
          this.migrationReport.categoriesUpdated++;
        }
      } catch (error) {
        console.error(`   ❌ Error creating main category ${mainCat.name}:`, error);
        this.migrationReport.errors.push(`Main category ${mainCat.name}: ${error.message}`);
      }
    }
  }

  async createSubcategories() {
    console.log('\n📁 Creating subcategories...');
    
    for (const [mainCatName, subcats] of Object.entries(intelligentCategoryStructure.subcategories)) {
      const mainCategory = this.mainCategoryMap.get(mainCatName);
      
      if (!mainCategory) {
        console.error(`   ❌ Main category ${mainCatName} not found`);
        continue;
      }
      
      console.log(`   📂 Processing ${mainCatName} subcategories...`);
      
      for (const subcatName of subcats) {
        try {
          const [subcategory, created] = await Category.findOrCreate({
            where: { name: subcatName, parentId: mainCategory.id },
            defaults: {
              name: subcatName,
              description: `${subcatName} products`,
              level: 1,
              isActive: true,
              parentId: mainCategory.id
            }
          });
          
          this.subcategoryMap.set(subcatName, subcategory);
          
          if (created) {
            console.log(`      ✅ Created subcategory: ${subcatName}`);
            this.migrationReport.categoriesCreated++;
          } else {
            console.log(`      ♻️  Updated subcategory: ${subcatName}`);
            this.migrationReport.categoriesUpdated++;
          }
        } catch (error) {
          console.error(`      ❌ Error creating subcategory ${subcatName}:`, error);
          this.migrationReport.errors.push(`Subcategory ${subcatName}: ${error.message}`);
        }
      }
    }
  }

  async createSpecialCategories() {
    console.log('\n⭐ Creating special categories...');
    
    for (const specialCat of intelligentCategoryStructure.specialCategories) {
      try {
        const [category, created] = await Category.findOrCreate({
          where: { name: specialCat.name, parentId: null },
          defaults: {
            name: specialCat.name,
            description: specialCat.description,
            level: 0,
            isActive: true,
            parentId: null
          }
        });
        
        if (created) {
          console.log(`   ✅ Created special category: ${specialCat.name}`);
          this.migrationReport.categoriesCreated++;
        } else {
          console.log(`   ♻️  Updated special category: ${specialCat.name}`);
          this.migrationReport.categoriesUpdated++;
        }
      } catch (error) {
        console.error(`   ❌ Error creating special category ${specialCat.name}:`, error);
        this.migrationReport.errors.push(`Special category ${specialCat.name}: ${error.message}`);
      }
    }
  }

  async migrateProducts() {
    console.log('\n📦 Migrating existing products to new structure...');
    
    const products = await Product.findAll({
      include: [{ model: Category, required: false }]
    });
    
    for (const product of products) {
      try {
        let targetCategoryId = null;
        const productName = product.name.toLowerCase();
        
        // Smart category detection based on product name
        if (productName.includes('iphone') || productName.includes('ipad')) {
          targetCategoryId = this.subcategoryMap.get(productName.includes('ipad') ? 'Apple iPad' : 'Apple')?.id;
        } else if (productName.includes('samsung')) {
          if (productName.includes('tab')) {
            targetCategoryId = this.subcategoryMap.get('Samsung Galaxy Tab')?.id;
          } else {
            targetCategoryId = this.subcategoryMap.get('Samsung')?.id;
          }
        } else if (productName.includes('huawei')) {
          if (productName.includes('matepad')) {
            targetCategoryId = this.subcategoryMap.get('Huawei MatePad')?.id;
          } else if (productName.includes('watch')) {
            targetCategoryId = this.subcategoryMap.get('Huawei Smartwatches')?.id;
          } else {
            targetCategoryId = this.subcategoryMap.get('Huawei')?.id;
          }
        } else if (productName.includes('macbook')) {
          targetCategoryId = this.subcategoryMap.get('Apple MacBook')?.id;
        } else if (productName.includes('dell')) {
          targetCategoryId = this.subcategoryMap.get('Dell')?.id;
        } else if (productName.includes('hp')) {
          targetCategoryId = this.subcategoryMap.get('HP')?.id;
        } else if (productName.includes('google') || productName.includes('pixel')) {
          targetCategoryId = this.subcategoryMap.get('Google')?.id;
        } else if (productName.includes('xiaomi')) {
          targetCategoryId = this.subcategoryMap.get('Xiaomi')?.id;
        } else if (productName.includes('oneplus')) {
          targetCategoryId = this.subcategoryMap.get('OnePlus')?.id;
        }
        
        if (targetCategoryId && targetCategoryId !== product.categoryId) {
          await product.update({ categoryId: targetCategoryId });
          console.log(`   ✅ Migrated "${product.name}" to new category`);
          this.migrationReport.productsMigrated++;
        }
      } catch (error) {
        console.error(`   ❌ Error migrating product ${product.name}:`, error);
        this.migrationReport.errors.push(`Product ${product.name}: ${error.message}`);
      }
    }
  }

  async cleanupOldCategories() {
    console.log('\n🧹 Cleaning up unused categories...');
    
    const allCategories = await Category.findAll();
    let deletedCount = 0;
    
    for (const category of allCategories) {
      // Check if category has products
      const productCount = await Product.count({ where: { categoryId: category.id } });
      
      // Check if it's a parent category
      const childCount = await Category.count({ where: { parentId: category.id } });
      
      // If no products and no children, and not in our new structure, consider for deletion
      if (productCount === 0 && childCount === 0) {
        const isInNewStructure = 
          this.mainCategoryMap.has(category.name) || 
          this.subcategoryMap.has(category.name) ||
          intelligentCategoryStructure.specialCategories.some(special => special.name === category.name);
        
        if (!isInNewStructure) {
          console.log(`   🗑️  Deleting unused category: ${category.name}`);
          await category.destroy();
          deletedCount++;
        }
      }
    }
    
    console.log(`   ✅ Deleted ${deletedCount} unused categories`);
  }

  generateReport() {
    console.log('\n📊 Migration Report:');
    console.log('═'.repeat(50));
    console.log(`📁 Categories created: ${this.migrationReport.categoriesCreated}`);
    console.log(`♻️  Categories updated: ${this.migrationReport.categoriesUpdated}`);
    console.log(`📦 Products migrated: ${this.migrationReport.productsMigrated}`);
    console.log(`❌ Errors: ${this.migrationReport.errors.length}`);
    
    if (this.migrationReport.errors.length > 0) {
      console.log('\n🚨 Errors encountered:');
      this.migrationReport.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n🎯 New Category Structure:');
    intelligentCategoryStructure.mainCategories.forEach(mainCat => {
      console.log(`📂 ${mainCat.name}`);
      const subcats = intelligentCategoryStructure.subcategories[mainCat.name] || [];
      subcats.forEach(subcat => {
        console.log(`   └─ ${subcat}`);
      });
    });
  }

  async run() {
    try {
      console.log('🚀 Starting intelligent category restructuring...');
      
      await this.init();
      await this.backupExistingData();
      await this.createMainCategories();
      await this.createSubcategories();
      await this.createSpecialCategories();
      await this.migrateProducts();
      await this.cleanupOldCategories();
      
      this.generateReport();
      
      console.log('\n✅ Category restructuring completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    }
  }
}

// Run the restructuring
if (require.main === module) {
  const restructurer = new IntelligentCategoryRestructurer();
  restructurer.run();
}

module.exports = IntelligentCategoryRestructurer;
