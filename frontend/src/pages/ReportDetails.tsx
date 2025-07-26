import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ReportDetails: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Report Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Report details page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ReportDetails;
