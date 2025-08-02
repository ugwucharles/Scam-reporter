const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityType: {
    type: String,
    required: true,
    enum: [
      'search_query',
      'website_check',
      'report_view',
      'report_submit',
      'user_login',
      'user_register'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for anonymous activities
  },
  sessionId: {
    type: String,
    required: true // For tracking anonymous users
  },
  details: {
    query: String, // For search queries
    website: String, // For website checks
    reportId: String, // For report interactions
    userAgent: String,
    referrer: String,
    result: String, // Search results count, website check status, etc.
    additionalData: mongoose.Schema.Types.Mixed // For any extra data
  },
  ipAddress: {
    type: String,
    required: true
  },
  location: {
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    timezone: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true,
  index: { timestamp: -1, activityType: 1, userId: 1 }
});

// Index for efficient querying
activitySchema.index({ timestamp: -1 });
activitySchema.index({ activityType: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ sessionId: 1, timestamp: -1 });
activitySchema.index({ ipAddress: 1, timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);
