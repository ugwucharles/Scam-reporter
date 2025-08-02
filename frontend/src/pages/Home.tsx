import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Card,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  ReportProblem,
  Search,
  TrendingUp,
  ArrowForward,
  Shield,
  VerifiedUser,
  Warning,
  AutoGraph,
  Psychology,
  Verified,
  Speed,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@mui/system';
import { websiteCheckerAPI } from '../services/api';
import WebsiteCheckerResult from '../components/WebsiteCheckerResult';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Home: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Real-time metrics rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetricIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate AI processing
  useEffect(() => {
    const processingInterval = setInterval(() => {
      setIsAIProcessing(prev => !prev);
    }, 4000);
    return () => clearInterval(processingInterval);
  }, []);

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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Framer-Style Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '44px', // Add top padding to account for fixed navbar
        }}
      >
        {/* Subtle Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.03,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #000 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
            animation: 'float 8s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(180deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.1))',
            animation: 'float 6s ease-in-out infinite reverse',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, md: 4 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  mb: 2.5,
                  color: '#1d1d1f',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                }}
              >
                See Scam
                <Box sx={{ 
                  width: '60px',
                  height: '2px',
                  background: '#007AFF',
                  borderRadius: '1px',
                  mx: 'auto',
                  my: 0,
                }} />
                Report Scam
              </Typography>
              
              {/* Subtitle */}
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  mb: 4,
                  color: '#86868b',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  fontSize: { xs: '1.125rem', md: '1.375rem' },
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                Identify and report scams. Protect yourself and others.
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2.5, 
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 6,
              }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/search"
                    variant="contained"
                    size="small"
                    sx={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      px: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      backgroundColor: '#1d1d1f',
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#000000',
                        boxShadow: 'none',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Search Scams
                    <ArrowForward sx={{ ml: 1, fontSize: 16 }} />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/report"
                    variant="outlined"
                    size="small"
                    sx={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      px: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderColor: '#1d1d1f',
                      color: '#1d1d1f',
                      borderRadius: '8px',
                      textTransform: 'none',
                      borderWidth: '1px',
                      '&:hover': {
                        borderColor: '#000000',
                        backgroundColor: 'rgba(29, 29, 31, 0.05)',
                        borderWidth: '1px',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Report Scam
                    <ReportProblem sx={{ ml: 1, fontSize: 16 }} />
                  </Button>
                </motion.div>
              </Box>

              {/* Stats */}
              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                {[
                  { number: '50K+', label: 'Reports Filed' },
                  { number: '10K+', label: 'Scams Identified' },
                  { number: '99%', label: 'Accuracy Rate' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: '#1e293b',
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#64748b',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* B Section (Tools Section) */}
      <Box sx={{ 
        position: 'relative',
        py: { xs: 12, md: 16 },
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, md: 3 } }}>
          {/* Top Left Text */}
          <Box sx={{ textAlign: 'left', mb: 8, maxWidth: '500px' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
                mb: 2,
                color: '#ffffff'
              }}
            >
              Build Trust Online
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                color: '#ffffff',
                lineHeight: 1.5,
              }}
            >
              Intelligent, fast, and reliable. The best way to identify and report online scams.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 2 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: '95%', mx: 'auto', width: '100%' }}
          >
            {[
              // Left Card - Report Function
              {
                type: 'report',
                title: "Report a Scam",
                description: "Help protect others by reporting suspicious activities and fraudulent schemes you've encountered.",
                icon: <ReportProblem sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                feature: "Community Protection",
                link: '/report'
              },
              // Middle Card - Website Verification
              {
                type: 'verify',
                title: "Verify Website Safety",
                description: "Check if a website is legitimate and safe before sharing your personal information with our advanced verification system.",
                icon: <Verified sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                feature: "Real-time Check",
                link: '#website-checker'
              },
              // Right Card - Search Function
              {
                type: 'search',
                title: "Search Scam Database",
                description: "Search our comprehensive database of reported scams and check if something is a known threat.",
                icon: <Search sx={{ fontSize: 32 }} />,
                gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                feature: "Instant Lookup",
                link: '/search'
              },
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                style={{ flex: 1 }}
              >
                {tool.link.startsWith('#') ? (
                  <Box
                    component="a"
                    href={tool.link}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        p: 6,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                          transform: 'translateY(-8px)',
                          
                          '& .gradient-icon': {
                            background: tool.gradient,
                            transform: 'scale(1.1)',
                          },
                          
                          '& .feature-badge': {
                            background: tool.gradient,
                            transform: 'translateX(8px)',
                          }
                        },
                        
                        // Subtle gradient overlay
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${tool.gradient.match(/#[a-fA-F0-9]{6}/g)?.[0] || '#667eea'}10 0%, transparent 50%)`,
                          borderRadius: '24px',
                          opacity: 0,
                          transition: 'opacity 0.4s ease',
                          pointerEvents: 'none',
                        },
                        
                        '&:hover::before': {
                          opacity: 1,
                        }
                      }}
                    >
                      {/* Feature Badge */}
                      <Box
                        className="feature-badge"
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          px: 2,
                          py: 0.5,
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.4s ease',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {tool.feature}
                        </Typography>
                      </Box>
                      
                      {/* Icon */}
                      <Box
                        className="gradient-icon"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 4,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <Box sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {tool.icon}
                        </Box>
                      </Box>
                      
                      {/* Content */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: '#ffffff',
                            fontSize: '1.5rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {tool.title}
                        </Typography>
                        
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            lineHeight: 1.6,
                            fontSize: '1rem',
                            flex: 1,
                          }}
                        >
                          {tool.description}
                        </Typography>
                        
                        {/* Learn More Link */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 4,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              '& .arrow-icon': {
                                transform: 'translateX(4px)',
                              }
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              mr: 1,
                            }}
                          >
                            Learn more
                          </Typography>
                          <KeyboardArrowRight
                            className="arrow-icon"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: 18,
                              transition: 'transform 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    component={Link}
                    to={tool.link}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        p: 6,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                          transform: 'translateY(-8px)',
                          
                          '& .gradient-icon': {
                            background: tool.gradient,
                            transform: 'scale(1.1)',
                          },
                          
                          '& .feature-badge': {
                            background: tool.gradient,
                            transform: 'translateX(8px)',
                          }
                        },
                        
                        // Subtle gradient overlay
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${tool.gradient.match(/#[a-fA-F0-9]{6}/g)?.[0] || '#667eea'}10 0%, transparent 50%)`,
                          borderRadius: '24px',
                          opacity: 0,
                          transition: 'opacity 0.4s ease',
                          pointerEvents: 'none',
                        },
                        
                        '&:hover::before': {
                          opacity: 1,
                        }
                      }}
                    >
                      {/* Feature Badge */}
                      <Box
                        className="feature-badge"
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          px: 2,
                          py: 0.5,
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.4s ease',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {tool.feature}
                        </Typography>
                      </Box>
                      
                      {/* Icon */}
                      <Box
                        className="gradient-icon"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 4,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <Box sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {tool.icon}
                        </Box>
                      </Box>
                      
                      {/* Content */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: '#ffffff',
                            fontSize: '1.5rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {tool.title}
                        </Typography>
                        
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            lineHeight: 1.6,
                            fontSize: '1rem',
                            flex: 1,
                          }}
                        >
                          {tool.description}
                        </Typography>
                        
                        {/* Learn More Link */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 4,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              '& .arrow-icon': {
                                transform: 'translateX(4px)',
                              }
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              mr: 1,
                            }}
                          >
                            Learn more
                          </Typography>
                          <KeyboardArrowRight
                            className="arrow-icon"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: 18,
                              transition: 'transform 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* C Section (Statistics Section) */}
      <Box
        sx={{
          py: { xs: 4, md: 6 }, // Add vertical padding for spacing above boxes
          background: '#f8fafc',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}> {/* Add container with horizontal padding */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 0 }} // Add small spacing between boxes on mobile
            sx={{ width: '100%' }}
          >
            {/* Black Box - Users */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
                  color: '#fff',
                  borderRadius: '16px',
                  p: { xs: 8, md: 12 },
                  textAlign: 'center',
                  minHeight: { xs: '400px', md: '500px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
                    zIndex: -1,
                  }
                }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 900, 
                    fontSize: { xs: '3rem', md: '4rem' },
                    mb: 2,
                    background: 'linear-gradient(135deg, #fff 0%, #e5e5e5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  50K+
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 1,
                    color: '#fff'
                  }}
                >
                  Active Users
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    maxWidth: '300px',
                    mx: 'auto'
                  }}
                >
                  Trust our platform to protect their digital lives
                </Typography>
              </Box>
            </motion.div>

            {/* White Box - Accuracy */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                  color: '#000',
                  borderRadius: '16px',
                  p: { xs: 8, md: 12 },
                  textAlign: 'center',
                  minHeight: { xs: '400px', md: '500px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 900, 
                    fontSize: { xs: '3rem', md: '4rem' },
                    mb: 2,
                    background: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  99.5%
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 1,
                    color: '#1e293b'
                  }}
                >
                  Report Accuracy
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    maxWidth: '300px',
                    mx: 'auto'
                  }}
                >
                  Of verified reports are confirmed as legitimate threats
                </Typography>
              </Box>
            </motion.div>
          </Stack>
        </Container> {/* Close container */}
      </Box>

      {/* D Section (Modern Website Checker) */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
