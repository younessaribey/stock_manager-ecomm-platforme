// server/config/profileDb.js
const { User } = require('./dbSequelize');

module.exports = {
  findByEmail: async (email) => User.findOne({ where: { email } }),
  findByUserId: async (id) => User.findByPk(id),
  addProfile: async (profile) => User.create(profile),
  updateProfile: async (id, updates) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(updates);
  },
};

/*const fs = require('fs');
const path = require('path');

// Database configuration for user profiles
const PROFILE_FILE = path.join(__dirname, '../../db/profile.json');

class ProfileDatabase {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    if (!fs.existsSync(PROFILE_FILE)) {
      fs.writeFileSync(PROFILE_FILE, JSON.stringify({ users: [] }, null, 2));
      return { users: [] };
    }
    const rawData = fs.readFileSync(PROFILE_FILE, 'utf8');
    return JSON.parse(rawData);
  }

  saveData() {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(this.data, null, 2));
  }

  findByEmail(email) {
    return this.data.users.find(item => item.email === email);
  }

  findByUserId(userId) {
    return this.data.users.find(item => item.id === userId);
  }

  addProfile(profile) {
    this.data.users.push(profile);
    this.saveData();
    return profile;
  }

  updateProfile(userId, updates) {
    const index = this.data.users.findIndex(item => item.id === userId);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.saveData();
      return this.data.users[index];
    }
    return null;
  }
}

const profileDb = new ProfileDatabase();
module.exports = profileDb;
*/