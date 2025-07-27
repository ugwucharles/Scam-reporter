const axios = require('axios');

async function testWebsiteChecker() {
  try {
    console.log('Testing website checker API with safe URL...');
    
    const response1 = await axios.post('http://localhost:5000/api/website-checker/check-website', {
      url: 'https://google.com'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Safe URL Response:', JSON.stringify(response1.data, null, 2));
    
    console.log('\nTesting website checker API with suspicious URL...');
    
    const response2 = await axios.post('http://localhost:5000/api/website-checker/check-website', {
      url: 'https://scam-fake-money.tk'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Suspicious URL Response:', JSON.stringify(response2.data, null, 2));
    
    // Test with an even more obvious scam URL
    console.log('\nTesting with obvious scam URL...');
    
    const response3 = await axios.post('http://localhost:5000/api/website-checker/check-website', {
      url: 'https://fake-bank-login-scam.tk'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Obvious Scam URL Response:', JSON.stringify(response3.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testWebsiteChecker(); 