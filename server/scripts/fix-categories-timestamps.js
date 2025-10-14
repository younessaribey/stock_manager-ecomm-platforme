require('dotenv').config();
const { sequelize } = require('../config/dbSequelize');

async function fixCategoriesTimestamps() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    console.log('Fixing categories timestamps...');
    
    // First, add the columns with default values and allow null
    try {
      await sequelize.query(`
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS "parentId" INTEGER REFERENCES categories(id),
        ADD COLUMN IF NOT EXISTS "level" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;
      `);
      console.log('✅ Added new columns to categories table');
    } catch (error) {
      console.log('Columns may already exist, continuing...');
    }
    
    // Update existing records to have timestamps
    await sequelize.query(`
      UPDATE categories 
      SET "createdAt" = NOW(), "updatedAt" = NOW() 
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;
    `);
    console.log('✅ Updated existing categories with timestamps');
    
    // Update existing categories to have level 0 (main categories)
    await sequelize.query(`
      UPDATE categories 
      SET level = 0 
      WHERE level IS NULL;
    `);
    console.log('✅ Set existing categories as main categories (level 0)');
    
    // Update existing categories to be active
    await sequelize.query(`
      UPDATE categories 
      SET "isActive" = true 
      WHERE "isActive" IS NULL;
    `);
    console.log('✅ Set existing categories as active');
    
    // Now make the columns NOT NULL
    await sequelize.query(`
      ALTER TABLE categories 
      ALTER COLUMN "createdAt" SET NOT NULL,
      ALTER COLUMN "updatedAt" SET NOT NULL,
      ALTER COLUMN "level" SET NOT NULL,
      ALTER COLUMN "isActive" SET NOT NULL;
    `);
    console.log('✅ Made timestamp columns NOT NULL');
    
    // Display all categories
    const result = await sequelize.query('SELECT * FROM categories ORDER BY id;');
    console.log('\n📋 Current categories:');
    result[0].forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (ID: ${cat.id}, Level: ${cat.level}, Active: ${cat.isActive})`);
    });
    
    console.log('\n✅ Categories table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
fixCategoriesTimestamps();
