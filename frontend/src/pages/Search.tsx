import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { Search as SearchIcon, FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { scamReportsAPI } from '../services/api';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  scamType: string;
  location?: string | { city?: string };
  dateOccurred: string;
  amountLost?: string;
  scammerName?: string;
  scammerEmail?: string;
  scammerPhone?: string;
  scammerWebsite?: string;
  createdAt: string;
}

interface SearchResponse {
  results: SearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  query: string;
  scamType: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scamType, setScamType] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const scamTypes = [
    { display: 'Investment Scam', value: 'investment' },
    { display: 'Romance Scam', value: 'romance' },
    { display: 'Phishing', value: 'phishing' },
    { display: 'Tech Support Scam', value: 'tech_support' },
    { display: 'Online Shopping Scam', value: 'online_shopping' },
    { display: 'Lottery/Sweepstakes Scam', value: 'lottery' },
    { display: 'Employment Scam', value: 'fake_job' },
    { display: 'Charity Scam', value: 'charity' },
    { display: 'Rental Scam', value: 'rental' },
    { display: 'Cryptocurrency Scam', value: 'crypto' },
    { display: 'Identity Theft', value: 'identity_theft' },
    { display: 'Other', value: 'other' },
  ];

  const handleSearch = async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const params: any = {
        page,
        limit: 10,
      };
      
      if (scamType !== 'all') {
        params.scamType = scamType;
      }
      
      let response;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (emailPattern.test(searchQuery.trim())) {
        // Search by email if the query is an email address
        params.email = searchQuery.trim();
        // Use the search endpoint with email parameter
        response = await scamReportsAPI.searchReports('', params);
        setResults(response.data.results || []);
      } else if (searchQuery.trim()) {
        // Use general search for other queries
        response = await scamReportsAPI.searchReports(searchQuery, params);
        setResults(response.data.results || []);
      } else {
        // Use general reports endpoint
        response = await scamReportsAPI.getReports(params);
        setResults(response.data.reports || []);
      }
      
      setPagination(response.data.pagination);
      setHasSearched(true);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Search error:', error);
      setError('Failed to search reports. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    handleSearch(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SearchIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" fontWeight={700}>
              Search Scam Reports
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Search through reported scams to check if you've encountered something similar
          </Typography>
        </Box>

        {/* Search Form */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3, 
            alignItems: { xs: 'stretch', md: 'center' } 
          }}>
            <Box sx={{ flex: { xs: '1', md: '2' } }}>
              <TextField
                fullWidth
                label="Search terms"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, scammer name, email, phone, etc."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(1);
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1', md: '1' } }}>
              <FormControl fullWidth>
                <InputLabel>Scam Type</InputLabel>
                <Select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value)}
                  label="Scam Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {scamTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.display}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1', md: '0 0 auto' }, minWidth: { md: '120px' } }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleSearch(1)}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ py: 1.5 }}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {hasSearched && (
          <Box>
            {/* Results Summary */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">
                {pagination ? `${pagination.totalResults} results found` : 'No results'}
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Query: "${searchQuery}"`}
                  variant="outlined"
                  onDelete={() => {
                    setSearchQuery('');
                    handleSearch(1);
                  }}
                />
              )}
              {scamType !== 'all' && (
                <Chip
                  label={`Type: ${scamType}`}
                  variant="outlined"
                  onDelete={() => {
                    setScamType('all');
                    handleSearch(1);
                  }}
                />
              )}
            </Box>

            {/* Results List */}
            {results.length > 0 ? (
              <Box sx={{ mb: 4 }}>
                {results.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{ mb: 3, '&:hover': { elevation: 8 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 2 }}>
                            {report.title}
                          </Typography>
                          <Chip 
                            label={report.scamType} 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {truncateText(report.description, 200)}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 2, 
                          mt: 1 
                        }}>
                          {report.location && (
                            <Typography variant="caption" color="text.secondary">
                              <strong>Location:</strong> {typeof report.location === 'string' ? report.location : report.location.city || 'Not specified'}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            <strong>Date:</strong> {formatDate(report.dateOccurred)}
                          </Typography>
                          {report.amountLost && (
                            <Typography variant="caption" color="text.secondary">
                              <strong>Amount Lost:</strong> ${report.amountLost}
                            </Typography>
                          )}
                        </Box>
                        
                        {(report.scammerName || report.scammerEmail || report.scammerPhone) && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" color="error.main" gutterBottom>
                              ⚠️ Scammer Information:
                            </Typography>
                            {report.scammerName && (
                              <Typography variant="caption" display="block">
                                <strong>Name:</strong> {report.scammerName}
                              </Typography>
                            )}
                            {report.scammerEmail && (
                              <Typography variant="caption" display="block">
                                <strong>Email:</strong> {report.scammerEmail}
                              </Typography>
                            )}
                            {report.scammerPhone && (
                              <Typography variant="caption" display="block">
                                <strong>Phone:</strong> {report.scammerPhone}
                              </Typography>
                            )}
                            {report.scammerWebsite && (
                              <Typography variant="caption" display="block">
                                <strong>Website:</strong> {report.scammerWebsite}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            ) : (
              <Card sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No scam reports found matching your search criteria.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try different keywords or change the scam type filter.
                </Typography>
              </Card>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default Search;
