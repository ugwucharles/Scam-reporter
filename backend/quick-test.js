const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_PHONE_NUMBER = '+1-555-SCAMMER';

async function quickTest() {
  try {
    // First, test if the server is running
    console.log('Testing server connection...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Server is running:', healthResponse.data.message);

    // Submit just one test report
    console.log('\n📤 Submitting test report...');
    const testReport = {
      title: 'Test Scam Report for Blacklist',
      description: 'This is a test report to verify the blacklist functionality works correctly.',
      scamType: 'investment',
      dateOccurred: new Date().toISOString().split('T')[0],
      scammerName: 'Test Scammer',
      scammerPhone: TEST_PHONE_NUMBER,
      scammerEmail: 'testscammer@example.com',
      location: 'Test City, Test State',
      amountLost: '1000',
      reporterName: 'Test Reporter',
      reporterEmail: 'testreporter@example.com',
      reporterPhone: '+1-555-000-0001',
      additionalDetails: 'This is a test report for blacklist functionality testing.'
    };

    const submitResponse = await axios.post(`${API_BASE_URL}/scams`, testReport);
    console.log('✅ Test report submitted successfully!');
    console.log('Report ID:', submitResponse.data.report._id);
    console.log('Status:', submitResponse.data.report.status);

    // Wait a moment and then search
    console.log('\n⏳ Waiting for database processing...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Search for the report
    console.log('\n🔍 Searching for reports...');
    const searchResponse = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        phone: TEST_PHONE_NUMBER,
        limit: 50
      }
    });

    console.log(`📊 Found ${searchResponse.data.results.length} reports for phone number ${TEST_PHONE_NUMBER}`);
    
    if (searchResponse.data.results.length > 0) {
      console.log('\n✅ Search functionality is working!');
      console.log('Now you can run the full test with: node test-blacklist.js');
    } else {
      console.log('\n⚠️ No reports found. This might be due to report approval requirements.');
      console.log('Reports might need to be approved before they appear in search results.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server is not running. Please start it with: npm start');
    }
  }
}

quickTest();
