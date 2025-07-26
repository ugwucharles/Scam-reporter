const mongoose = require('mongoose');
const ScamReport = require('./models/ScamReport');
require('dotenv').config();

async function approveReports() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all pending reports to approved
    const result = await ScamReport.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );

    console.log(`Updated ${result.modifiedCount} reports from pending to approved`);

    // Get all reports to show current status
    const allReports = await ScamReport.find({}, 'title status createdAt').sort({ createdAt: -1 });
    console.log('\nAll reports in database:');
    allReports.forEach(report => {
      console.log(`- ${report.title} [${report.status}] (${report.createdAt.toISOString().split('T')[0]})`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

approveReports();
