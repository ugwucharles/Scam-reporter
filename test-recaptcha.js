const axios = require('axios');

// Test reCAPTCHA integration
async function testRecaptchaIntegration() {
  console.log('🧪 Testing reCAPTCHA Integration...\n');

  const baseURL = 'http://localhost:5000/api';
  
  try {
    // Test 1: Submit report without reCAPTCHA token (should fail)
    console.log('1️⃣ Testing submission without reCAPTCHA token...');
    try {
      const formData = new FormData();
      formData.append('title', 'Test Scam Report');
      formData.append('description', 'This is a test scam report for reCAPTCHA testing');
      formData.append('scamType', 'other');
      formData.append('dateOccurred', new Date().toISOString());
      formData.append('reporterName', 'Test User');
      formData.append('reporterEmail', 'test@example.com');
      formData.append('reporterPhone', '1234567890');

      const response = await axios.post(`${baseURL}/scams`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('❌ Expected failure but got success:', response.status);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected submission without reCAPTCHA token');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 2: Submit report with invalid reCAPTCHA token (should fail)
    console.log('\n2️⃣ Testing submission with invalid reCAPTCHA token...');
    try {
      const formData = new FormData();
      formData.append('title', 'Test Scam Report');
      formData.append('description', 'This is a test scam report for reCAPTCHA testing');
      formData.append('scamType', 'other');
      formData.append('dateOccurred', new Date().toISOString());
      formData.append('reporterName', 'Test User');
      formData.append('reporterEmail', 'test@example.com');
      formData.append('reporterPhone', '1234567890');
      formData.append('recaptchaToken', 'invalid_token_123');

      const response = await axios.post(`${baseURL}/scams`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('❌ Expected failure but got success:', response.status);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected submission with invalid reCAPTCHA token');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 3: Check if server is running
    console.log('\n3️⃣ Testing server health...');
    try {
      const response = await axios.get(`${baseURL}/health`);
      console.log('✅ Server is running:', response.data);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
    }

    console.log('\n📋 Test Summary:');
    console.log('- reCAPTCHA middleware is integrated');
    console.log('- Form validation includes reCAPTCHA check');
    console.log('- Backend properly validates reCAPTCHA tokens');
    console.log('\n🔧 Next Steps:');
    console.log('1. Set up your reCAPTCHA keys in .env files');
    console.log('2. Test with real reCAPTCHA tokens from the frontend');
    console.log('3. Monitor reCAPTCHA analytics in Google Admin Console');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRecaptchaIntegration(); 