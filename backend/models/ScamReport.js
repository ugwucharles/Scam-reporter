const mongoose = require('mongoose');

const scamReportSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  scamType: {
    type: String,
    required: true,
    enum: [
      'online_shopping',
      'investment',
      'romance',
      'phishing',
      'fake_job',
      'crypto',
      'tech_support',
      'charity',
      'lottery',
      'rental',
      'identity_theft',
      'other'
    ]
  },
  
  // Scammer Information
  scammerInfo: {
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    socialMedia: [{
      platform: String,
      username: String,
      url: String
    }],
    businessName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    address: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },
  
  // Financial Information
  financialLoss: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'credit_card', 'paypal', 'crypto', 'cash', 'check', 'other']
    }
  },
  
  // Location and Date
  location: {
    country: String,
    state: String,
    city: String
  },
  dateOccurred: {
    type: Date,
    required: true
  },
  
  // Evidence
  evidence: [{
    type: {
      type: String,
      enum: ['screenshot', 'document', 'email', 'text_message', 'other']
    },
    filename: String,
    url: String,
    description: String
  }],
  
  // Reporter Information
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous reports
  },
  reporterContact: {
    allowContact: {
      type: Boolean,
      default: false
    },
    contactMethod: {
      type: String,
      enum: ['email', 'phone', 'none'],
      default: 'none'
    }
  },
  
  // Status and Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationNotes: {
    type: String,
    maxlength: 500
  },
  
  // Engagement
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  downvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  
  // Flags and Reports
  flags: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'false_info', 'duplicate', 'other']
    },
    details: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // SEO and Search
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Analytics
  severity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better search performance
scamReportSchema.index({ 'scammerInfo.email': 1 });
scamReportSchema.index({ 'scammerInfo.phone': 1 });
scamReportSchema.index({ 'scammerInfo.website': 1 });
scamReportSchema.index({ 'scammerInfo.businessName': 'text' });
scamReportSchema.index({ title: 'text', description: 'text' });
scamReportSchema.index({ scamType: 1 });
scamReportSchema.index({ status: 1 });
scamReportSchema.index({ createdAt: -1 });
scamReportSchema.index({ tags: 1 });

// Virtual for vote score
scamReportSchema.virtual('voteScore').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Ensure virtual fields are serialized
scamReportSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ScamReport', scamReportSchema);
