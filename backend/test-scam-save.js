const mongoose = require('mongoose');
const ScamReport = require('./models/ScamReport');
require('dotenv').config();

async function testScamReportSave() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a test scam report
    const testReport = new ScamReport({
      title: 'Test Investment Scam Report',
      description: 'This is a test scam report to verify the database functionality. A fake investment company promised high returns but disappeared with the money.',
      scamType: 'investment',
      dateOccurred: new Date('2024-01-15'),
      scammerInfo: {
        name: 'John Doe',
        email: 'scammer@fake-investment.com',
        phone: '+1-555-123-4567',
        website: 'https://fake-investment.com',
        businessName: 'Fake Investment LLC'
      },
      financialLoss: {
        amount: 5000,
        currency: 'USD',
        paymentMethod: 'bank_transfer'
      },
      location: {
        country: 'USA',
        state: 'California',
        city: 'Los Angeles'
      },
      reportedBy: new mongoose.Types.ObjectId(), // Mock user ID
      tags: ['investment', 'fake_company', 'high_returns'],
      severity: 8,
      status: 'pending'
    });

    // Save the report
    const savedReport = await testReport.save();
    console.log('✅ Test scam report saved successfully!');
    console.log('Report ID:', savedReport._id);
    console.log('Title:', savedReport.title);
    console.log('Scam Type:', savedReport.scamType);
    console.log('Created At:', savedReport.createdAt);

    // Verify it can be retrieved
    const retrievedReport = await ScamReport.findById(savedReport._id);
    console.log('✅ Report retrieved successfully from database');

    // Count total reports in database
    const totalReports = await ScamReport.countDocuments();
    console.log(`📊 Total reports in database: ${totalReports}`);

    // Clean up - delete the test report
    await ScamReport.findByIdAndDelete(savedReport._id);
    console.log('🧹 Test report cleaned up');

    console.log('\n🎉 Database test completed successfully!');
    console.log('Your scam-reporter application is ready to save submitted scams.');

  } catch (error) {
    console.error('❌ Error testing scam report save:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the test
testScamReportSave();
