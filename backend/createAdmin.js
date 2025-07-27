const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async (email, password) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/scam-reporter');
    console.log('Connected to database');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      username: 'adminuser',
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log(`Admin user created successfully: ${email}`);

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  }
};

// Usage: node createAdmin.js admin@example.com password123
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node createAdmin.js <email> <password>');
  console.log('Example: node createAdmin.js admin@example.com password123');
  process.exit(1);
}

createAdmin(email, password);
