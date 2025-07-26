import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin dashboard coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
