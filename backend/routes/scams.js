const express = require('express');
const { body, query, validationResult } = require('express-validator');
const ScamReport = require('../models/ScamReport');
const User = require('../models/User');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/scams
// @desc    Create a new scam report with file uploads
// @access  Public
router.post('/', upload.array('evidence', 5), handleUploadError, [
  body('title').isLength({ min: 5, max: 200 }).trim().escape(),
  body('description').isLength({ min: 20, max: 2000 }).trim(),
  body('scamType').isIn([
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
  ]),
  body('dateOccurred').isISO8601().toDate(),
  body('scammerName').optional().isLength({ max: 100 }).trim(),
  body('scammerPhone').optional().isLength({ max: 20 }).trim(),
  body('scammerEmail').optional().isEmail().normalizeEmail(),
  body('scammerWebsite').optional().isURL(),
  body('location').optional().isLength({ max: 200 }).trim(),
  body('amountLost').optional().isNumeric(),
  body('contactInfo').optional().isLength({ max: 200 }).trim(),
  body('additionalDetails').optional().isLength({ max: 1000 }).trim(),
  body('reporterName').optional().isLength({ max: 100 }).trim(),
  body('reporterEmail').optional().isEmail().normalizeEmail(),
  body('reporterPhone').optional().isLength({ max: 20 }).trim()
], async (req, res) => {
  try {
    console.log('=== SCAM REPORT SUBMISSION ===');
    console.log('Request body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('=== VALIDATION ERRORS ===');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
      console.log('========================');
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        receivedData: req.body
      });
    }

    // Process uploaded files
    const evidence = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        evidence.push({
          type: 'screenshot',
          filename: file.filename,
          url: `/uploads/${file.filename}`,
          description: `Uploaded evidence: ${file.originalname}`
        });
      });
    }

    // Map form fields to model structure
    const reportData = {
      title: req.body.title,
      description: req.body.description,
      scamType: req.body.scamType,
      dateOccurred: new Date(req.body.dateOccurred),
      evidence: evidence,
      reportedBy: req.user ? req.user._id : null, // Allow anonymous reports
      scammerInfo: {
        name: req.body.scammerName || '',
        email: req.body.scammerEmail || '',
        phone: req.body.scammerPhone || '',
        website: req.body.scammerWebsite || '',
        businessName: req.body.scammerName || ''
      },
      financialLoss: {
        amount: req.body.amountLost ? parseFloat(req.body.amountLost) : 0,
        currency: 'USD'
      },
      location: {
        city: req.body.location || ''
      },
      reporterInfo: {
        name: req.body.reporterName || '',
        email: req.body.reporterEmail || '',
        phone: req.body.reporterPhone || ''
      },
      reporterContact: {
        allowContact: !!req.body.contactInfo,
        contactMethod: req.body.contactInfo ? 'email' : 'none'
      },
      tags: [req.body.scamType.toLowerCase().replace(/\s+/g, '_')],
      additionalDetails: req.body.additionalDetails || ''
    };

    const scamReport = new ScamReport(reportData);
    await scamReport.save();

    // Update user's report count only if user is authenticated
    if (req.user) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { reportsCount: 1 } }
      );
      // Populate reporter info for response
      await scamReport.populate('reportedBy', 'username avatar');
    }

    res.status(201).json({
      message: 'Scam report created successfully',
      report: scamReport
    });

  } catch (error) {
    console.error('Create scam report error:', error);
    res.status(500).json({ message: 'Server error creating scam report' });
  }
});

// @route   POST /api/scams/:id/upload
// @desc    Upload additional evidence for existing report
// @access  Private
router.post('/:id/upload', auth, upload.array('evidence', 5), handleUploadError, async (req, res) => {
  try {
    const report = await ScamReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    // Check if user can upload (reporter or admin)
    if (report.reportedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Not authorized to upload to this report' });
    }

    // Process uploaded files
    const newEvidence = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        newEvidence.push({
          type: 'screenshot',
          filename: file.filename,
          url: `/uploads/${file.filename}`,
          description: `Additional evidence: ${file.originalname}`
        });
      });
    }

    // Add new evidence to existing evidence
    report.evidence = [...report.evidence, ...newEvidence];
    await report.save();

    res.json({
      message: 'Evidence uploaded successfully',
      evidence: newEvidence
    });

  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({ message: 'Server error uploading evidence' });
  }
});

// @route   GET /api/scams
// @desc    Get all approved scam reports with pagination and filtering
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('scamType').optional().isIn([
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
  ]),
  query('sortBy').optional().isIn(['createdAt', 'views', 'voteScore', 'severity']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { status: 'approved' };
    
    if (req.query.scamType) {
      query.scamType = req.query.scamType;
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Build sort
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const reports = await ScamReport.find(query)
      .populate('reportedBy', 'username avatar reputation')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-flags -moderationNotes');

    const total = await ScamReport.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      reports,
      pagination: {
        currentPage: page,
        totalPages,
        totalReports: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get scam reports error:', error);
    res.status(500).json({ message: 'Server error fetching scam reports' });
  }
});

// @route   GET /api/scams/:id
// @desc    Get single scam report by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const report = await ScamReport.findById(req.params.id)
      .populate('reportedBy', 'username avatar reputation createdAt')
      .select('-flags -moderationNotes');

    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    if (report.status !== 'approved' && (!req.user || req.user.role === 'user')) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    // Increment view count
    await ScamReport.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });

    res.json({ report });

  } catch (error) {
    console.error('Get scam report error:', error);
    res.status(500).json({ message: 'Server error fetching scam report' });
  }
});

// @route   PUT /api/scams/:id
// @desc    Update scam report (only by reporter or admin)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const report = await ScamReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    // Check if user can edit (reporter or admin)
    if (report.reportedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Not authorized to edit this report' });
    }

    // Users can only edit pending reports, admins can edit any
    if (report.status !== 'pending' && req.user.role === 'user') {
      return res.status(400).json({ message: 'Cannot edit approved or rejected reports' });
    }

    const allowedUpdates = [
      'title', 'description', 'scamType', 'scammerInfo', 'financialLoss',
      'location', 'dateOccurred', 'evidence', 'tags', 'severity', 'additionalDetails'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedReport = await ScamReport.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'username avatar');

    res.json({
      message: 'Scam report updated successfully',
      report: updatedReport
    });

  } catch (error) {
    console.error('Update scam report error:', error);
    res.status(500).json({ message: 'Server error updating scam report' });
  }
});

// @route   DELETE /api/scams/:id
// @desc    Delete scam report (only by reporter or admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await ScamReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    // Check if user can delete (reporter or admin)
    if (report.reportedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await ScamReport.findByIdAndDelete(req.params.id);

    // Update user's report count
    await User.findByIdAndUpdate(
      report.reportedBy,
      { $inc: { reportsCount: -1 } }
    );

    res.json({ message: 'Scam report deleted successfully' });

  } catch (error) {
    console.error('Delete scam report error:', error);
    res.status(500).json({ message: 'Server error deleting scam report' });
  }
});

// @route   POST /api/scams/:id/vote
// @desc    Vote on a scam report (upvote/downvote)
// @access  Private
router.post('/:id/vote', auth, [
  body('type').isIn(['upvote', 'downvote'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type } = req.body;
    const userId = req.user._id;
    const reportId = req.params.id;

    const report = await ScamReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    // Remove existing votes by this user
    report.upvotes = report.upvotes.filter(vote => vote.user.toString() !== userId.toString());
    report.downvotes = report.downvotes.filter(vote => vote.user.toString() !== userId.toString());

    // Add new vote
    if (type === 'upvote') {
      report.upvotes.push({ user: userId });
    } else {
      report.downvotes.push({ user: userId });
    }

    await report.save();

    res.json({
      message: `${type} recorded successfully`,
      voteScore: report.upvotes.length - report.downvotes.length
    });

  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error recording vote' });
  }
});

// @route   POST /api/scams/:id/flag
// @desc    Flag a scam report
// @access  Private
router.post('/:id/flag', auth, [
  body('reason').isIn(['spam', 'inappropriate', 'false_info', 'duplicate', 'other']),
  body('details').optional().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reason, details } = req.body;
    const userId = req.user._id;
    const reportId = req.params.id;

    const report = await ScamReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    // Check if user already flagged
    const existingFlag = report.flags.find(flag => flag.user.toString() === userId.toString());
    if (existingFlag) {
      return res.status(400).json({ message: 'You have already flagged this report' });
    }

    report.flags.push({
      user: userId,
      reason,
      details
    });

    await report.save();

    res.json({ message: 'Report flagged successfully' });

  } catch (error) {
    console.error('Flag error:', error);
    res.status(500).json({ message: 'Server error flagging report' });
  }
});

// @route   GET /api/scams/user/:userId
// @desc    Get scam reports by user
// @access  Public
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { 
      reportedBy: req.params.userId,
      status: 'approved'
    };

    const reports = await ScamReport.find(query)
      .populate('reportedBy', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-flags -moderationNotes');

    const total = await ScamReport.countDocuments(query);

    res.json({
      reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total
      }
    });

  } catch (error) {
    console.error('Get user reports error:', error);
    res.status(500).json({ message: 'Server error fetching user reports' });
  }
});

// @route   PUT /api/scams/:id/moderate
// @desc    Moderate scam report (admin only)
// @access  Private (Admin)
router.put('/:id/moderate', adminAuth, [
  body('status').isIn(['approved', 'rejected', 'under_review']),
  body('moderationNotes').optional().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, moderationNotes } = req.body;

    const report = await ScamReport.findByIdAndUpdate(
      req.params.id,
      {
        status,
        moderatedBy: req.user._id,
        moderationNotes: moderationNotes || ''
      },
      { new: true }
    ).populate('reportedBy', 'username avatar');

    if (!report) {
      return res.status(404).json({ message: 'Scam report not found' });
    }

    res.json({
      message: 'Report moderated successfully',
      report
    });

  } catch (error) {
    console.error('Moderate report error:', error);
    res.status(500).json({ message: 'Server error moderating report' });
  }
});

module.exports = router;
