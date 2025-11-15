const { Category } = require('../config/dbSequelize');

const syncCategories = async () => {
  try {
    console.log('🔄 Syncing categories with brothers-phone.com website...');

    // Define the exact category structure from the website
    const websiteCategories = [
      {
        name: 'Occasions',
        description: 'Used phones and devices',
        subcategories: []
      },
      {
        name: 'Smartphones',
        description: 'Mobile phones from all brands',
        subcategories: [
          'Apple',
          'Vivo', 
          'Samsung',
          'Google',
          'Huawei',
          'Oppo',
          'Realme',
          'Xiaomi',
          'One plus',
          'Poco',
          'Itel'  // Missing from current setup
        ]
      },
      {
        name: 'Smartwatches',
        description: 'Smart watches from various brands',
        subcategories: [
          'Huawei Smartwatches',
          'Xiaomi Smartwatches', 
          'Amazfit Smartwatches',  // Missing from current setup
          'Apple Smartwatches',
          'Samsung Smartwatches',
          'Autre marque'  // Missing from current setup
        ]
      },
      {
        name: 'Tablets',
        description: 'Tablet devices',
        subcategories: [
          'Apple iPad',
          'Samsung Galaxy Tab',
          'Huawei MatePad',
          'Lenovo Tab',
          'Microsoft Surface'
        ]
      },
      {
        name: 'Laptop',
        description: 'Laptop computers',
        subcategories: [
          'Dell',
          'Acer',  // Missing from current setup
          'HP',
          'Asus',
          'Lenovo',
          'Samsung Laptop',  // More specific naming to avoid conflicts
          'Apple MacBook'
        ]
      },
      {
        name: 'Affaire du jour',
        description: 'Daily deals and special offers',
        subcategories: []
      },
      {
        name: 'Accessoires',
        description: 'Phone and tech accessories',
        subcategories: [
          'Support',
          'Adaptateurs',
          'Airpods',
          'Baffles',
          'Câbles',
          'Caméras',
          'Chargeur',
          'Chargeur laptop',
          'Glasses',
          'Kitman',
          'Pochettes',
          'Power Bank'
        ]
      },
      {
        name: "Brother's Packs",
        description: 'Special bundle offers',
        subcategories: []
      },
      {
        name: 'Livraison Gratuite',
        description: 'Free delivery items',
        subcategories: []
      }
    ];

    // Process each main category
    for (const categoryData of websiteCategories) {
      console.log(`📁 Processing main category: ${categoryData.name}`);
      
      // Create or update main category
      const [mainCategory, mainCreated] = await Category.findOrCreate({
        where: { name: categoryData.name, level: 0 },
        defaults: {
          name: categoryData.name,
          description: categoryData.description,
          level: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      if (mainCreated) {
        console.log(`  ✅ Created main category: ${categoryData.name}`);
      } else {
        // Update description if needed
        if (mainCategory.description !== categoryData.description) {
          await mainCategory.update({ 
            description: categoryData.description,
            updatedAt: new Date()
          });
          console.log(`  📝 Updated description for: ${categoryData.name}`);
        }
      }

      // Process subcategories
      for (const subcategoryName of categoryData.subcategories) {
        console.log(`  📂 Processing subcategory: ${subcategoryName}`);
        
        const [subcategory, subCreated] = await Category.findOrCreate({
          where: { 
            name: subcategoryName, 
            parentId: mainCategory.id,
            level: 1 
          },
          defaults: {
            name: subcategoryName,
            parentId: mainCategory.id,
            level: 1,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        if (subCreated) {
          console.log(`    ✅ Created subcategory: ${subcategoryName}`);
        }
      }
    }

    console.log('🎉 Category sync completed successfully!');
    
    // Display final summary
    const totalMain = await Category.count({ where: { level: 0 } });
    const totalSub = await Category.count({ where: { level: 1 } });
    
    console.log(`📊 Summary:`);
    console.log(`   Main categories: ${totalMain}`);
    console.log(`   Subcategories: ${totalSub}`);
    console.log(`   Total categories: ${totalMain + totalSub}`);

  } catch (error) {
    console.error('❌ Error syncing categories:', error);
    throw error;
  }
};

// Run the sync
if (require.main === module) {
  syncCategories()
    .then(() => {
      console.log('✅ Sync completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sync failed:', error);
      process.exit(1);
    });
}

module.exports = { syncCategories };
