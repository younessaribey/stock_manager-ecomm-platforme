const fs = require('fs');
const path = require('path');

// Path to db.json
const dbFilePath = path.join(__dirname, '../db/administration.json');

function approveAdmin() {
  try {
    // Read the current database
    const rawData = fs.readFileSync(dbFilePath, 'utf8');
    const dbData = JSON.parse(rawData);
    
    // Find admin user(s)
    const adminUsers = dbData.users.filter(user => user.role === 'admin');
    
    if (adminUsers.length === 0) {
      console.log('No admin users found!');
      return;
    }
    
    // Update each admin user
    let updatedCount = 0;
    dbData.users = dbData.users.map(user => {
      if (user.role === 'admin') {
        updatedCount++;
        return { 
          ...user, 
          approved: true 
        };
      }
      return user;
    });
    
    // Write the updated data back to the file
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
    
    console.log(`Updated ${updatedCount} admin user(s) to approved status`);
    console.log('Admins can now access all pages and functionality');
    
    // Display login details for convenience
    adminUsers.forEach(admin => {
      console.log('\nAdmin login details:');
      console.log('Email:', admin.email);
      console.log('Username:', admin.username);
    });
    
  } catch (error) {
    console.error('Error approving admin:', error);
  }
}

// Run the function
approveAdmin();
