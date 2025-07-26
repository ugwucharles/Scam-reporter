const mongoose = require('mongoose');
const ScamReport = require('./models/ScamReport');
require('dotenv').config();

async function approveAllPendingReports() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all pending reports
    const pendingReports = await ScamReport.find({ status: 'pending' });
    console.log(`Found ${pendingReports.length} pending reports`);

    if (pendingReports.length > 0) {
      // Approve all pending reports
      const result = await ScamReport.updateMany(
        { status: 'pending' },
        { status: 'approved' }
      );
      
      console.log(`✅ Approved ${result.modifiedCount} reports`);
      
      // List approved reports
      const approvedReports = await ScamReport.find({ status: 'approved' });
      console.log('\n📋 Approved Reports:');
      approvedReports.forEach((report, index) => {
        console.log(`${index + 1}. ${report.title} (${report.scamType}) - ID: ${report._id}`);
      });
    } else {
      console.log('No pending reports found');
    }

  } catch (error) {
    console.error('❌ Error approving reports:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the approval
approveAllPendingReports();
