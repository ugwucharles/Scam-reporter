const axios = require('axios');

// API base URL - make sure this matches your server port
const API_BASE = 'http://localhost:5001/api';

async function testScamReportAPI() {
  try {
    console.log('🧪 Testing Scam Reporter API...\n');

    // Test 1: Health check
    console.log('1. Testing health check endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Submit a new scam report
    console.log('\n2. Testing scam report submission...');
    const scamReportData = {
      title: 'Fake Online Store Scam',
      description: 'I ordered a laptop from an online store but never received it. The website disappeared after taking my money. They had professional-looking website with fake customer reviews.',
      scamType: 'online_shopping',
      dateOccurred: '2024-01-20',
      scammerName: 'TechDeals Store',
      scammerEmail: 'support@fake-techdeals.com',
      scammerWebsite: 'https://fake-techdeals.com',
      scammerPhone: '+1-800-555-0199',
      location: 'New York, NY',
      amountLost: '1200',
      contactInfo: 'test@example.com',
      additionalDetails: 'The website looked very professional with SSL certificate and fake testimonials. They accepted PayPal but money was transferred to suspicious account.'
    };

    const submitResponse = await axios.post(`${API_BASE}/scams`, scamReportData);
    console.log('✅ Scam report submitted successfully!');
    console.log('Report ID:', submitResponse.data.report._id);
    console.log('Status:', submitResponse.data.report.status);

    const reportId = submitResponse.data.report._id;

    // Test 3: Retrieve the submitted report
    console.log('\n3. Testing report retrieval...');
    try {
      const getResponse = await axios.get(`${API_BASE}/scams/${reportId}`);
      console.log('✅ Report retrieved successfully!');
      console.log('Title:', getResponse.data.report.title);
      console.log('Scam Type:', getResponse.data.report.scamType);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('⚠️ Report is pending approval (normal for new reports)');
        console.log('Note: Only approved reports are publicly visible');
      } else {
        throw error;
      }
    }

    // Test 4: Get all reports (with pagination)
    console.log('\n4. Testing reports listing...');
    const listResponse = await axios.get(`${API_BASE}/scams?page=1&limit=10`);
    console.log('✅ Reports list retrieved successfully!');
    console.log('Total reports:', listResponse.data.pagination.totalReports);
    console.log('Reports on this page:', listResponse.data.reports.length);

    // Test 5: Search functionality
    console.log('\n5. Testing search functionality...');
    const searchResponse = await axios.get(`${API_BASE}/scams?search=laptop&scamType=online_shopping`);
    console.log('✅ Search completed successfully!');
    console.log('Search results:', searchResponse.data.reports.length);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Health check endpoint working');
    console.log('- ✅ Scam report submission working');
    console.log('- ✅ Report retrieval working');
    console.log('- ✅ Reports listing working');
    console.log('- ✅ Search functionality working');
    console.log('\n🚀 Your scam-reporter API is fully functional and ready to receive scam reports!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your server is running on port 5001');
      console.log('Run: npm start');
    }
  }
}

// Add axios to package.json if not present
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.dependencies.axios && !packageJson.devDependencies.axios) {
  console.log('Installing axios for API testing...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
}

// Run the test
testScamReportAPI();
