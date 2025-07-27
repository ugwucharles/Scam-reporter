const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/scam-reporter')
  .then(() => {
    console.log('Connected to database');
    return User.find({ role: { $in: ['admin', 'moderator'] } }, 'email role');
  })
  .then(admins => {
    console.log('\nAdmin/Moderator users:');
    if (admins.length === 0) {
      console.log('No admin or moderator users found');
    } else {
      admins.forEach(user => console.log(`- ${user.email} (${user.role})`));
    }
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('\nDisconnected from database');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
