const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Load environment variables
require('dotenv').config();

// Google Safe Browsing API base URL
const baseUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

// Rate limiting for website checker (temporarily disabled for testing)
const websiteCheckLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased limit for testing
  message: {
    error: 'Too many website checks from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// URL validation function
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Input sanitization
const sanitizeUrl = (url) => {
  return url.trim().toLowerCase();
};

// Check website legitimacy
router.post('/check-website', async (req, res) => {
  const { url } = req.body;

  // Input validation
  if (!url) {
    return res.status(400).json({ 
      error: 'URL is required',
      safe: false 
    });
  }

  // Sanitize input
  const sanitizedUrl = sanitizeUrl(url);

  // Validate URL format
  if (!isValidUrl(sanitizedUrl)) {
    return res.status(400).json({ 
      error: 'Invalid URL format. Please include http:// or https://',
      safe: false 
    });
  }

  // Security: Block certain suspicious patterns
  const suspiciousPatterns = [
    /localhost/i,
    /127\.0\.0\.1/,
    /192\.168\./,
    /10\./,
    /172\.(1[6-9]|2[0-9]|3[0-1])\./
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(sanitizedUrl))) {
    return res.status(400).json({ 
      error: 'Cannot check internal/private network URLs',
      safe: false 
    });
  }

  try {
    // Log the request for monitoring (without sensitive data)
    console.log(`Website check requested for domain: ${new URL(sanitizedUrl).hostname}`);

    // Basic safety checks without external API
    const domain = new URL(sanitizedUrl).hostname.toLowerCase();
    
    // Check for suspicious patterns in domain
    const suspiciousKeywords = [
      'scam', 'fraud', 'fake', 'phishing', 'malware', 'virus',
      'hack', 'steal', 'money', 'bank', 'credit', 'card',
      'password', 'login', 'secure', 'verify', 'confirm'
    ];
    
    const hasSuspiciousKeywords = suspiciousKeywords.some(keyword => 
      domain.includes(keyword)
    );
    
    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq'];
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => 
      domain.endsWith(tld)
    );
    
    // Check for IP addresses (often suspicious)
    const isIPAddress = /^\d+\.\d+\.\d+\.\d+$/.test(domain);
    
    // Check for very long domains (often suspicious)
    const isVeryLongDomain = domain.length > 50;
    
    // Check for excessive subdomains
    const subdomainCount = domain.split('.').length - 1;
    const hasExcessiveSubdomains = subdomainCount > 3;
    
    // Determine safety based on checks
    const safetyScore = {
      suspiciousKeywords: hasSuspiciousKeywords ? -30 : 0,
      suspiciousTLD: hasSuspiciousTLD ? -40 : 0,
      ipAddress: isIPAddress ? -20 : 0,
      longDomain: isVeryLongDomain ? -15 : 0,
      excessiveSubdomains: hasExcessiveSubdomains ? -10 : 0
    };
    
    const totalScore = Object.values(safetyScore).reduce((sum, score) => sum + score, 0);
    const isSafe = totalScore >= -10; // Stricter threshold for safety
    
    // Additional check: Try to fetch the website to see if it's accessible
    let isAccessible = false;
    try {
      const response = await axios.get(sanitizedUrl, {
        timeout: 5000,
        maxRedirects: 3,
        validateStatus: () => true // Accept any status code
      });
      isAccessible = response.status < 500; // Consider accessible if not server error
    } catch (fetchError) {
      // Website might be down or blocking requests
      console.log(`Website accessibility check failed for ${domain}:`, fetchError.message);
    }
    
    // If Google API key is available, use it as additional check
    if (process.env.GOOGLE_API_KEY) {
      try {
        const googleResponse = await axios.post(baseUrl, {
          client: {
            clientId: "scam-reporter",
            clientVersion: "1.0"
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [
              { "url": sanitizedUrl }
            ]
          }
        }, {
          params: {
            key: process.env.GOOGLE_API_KEY
          },
          timeout: 10000
        });

        if (googleResponse.data.matches) {
          console.log(`Google Safe Browsing threat detected for domain: ${domain}`);
          return res.json({ 
            safe: false, 
            threats: googleResponse.data.matches,
            checkedUrl: sanitizedUrl,
            analysis: {
              method: 'google_safe_browsing',
              score: -100,
              details: 'Threat detected by Google Safe Browsing API'
            }
          });
        }
      } catch (googleError) {
        console.log('Google Safe Browsing API check failed, using fallback analysis');
      }
    }
    
    // Return results based on our analysis
    const analysis = {
      method: 'basic_analysis',
      score: totalScore,
      details: {
        suspiciousKeywords: hasSuspiciousKeywords,
        suspiciousTLD: hasSuspiciousTLD,
        ipAddress: isIPAddress,
        longDomain: isVeryLongDomain,
        excessiveSubdomains: hasExcessiveSubdomains,
        accessible: isAccessible
      }
    };
    
    // Debug logging
    console.log('Analysis results:', {
      domain,
      hasSuspiciousKeywords,
      hasSuspiciousTLD,
      isIPAddress,
      isVeryLongDomain,
      hasExcessiveSubdomains,
      totalScore,
      isSafe,
      analysis
    });
    
    if (isSafe) {
      console.log('Returning safe response with analysis');
      res.json({ 
        safe: true, 
        message: "This URL appears to be safe based on our analysis.",
        checkedUrl: sanitizedUrl,
        analysis
      });
    } else {
      console.log('Returning unsafe response with analysis');
      res.json({ 
        safe: false, 
        message: "This URL shows suspicious characteristics.",
        checkedUrl: sanitizedUrl,
        analysis
      });
    }
    
  } catch (error) {
    console.error('Error checking website:', {
      message: error.message,
      domain: sanitizedUrl ? new URL(sanitizedUrl).hostname : 'unknown'
    });
    
    res.status(500).json({ 
      error: 'Failed to check website. Please try again.',
      safe: false 
    });
  }
});

module.exports = router;
