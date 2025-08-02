const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');

const testLogin = async (email, password) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/scam-reporter');
    console.log('Connected to database');

    // Simulate the validation from the auth route
    console.log('Testing login for:', email);
    
    // Check if user exists (same logic as auth route)
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.email);
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password does not match');
      return;
    }
    
    console.log('Login would succeed!');
    console.log('User role:', user.role);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  }
};

// Usage: node testLogin.js admin@example.com admin123
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node testLogin.js <email> <password>');
  console.log('Example: node testLogin.js admin@example.com admin123');
  process.exit(1);
}

testLogin(email, password);
