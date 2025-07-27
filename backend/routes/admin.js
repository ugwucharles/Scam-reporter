const express = require('express');
const { query, validationResult } = require('express-validator');
const ScamReport = require('../models/ScamReport');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/reports
// @desc    Get all reports including pending ones (admin only)
// @access  Private (Admin)
router.get('/reports', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'under_review', 'all'])
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    // Build query - admins can see all reports
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Execute query
    const reports = await ScamReport.find(query)
      .populate('reportedBy', 'username avatar reputation')
      .populate('moderatedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    console.error('Get admin reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get report counts by status
    const reportStats = await ScamReport.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get report counts by type
    const typeStats = await ScamReport.aggregate([
      {
        $group: {
          _id: '$scamType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get user counts
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'moderator'] } });

    // Get recent activity (reports in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentReports = await ScamReport.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate financial impact
    const financialImpact = await ScamReport.aggregate([
      {
        $group: {
          _id: null,
          totalLoss: { $sum: '$financialLoss.amount' },
          avgLoss: { $avg: '$financialLoss.amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      reportsByStatus: reportStats,
      reportsByType: typeStats,
      userStats: {
        totalUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers
      },
      recentActivity: {
        reportsLast30Days: recentReports
      },
      financialImpact: financialImpact[0] || { totalLoss: 0, avgLoss: 0, count: 0 }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:userId/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put('/users/:userId/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent self-demotion for the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    const targetUser = await User.findById(userId);
    
    if (adminCount === 1 && targetUser.role === 'admin' && role !== 'admin') {
      return res.status(400).json({ 
        message: 'Cannot demote the last admin user' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

// @route   GET /api/admin/reports/flagged
// @desc    Get flagged reports (admin only)
// @access  Private (Admin)
router.get('/reports/flagged', adminAuth, async (req, res) => {
  try {
    const flaggedReports = await ScamReport.find({
      'flags.0': { $exists: true } // Reports with at least one flag
    })
      .populate('reportedBy', 'username avatar')
      .populate('flags.user', 'username')
      .sort({ 'flags.createdAt': -1 })
      .limit(50);

    res.json({
      flaggedReports,
      count: flaggedReports.length
    });

  } catch (error) {
    console.error('Get flagged reports error:', error);
    res.status(500).json({ message: 'Server error fetching flagged reports' });
  }
});

// @route   DELETE /api/admin/reports/:reportId
// @desc    Delete report permanently (admin only)
// @access  Private (Admin)
router.delete('/reports/:reportId', adminAuth, async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await ScamReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await ScamReport.findByIdAndDelete(reportId);

    // Update user's report count if applicable
    if (report.reportedBy) {
      await User.findByIdAndUpdate(
        report.reportedBy,
        { $inc: { reportsCount: -1 } }
      );
    }

    res.json({ message: 'Report deleted successfully' });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error deleting report' });
  }
});

module.exports = router;
