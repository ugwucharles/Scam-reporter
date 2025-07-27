import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scamReportsAPI } from '../services/api';
import { useQuery } from '@tanstack/react-query';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => scamReportsAPI.getReports({ page: 1, limit: 15 }),
    enabled: !!user
  });

  const handleModerate = (reportId: string, status: string) => {
    // Moderate reports here
    console.log(`Moderating report: ${reportId}, setting status to: ${status}`);
  };

  if (!user || user.role !== 'admin') {
    return <Typography>Access denied. Admins only.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome, {user.username}. Manage scam reports and users here.
        </Typography>
      </Box>

      <Box sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {isLoading ? (
            <Typography>Loading reports...</Typography>
          ) : error ? (
            <Typography>Error fetching reports.</Typography>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              {(data as any)?.reports?.map((report: any) => (
                <Box key={report._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {report.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                          onClick={() => handleModerate(report._id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleModerate(report._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </motion.div>
      </Box>
    </Container>
  );
};

export default AdminPanel;

