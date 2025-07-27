import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated and is admin
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect non-admin users to regular login
  if (isAuthenticated && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      
      // Check if user is admin after login
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.role === 'admin' || userData.role === 'moderator') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        // Clear the token since this isn't an admin account
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e9ecef',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1B365C 0%, #2D4A6B 100%)',
                  mb: 2,
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Access the administrative dashboard
              </Typography>
            </Box>

            {/* Security Notice */}
            <Alert
              severity="info"
              icon={<Security />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              This is a secure admin area. Please use your administrator credentials.
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                sx={{ mb: 3 }}
                disabled={isLoading}
                placeholder="admin@scamreporter.com"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                sx={{ mb: 4 }}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !email || !password}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Signing in...
                  </>
                ) : (
                  'Sign in to Admin Panel'
                )}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact the system administrator
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default AdminLogin;
