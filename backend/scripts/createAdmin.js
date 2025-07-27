const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: 'ADMIN1' },
        { email: 'admin@scam-reporter.com' }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      
      // Update role if needed
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user role to admin');
      }
      
      return;
    }

    // Create new admin user
    const adminUser = new User({
      username: 'ADMIN1',
      email: 'admin@scam-reporter.com',
      password: 'Emeka100',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();

    console.log('Admin user created successfully:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      id: adminUser._id
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
createAdminUser();
