const mongoose = require('mongoose');
const ScamReport = require('./models/ScamReport');
require('dotenv').config();

async function viewDatabaseReports() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    console.log('📊 Database:', process.env.MONGODB_URI);
    console.log('=' * 80);

    // Get total count
    const totalReports = await ScamReport.countDocuments();
    console.log(`\n📈 Total Reports in Database: ${totalReports}`);

    if (totalReports === 0) {
      console.log('❌ No reports found in the database');
      return;
    }

    // Get all reports
    const reports = await ScamReport.find({}).sort({ createdAt: -1 });
    
    console.log('\n📋 All Reports in Database:');
    console.log('=' * 80);

    reports.forEach((report, index) => {
      console.log(`\n${index + 1}. REPORT ID: ${report._id}`);
      console.log(`   Title: ${report.title}`);
      console.log(`   Type: ${report.scamType}`);
      console.log(`   Status: ${report.status}`);
      console.log(`   Date Occurred: ${report.dateOccurred?.toDateString() || 'Not specified'}`);
      console.log(`   Amount Lost: $${report.financialLoss?.amount || 0} ${report.financialLoss?.currency || 'USD'}`);
      console.log(`   Reported By: ${report.reportedBy ? report.reportedBy : 'Anonymous'}`);
      console.log(`   Created: ${report.createdAt?.toLocaleString()}`);
      console.log(`   Updated: ${report.updatedAt?.toLocaleString()}`);
      
      // Scammer Info
      if (report.scammerInfo?.name || report.scammerInfo?.email || report.scammerInfo?.phone) {
        console.log(`   📱 Scammer Info:`);
        if (report.scammerInfo.name) console.log(`      Name: ${report.scammerInfo.name}`);
        if (report.scammerInfo.email) console.log(`      Email: ${report.scammerInfo.email}`);
        if (report.scammerInfo.phone) console.log(`      Phone: ${report.scammerInfo.phone}`);
        if (report.scammerInfo.website) console.log(`      Website: ${report.scammerInfo.website}`);
      }

      // Location
      if (report.location?.city) {
        console.log(`   📍 Location: ${report.location.city}`);
      }

      // Evidence
      if (report.evidence && report.evidence.length > 0) {
        console.log(`   🗂️  Evidence Files: ${report.evidence.length}`);
      }

      console.log(`   📝 Description: ${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}`);
      console.log('   ' + '-'.repeat(70));
    });

    // Group by status
    console.log('\n📊 Reports by Status:');
    const statusCounts = await ScamReport.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    statusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count}`);
    });

    // Group by scam type
    console.log('\n🎯 Reports by Scam Type:');
    const typeCounts = await ScamReport.aggregate([
      { $group: { _id: '$scamType', count: { $sum: 1 } } }
    ]);
    
    typeCounts.forEach(type => {
      console.log(`   ${type._id}: ${type.count}`);
    });

    console.log('\n✅ Database verification complete!');

  } catch (error) {
    console.error('❌ Error viewing database reports:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
viewDatabaseReports();
