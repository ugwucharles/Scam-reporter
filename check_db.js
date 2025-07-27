const mongoose = require('mongoose');
const ScamReport = require('./backend/models/ScamReport');

mongoose.connect('mongodb://localhost:27017/scam_reporter_db')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check recent trends (last 30 days)
    const recentTrends = await ScamReport.aggregate([
      { $match: { 
        status: 'approved',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }},
      { $group: { 
        _id: '$scamType', 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);
    
    console.log('Recent Trends (Last 30 days):');
    console.log(JSON.stringify(recentTrends, null, 2));
    
    // Check total approved reports
    const totalApproved = await ScamReport.countDocuments({ status: 'approved' });
    console.log('\nTotal approved reports:', totalApproved);
    
    // Check recent reports count
    const recentCount = await ScamReport.countDocuments({ 
      status: 'approved',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    console.log('Recent reports (last 30 days):', recentCount);
    
    // Check all scam types
    const allScamTypes = await ScamReport.aggregate([
      { $match: { status: 'approved' }},
      { $group: { 
        _id: '$scamType', 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nAll scam types:');
    console.log(JSON.stringify(allScamTypes, null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
