require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../config/dbSequelize');

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Admin user information - customize as needed
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',  // Simple password as per the project requirement
      role: 'admin',
      approved: true
    };
    
    console.log(`Creating admin user with email: ${adminData.email}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: adminData.email } });
    
    if (existingUser) {
      console.log('Admin user already exists. Updating instead...');
      // Hash the password (even though security checks are removed, we still need to hash)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Update the existing user
      await existingUser.update({
        name: adminData.name,
        password: hashedPassword,
        role: 'admin',
        approved: true
      });
      
      console.log('Admin user updated successfully.');
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Create new admin user
      const newAdmin = await User.create({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: 'admin',
        approved: true
      });
      
      console.log('Admin user created successfully.');
    }
    
    console.log('Done. You can now login with:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
createAdminUser();
