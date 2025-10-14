const { Category, Product, sequelize } = require('../config/dbSequelize');

class FinalCategorySetup {
  constructor() {
    this.report = {
      categoriesDeleted: 0,
      categoriesCreated: 0,
      productsReassigned: 0,
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

  async clearAllCategories() {
    console.log('\n🧹 Clearing ALL existing categories...');
    
    try {
      // First, set all products to null category
      await Product.update({ categoryId: null }, { where: {} });
      console.log('   📦 Cleared category assignments from all products');
      
      // Delete all categories
      const deletedCount = await Category.destroy({ where: {} });
      console.log(`   🗑️ Deleted ${deletedCount} existing categories`);
      this.report.categoriesDeleted = deletedCount;
      
    } catch (error) {
      console.error('   ❌ Error clearing categories:', error);
      this.report.errors.push(`Clear categories: ${error.message}`);
    }
  }

  async createFinalCategoryStructure() {
    console.log('\n🏗️ Creating final category structure from Brothers Phone website...');
    
    // Main categories in exact order from website
    const mainCategories = [
      { name: 'Occasions', description: 'Used phones with battery health tracking' },
      { name: 'Smartphones', description: 'New smartphones from all brands' },
      { name: 'Smartwatches', description: 'Smart watches and wearables' },
      { name: 'Tablets', description: 'Tablets and iPads' },
      { name: 'Laptop', description: 'Laptops and notebooks' },
      { name: 'Affaire du jour', description: 'Daily deals and special offers' },
      { name: 'Accessoires', description: 'Phone and tech accessories' },
      { name: "Brother's Packs", description: 'Bundled products and packages' },
      { name: 'Livraison Gratuite', description: 'Free delivery products' }
    ];

    // Subcategories for each main category
    const subcategories = {
      'Smartphones': [
        'Apple', 'Vivo', 'Samsung', 'Google', 'Huawei', 'Oppo', 
        'Realme', 'Xiaomi', 'One plus', 'Poco'
      ],
      'Smartwatches': [
        'Huawei Smartwatches', 'Xiaomi Smartwatches', 'Amazfit Smartwatches',
        'Apple Smartwatches', 'Samsung Smartwatches', 'Autre marque'
      ],
      'Tablets': [
        'IPAD', 'SAMSUNG', 'HUIAWEI'
      ],
      'Laptop': [
        'Dell', 'Acer', 'HP', 'Asus', 'Lenovo'
      ],
      'Accessoires': [
        'Support', 'Adaptateurs', 'Airpods', 'Baffles', 'Câbles', 'Caméras',
        'Chargeur', 'Chargeur laptop', 'Glasses', 'Kitman', 'Pochettes', 'Power Bank'
      ]
      // Note: Occasions, Affaire du jour, Brother's Packs, Livraison Gratuite have no subcategories
    };

    // Create main categories
    const createdMainCategories = {};
    
    for (const mainCat of mainCategories) {
      try {
        const category = await Category.create({
          name: mainCat.name,
          description: mainCat.description,
          parentId: null,
          level: 0,
          isActive: true
        });
        
        createdMainCategories[mainCat.name] = category;
        console.log(`   ✅ Created main category: ${mainCat.name}`);
        this.report.categoriesCreated++;
        
      } catch (error) {
        console.error(`   ❌ Error creating main category ${mainCat.name}:`, error.message);
        this.report.errors.push(`Main category ${mainCat.name}: ${error.message}`);
      }
    }

    // Create subcategories
    for (const [mainCatName, subCatNames] of Object.entries(subcategories)) {
      const mainCategory = createdMainCategories[mainCatName];
      
      if (!mainCategory) {
        console.error(`   ❌ Main category ${mainCatName} not found for subcategories`);
        continue;
      }
      
      console.log(`   📂 Creating subcategories for ${mainCatName}...`);
      
      for (const subCatName of subCatNames) {
        try {
          await Category.create({
            name: subCatName,
            description: `${subCatName} products`,
            parentId: mainCategory.id,
            level: 1,
            isActive: true
          });
          
          console.log(`      └─ ${subCatName}`);
          this.report.categoriesCreated++;
          
        } catch (error) {
          console.error(`      ❌ Error creating subcategory ${subCatName}:`, error.message);
          this.report.errors.push(`Subcategory ${subCatName}: ${error.message}`);
        }
      }
    }
  }

  async showFinalStructure() {
    console.log('\n🎯 Final Category Structure (Exact Brothers Phone Layout):');
    console.log('═'.repeat(60));
    
    const mainCategories = await Category.findAll({ 
      where: { parentId: null },
      order: [['id', 'ASC']] // Keep creation order
    });
    
    for (const mainCat of mainCategories) {
      const subcats = await Category.findAll({
        where: { parentId: mainCat.id },
        order: [['id', 'ASC']]
      });
      
      let specialNote = '';
      if (mainCat.name === 'Occasions') {
        specialNote = ' 🔋 (Used phones with battery health)';
      } else if (mainCat.name === 'Affaire du jour') {
        specialNote = ' 💰 (Daily deals)';
      } else if (mainCat.name === "Brother's Packs") {
        specialNote = ' 📦 (Product bundles)';
      } else if (mainCat.name === 'Livraison Gratuite') {
        specialNote = ' 🚚 (Free delivery)';
      }
      
      console.log(`📂 ${mainCat.name}${specialNote}`);
      
      if (subcats.length > 0) {
        subcats.forEach(subcat => {
          let emoji = '└─';
          if (subcat.name.includes('Apple')) emoji = '└─ 🍎';
          else if (subcat.name.includes('Samsung')) emoji = '└─ 📱';
          else if (subcat.name.includes('Huawei')) emoji = '└─ 🌟';
          console.log(`   ${emoji} ${subcat.name}`);
        });
      } else {
        console.log(`   └─ (Direct products)`);
      }
      
      console.log();
    }
  }

  generateReport() {
    console.log('\n📊 Final Category Setup Report:');
    console.log('═'.repeat(50));
    console.log(`🗑️ Old categories deleted: ${this.report.categoriesDeleted}`);
    console.log(`✅ New categories created: ${this.report.categoriesCreated}`);
    console.log(`❌ Errors: ${this.report.errors.length}`);
    
    if (this.report.errors.length > 0) {
      console.log('\n🚨 Errors encountered:');
      this.report.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n✨ Special Features:');
    console.log('   🔋 Occasions: Used phones with battery health tracking');
    console.log('   📱 Smartphones: All major brands organized');
    console.log('   ⌚ Smartwatches: Brand-specific organization');
    console.log('   💻 Tablets & Laptops: Clean brand separation');
    console.log('   🔌 Accessoires: Complete accessory types');
  }

  async run() {
    try {
      console.log('🚀 Starting FINAL category setup (Brothers Phone exact structure)...');
      
      await this.init();
      await this.clearAllCategories();
      await this.createFinalCategoryStructure();
      
      this.generateReport();
      await this.showFinalStructure();
      
      console.log('\n✅ Brothers Phone category structure created successfully!');
      console.log('🔄 Smart Wizard is now ready with clean, organized categories!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Final setup failed:', error);
      this.report.errors.push(error.message);
      this.generateReport();
      process.exit(1);
    }
  }
}

// Run the final setup
if (require.main === module) {
  const setup = new FinalCategorySetup();
  setup.run();
}

module.exports = FinalCategorySetup;
