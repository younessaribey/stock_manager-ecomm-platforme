const { Category, sequelize } = require('../config/dbSequelize');

class BrandAdder {
  constructor() {
    this.report = {
      brandsAdded: 0,
      brandsUpdated: 0,
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

  async addMissingBrands() {
    console.log('\n📱 Adding missing smartphone brands...');
    
    // Get main categories
    const smartphones = await Category.findOne({ where: { name: 'Smartphones', parentId: null } });
    const tablets = await Category.findOne({ where: { name: 'Tablets', parentId: null } });
    const laptops = await Category.findOne({ where: { name: 'Laptops', parentId: null } });
    const smartwatches = await Category.findOne({ where: { name: 'Smartwatches', parentId: null } });
    const accessories = await Category.findOne({ where: { name: 'Accessories', parentId: null } });
    
    // Essential smartphone brands
    const smartphoneBrands = [
      'Apple',
      'Samsung', // Already exists, will skip
      'Huawei', // Already exists, will skip
      'Google',
      'OnePlus',
      'Xiaomi',
      'Honor', // Already exists, will skip
      'Infinix',
      'Oppo',
      'Realme',
      'Vivo',
      'Poco',
      'Itel'
    ];
    
    // Essential tablet brands
    const tabletBrands = [
      'Apple iPad',
      'Samsung Galaxy Tab', // Already exists
      'Huawei MatePad',
      'Lenovo Tab',
      'Microsoft Surface'
    ];
    
    // Essential laptop brands
    const laptopBrands = [
      'Apple MacBook', // Already exists
      'HP',
      'Dell', // Already exists
      'Asus',
      'Lenovo',
      'Acer',
      'MSI'
    ];
    
    // Essential smartwatch brands
    const smartwatchBrands = [
      'Apple Watch',
      'Samsung Galaxy Watch',
      'Huawei Watch',
      'Xiaomi Mi Watch',
      'Amazfit'
    ];
    
    // Essential accessory types
    const accessoryTypes = [
      'AirPods',
      'Chargeurs', // Already exists
      'Cables',
      'Power Banks',
      'Cases & Covers',
      'Screen Protectors',
      'Wireless Chargers'
    ];
    
    // Add smartphone brands
    if (smartphones) {
      for (const brandName of smartphoneBrands) {
        await this.addBrandIfNotExists(brandName, smartphones.id, 'smartphone');
      }
    }
    
    // Add tablet brands
    if (tablets) {
      for (const brandName of tabletBrands) {
        await this.addBrandIfNotExists(brandName, tablets.id, 'tablet');
      }
    }
    
    // Add laptop brands
    if (laptops) {
      for (const brandName of laptopBrands) {
        await this.addBrandIfNotExists(brandName, laptops.id, 'laptop');
      }
    }
    
    // Add smartwatch brands
    if (smartwatches) {
      for (const brandName of smartwatchBrands) {
        await this.addBrandIfNotExists(brandName, smartwatches.id, 'smartwatch');
      }
    }
    
    // Add accessory types
    if (accessories) {
      for (const brandName of accessoryTypes) {
        await this.addBrandIfNotExists(brandName, accessories.id, 'accessory');
      }
    }
  }
  
  async addBrandIfNotExists(brandName, parentId, type) {
    try {
      const existing = await Category.findOne({ 
        where: { name: brandName, parentId: parentId } 
      });
      
      if (existing) {
        console.log(`   ♻️  ${brandName} already exists`);
        return existing;
      }
      
      const newBrand = await Category.create({
        name: brandName,
        description: `${brandName} products`,
        parentId: parentId,
        level: 1,
        isActive: true
      });
      
      console.log(`   ✅ Added ${brandName} (${type})`);
      this.report.brandsAdded++;
      return newBrand;
      
    } catch (error) {
      console.error(`   ❌ Error adding ${brandName}:`, error.message);
      this.report.errors.push(`${brandName}: ${error.message}`);
    }
  }

  async showCurrentStructure() {
    console.log('\n🎯 Updated Category Structure:');
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
      
      console.log(`📂 ${mainCat.name} (${subcats.length} brands)`);
      
      subcats.forEach(subcat => {
        console.log(`   └─ ${subcat.name}`);
      });
      
      console.log();
    }
  }

  generateReport() {
    console.log('\n📊 Brand Addition Report:');
    console.log('═'.repeat(50));
    console.log(`✅ Brands added: ${this.report.brandsAdded}`);
    console.log(`♻️  Brands updated: ${this.report.brandsUpdated}`);
    console.log(`❌ Errors: ${this.report.errors.length}`);
    
    if (this.report.errors.length > 0) {
      console.log('\n🚨 Errors encountered:');
      this.report.errors.forEach(error => console.log(`   - ${error}`));
    }
  }

  async run() {
    try {
      console.log('🚀 Starting to add missing brands...');
      
      await this.init();
      await this.addMissingBrands();
      
      this.generateReport();
      await this.showCurrentStructure();
      
      console.log('\n✅ Missing brands added successfully!');
      console.log('🔄 Please refresh your smart wizard to see all brands.');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Adding brands failed:', error);
      this.report.errors.push(error.message);
      this.generateReport();
      process.exit(1);
    }
  }
}

// Run the brand addition
if (require.main === module) {
  const brandAdder = new BrandAdder();
  brandAdder.run();
}

module.exports = BrandAdder;
