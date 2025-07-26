const express = require('express');
const { query, validationResult } = require('express-validator');
const ScamReport = require('../models/ScamReport');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/search
// @desc    Search scam reports by various criteria
// @access  Public
router.get('/', optionalAuth, [
  query('q').optional().isLength({ min: 1, max: 100 }).trim(),
  query('email').optional().isEmail().normalizeEmail(),
  query('phone').optional().isLength({ min: 5, max: 20 }).trim(),
  query('website').optional().isURL(),
  query('businessName').optional().isLength({ min: 1, max: 100 }).trim(),
  query('scamType').optional().isIn([
    'online_shopping', 'investment', 'romance', 'phishing', 'fake_job',
    'crypto', 'tech_support', 'charity', 'lottery', 'rental', 'identity_theft', 'other'
  ]),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      q,
      email,
      phone,
      website,
      businessName,
      scamType,
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const searchQuery = { status: 'approved' };
    const orConditions = [];

    // Text search
    if (q) {
      orConditions.push(
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'scammerInfo.name': { $regex: q, $options: 'i' } },
        { 'scammerInfo.email': { $regex: q, $options: 'i' } },
        { 'scammerInfo.phone': { $regex: q, $options: 'i' } },
        { 'scammerInfo.website': { $regex: q, $options: 'i' } },
        { 'scammerInfo.businessName': { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      );
    }

    // Specific field searches
    if (email) {
      orConditions.push({ 'scammerInfo.email': email });
    }

    if (phone) {
      // Remove common phone formatting characters for search
      const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
      orConditions.push({ 
        'scammerInfo.phone': { 
          $regex: cleanPhone.split('').join('\\s*[\\-\\(\\)\\s]*\\+?'), 
          $options: 'i' 
        } 
      });
    }

    if (website) {
      orConditions.push({ 'scammerInfo.website': { $regex: website, $options: 'i' } });
    }

    if (businessName) {
      orConditions.push({ 'scammerInfo.businessName': { $regex: businessName, $options: 'i' } });
    }

    // Add OR conditions if any exist
    if (orConditions.length > 0) {
      searchQuery.$or = orConditions;
    }

    // Scam type filter
    if (scamType) {
      searchQuery.scamType = scamType;
    }

    // If no search criteria provided, return error
    if (!q && !email && !phone && !website && !businessName && !scamType) {
      return res.status(400).json({
        message: 'At least one search criteria must be provided'
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const reports = await ScamReport.find(searchQuery)
      .populate('reportedBy', 'username avatar reputation')
      .sort({ 
        createdAt: -1,
        voteScore: -1,
        views: -1
      })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-flags -moderationNotes');

    const total = await ScamReport.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Calculate relevance scores and sort
    const reportsWithScore = reports.map(report => {
      let relevanceScore = 0;
      
      // Exact matches get higher scores
      if (email && report.scammerInfo.email === email) relevanceScore += 100;
      if (phone && report.scammerInfo.phone && report.scammerInfo.phone.includes(phone.replace(/[\s\-\(\)\+]/g, ''))) relevanceScore += 90;
      if (website && report.scammerInfo.website && report.scammerInfo.website.toLowerCase().includes(website.toLowerCase())) relevanceScore += 80;
      if (businessName && report.scammerInfo.businessName && report.scammerInfo.businessName.toLowerCase().includes(businessName.toLowerCase())) relevanceScore += 70;
      
      // Text matches in title/description
      if (q) {
        const queryLower = q.toLowerCase();
        if (report.title.toLowerCase().includes(queryLower)) relevanceScore += 60;
        if (report.description.toLowerCase().includes(queryLower)) relevanceScore += 40;
        if (report.scammerInfo.name && report.scammerInfo.name.toLowerCase().includes(queryLower)) relevanceScore += 50;
      }

      // Boost for verified reports and higher vote scores
      if (report.isVerified) relevanceScore += 20;
      relevanceScore += Math.min(report.voteScore || 0, 10);

      return {
        ...report.toObject(),
        relevanceScore
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      results: reportsWithScore,
      searchCriteria: {
        query: q,
        email,
        phone,
        website,
        businessName,
        scamType
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: total,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions based on partial input
// @access  Public
router.get('/suggestions', [
  query('q').isLength({ min: 2, max: 50 }).trim(),
  query('type').optional().isIn(['email', 'phone', 'website', 'business', 'general'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q, type } = req.query;
    const suggestions = [];

    try {
      switch (type) {
        case 'email':
          const emailSuggestions = await ScamReport.aggregate([
            { $match: { 
              'scammerInfo.email': { $regex: q, $options: 'i' },
              status: 'approved'
            }},
            { $group: { 
              _id: '$scammerInfo.email', 
              count: { $sum: 1 } 
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]);
          suggestions.push(...emailSuggestions.map(s => ({ 
            value: s._id, 
            type: 'email', 
            count: s.count 
          })));
          break;

        case 'business':
          const businessSuggestions = await ScamReport.aggregate([
            { $match: { 
              'scammerInfo.businessName': { $regex: q, $options: 'i' },
              status: 'approved'
            }},
            { $group: { 
              _id: '$scammerInfo.businessName', 
              count: { $sum: 1 } 
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]);
          suggestions.push(...businessSuggestions.map(s => ({ 
            value: s._id, 
            type: 'business', 
            count: s.count 
          })));
          break;

        case 'website':
          const websiteSuggestions = await ScamReport.aggregate([
            { $match: { 
              'scammerInfo.website': { $regex: q, $options: 'i' },
              status: 'approved'
            }},
            { $group: { 
              _id: '$scammerInfo.website', 
              count: { $sum: 1 } 
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]);
          suggestions.push(...websiteSuggestions.map(s => ({ 
            value: s._id, 
            type: 'website', 
            count: s.count 
          })));
          break;

        default:
          // General suggestions from titles and business names
          const titleSuggestions = await ScamReport.aggregate([
            { $match: { 
              title: { $regex: q, $options: 'i' },
              status: 'approved'
            }},
            { $project: { title: 1 } },
            { $limit: 5 }
          ]);
          
          suggestions.push(...titleSuggestions.map(s => ({ 
            value: s.title, 
            type: 'title',
            count: 1
          })));
      }

      res.json({ suggestions: suggestions.slice(0, 10) });

    } catch (error) {
      console.error('Suggestion query error:', error);
      res.json({ suggestions: [] });
    }

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ message: 'Server error getting suggestions' });
  }
});

// @route   GET /api/search/stats
// @desc    Get search statistics and trending scams
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      // Total reports by status
      ScamReport.aggregate([
        { $group: { 
          _id: '$status', 
          count: { $sum: 1 } 
        }}
      ]),
      
      // Reports by scam type
      ScamReport.aggregate([
        { $match: { status: 'approved' } },
        { $group: { 
          _id: '$scamType', 
          count: { $sum: 1 } 
        }},
        { $sort: { count: -1 } }
      ]),
      
      // Top reported domains/websites
      ScamReport.aggregate([
        { $match: { 
          status: 'approved',
          'scammerInfo.website': { $exists: true, $ne: '' }
        }},
        { $group: { 
          _id: '$scammerInfo.website', 
          count: { $sum: 1 } 
        }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Recent trends (last 30 days)
      ScamReport.aggregate([
        { $match: { 
          status: 'approved',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }},
        { $group: { 
          _id: '$scamType', 
          count: { $sum: 1 } 
        }},
        { $sort: { count: -1 } }
      ]),
      
      // Total financial losses
      ScamReport.aggregate([
        { $match: { 
          status: 'approved',
          'financialLoss.amount': { $exists: true, $gt: 0 }
        }},
        { $group: { 
          _id: null, 
          totalLoss: { $sum: '$financialLoss.amount' },
          averageLoss: { $avg: '$financialLoss.amount' },
          count: { $sum: 1 }
        }}
      ])
    ]);

    const [statusStats, scamTypeStats, topWebsites, recentTrends, financialStats] = stats;

    res.json({
      reportsByStatus: statusStats,
      reportsByType: scamTypeStats,
      topReportedWebsites: topWebsites,
      recentTrends: recentTrends,
      financialImpact: financialStats[0] || { 
        totalLoss: 0, 
        averageLoss: 0, 
        count: 0 
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error getting statistics' });
  }
});

// @route   GET /api/search/similar/:id
// @desc    Find similar scam reports
// @access  Public
router.get('/similar/:id', async (req, res) => {
  try {
    const report = await ScamReport.findById(req.params.id);
    if (!report || report.status !== 'approved') {
      return res.status(404).json({ message: 'Report not found' });
    }

    const similarQuery = {
      _id: { $ne: report._id },
      status: 'approved',
      $or: []
    };

    // Find similar reports based on various criteria
    if (report.scammerInfo.email) {
      similarQuery.$or.push({ 'scammerInfo.email': report.scammerInfo.email });
    }
    
    if (report.scammerInfo.phone) {
      similarQuery.$or.push({ 'scammerInfo.phone': report.scammerInfo.phone });
    }
    
    if (report.scammerInfo.website) {
      similarQuery.$or.push({ 'scammerInfo.website': report.scammerInfo.website });
    }
    
    if (report.scammerInfo.businessName) {
      similarQuery.$or.push({ 
        'scammerInfo.businessName': { 
          $regex: report.scammerInfo.businessName, 
          $options: 'i' 
        } 
      });
    }

    // Same scam type
    similarQuery.$or.push({ scamType: report.scamType });

    // Similar tags
    if (report.tags && report.tags.length > 0) {
      similarQuery.$or.push({ tags: { $in: report.tags } });
    }

    if (similarQuery.$or.length === 0) {
      return res.json({ similarReports: [] });
    }

    const similarReports = await ScamReport.find(similarQuery)
      .populate('reportedBy', 'username avatar')
      .sort({ createdAt: -1, voteScore: -1 })
      .limit(10)
      .select('-flags -moderationNotes');

    res.json({ similarReports });

  } catch (error) {
    console.error('Similar reports error:', error);
    res.status(500).json({ message: 'Server error finding similar reports' });
  }
});

module.exports = router;
