const { Product, Category, sequelize } = require('../config/dbSequelize');

async function checkProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    const products = await Product.findAll({ 
      include: [Category],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`\n📊 Total products in database: ${products.length}`);
    
    // Categorize products
    const brothersProducts = products.filter(p => 
      p.description && p.description.includes('brothers-phone.com')
    );
    const estimatedProducts = products.filter(p => 
      p.description && p.description.includes('estimated-pricing')
    );
    const demoProducts = products.filter(p => 
      !p.description || 
      (!p.description.includes('brothers-phone.com') && 
       !p.description.includes('estimated-pricing'))
    );
    
    console.log(`\n📱 Product breakdown:`);
    console.log(`🌐 Real Brothers Phone products: ${brothersProducts.length}`);
    console.log(`💼 Estimated pricing products: ${estimatedProducts.length}`);
    console.log(`🧪 Demo/old products: ${demoProducts.length}`);
    
    console.log(`\n🌐 Brothers Phone products:`);
    brothersProducts.forEach(p => {
      console.log(`  - ${p.name} (${p.price} DA) - ${p.Category?.name || 'No category'}`);
    });
    
    console.log(`\n💼 Estimated pricing products:`);
    estimatedProducts.forEach(p => {
      console.log(`  - ${p.name} (${p.price} DA) - ${p.Category?.name || 'No category'}`);
    });
    
    console.log(`\n🧪 Demo/old products (may need cleanup):`);
    demoProducts.slice(0, 10).forEach(p => {
      console.log(`  - ${p.name} (${p.price} DA) - ${p.Category?.name || 'No category'}`);
    });
    
    if (demoProducts.length > 10) {
      console.log(`  ... and ${demoProducts.length - 10} more demo products`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkProducts();
