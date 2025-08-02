import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  Security,
  Warning,
  AttachMoney,
  Language,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { searchAPI } from '../services/api';

interface Statistics {
  reportsByStatus: Array<{ _id: string; count: number }>;
  reportsByType: Array<{ _id: string; count: number }>;
  topReportedWebsites: Array<{ _id: string; count: number }>;
  recentTrends: Array<{ _id: string; count: number }>;
  financialImpact: {
    totalLoss: number;
    averageLoss: number;
    count: number;
  };
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await searchAPI.getStatistics();
        setStats(response.data);
      } catch (error: any) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getScamTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      investment: 'Investment Scam',
      romance: 'Romance Scam',
      phishing: 'Phishing',
      tech_support: 'Tech Support Scam',
      online_shopping: 'Online Shopping Scam',
      lottery: 'Lottery/Sweepstakes Scam',
      fake_job: 'Employment Scam',
      charity: 'Charity Scam',
      rental: 'Rental Scam',
      crypto: 'Cryptocurrency Scam',
      identity_theft: 'Identity Theft',
      other: 'Other',
    };
    return typeMap[type] || type;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 4, pt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" fontWeight={700}>
              Scam Reporter Statistics
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Real-time insights into reported scams and fraud prevention data
          </Typography>
        </Box>

        {stats && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* First Row: Status and Financial */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Report Status Overview */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Security sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Report Status Overview
                      </Typography>
                    </Box>
                    <List>
                      {stats.reportsByStatus.map((status) => (
                        <ListItem key={status._id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                  {status._id}
                                </Typography>
                                <Chip
                                  label={status.count}
                                  color={status._id === 'approved' ? 'success' : status._id === 'pending' ? 'warning' : 'default'}
                                  size="small"
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>

              {/* Financial Impact */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney sx={{ color: 'error.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Financial Impact
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h4" color="error.main" fontWeight={700}>
                        {formatCurrency(stats.financialImpact.totalLoss)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Reported Losses
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="h6" color="warning.main">
                        {formatCurrency(stats.financialImpact.averageLoss)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Loss per Report
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Based on {stats.financialImpact.count} reports with financial data
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Second Row: Scam Types and Websites */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Scam Types Distribution */}
              <Box sx={{ flex: 2 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp sx={{ color: 'info.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Most Reported Scam Types
                      </Typography>
                    </Box>
                    <List>
                      {stats.reportsByType.slice(0, 6).map((type, index) => (
                        <ListItem key={type._id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1">
                                  #{index + 1} {getScamTypeDisplayName(type._id)}
                                </Typography>
                                <Chip
                                  label={`${type.count} reports`}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>

              {/* Top Reported Websites */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Language sx={{ color: 'warning.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Suspicious Websites
                      </Typography>
                    </Box>
                    {stats.topReportedWebsites.length > 0 ? (
                      <List>
                        {stats.topReportedWebsites.slice(0, 5).map((website) => (
                          <ListItem key={website._id} sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    {website._id}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {website.count} report{website.count !== 1 ? 's' : ''}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No website data available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Recent Trends */}
            <Box>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Warning sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Recent Trends (Last 30 Days)
                    </Typography>
                  </Box>
                  {stats.recentTrends.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {stats.recentTrends.map((trend) => (
                        <Box 
                          key={trend._id} 
                          sx={{ 
                            textAlign: 'center', 
                            p: 2, 
                            border: '1px solid', 
                            borderColor: 'divider', 
                            borderRadius: 1,
                            minWidth: '200px',
                            flex: '1 1 200px'
                          }}
                        >
                          <Typography variant="h5" color="primary.main" fontWeight={700}>
                            {trend.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getScamTypeDisplayName(trend._id)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No recent activity
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default Statistics;
