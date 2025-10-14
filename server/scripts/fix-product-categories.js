const { Product, Category } = require('../config/dbSequelize');

const fixProductCategories = async () => {
  try {
    console.log('🔧 Starting product category assignment...');
    
    // Get all products and categories
    const products = await Product.findAll();
    const categories = await Category.findAll();
    
    console.log(`📦 Found ${products.length} products`);
    console.log(`📂 Found ${categories.length} categories`);
    
    // Create category mapping for easy lookup
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat.id;
    });
    
    console.log('📋 Available categories:', Object.keys(categoryMap));
    
    let updated = 0;
    
    for (const product of products) {
      if (product.categoryId) {
        console.log(`✅ ${product.name} already has categoryId: ${product.categoryId}`);
        continue;
      }
      
      let assignedCategoryId = null;
      const name = product.name.toLowerCase();
      const model = (product.model || '').toLowerCase();
      
      // Smart category assignment based on product name and model
      if (name.includes('iphone') || model.includes('iphone') || name.includes('ipad') || model.includes('ipad') || name.includes('macbook') || model.includes('macbook')) {
        assignedCategoryId = categoryMap['apple'];
      } else if (name.includes('samsung') || model.includes('samsung') || name.includes('galaxy') || model.includes('galaxy')) {
        assignedCategoryId = categoryMap['samsung'];
      } else if (name.includes('huawei') || model.includes('huawei') || name.includes('honor') || model.includes('honor')) {
        assignedCategoryId = categoryMap['huawei'];
      } else if (name.includes('xiaomi') || model.includes('xiaomi') || name.includes('poco') || model.includes('poco')) {
        assignedCategoryId = categoryMap['xiaomi'];
      } else if (name.includes('oneplus') || model.includes('oneplus') || name.includes('one plus')) {
        assignedCategoryId = categoryMap['one plus'];
      } else if (name.includes('oppo') || model.includes('oppo')) {
        assignedCategoryId = categoryMap['oppo'];
      } else if (name.includes('vivo') || model.includes('vivo')) {
        assignedCategoryId = categoryMap['vivo'];
      } else if (name.includes('realme') || model.includes('realme')) {
        assignedCategoryId = categoryMap['realme'];
      } else if (name.includes('google') || model.includes('google') || name.includes('pixel') || model.includes('pixel')) {
        assignedCategoryId = categoryMap['google'];
      } else if (name.includes('dell') || model.includes('dell')) {
        assignedCategoryId = categoryMap['dell'];
      } else if (name.includes('hp') || model.includes('hp')) {
        assignedCategoryId = categoryMap['hp'];
      } else if (name.includes('lenovo') || model.includes('lenovo')) {
        assignedCategoryId = categoryMap['lenovo'];
      } else if (name.includes('acer') || model.includes('acer')) {
        assignedCategoryId = categoryMap['acer'];
      } else if (name.includes('asus') || model.includes('asus')) {
        assignedCategoryId = categoryMap['asus'];
      } else if (name.includes('airpods') || name.includes('chargeur') || name.includes('charger') || name.includes('cable') || name.includes('câbles') || name.includes('adaptateur')) {
        assignedCategoryId = categoryMap['accessoires'];
      } else if (name.includes('watch') || model.includes('watch')) {
        // Try to assign to specific smartwatch brand
        if (name.includes('apple') || model.includes('apple')) {
          assignedCategoryId = categoryMap['apple smartwatches'];
        } else if (name.includes('samsung') || model.includes('samsung')) {
          assignedCategoryId = categoryMap['samsung smartwatches'];
        } else if (name.includes('huawei') || model.includes('huawei')) {
          assignedCategoryId = categoryMap['huawei smartwatches'];
        } else if (name.includes('xiaomi') || model.includes('xiaomi')) {
          assignedCategoryId = categoryMap['xiaomi smartwatches'];
        } else if (name.includes('amazfit') || model.includes('amazfit')) {
          assignedCategoryId = categoryMap['amazfit smartwatches'];
        } else {
          assignedCategoryId = categoryMap['smartwatches']; // Main category fallback
        }
      } else if (name.includes('tablet') || name.includes('tab ') || model.includes('tablet') || model.includes('tab ')) {
        // Try to assign to specific tablet brand
        if (name.includes('samsung') || model.includes('samsung')) {
          assignedCategoryId = categoryMap['samsung'];
        } else if (name.includes('huawei') || model.includes('huawei')) {
          assignedCategoryId = categoryMap['huiawei']; // Note the typo in DB
        } else if (name.includes('ipad') || model.includes('ipad')) {
          assignedCategoryId = categoryMap['ipad'];
        } else {
          assignedCategoryId = categoryMap['tablets']; // Main category fallback
        }
      } else if (name.includes('laptop') || name.includes('macbook') || name.includes('notebook') || model.includes('laptop') || model.includes('macbook')) {
        assignedCategoryId = categoryMap['laptop']; // Main category
      }
      
      if (assignedCategoryId) {
        await product.update({ categoryId: assignedCategoryId });
        console.log(`✅ Assigned ${product.name} to category ID ${assignedCategoryId}`);
        updated++;
      } else {
        console.log(`⚠️  Could not determine category for: ${product.name} (model: ${product.model})`);
      }
    }
    
    console.log(`🎉 Successfully updated ${updated} products with category assignments`);
    
  } catch (error) {
    console.error('❌ Error fixing product categories:', error);
  }
};

// Run the script
if (require.main === module) {
  fixProductCategories().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { fixProductCategories };
