const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_PHONE_NUMBER = '+1-555-SCAMMER';
const NUMBER_OF_REPORTS = 20;

// Sample scam types for variety
const scamTypes = [
  'investment',
  'romance',
  'phishing',
  'tech_support',
  'online_shopping',
  'crypto',
  'fake_job',
  'lottery',
  'identity_theft'
];

// Sample data templates
const reportTemplates = [
  {
    title: 'Investment Scam Call',
    description: 'Someone called offering guaranteed investment returns. They were very pushy and asked for personal banking information.',
    scamType: 'investment'
  },
  {
    title: 'Romance Scam Phone Call',
    description: 'Received calls from someone claiming to be in love with me and asking for money for emergencies.',
    scamType: 'romance'
  },
  {
    title: 'Fake Bank Security Call',
    description: 'Called claiming to be from my bank security department asking to verify account details over the phone.',
    scamType: 'phishing'
  },
  {
    title: 'Tech Support Scam',
    description: 'Called claiming my computer was infected and needed immediate remote access to fix it.',
    scamType: 'tech_support'
  },
  {
    title: 'Online Shopping Scam',
    description: 'Called about a fake order confirmation and tried to get credit card details to "cancel" the order.',
    scamType: 'online_shopping'
  },
  {
    title: 'Cryptocurrency Investment Fraud',
    description: 'Called with promises of guaranteed Bitcoin profits if I invest immediately over the phone.',
    scamType: 'crypto'
  },
  {
    title: 'Fake Job Offer Scam',
    description: 'Called offering a work-from-home job but wanted personal information and upfront payment.',
    scamType: 'fake_job'
  },
  {
    title: 'Lottery Winner Scam',
    description: 'Called claiming I won a lottery I never entered and needed to pay fees to claim the prize.',
    scamType: 'lottery'
  },
  {
    title: 'Identity Theft Attempt',
    description: 'Called pretending to be from government agency asking for SSN and personal details.',
    scamType: 'identity_theft'
  }
];

async function generateReportData(index) {
  const template = reportTemplates[index % reportTemplates.length];
  const reportNumber = index + 1;
  
  return {
    title: `${template.title} - Report #${reportNumber}`,
    description: `${template.description} This is report number ${reportNumber} for the same scammer phone number. The caller was persistent and tried multiple times to scam me.`,
    scamType: template.scamType,
    dateOccurred: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 30 days
    scammerName: `Scammer #${reportNumber}`,
    scammerPhone: TEST_PHONE_NUMBER,
    scammerEmail: `scammer${reportNumber}@fakeemail.com`,
    location: `Test City ${reportNumber}, Test State`,
    amountLost: Math.floor(Math.random() * 5000).toString(),
    reporterName: `Test Reporter ${reportNumber}`,
    reporterEmail: `reporter${reportNumber}@test.com`,
    reporterPhone: `+1-555-000-${String(reportNumber).padStart(4, '0')}`,
    additionalDetails: `This is a test report #${reportNumber} to test the blacklist functionality. The scammer used the same phone number across multiple scam attempts.`
  };
}

async function submitReport(reportData, index) {
  try {
    console.log(`📤 Submitting report ${index + 1}/${NUMBER_OF_REPORTS}...`);
    
    const response = await axios.post(`${API_BASE_URL}/scams`, reportData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`✅ Report ${index + 1} submitted successfully! ID: ${response.data.report._id}`);
    return {
      success: true,
      reportId: response.data.report._id,
      index: index + 1
    };
    
  } catch (error) {
    console.error(`❌ Error submitting report ${index + 1}:`, 
      error.response?.data?.message || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      index: index + 1
    };
  }
}

async function searchForReports(phoneNumber) {
  try {
    console.log(`🔍 Searching for reports with phone number: ${phoneNumber}`);
    
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        phone: phoneNumber,
        limit: 50
      },
      timeout: 10000
    });
    
    console.log(`📊 Search Results:`);
    console.log(`   Total reports found: ${response.data.results.length}`);
    console.log(`   Search criteria: Phone = ${phoneNumber}`);
    
    if (response.data.results.length > 0) {
      console.log(`\n📋 Report Details:`);
      response.data.results.forEach((report, index) => {
        console.log(`   ${index + 1}. ${report.title}`);
        console.log(`      Scam Type: ${report.scamType}`);
        console.log(`      Date: ${new Date(report.createdAt).toLocaleDateString()}`);
        console.log(`      Amount Lost: $${report.financialLoss?.amount || 'N/A'}`);
        console.log(`      Status: ${report.status}`);
        console.log(`      Relevance Score: ${report.relevanceScore || 'N/A'}`);
        console.log('');
      });
    }
    
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error searching for reports:`, 
      error.response?.data?.message || error.message);
    return null;
  }
}

async function testBlacklistFunctionality() {
  console.log('🧪 Testing Blacklist Functionality');
  console.log('==================================');
  console.log(`Target Phone Number: ${TEST_PHONE_NUMBER}`);
  console.log(`Number of Reports to Submit: ${NUMBER_OF_REPORTS}`);
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log('');
  
  // Step 1: Test API connection
  try {
    console.log('🔗 Testing API connection...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log(`✅ API is running: ${healthResponse.data.message}`);
  } catch (error) {
    console.error('❌ API is not responding. Make sure the server is running on port 5000');
    console.error('   Run: npm start');
    return;
  }
  
  console.log('\n📤 Submitting Reports...');
  console.log('========================');
  
  const results = [];
  const successfulReports = [];
  
  // Step 2: Submit multiple reports with the same phone number
  for (let i = 0; i < NUMBER_OF_REPORTS; i++) {
    const reportData = await generateReportData(i);
    const result = await submitReport(reportData, i);
    results.push(result);
    
    if (result.success) {
      successfulReports.push(result);
    }
    
    // Small delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Submission Summary');
  console.log('====================');
  console.log(`Total attempts: ${results.length}`);
  console.log(`Successful submissions: ${successfulReports.length}`);
  console.log(`Failed submissions: ${results.length - successfulReports.length}`);
  
  if (successfulReports.length === 0) {
    console.log('❌ No reports were successfully submitted. Cannot test blacklist functionality.');
    return;
  }
  
  // Step 3: Wait a moment for database to process
  console.log('\n⏳ Waiting for database processing...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Step 4: Search for the reports using the phone number
  console.log('\n🔍 Testing Search Functionality');
  console.log('==============================');
  
  const searchResults = await searchForReports(TEST_PHONE_NUMBER);
  
  if (searchResults) {
    console.log('\n🎯 Blacklist Test Results');
    console.log('=========================');
    
    const foundReports = searchResults.results.length;
    const expectedReports = successfulReports.length;
    
    if (foundReports > 0) {
      console.log(`✅ SUCCESS: Found ${foundReports} reports for phone number ${TEST_PHONE_NUMBER}`);
      
      if (foundReports >= 10) {
        console.log('🚨 BLACKLIST ALERT: This phone number has been reported multiple times!');
        console.log('   This number should be considered HIGH RISK for scam activity.');
      } else if (foundReports >= 5) {
        console.log('⚠️  WARNING: This phone number has multiple reports.');
        console.log('   Users should be cautious when dealing with this number.');
      }
      
      // Check for patterns
      const scamTypes = [...new Set(searchResults.results.map(r => r.scamType))];
      const totalLoss = searchResults.results.reduce((sum, r) => sum + (r.financialLoss?.amount || 0), 0);
      
      console.log(`\n📈 Pattern Analysis:`);
      console.log(`   Scam Types Used: ${scamTypes.join(', ')}`);
      console.log(`   Total Financial Impact: $${totalLoss.toLocaleString()}`);
      console.log(`   Average Loss per Report: $${(totalLoss / foundReports).toFixed(2)}`);
      console.log(`   Reports Span: Multiple dates (see details above)`);
      
    } else {
      console.log(`❌ No reports found for phone number ${TEST_PHONE_NUMBER}`);
      console.log('   This could indicate an issue with the search functionality or database indexing.');
    }
  }
  
  console.log('\n🏁 Test Complete!');
  console.log('================');
  console.log('You can now:');
  console.log(`1. Search for "${TEST_PHONE_NUMBER}" in your frontend application`);
  console.log('2. Observe how multiple reports for the same number are displayed');
  console.log('3. Test the blacklist/warning functionality in your UI');
  console.log('4. Verify that the relevance scoring works correctly');
  console.log('\nTo clean up test data, you can delete reports with scammerPhone containing "555-SCAMMER"');
}

// Run the test
if (require.main === module) {
  testBlacklistFunctionality()
    .then(() => {
      console.log('\n✅ Blacklist test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed with error:', error.message);
      process.exit(1);
    });
}

module.exports = { testBlacklistFunctionality, searchForReports };
