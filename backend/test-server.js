const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Scam Reporter API is running' });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Mock database to store reports
let mockReports = [
  {
    id: '1',
    title: 'Fake Investment Scheme',
    description: 'Someone claiming to be from a investment company asked me to invest $5000 with promise of 300% returns in 30 days.',
    scamType: 'Investment Scam',
    dateOccurred: '2024-01-15',
    location: 'New York',
    amountLost: '5000',
    scammerName: 'John Smith',
    scammerPhone: '+1-555-0123',
    scammerEmail: 'john.smith@fakeinvest.com',
    createdAt: new Date('2024-01-16').toISOString()
  },
  {
    id: '2', 
    title: 'Romance Scam on Dating App',
    description: 'Met someone on a dating app who claimed to be a soldier overseas. After weeks of chatting, they asked for money for emergency medical bills.',
    scamType: 'Romance Scam',
    dateOccurred: '2024-02-10',
    location: 'California',
    amountLost: '2500',
    scammerName: 'Sarah Johnson',
    scammerEmail: 'sarah.j.military@gmail.com',
    createdAt: new Date('2024-02-11').toISOString()
  },
  {
    id: '3',
    title: 'Phishing Email from Bank',
    description: 'Received an email claiming to be from my bank asking me to verify my account details. The website looked identical to my real bank.',
    scamType: 'Phishing',
    dateOccurred: '2024-03-05',
    location: 'Texas',
    scammerWebsite: 'https://secure-bankofamerica-verify.com',
    createdAt: new Date('2024-03-06').toISOString()
  },
  {
    id: '4',
    title: 'Tech Support Scam Call',
    description: 'Received a call claiming to be from Microsoft saying my computer was infected. They wanted remote access to fix it.',
    scamType: 'Tech Support Scam',
    dateOccurred: '2024-03-20',
    location: 'Florida',
    scammerPhone: '+1-800-FAKE-MS',
    scammerName: 'Microsoft Support Team',
    createdAt: new Date('2024-03-21').toISOString()
  },
  {
    id: '5',
    title: 'Cryptocurrency Investment Fraud',
    description: 'Someone on social media promised guaranteed profits in Bitcoin mining. They asked for an initial investment of $10,000.',
    scamType: 'Cryptocurrency Scam',
    dateOccurred: '2024-04-01',
    location: 'Illinois',
    amountLost: '10000',
    scammerName: 'Crypto King',
    scammerEmail: 'cryptoking@cryptomining.biz',
    scammerWebsite: 'https://guaranteed-crypto-profits.com',
    createdAt: new Date('2024-04-02').toISOString()
  }
];

// Scam report endpoint WITHOUT authentication requirement
app.post('/api/scams', upload.array('evidence', 5), (req, res) => {
  console.log('=== REPORT SUBMISSION DEBUG ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('================================');
  
  // Check if required fields are present
  const requiredFields = ['title', 'description', 'scamType', 'dateOccurred'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: missingFields.map(field => `${field} is required`)
    });
  }
  
  // Add new report to mock database
  const newReport = {
    id: (mockReports.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockReports.push(newReport);
  
  res.json({
    message: 'Report submitted successfully',
    reportId: newReport.id,
    data: {
      title: req.body.title,
      description: req.body.description,
      scamType: req.body.scamType,
      dateOccurred: req.body.dateOccurred,
      files: req.files ? req.files.map(f => f.filename) : []
    }
  });
});

// GET all scam reports
app.get('/api/scams', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const scamType = req.query.scamType;
  const search = req.query.search;
  
  console.log('=== SEARCH/GET REPORTS DEBUG ===');
  console.log('Query params:', req.query);
  console.log('===============================');
  
  let filteredReports = [...mockReports];
  
  // Filter by scam type
  if (scamType && scamType !== 'all') {
    filteredReports = filteredReports.filter(report => 
      report.scamType === scamType
    );
  }
  
  // Search functionality
  if (search && search.trim() !== '') {
    const searchTerm = search.toLowerCase().trim();
    filteredReports = filteredReports.filter(report => {
      return (
        report.title?.toLowerCase().includes(searchTerm) ||
        report.description?.toLowerCase().includes(searchTerm) ||
        report.scammerName?.toLowerCase().includes(searchTerm) ||
        report.scammerEmail?.toLowerCase().includes(searchTerm) ||
        report.scammerPhone?.toLowerCase().includes(searchTerm) ||
        report.scammerWebsite?.toLowerCase().includes(searchTerm) ||
        report.location?.toLowerCase().includes(searchTerm)
      );
    });
  }
  
  // Sort by most recent first
  filteredReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);
  
  res.json({
    reports: paginatedReports,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredReports.length / limit),
      totalReports: filteredReports.length,
      hasNext: endIndex < filteredReports.length,
      hasPrev: page > 1
    }
  });
});

// GET single scam report by ID
app.get('/api/scams/:id', (req, res) => {
  const report = mockReports.find(r => r.id === req.params.id);
  
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  
  res.json({ report });
});

// Search endpoint
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const scamType = req.query.scamType;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  console.log('=== DEDICATED SEARCH DEBUG ===');
  console.log('Search query:', query);
  console.log('Scam type filter:', scamType);
  console.log('==============================');
  
  let results = [...mockReports];
  
  // Apply search filter
  if (query && query.trim() !== '') {
    const searchTerm = query.toLowerCase().trim();
    results = results.filter(report => {
      return (
        report.title?.toLowerCase().includes(searchTerm) ||
        report.description?.toLowerCase().includes(searchTerm) ||
        report.scammerName?.toLowerCase().includes(searchTerm) ||
        report.scammerEmail?.toLowerCase().includes(searchTerm) ||
        report.scammerPhone?.toLowerCase().includes(searchTerm) ||
        report.scammerWebsite?.toLowerCase().includes(searchTerm) ||
        report.location?.toLowerCase().includes(searchTerm)
      );
    });
  }
  
  // Apply scam type filter
  if (scamType && scamType !== 'all') {
    results = results.filter(report => report.scamType === scamType);
  }
  
  // Sort by relevance (most recent first)
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  res.json({
    results: paginatedResults,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(results.length / limit),
      totalResults: results.length,
      hasNext: endIndex < results.length,
      hasPrev: page > 1
    },
    query: query,
    scamType: scamType
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('This is a mock server for testing - no MongoDB required');
  console.log('Reports can be submitted without authentication');
}); 