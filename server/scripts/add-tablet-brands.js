const { sequelize, Category } = require('../config/dbSequelize');

async function addTabletBrands() {
  try {
    console.log('📱 Adding more tablet brands...');

    // Find the Tablets category
    const tablets = await Category.findOne({ where: { name: 'Tablets', parentId: null } });

    if (!tablets) {
      console.error('❌ Could not find Tablets category');
      return;
    }

    console.log(`📱 Found Tablets category (ID: ${tablets.id})`);

    // Tablet brands to add
    const tabletBrands = ['Samsung Galaxy Tab', 'Huawei MatePad', 'Lenovo Tab', 'Microsoft Surface'];

    for (const brand of tabletBrands) {
      const [tabletBrand, tabletBrandCreated] = await Category.findOrCreate({
        where: { 
          name: brand,
          parentId: tablets.id
        },
        defaults: {
          name: brand,
          parentId: tablets.id,
          level: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      if (tabletBrandCreated) {
        console.log(`✅ Added ${brand} subcategory to Tablets`);
      } else {
        console.log(`ℹ️ ${brand} subcategory already exists under Tablets`);
      }
    }

    console.log('🎉 Tablet brands organization completed!');
    
    // Display the updated tablets structure
    console.log('\n📂 Updated Tablets Category:');
    const tabletsWithSubs = await Category.findOne({
      where: { name: 'Tablets', parentId: null },
      include: [{
        model: Category,
        as: 'subcategories',
        order: [['name', 'ASC']]
      }]
    });

    console.log(`${tabletsWithSubs.name} (ID: ${tabletsWithSubs.id})`);
    if (tabletsWithSubs.subcategories && tabletsWithSubs.subcategories.length > 0) {
      tabletsWithSubs.subcategories.forEach(sub => {
        console.log(`  └── ${sub.name} (ID: ${sub.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error adding tablet brands:', error);
  } finally {
    await sequelize.close();
  }
}

addTabletBrands();
