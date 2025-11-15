const { Product, Category, sequelize } = require('../config/dbSequelize');

async function cleanupDemoProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    console.log('🔍 Analyzing products before cleanup...');
    
    const allProducts = await Product.findAll({ 
      include: [Category],
      order: [['createdAt', 'ASC']]
    });
    
    console.log(`📊 Total products: ${allProducts.length}`);
    
    // Identify products to keep (Brothers Phone + estimated pricing)
    const keepProducts = allProducts.filter(p => {
      if (!p.description) return false;
      return p.description.includes('brothers-phone.com') || 
             p.description.includes('estimated-pricing');
    });
    
    // Identify products to remove (old demo data)
    const removeProducts = allProducts.filter(p => {
      if (!p.description) return true;
      return !p.description.includes('brothers-phone.com') && 
             !p.description.includes('estimated-pricing');
    });
    
    console.log(`✅ Products to keep: ${keepProducts.length}`);
    console.log(`❌ Products to remove: ${removeProducts.length}`);
    
    console.log('\\n📋 Products to keep:');
    keepProducts.forEach(p => {
      const source = p.description.includes('brothers-phone.com') ? '🌐' : '💼';
      console.log(`  ${source} ${p.name} (${p.price} DA)`);
    });
    
    console.log('\\n🗑️  Products to remove:');
    removeProducts.slice(0, 10).forEach(p => {
      console.log(`  - ${p.name} (${p.price} DA)`);
    });
    if (removeProducts.length > 10) {
      console.log(`  ... and ${removeProducts.length - 10} more`);
    }
    
    // Ask for confirmation (in a real scenario)
    console.log('\\n⚠️  This will remove all old demo products and keep only Brothers Phone products.');
    console.log('🚀 Proceeding with cleanup...');
    
    // Remove old demo products
    const productIdsToRemove = removeProducts.map(p => p.id);
    
    if (productIdsToRemove.length > 0) {
      const deletedCount = await Product.destroy({
        where: {
          id: productIdsToRemove
        }
      });
      
      console.log(`\\n✅ Successfully removed ${deletedCount} old demo products`);
    }
    
    // Final count
    const finalProducts = await Product.findAll({
      include: [Category]
    });
    
    console.log(`\\n📊 Final product count: ${finalProducts.length}`);
    
    console.log('\\n🎉 Database cleanup completed!');
    console.log('✅ Your website now shows only Brothers Phone products!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await sequelize.close();
  }
}

cleanupDemoProducts();
