import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Register: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Registration form coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
