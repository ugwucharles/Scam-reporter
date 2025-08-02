const mongoose = require('mongoose');
const User = require('./models/User');

const deleteAdmin = async (email) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/scam-reporter');
    console.log('Connected to database');

    // Delete user
    const result = await User.deleteOne({ email });
    if (result.deletedCount > 0) {
      console.log(`Admin user deleted successfully: ${email}`);
    } else {
      console.log(`No user found with email: ${email}`);
    }

  } catch (error) {
    console.error('Error deleting admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  }
};

// Usage: node deleteAdmin.js admin@example.com
const email = process.argv[2];

if (!email) {
  console.log('Usage: node deleteAdmin.js <email>');
  console.log('Example: node deleteAdmin.js admin@example.com');
  process.exit(1);
}

deleteAdmin(email);
