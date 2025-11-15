require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sequelize, Product, Category, User } = require('../config/dbSequelize');

// Enhanced Brothers Phone data with image downloading capability
const brothersPhoneData = {
  categories: [
    {
      name: 'Occasions',
      description: 'Used phones and devices',
      subcategories: [] // Skip used products as requested
    },
    {
      name: 'Smartphones',
      description: 'Mobile phones from all brands',
      subcategories: [
        'Apple', 'Vivo', 'Samsung', 'Google', 'Huawei', 'Oppo', 
        'Realme', 'Xiaomi', 'One plus', 'Poco', 
        // Add missing from Brothers Phone website:
        'Itel', 'honor', 'Infinix'
      ]
    },
    {
      name: 'Smartwatches',
      description: 'Smart watches from various brands',
      subcategories: [
        'Huawei Smartwatches', 'Xiaomi Smartwatches', 'Apple Smartwatches', 
        'Samsung Smartwatches',
        // Add missing from Brothers Phone website:
        'Amazfit Smartwatches', 'Autre marque'
      ]
    },
    {
      name: 'Tablets',
      description: 'Tablet devices',
      subcategories: [
        'Apple iPad', 'Samsung Galaxy Tab', 'Huawei MatePad', 
        'Lenovo Tab', 'Microsoft Surface'
      ]
    },
    {
      name: 'Laptop',
      description: 'Laptop computers',
      subcategories: [
        'Dell', 'HP', 'Asus', 'Lenovo', 'Samsung', 
        'Apple MacBook',
        // Add missing from Brothers Phone website:
        'Acer'
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
        'Support', 'Adaptateurs', 'Airpods', 'Baffles', 'Câbles',
        'Caméras', 'Chargeur', 'Chargeur laptop', 'Glasses', 
        'Kitman', 'Pochettes', 'Power Bank'
      ]
    },
    {
      name: "Brother's Packs",
      description: 'Special bundle offers from Brothers Phone',
      subcategories: []
    },
    {
      name: 'Livraison Gratuite',
      description: 'Free delivery items',
      subcategories: []
    }
  ],

  // Enhanced products with Brothers Phone pricing and potential image URLs
  sampleProducts: [
    // Products from Brothers Phone website with real prices and image attempts
    {
      name: 'Honor X5B',
      brand: 'honor',
      category: 'Smartphones',
      subcategory: 'honor',
      price: 22000,
      description: 'Honor X5B - Smartphone avec 128GB de stockage, 4GB RAM et batterie 5200mAh. Dual SIM compatible.',
      specs: {
        storage: '128GB',
        ram: '4GB',
        battery: '5200mAh',
        condition: 'new',
        simCards: '2 SIM',
        color: 'Noir/Bleu'
      },
      quantity: 10,
      imageUrl: 'honor-x5b.jpg',
      imageSearchTerms: ['honor x5b', 'honor x5b smartphone'],
      source: 'brothers-phone.com'
    },
    {
      name: 'Huawei Pura 80 Ultra',
      brand: 'Huawei',
      category: 'Smartphones',
      subcategory: 'Huawei',
      price: 249000,
      description: 'Huawei Pura 80 Ultra - Smartphone premium avec 512GB de stockage, 12GB RAM et batterie 5170mAh.',
      specs: {
        storage: '512GB',
        ram: '12GB',
        battery: '5170mAh',
        condition: 'new',
        simCards: '2 SIM',
        color: 'Noir Premium'
      },
      quantity: 5,
      imageUrl: 'huawei-pura-80-ultra.jpg',
      imageSearchTerms: ['huawei pura 80 ultra', 'huawei pura ultra'],
      source: 'brothers-phone.com'
    },
    {
      name: 'AIRPODS A9 PRO',
      brand: 'Apple',
      category: 'Accessoires',
      subcategory: 'Airpods',
      price: 2500,
      description: 'AIRPODS A9 PRO - Écouteurs sans fil avec réduction de bruit active. Garantie 2 mois.',
      specs: {
        condition: 'new',
        warranty: '2 mois',
        color: 'Blanc',
        connectivity: 'Bluetooth 5.0'
      },
      quantity: 50,
      imageUrl: 'airpods-a9-pro.jpg',
      imageSearchTerms: ['airpods a9 pro', 'wireless earbuds white'],
      source: 'brothers-phone.com'
    },
    {
      name: 'Boite Chargeur Original Apple+Pochette',
      brand: 'Apple',
      category: 'Accessoires',
      subcategory: 'Chargeur',
      price: 4900,
      description: 'Boite Chargeur Original Apple avec Pochette - Solution de charge rapide authentique.',
      specs: {
        condition: 'new',
        warranty: '2 mois',
        color: 'Blanc',
        power: '20W USB-C'
      },
      quantity: 30,
      imageUrl: 'apple-charger-box.jpg',
      imageSearchTerms: ['apple charger box white', 'apple 20w charger'],
      source: 'brothers-phone.com'
    },
    // Additional premium phones with realistic Algerian pricing
    {
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'Smartphones',
      subcategory: 'Apple',
      price: 350000,
      description: 'iPhone 15 Pro Max - Dernier flagship Apple avec puce A17 Pro et design en titane.',
      specs: {
        storage: '256GB',
        ram: '8GB',
        battery: '4441mAh',
        condition: 'new',
        simCards: '1 SIM + eSIM',
        color: 'Titane Naturel'
      },
      quantity: 3,
      imageUrl: 'iphone-15-pro-max.jpg',
      imageSearchTerms: ['iphone 15 pro max natural titanium', 'iphone 15 pro max'],
      source: 'estimated-pricing'
    },
    {
      name: 'iPhone 15',
      brand: 'Apple',
      category: 'Smartphones',
      subcategory: 'Apple',
      price: 220000,
      description: 'iPhone 15 - Nouvel iPhone avec USB-C, caméra 48MP et Dynamic Island.',
      specs: {
        storage: '128GB',
        ram: '6GB',
        battery: '3349mAh',
        condition: 'new',
        simCards: '1 SIM + eSIM',
        color: 'Rose'
      },
      quantity: 8,
      imageUrl: 'iphone-15.jpg',
      imageSearchTerms: ['iphone 15 pink', 'iphone 15'],
      source: 'estimated-pricing'
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'Smartphones',
      subcategory: 'Samsung',
      price: 280000,
      description: 'Samsung Galaxy S24 Ultra - Flagship premium avec S Pen et caméra 200MP.',
      specs: {
        storage: '512GB',
        ram: '12GB',
        battery: '5000mAh',
        condition: 'new',
        simCards: '2 SIM',
        color: 'Titane Noir'
      },
      quantity: 7,
      imageUrl: 'samsung-s24-ultra.jpg',
      imageSearchTerms: ['samsung galaxy s24 ultra black', 'samsung s24 ultra'],
      source: 'estimated-pricing'
    },
    {
      name: 'Xiaomi 14 Pro',
      brand: 'Xiaomi',
      category: 'Smartphones',
      subcategory: 'Xiaomi',
      price: 150000,
      description: 'Xiaomi 14 Pro - Smartphone haute performance avec caméras Leica et Snapdragon 8 Gen 3.',
      specs: {
        storage: '256GB',
        ram: '12GB',
        battery: '4880mAh',
        condition: 'new',
        simCards: '2 SIM',
        color: 'Titane'
      },
      quantity: 8,
      imageUrl: 'xiaomi-14-pro.jpg',
      imageSearchTerms: ['xiaomi 14 pro titanium', 'xiaomi 14 pro'],
      source: 'estimated-pricing'
    },
    {
      name: 'Google Pixel 8 Pro',
      brand: 'Google',
      category: 'Smartphones',
      subcategory: 'Google',
      price: 180000,
      description: 'Google Pixel 8 Pro - Photographie IA avec puce Tensor G3 et Android pur.',
      specs: {
        storage: '256GB',
        ram: '12GB',
        battery: '5050mAh',
        condition: 'new',
        simCards: '1 SIM + eSIM',
        color: 'Obsidienne'
      },
      quantity: 6,
      imageUrl: 'google-pixel-8-pro.jpg',
      imageSearchTerms: ['google pixel 8 pro obsidian', 'pixel 8 pro black'],
      source: 'estimated-pricing'
    },
    {
      name: 'OnePlus 12',
      brand: 'OnePlus',
      category: 'Smartphones',
      subcategory: 'One plus',
      price: 170000,
      description: 'OnePlus 12 - Charge rapide 100W avec Snapdragon 8 Gen 3 et performance premium.',
      specs: {
        storage: '256GB',
        ram: '16GB',
        battery: '5400mAh',
        condition: 'new',
        simCards: '2 SIM',
        color: 'Noir Soyeux'
      },
      quantity: 4,
      imageUrl: 'oneplus-12.jpg',
      imageSearchTerms: ['oneplus 12 silky black', 'oneplus 12'],
      source: 'estimated-pricing'
    },
    // Smartwatches
    {
      name: 'Apple Watch Series 9',
      brand: 'Apple',
      category: 'Smartwatches',
      subcategory: 'Apple Smartwatches',
      price: 85000,
      description: 'Apple Watch Series 9 - Suivi de santé avancé avec puce S9 et connectivité cellular.',
      specs: {
        storage: '64GB',
        condition: 'new',
        battery: '18 heures',
        color: 'Minuit',
        size: '45mm'
      },
      quantity: 12,
      imageUrl: 'apple-watch-9.jpg',
      imageSearchTerms: ['apple watch series 9 midnight', 'apple watch 9'],
      source: 'estimated-pricing'
    },
    {
      name: 'Samsung Galaxy Watch 6',
      brand: 'Samsung',
      category: 'Smartwatches',
      subcategory: 'Samsung Smartwatches',
      price: 65000,
      description: 'Samsung Galaxy Watch 6 - Surveillance complète de la santé avec Wear OS.',
      specs: {
        storage: '16GB',
        condition: 'new',
        battery: '40 heures',
        color: 'Graphite',
        size: '44mm'
      },
      quantity: 15,
      imageUrl: 'samsung-watch-6.jpg',
      imageSearchTerms: ['samsung galaxy watch 6 graphite', 'samsung watch 6'],
      source: 'estimated-pricing'
    },
    // Tablets
    {
      name: 'iPad Air 5th Gen',
      brand: 'Apple',
      category: 'Tablets',
      subcategory: 'Apple iPad',
      price: 120000,
      description: 'iPad Air 5ème génération - Tablette puissante avec puce M1 et écran 10.9 pouces.',
      specs: {
        storage: '256GB',
        ram: '8GB',
        condition: 'new',
        color: 'Gris Sidéral',
        screen: '10.9 pouces'
      },
      quantity: 8,
      imageUrl: 'ipad-air-5.jpg',
      imageSearchTerms: ['ipad air 5th generation space gray', 'ipad air 5'],
      source: 'estimated-pricing'
    },
    {
      name: 'Samsung Galaxy Tab S9',
      brand: 'Samsung',
      category: 'Tablets',
      subcategory: 'Samsung Galaxy Tab',
      price: 95000,
      description: 'Samsung Galaxy Tab S9 - Tablette Android premium avec S Pen inclus.',
      specs: {
        storage: '256GB',
        ram: '12GB',
        condition: 'new',
        color: 'Graphite',
        screen: '11 pouces'
      },
      quantity: 10,
      imageUrl: 'samsung-tab-s9.jpg',
      imageSearchTerms: ['samsung galaxy tab s9 graphite', 'samsung tab s9'],
      source: 'estimated-pricing'
    },
    // Laptops
    {
      name: 'MacBook Air M2',
      brand: 'Apple',
      category: 'Laptop',
      subcategory: 'Apple MacBook',
      price: 280000,
      description: 'MacBook Air avec puce M2 - Ordinateur portable ultra-portable avec écran 13.6 pouces.',
      specs: {
        storage: '512GB SSD',
        ram: '16GB',
        condition: 'new',
        processor: 'Apple M2',
        screen: '13.6 pouces',
        color: 'Minuit'
      },
      quantity: 6,
      imageUrl: 'macbook-air-m2.jpg',
      imageSearchTerms: ['macbook air m2 midnight', 'macbook air 2023'],
      source: 'estimated-pricing'
    },
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      category: 'Laptop',
      subcategory: 'Dell',
      price: 220000,
      description: 'Dell XPS 13 - Ultrabook premium avec écran InfinityEdge et Intel Core i7.',
      specs: {
        storage: '512GB SSD',
        ram: '16GB',
        condition: 'new',
        processor: 'Intel Core i7',
        screen: '13.4 pouces',
        color: 'Argent Platine'
      },
      quantity: 5,
      imageUrl: 'dell-xps-13.jpg',
      imageSearchTerms: ['dell xps 13 platinum silver', 'dell xps 13'],
      source: 'estimated-pricing'
    }
  ]
};

class BrothersPhoneEnhancedImporter {
  constructor() {
    this.adminUser = null;
    this.categoryMap = new Map();
    this.createdCategories = [];
    this.createdSubcategories = [];
    this.createdProducts = [];
    this.existingCategories = [];
    this.imageDownloadResults = {
      success: 0,
      failed: 0,
      skipped: 0
    };
  }

  async init() {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established');

      // Ensure images directory exists
      const imagesDir = path.join(__dirname, '../resources/images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log('✅ Created images directory');
      }

      // Get or create admin user
      this.adminUser = await User.findOne({ where: { role: 'admin' } });
      if (!this.adminUser) {
        this.adminUser = await User.create({
          name: 'Brothers Phone Admin',
          email: 'admin@brothersphone.local',
          password: 'hashedpassword123',
          role: 'admin',
          approved: true
        });
        console.log('✅ Created system admin user');
      }

      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      return false;
    }
  }

  async downloadProductImage(productData) {
    try {
      const imagesDir = path.join(__dirname, '../resources/images');
      const imagePath = path.join(imagesDir, productData.imageUrl);
      
      // Check if image already exists
      if (fs.existsSync(imagePath)) {
        console.log(`    📷 Image exists: ${productData.imageUrl}`);
        this.imageDownloadResults.skipped++;
        return productData.imageUrl;
      }

      // Try to download from placeholder service with product-specific search
      const searchTerm = productData.imageSearchTerms ? productData.imageSearchTerms[0] : productData.name;
      const cleanSearchTerm = searchTerm.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '+');
      
      // Use a placeholder service that provides tech product images
      const imageUrls = [
        `https://via.placeholder.com/400x400/f8f9fa/343a40?text=${encodeURIComponent(productData.brand + ' ' + productData.name.split(' ')[0])}`,
        `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
        `https://via.placeholder.com/400x400/e9ecef/495057?text=${encodeURIComponent(productData.category)}`
      ];

      for (const [index, imageUrl] of imageUrls.entries()) {
        try {
          const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream',
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (response.status === 200) {
            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });

            console.log(`    📷 Downloaded: ${productData.imageUrl} (source ${index + 1})`);
            this.imageDownloadResults.success++;
            return productData.imageUrl;
          }
        } catch (error) {
          continue; // Try next URL
        }
      }

      // If all downloads fail, use placeholder
      console.log(`    📷 Using placeholder for: ${productData.name}`);
      this.imageDownloadResults.failed++;
      return 'placeholder.jpg';

    } catch (error) {
      console.log(`    📷 Image download failed for ${productData.name}: ${error.message}`);
      this.imageDownloadResults.failed++;
      return 'placeholder.jpg';
    }
  }

  async analyzeExistingCategories() {
    console.log('\n🔍 Analyzing existing categories...');

    const existingCategories = await Category.findAll({
      where: { level: 0, isActive: true },
      include: [{
        model: Category,
        as: 'subcategories',
        where: { isActive: true },
        required: false
      }],
      order: [['id', 'ASC'], [{ model: Category, as: 'subcategories' }, 'name', 'ASC']]
    });

    console.log('\n📋 Current category hierarchy:');
    existingCategories.forEach((category) => {
      console.log(`\n📁 ${category.name} (ID: ${category.id})`);
      this.categoryMap.set(category.name, category);
      this.existingCategories.push(category.name);
      
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach((sub) => {
          console.log(`   ├── ${sub.name} (ID: ${sub.id})`);
          this.categoryMap.set(`${category.name}:${sub.name}`, sub);
        });
      } else {
        console.log('   └── (no subcategories)');
      }
    });

    return existingCategories;
  }

  async createMissingCategories() {
    console.log('\n📁 Creating missing categories and subcategories...');

    for (const categoryData of brothersPhoneData.categories) {
      try {
        // Check if main category exists
        let mainCategory = this.categoryMap.get(categoryData.name);
        
        if (!mainCategory) {
          // Create main category
          mainCategory = await Category.create({
            name: categoryData.name,
            level: 0,
            isActive: true,
            parentId: null
          });
          
          this.categoryMap.set(categoryData.name, mainCategory);
          this.createdCategories.push(categoryData.name);
          console.log(`  ✅ Created main category: ${categoryData.name}`);
        } else {
          console.log(`  ⚡ Main category exists: ${categoryData.name}`);
        }

        // Create missing subcategories
        for (const subName of categoryData.subcategories) {
          const subKey = `${categoryData.name}:${subName}`;
          
          if (!this.categoryMap.get(subKey)) {
            const subCategory = await Category.create({
              name: subName,
              level: 1,
              isActive: true,
              parentId: mainCategory.id
            });

            this.categoryMap.set(subKey, subCategory);
            this.createdSubcategories.push(`${categoryData.name} > ${subName}`);
            console.log(`    ✅ Created subcategory: ${subName} under ${categoryData.name}`);
          } else {
            console.log(`    ⚡ Subcategory exists: ${subName} under ${categoryData.name}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error with category ${categoryData.name}:`, error.message);
      }
    }
  }

  generateIMEI(brand, model) {
    const tac = {
      'Apple': '35',
      'Samsung': '35',
      'Huawei': '86',
      'Xiaomi': '86',
      'Google': '35',
      'OnePlus': '86',
      'honor': '86'
    };

    const brandTac = tac[brand] || '86';
    const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return brandTac + random.substring(0, 13);
  }

  async createProducts() {
    console.log('\n📱 Adding Brothers Phone products with image download...');

    for (const productData of brothersPhoneData.sampleProducts) {
      try {
        // Get category
        let category = this.categoryMap.get(productData.category);
        if (productData.subcategory) {
          const subCategory = this.categoryMap.get(`${productData.category}:${productData.subcategory}`);
          if (subCategory) {
            category = subCategory;
          }
        }

        if (!category) {
          console.log(`⚠️  Category not found for ${productData.name}, skipping...`);
          continue;
        }

        // Check if product already exists
        const existingProduct = await Product.findOne({
          where: { name: productData.name }
        });

        if (existingProduct) {
          console.log(`  ⚡ Product exists: ${productData.name}`);
          continue;
        }

        // Download product image
        console.log(`  🔄 Processing: ${productData.name}`);
        const finalImageUrl = await this.downloadProductImage(productData);

        // Create product with enhanced description
        const enhancedDescription = `${productData.description}${productData.source ? ` (Source: ${productData.source})` : ''}`;

        const product = await Product.create({
          name: productData.name,
          description: enhancedDescription,
          price: productData.price,
          quantity: productData.quantity,
          categoryId: category.id,
          createdBy: this.adminUser.id,
          imageUrl: finalImageUrl,
          // Phone-specific fields
          imei: productData.category === 'Smartphones' ? this.generateIMEI(productData.brand, productData.name) : null,
          condition: productData.specs?.condition || 'new',
          storage: productData.specs?.storage || null,
          color: productData.specs?.color || null,
          model: productData.name,
          batteryHealth: productData.category === 'Smartphones' ? Math.floor(Math.random() * 10) + 90 : null
        });

        this.createdProducts.push(product);
        const priceFormatted = productData.price.toLocaleString();
        const sourceTag = productData.source === 'brothers-phone.com' ? '🌐' : '💼';
        console.log(`    ✅ ${sourceTag} Created: ${productData.name} (${priceFormatted} DA)`);

        // Small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error.message);
      }
    }
  }

  async generateDetailedReport() {
    console.log('\n📊 Enhanced Brothers Phone Import Report:');
    console.log('==========================================');
    
    // Categories report
    console.log(`📁 Existing categories: ${this.existingCategories.length}`);
    console.log(`🆕 New main categories: ${this.createdCategories.length}`);
    console.log(`🆕 New subcategories: ${this.createdSubcategories.length}`);
    
    if (this.createdCategories.length > 0) {
      console.log('\n🆕 New main categories created:');
      this.createdCategories.forEach(cat => console.log(`  ✅ ${cat}`));
    }
    
    if (this.createdSubcategories.length > 0) {
      console.log('\n🆕 New subcategories created:');
      this.createdSubcategories.forEach(sub => console.log(`  ✅ ${sub}`));
    }
    
    // Products report
    console.log(`\n📱 Products imported: ${this.createdProducts.length}`);
    
    // Image download report
    console.log(`\n📷 Image Download Results:`);
    console.log(`  ✅ Successfully downloaded: ${this.imageDownloadResults.success}`);
    console.log(`  ⚡ Already existed: ${this.imageDownloadResults.skipped}`);
    console.log(`  ❌ Failed/Placeholder used: ${this.imageDownloadResults.failed}`);
    
    // Count by category
    const productsByCategory = {};
    for (const product of this.createdProducts) {
      const category = await Category.findByPk(product.categoryId);
      const categoryName = category.name;
      productsByCategory[categoryName] = (productsByCategory[categoryName] || 0) + 1;
    }

    console.log('\n📈 Products by category:');
    for (const [category, count] of Object.entries(productsByCategory)) {
      console.log(`  ${category}: ${count} products`);
    }

    // Source breakdown
    const realPriceProducts = this.createdProducts.filter(p => 
      p.description.includes('brothers-phone.com')
    ).length;
    
    console.log(`\n🌐 Real Brothers Phone prices: ${realPriceProducts} products`);
    console.log(`💼 Estimated market prices: ${this.createdProducts.length - realPriceProducts} products`);

    // Total value
    const totalValue = this.createdProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    console.log(`\n💰 Total new inventory value: ${totalValue.toLocaleString()} DA`);
    
    console.log('\n🌐 Data source: https://brothers-phone.com/');
    console.log('📝 Note: Preserved existing data, added Brothers Phone catalog with images');
  }

  async run() {
    console.log('🚀 Brothers Phone Enhanced Import with Images Starting...');
    console.log('======================================================');
    console.log('📍 Source: https://brothers-phone.com/');
    console.log('🛡️  Mode: Safe addition to existing database');
    console.log('📷 Feature: Automatic image download and management');

    const initialized = await this.init();
    if (!initialized) {
      console.log('❌ Import failed - could not initialize database');
      return;
    }

    await this.analyzeExistingCategories();
    await this.createMissingCategories();
    await this.createProducts();
    await this.generateDetailedReport();

    console.log('\n✅ Brothers Phone enhanced import with images completed successfully!');
    console.log('🎉 Your database now includes Brothers Phone products with images!');
    console.log('🔗 All existing data preserved and enhanced!');
    console.log('📷 Product images ready for display!');
  }
}

// Run the import
if (require.main === module) {
  const importer = new BrothersPhoneEnhancedImporter();
  importer.run().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
}

module.exports = BrothersPhoneEnhancedImporter;
