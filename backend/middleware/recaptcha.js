const axios = require('axios');

/**
 * Middleware to verify Google reCAPTCHA token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    // Skip reCAPTCHA verification if no token provided (for development/testing)
    if (!recaptchaToken) {
      console.log('No reCAPTCHA token provided - skipping verification');
      return next();
    }

    // Get secret key from environment variables
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return res.status(500).json({
        message: 'reCAPTCHA configuration error',
        error: 'Server configuration issue'
      });
    }

    // Verify token with Google reCAPTCHA API
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
        remoteip: req.ip || req.connection.remoteAddress
      }
    });

    const { success, score, action, challenge_ts, hostname, 'error-codes': errorCodes } = response.data;

    console.log('reCAPTCHA verification result:', {
      success,
      score,
      action,
      hostname,
      errorCodes
    });

    if (!success) {
      console.log('reCAPTCHA verification failed:', errorCodes);
      return res.status(400).json({
        message: 'reCAPTCHA verification failed',
        error: 'Please complete the reCAPTCHA verification',
        details: errorCodes
      });
    }

    // For reCAPTCHA v3, check the score (0.0 is very likely a bot, 1.0 is very likely a human)
    if (score !== undefined && score < 0.5) {
      console.log('reCAPTCHA score too low:', score);
      return res.status(400).json({
        message: 'reCAPTCHA verification failed',
        error: 'Suspicious activity detected. Please try again.',
        score
      });
    }

    // Store verification result in request for logging/debugging
    req.recaptchaResult = {
      success,
      score,
      action,
      hostname,
      timestamp: challenge_ts
    };

    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      message: 'reCAPTCHA verification error',
      error: 'Unable to verify reCAPTCHA. Please try again.'
    });
  }
};

/**
 * Optional reCAPTCHA verification - only verifies if token is provided
 */
const optionalRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;
  
  if (recaptchaToken) {
    return verifyRecaptcha(req, res, next);
  }
  
  next();
};

module.exports = {
  verifyRecaptcha,
  optionalRecaptcha
}; 