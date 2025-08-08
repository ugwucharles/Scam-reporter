const axios = require('axios');

// reCAPTCHA v2 verification middleware
const verifyRecaptcha = async (req, res, next) => {
  try {
    console.log('🔍 reCAPTCHA verification started...');
    
    const recaptchaToken = req.body.recaptchaToken || req.body['g-recaptcha-response'];
    
    if (!recaptchaToken) {
      console.log('❌ No reCAPTCHA token provided');
      return res.status(400).json({ 
        message: 'reCAPTCHA verification required',
        error: 'Missing reCAPTCHA token'
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.log('❌ reCAPTCHA secret key not configured');
      return res.status(500).json({ 
        message: 'reCAPTCHA configuration error',
        error: 'Server misconfiguration'
      });
    }

    // Verify token with Google's reCAPTCHA API
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verificationData = {
      secret: secretKey,
      response: recaptchaToken,
      remoteip: req.ip || req.connection.remoteAddress
    };

    console.log('📡 Verifying with Google reCAPTCHA API...');
    console.log('Token (first 20 chars):', recaptchaToken.substring(0, 20) + '...');
    console.log('Remote IP:', verificationData.remoteip);

    const response = await axios.post(verificationUrl, null, {
      params: verificationData,
      timeout: 10000 // 10 second timeout
    });

    console.log('📨 Google reCAPTCHA response:', response.data);

    if (!response.data.success) {
      console.log('❌ reCAPTCHA verification failed');
      console.log('Error codes:', response.data['error-codes']);
      
      return res.status(400).json({ 
        message: 'reCAPTCHA verification failed',
        error: 'Invalid reCAPTCHA response',
        details: response.data['error-codes']
      });
    }

    console.log('✅ reCAPTCHA verification successful');
    
    // Add verification result to request object
    req.recaptcha = {
      success: true,
      challengeTimestamp: response.data.challenge_ts,
      hostname: response.data.hostname
    };

    next();

  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error.message);
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(500).json({ 
        message: 'reCAPTCHA verification timeout',
        error: 'Unable to verify reCAPTCHA at this time'
      });
    }
    
    return res.status(500).json({ 
      message: 'reCAPTCHA verification error',
      error: 'Internal server error during verification'
    });
  }
};

// Optional reCAPTCHA verification (for testing or optional endpoints)
const optionalRecaptcha = async (req, res, next) => {
  const recaptchaToken = req.body.recaptchaToken || req.body['g-recaptcha-response'];
  
  if (!recaptchaToken) {
    console.log('⚠️ No reCAPTCHA token provided (optional verification)');
    req.recaptcha = { success: false, optional: true };
    return next();
  }
  
  // If token is provided, verify it
  return verifyRecaptcha(req, res, next);
};

module.exports = {
  verifyRecaptcha,
  optionalRecaptcha
};
