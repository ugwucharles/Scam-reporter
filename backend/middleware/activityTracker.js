const Activity = require('../models/Activity');
const geoip = require('geoip-lite');

// Generate session ID for anonymous users
const generateSessionId = (req) => {
  return req.sessionID || `${req.ip}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get location from IP address
const getLocationFromIP = (ip) => {
  try {
    // Handle localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
    
    const geo = geoip.lookup(ip);
    if (geo) {
      return {
        country: geo.country,
        region: geo.region,
        city: geo.city,
        latitude: geo.ll ? geo.ll[0] : null,
        longitude: geo.ll ? geo.ll[1] : null,
        timezone: geo.timezone
      };
    }
  } catch (error) {
    console.error('Error getting location from IP:', error);
  }
  
  return {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown'
  };
};

// Main activity tracking function
const logActivity = async (activityType, req, details = {}) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) || 'unknown';
    
    const sessionId = generateSessionId(req);
    const location = getLocationFromIP(clientIP);
    
    const activityData = {
      activityType,
      userId: req.user ? req.user._id : null,
      sessionId,
      details: {
        ...details,
        userAgent: req.get('User-Agent') || 'Unknown',
        referrer: req.get('Referer') || req.get('Referrer') || 'Direct'
      },
      ipAddress: clientIP,
      location,
      timestamp: new Date()
    };
    
    const activity = new Activity(activityData);
    await activity.save();
    
    console.log(`Activity logged: ${activityType} from ${clientIP}`);
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Middleware function to automatically track certain activities
const trackActivity = (activityType, getDetails = () => ({})) => {
  return async (req, res, next) => {
    try {
      // Log the activity
      await logActivity(activityType, req, getDetails(req));
    } catch (error) {
      console.error('Activity tracking middleware error:', error);
    }
    next();
  };
};

// Response interceptor to log activities after successful operations
const trackActivityAfterResponse = (activityType, getDetails = () => ({})) => {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      // Only log if response is successful
      if (res.statusCode >= 200 && res.statusCode < 400) {
        logActivity(activityType, req, getDetails(req, data)).catch(console.error);
      }
      originalSend.call(this, data);
    };
    next();
  };
};

module.exports = {
  logActivity,
  trackActivity,
  trackActivityAfterResponse,
  getLocationFromIP,
  generateSessionId
};
