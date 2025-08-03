import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
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

interface BlacklistInfo {
  isBlacklisted: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reportCount: number;
  message: string;
  type: string;
  entity: string;
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
  blacklistInfo?: BlacklistInfo;
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [blacklistInfo, setBlacklistInfo] = useState<BlacklistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  const handleSearch = async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const params: any = {
        page,
        limit: 10,
      };
      
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
      setBlacklistInfo(response.data.blacklistInfo || null);
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
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4, pt: { xs: 12, md: 14 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Typography variant="h3" fontWeight={700} sx={{ color: 'text.primary' }}>
                Search Scam Reports
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', color: 'text.secondary' }}>
              Search through reported scams to check if you've encountered something similar
            </Typography>
          </Box>

        {/* Search Form */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          alignItems: 'stretch',
          mb: 4
        }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, scammer name, email, phone, website..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(1);
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'rgba(0, 0, 0, 0.87)',
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1,
                },
              }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            minWidth: { md: '140px' }
          }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleSearch(1)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ 
                py: 1.5,
                backgroundColor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
                borderWidth: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'primary.dark',
                  borderWidth: 2,
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Box>

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
              <Typography variant="h6" sx={{ color: 'white' }}>
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
            </Box>

            {/* Blacklist Warning */}
            {blacklistInfo && blacklistInfo.isBlacklisted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert 
                  severity={
                    blacklistInfo.riskLevel === 'critical' ? 'error' :
                    blacklistInfo.riskLevel === 'high' ? 'error' :
                    blacklistInfo.riskLevel === 'medium' ? 'warning' : 'info'
                  }
                  variant="filled"
                  sx={{ 
                    mb: 3,
backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '& .MuiAlert-icon': {
                      fontSize: '2rem',
                      color: 'white'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                      {blacklistInfo.riskLevel === 'critical' && (
                        <Box
                          component="span"
                          sx={{
                            animation: 'textPulse 1.2s infinite',
                            '@keyframes textPulse': {
                              '0%': {
                                textShadow: '0 0 5px #ffffff, 0 0 10px #ff0000',
                                transform: 'scale(1)'
                              },
                              '50%': {
                                textShadow: '0 0 10px #ffffff, 0 0 20px #ff0000, 0 0 30px #ff4444',
                                transform: 'scale(1.02)'
                              },
                              '100%': {
                                textShadow: '0 0 5px #ffffff, 0 0 10px #ff0000',
                                transform: 'scale(1)'
                              }
                            }
                          }}
                        >
                          CRITICAL BLACKLIST ALERT
                        </Box>
                      )}
                      {blacklistInfo.riskLevel === 'high' && '⚠️ HIGH RISK BLACKLIST WARNING'}
                      {blacklistInfo.riskLevel === 'medium' && '⚠️ BLACKLIST WARNING'}
                      {blacklistInfo.riskLevel === 'low' && 'ℹ️ NOTICE'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'white' }}>
                      {blacklistInfo.message}
                    </Typography>
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                        📊 Blacklist Details:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        • Entity: {blacklistInfo.entity}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        • Type: {blacklistInfo.type.charAt(0).toUpperCase() + blacklistInfo.type.slice(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        • Total Reports: {blacklistInfo.reportCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        • Risk Level: {blacklistInfo.riskLevel.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Alert>
              </motion.div>
            )}

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
                    <Card sx={{ mb: 3, '\u0026:hover': { elevation: 8 }, bgcolor: 'background.paper' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 2, color: 'text.primary' }}>
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
              <Card sx={{ textAlign: 'center', p: 4, bgcolor: '#1a1a1a' }}>
                <Typography variant="h6" sx={{ color: '#ccc' }}>
                  No scam reports found matching your search criteria.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
                  Try different keywords to refine your search.
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
    </Box>
  );
};

export default Search;
