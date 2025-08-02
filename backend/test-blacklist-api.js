const axios = require('axios');

async function testBlacklistAPI() {
  try {
    console.log('🔍 Testing Blacklist API Functionality\n');
    
    // Test the search API with our blacklisted phone number
    const response = await axios.get('http://localhost:5000/api/search', {
      params: {
        q: '+1-555-SCAMMER',
        page: 1,
        limit: 5
      }
    });
    
    console.log('📊 API Response Summary:');
    console.log(`Total Results: ${response.data.results.length}`);
    console.log(`Total Found: ${response.data.pagination.totalResults}`);
    
    // Check if blacklistInfo is included
    if (response.data.blacklistInfo) {
      console.log('\n🚨 BLACKLIST INFORMATION:');
      console.log('─'.repeat(50));
      const blacklist = response.data.blacklistInfo;
      
      console.log(`Is Blacklisted: ${blacklist.isBlacklisted}`);
      console.log(`Risk Level: ${blacklist.riskLevel}`);
      console.log(`Report Count: ${blacklist.reportCount}`);
      console.log(`Type: ${blacklist.type}`);
      console.log(`Entity: ${blacklist.entity}`);
      
      if (blacklist.message) {
        console.log('\n📢 Warning Message:');
        console.log(`"${blacklist.message}"`);
      }
      
      if (blacklist.isBlacklisted) {
        console.log('\n✅ SUCCESS: Blacklist detection is working!');
        console.log('The API correctly identified this as a blacklisted number.');
      } else {
        console.log('\n❌ Issue: Number should be blacklisted but wasn\'t detected.');
      }
    } else {
      console.log('\n❌ ERROR: blacklistInfo not found in API response');
      console.log('The blacklist functionality may not be working properly.');
    }
    
    // Show sample of first result
    if (response.data.results.length > 0) {
      const firstResult = response.data.results[0];
      console.log('\n📋 Sample Result:');
      console.log(`Title: ${firstResult.title}`);
      console.log(`Phone: ${firstResult.scammerInfo.phone}`);
      console.log(`Type: ${firstResult.scamType}`);
      console.log(`Amount Lost: $${firstResult.financialLoss.amount}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testBlacklistAPI();
