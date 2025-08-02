const mongoose = require('mongoose');
const User = require('./models/User');

const debugUser = async (email) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/scam-reporter');
    console.log('Connected to database');

    // Find user
    const user = await User.findOne({ email });
    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('Role:', user.role);
      console.log('Password hash:', user.password);
      console.log('Password length:', user.password.length);
      
      // Test password comparison
      const testPassword = 'admin123';
      const isMatch = await user.comparePassword(testPassword);
      console.log(`Password "${testPassword}" matches:`, isMatch);
    } else {
      console.log(`No user found with email: ${email}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  }
};

// Usage: node debugUser.js admin@example.com
const email = process.argv[2];

if (!email) {
  console.log('Usage: node debugUser.js <email>');
  console.log('Example: node debugUser.js admin@example.com');
  process.exit(1);
}

debugUser(email);
