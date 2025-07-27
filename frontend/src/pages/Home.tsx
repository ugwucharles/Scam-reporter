import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Card,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Security,
  ReportProblem,
  Search,
  TrendingUp,
  ArrowForward,
  Shield,
  VerifiedUser,
  Warning,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { websiteCheckerAPI } from '../services/api';
import WebsiteCheckerResult from '../components/WebsiteCheckerResult';

const Home: React.FC = () => {
  const theme = useTheme();
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  const handleWebsiteCheck = async () => {
    if (!websiteUrl.trim()) return;
    
    setIsChecking(true);
    setCheckResult(null);
    
    try {
      const response = await websiteCheckerAPI.checkWebsite(websiteUrl.trim());
      setCheckResult(response.data);
    } catch (error: any) {
      setCheckResult({
        error: error.response?.data?.error || 'Failed to check website. Please try again.',
        safe: false
      });
    } finally {
      setIsChecking(false);
    }
  };

  const features = [
    {
      icon: <ReportProblem sx={{ fontSize: 40, color: '#6366f1' }} />,
      title: 'Report Scams',
      description: 'Quickly report suspicious activities and help protect others from fraud.',
      link: '/report'
    },
    {
      icon: <Search sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: 'Search Database',
      description: 'Search our comprehensive database of reported scams and fraudulent activities.',
      link: '/search'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Track Trends',
      description: 'Monitor fraud trends and stay informed about the latest scam techniques.',
      link: '/dashboard'
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Enhanced Background Patterns */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.5) 2px, transparent 2px),
              linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%)
            `,
            backgroundSize: '40px 40px, 60px 60px, 100px 100px',
          }}
        />
        
        {/* Floating Animated Shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            animation: 'float 8s ease-in-out infinite reverse',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            animation: 'float 7s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-15px)' },
            },
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={6} 
            alignItems="center"
          >
            <Box sx={{ flex: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Enhanced Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    px: 2,
                    py: 1,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                      },
                    }}
                  />
                  Trusted by 50K+ Users Worldwide
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    mb: 4,
                    background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1.1,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-10px',
                      left: 0,
                      width: '100px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #ffffff, transparent)',
                      borderRadius: '2px',
                    },
                  }}
                >
                  PalmGuard
                  <br />
                  <span style={{ 
                    fontSize: '0.6em', 
                    fontWeight: 300,
                    background: 'linear-gradient(45deg, #e0e7ff, #c7d2fe)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}>Security</span>
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                  }}
                >
                  Your trusted financial security platform. Report fraud, search scam databases, 
                  and protect your digital transactions with enterprise-grade security.
                </Typography>

                {/* Enhanced Stats Row */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4, 
                  mb: 4,
                  flexWrap: 'wrap'
                }}>
                  {[
                    { number: '10K+', label: 'Reports' },
                    { number: '95%', label: 'Accuracy' },
                    { number: '24/7', label: 'Support' },
                  ].map((stat, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: { xs: '0.8rem', md: '0.9rem' },
                          fontWeight: 500,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/report"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      py: 2,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Report Fraud
                  </Button>
                  <Button
                    component={Link}
                    to="/search"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      py: 2,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Search Database
                  </Button>
                </Box>
              </motion.div>
            </Box>
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Enhanced 3D Shield with Multiple Layers */}
                  <Box
                    sx={{
                      width: 280,
                      height: 280,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        right: '-10px',
                        bottom: '-10px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                        zIndex: -1,
                        animation: 'pulse 3s ease-in-out infinite',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                        right: '-20px',
                        bottom: '-20px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)',
                        zIndex: -2,
                        animation: 'pulse 4s ease-in-out infinite reverse',
                      },
                    }}
                  >
                    <Security sx={{ 
                      fontSize: 120, 
                      color: 'white',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                    }} />
                  </Box>
                  
                  {/* Orbiting Elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '320px',
                      height: '320px',
                      transform: 'translate(-50%, -50%)',
                      animation: 'rotate 20s linear infinite',
                      '@keyframes rotate': {
                        '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                        '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                      },
                    }}
                  >
                    {[0, 120, 240].map((angle, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.6)',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-160px)`,
                          animation: `pulse ${2 + index * 0.5}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* B Section (Modern Features) */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 3, 
        mt: { xs: -6, md: -8 }, 
        mb: { xs: -6, md: -8 },
        py: { xs: 8, md: 6 },
        minHeight: { xs: '400px', md: 'auto' },
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, px: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Desktop Card */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Card
                sx={{
                  p: { xs: 6, md: 8 },
                  minHeight: { xs: '400px', md: '450px' },
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                }}
              >
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                  }}
                >
                  Comprehensive Fraud Protection
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    mb: 4,
                    color: '#64748b',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontWeight: 400
                  }}
                >
                  Advanced tools and community-driven intelligence to keep your finances secure
                </Typography>

                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={3}
                  justifyContent="center"
                  alignItems="stretch"
                  sx={{
                    flexWrap: 'wrap',
                    width: '100%',
                    mt: 6,
                  }}
                >
                  {features.map((feature, index) => (
                    <Box key={index} sx={{
                      width: { xs: '100%', md: '32%' },
                      minWidth: { xs: 'auto', md: 'auto' },
                      flexShrink: 1,
                      display: 'flex',
                    }}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      >
                        <Box
                          component={Link}
                          to={feature.link}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 3,
                            borderRadius: '20px',
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: '180px',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            }
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                          </Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 2, 
                              fontWeight: 700,
                              color: '#1e293b',
                              fontSize: '1.25rem'
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{
                              color: '#64748b',
                              fontSize: '0.95rem',
                              lineHeight: 1.5,
                              textAlign: 'center'
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Box>

            {/* Mobile Content (no card) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Typography
                variant="h3"
                align="center"
                sx={{
                  mb: 3,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: '2rem'
                }}
              >
                Comprehensive Fraud Protection
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  mb: 6,
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontWeight: 400
                }}
              >
                Advanced tools and community-driven intelligence to keep your finances secure
              </Typography>

              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={3}
                justifyContent="center"
                alignItems="stretch"
                sx={{
                  flexWrap: 'wrap',
                  width: '100%',
                  mt: 6,
                }}
              >
                {features.map((feature, index) => (
                  <Box key={index} sx={{
                    width: '100%',
                    minWidth: 'auto',
                    flexShrink: 1,
                    display: 'flex',
                  }}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    >
                      <Box
                        component={Link}
                        to={feature.link}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          p: 3,
                          borderRadius: '20px',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          height: '180px',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                      >
                        <Box sx={{ mb: 2 }}>
                          {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                        </Box>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mb: 2, 
                            fontWeight: 700,
                            color: '#1e293b',
                            fontSize: '1.25rem'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{
                            color: '#64748b',
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            textAlign: 'center'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* C Section (3D Premium Stats) */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 12, md: 16 },
        position: 'relative',
        zIndex: 1,
        mt: { xs: 0, md: 0 },
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
        // Floating particles animation
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 120px 120px',
          animation: 'float 20s linear infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          pointerEvents: 'none',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '2.2rem', md: '3rem' },
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  borderRadius: '2px',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.5)',
                }
              }}
            >
              Our Impact in Numbers
            </Typography>
            
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 8,
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Discover the real-world impact we're making in the fight against fraud
            </Typography>
          </motion.div>
          
          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 8, md: 6 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 6 }}
          >
            {[
              { 
                icon: <Shield sx={{ fontSize: 60 }} />, 
                number: '50K+', 
                label: 'Users Protected', 
                description: 'Trusted by security professionals worldwide',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                hoverGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                shadowColor: 'rgba(102, 126, 234, 0.4)',
                hoverShadowColor: 'rgba(249, 115, 22, 0.5)',
                size: 'large'
              },
              { 
                icon: <VerifiedUser sx={{ fontSize: 50 }} />, 
                number: '99.5%', 
                label: 'Detection Rate', 
                description: 'Advanced AI-powered fraud detection',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                hoverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                shadowColor: 'rgba(102, 126, 234, 0.4)',
                hoverShadowColor: 'rgba(16, 185, 129, 0.5)',
                size: 'medium'
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                style={{ 
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                  width: '100%',
                  maxWidth: '350px'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    p: { xs: 4, md: 5 },
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `
                      0 25px 50px ${stat.shadowColor},
                      0 0 0 1px rgba(255, 255, 255, 0.05),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    
                    // 3D hover effects
                    '&:hover': {
                      transform: 'translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.02)',
                      boxShadow: `
                        0 35px 70px ${stat.shadowColor},
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `,
                      '&::before': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                        background: `radial-gradient(circle at 50% 50%, ${stat.gradient.replace(/linear-gradient\(135deg, /, '').replace(/\)$/, '').split(' 0%, ')[0]} 0%, transparent 70%)`
                      },
                      '& .stat-icon-container': {
                        transform: 'translateZ(20px) scale(1.1)',
                        background: stat.gradient,
                        boxShadow: `0 10px 30px ${stat.shadowColor}`,
                        '&::before': {
                          background: stat.gradient
                        }
                      },
                      '& .stat-number': {
                        transform: 'translateZ(15px)',
                        background: stat.gradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      },
                      '& .stat-label': {
                        transform: 'translateZ(10px)',
                        color: 'white'
                      },
                      '& .stat-description': {
                        transform: 'translateZ(5px)',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }
                    },
                    
                    // Animated background gradient
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at 50% 50%, ${stat.gradient.replace(/linear-gradient\(135deg, /, '').replace(/\)$/, '').split(' 0%, ')[0]} 0%, transparent 70%)`,
                      opacity: 0,
                      borderRadius: '24px',
                      transition: 'all 0.6s ease',
                      transform: 'scale(0.8)',
                      zIndex: -1
                    },
                    
                    // Floating particles inside card
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px, 50px 50px',
                      animation: 'sparkle 8s linear infinite',
                      '@keyframes sparkle': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 0.8 },
                      },
                      pointerEvents: 'none',
                      borderRadius: '24px'
                    }
                  }}
                >
                  {/* 3D Icon Container */}
                  <Box
                    className="stat-icon-container"
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-5px',
                        left: '-5px',
                        right: '-5px',
                        bottom: '-5px',
                        background: stat.gradient,
                        borderRadius: '25px',
                        opacity: 0.3,
                        filter: 'blur(10px)',
                        zIndex: -1,
                        transition: 'all 0.6s ease'
                      }
                    }}
                  >
                    <Box sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  
                  {/* 3D Number */}
                  <Typography 
                    className="stat-number"
                    variant="h2" 
                    sx={{ 
                      mb: 2,
                      color: 'white',
                      fontSize: { xs: '3rem', md: '3.5rem' },
                      fontWeight: 900,
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      lineHeight: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  
                  {/* 3D Label */}
                  <Typography 
                    className="stat-label"
                    variant="h5" 
                    sx={{ 
                      mb: 2,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '1.2rem', md: '1.4rem' },
                      fontWeight: 700,
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {stat.label}
                  </Typography>
                  
                  {/* 3D Description */}
                  <Typography 
                    className="stat-description"
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* D Section (Modern Website Checker) */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Website Legitimacy Checker
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 6,
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: 1.5,
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Verify if a website is legitimate and safe before sharing your personal information. 
              Our advanced system analyzes websites for potential scams and fraudulent activities.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 3, md: 4 },
                maxWidth: '700px',
                mx: 'auto',
                alignItems: 'center'
              }}
            >
              <Box sx={{ flex: 1, width: '100%' }}>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., https://example.com)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isChecking) {
                      handleWebsiteCheck();
                    }
                  }}
                  disabled={isChecking}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: isChecking ? '#f8fafc' : 'white',
                    color: '#1e293b',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    opacity: isChecking ? 0.7 : 1,
                  }}
                  onFocus={(e) => {
                    if (!isChecking) {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                />
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={handleWebsiteCheck}
                disabled={isChecking || !websiteUrl.trim()}
                sx={{
                  background: isChecking || !websiteUrl.trim() 
                    ? 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  px: { xs: 4, md: 6 },
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: isChecking || !websiteUrl.trim()
                    ? '0 4px 8px rgba(148, 163, 184, 0.3)'
                    : '0 10px 25px rgba(99, 102, 241, 0.3)',
                  width: { xs: '100%', md: 'auto' },
                  '&:hover': {
                    background: isChecking || !websiteUrl.trim()
                      ? 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)'
                      : 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    transform: isChecking || !websiteUrl.trim() ? 'none' : 'translateY(-2px)',
                    boxShadow: isChecking || !websiteUrl.trim()
                      ? '0 4px 8px rgba(148, 163, 184, 0.3)'
                      : '0 15px 35px rgba(99, 102, 241, 0.4)',
                  },
                  cursor: isChecking || !websiteUrl.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isChecking ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Checking...
                  </>
                ) : (
                  'Check Website'
                )}
              </Button>
            </Box>
            
            {/* Website Checker Result */}
            {checkResult && (
              <WebsiteCheckerResult result={checkResult} url={websiteUrl} />
            )}
          </motion.div>
        </Container>
      </Box>

      {/* E Section (Modern Recent Reports) */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Recent Scam Reports
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 6,
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: 1.5,
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Stay informed with the latest reported scams and fraudulent activities from our community.
            </Typography>

            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={{ xs: 2, md: 3 }} 
              justifyContent="center"
            >
              {[
                {
                  title: "Fake Investment Platform",
                  description: "Scammers posing as legitimate investment companies offering unrealistic returns.",
                  date: "2 hours ago",
                  category: "Investment Scam",
                  severity: "High"
                },
                {
                  title: "Phishing Email Campaign",
                  description: "Massive email campaign targeting banking credentials with fake security alerts.",
                  date: "5 hours ago",
                  category: "Phishing",
                  severity: "Medium"
                },
                {
                  title: "Fake Tech Support",
                  description: "Scammers calling claiming to be from Microsoft support to access computers.",
                  date: "1 day ago",
                  category: "Tech Support",
                  severity: "High"
                }
              ].map((report, index) => (
                <Card
                  key={index}
                  sx={{
                    flex: 1,
                    p: { xs: 3, md: 4 }, // Less padding on mobile
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: { xs: '200px', md: 'auto' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b',
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}>
                      {report.title}
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        backgroundColor: report.severity === 'High' ? '#fef2f2' : '#fffbeb',
                        color: report.severity === 'High' ? '#dc2626' : '#d97706',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {report.severity}
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ 
                    color: '#64748b', 
                    mb: 3, 
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}>
                    {report.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ 
                      color: '#94a3b8',
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      fontWeight: 500
                    }}>
                      {report.category}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#94a3b8',
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      fontWeight: 500
                    }}>
                      {report.date}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* F Section (Trending Scams) */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Trending Scams This Week
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 6,
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: 1.5,
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Stay ahead of the latest scam tactics and protect yourself from emerging threats.
            </Typography>

            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={{ xs: 2, md: 3 }} 
              justifyContent="center"
            >
              {[
                {
                  title: "Crypto Investment Scams",
                  description: "Fake cryptocurrency investment platforms promising unrealistic returns. Scammers create fake websites and social media profiles.",
                  trend: "+45%",
                  category: "Investment",
                  victims: "2.3K+"
                },
                {
                  title: "Romance Scam Surge",
                  description: "Scammers creating fake dating profiles to build relationships and request money for emergencies or travel.",
                  trend: "+32%",
                  category: "Romance",
                  victims: "1.8K+"
                },
                {
                  title: "Fake Government Calls",
                  description: "Impersonating IRS, Social Security, or other government agencies demanding immediate payment.",
                  trend: "+28%",
                  category: "Government",
                  victims: "1.5K+"
                }
              ].map((scam, index) => (
                <Card
                  key={index}
                  sx={{
                    flex: 1,
                    p: { xs: 3, md: 4 },
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: { xs: '220px', md: 'auto' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b',
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}>
                      {scam.title}
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {scam.trend}
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ 
                    color: '#64748b', 
                    mb: 3, 
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}>
                    {scam.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ 
                      color: '#94a3b8',
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      fontWeight: 500
                    }}>
                      {scam.category}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#dc2626',
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      fontWeight: 700
                    }}>
                      {scam.victims} victims
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;
