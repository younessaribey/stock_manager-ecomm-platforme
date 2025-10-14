// min-create-sqlize.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

(async () => {
  // Ensure CNX_STRING exists
  const url = process.env.CNX_STRING;
  if (!url) {
    console.error('✋ Missing CNX_STRING in .env. Aborting.');
    process.exit(1);
  }

  // Init Sequelize with SSL for Render
  const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false, // set to console.log to debug SQL
  });

  // Define only the fields we need
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Admin User',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  try {
    console.log('🔌 Connecting to DB...');
    await sequelize.authenticate();
    console.log('✅ Connection established.');

    // Make sure the table exists; remove force:true in prod!
    await User.sync();

    // Hash the test password
    const plainPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);

    // Upsert the admin user
    const [user, created] = await User.upsert({
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashed,
      role: 'admin',
      approved: true,
    }, { returning: true });

    if (created) {
      console.log('🎉 Admin user created.');
    } else {
      console.log('🔄 Admin user updated.');
    }

    console.log('\n🔑 Credentials:');
    console.log('Email:   admin@example.com');
    console.log('Password:', plainPassword);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sequelize.close();
    console.log('🛑 Connection closed.');
  }
})();
