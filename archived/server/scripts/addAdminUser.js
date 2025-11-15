const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Admin user details - you can customize these
const adminUser = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Password to hash
const password = 'Admin123!';

// Path to db.json
const dbFilePath = path.join(__dirname, '../db/administration.json');

async function addAdminUser() {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Add hashed password to admin user
    adminUser.password = hashedPassword;
    
    // Read the current database
    let dbData = {};
    if (fs.existsSync(dbFilePath)) {
      const rawData = fs.readFileSync(dbFilePath, 'utf8');
      dbData = JSON.parse(rawData);
    } else {
      // Create default structure if file doesn't exist
      dbData = {
        users: [],
        products: [],
        categories: [],
        transactions: []
      };
    }
    
    // Check if admin user already exists
    const existingAdmin = dbData.users.find(user => 
      user.email === adminUser.email || user.username === adminUser.username
    );
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Add admin user to the users array
    dbData.users.push(adminUser);
    
    // Write the updated data back to the file
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
    
    console.log('Admin user added successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error adding admin user:', error);
  }
}

// Run the function
addAdminUser();
