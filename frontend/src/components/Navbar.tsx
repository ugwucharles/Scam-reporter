import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Box, 
  Button, 
  IconButton, 
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Lock, 
  Menu, 
  Close,
  Search as SearchIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // const { isAuthenticated, user, logout } = useAuth();

  // Apple's exact navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report' },
    { path: '/dashboard', label: 'Analytics' },
    { path: '/support', label: 'Support' },
  ];

  // Always show Sign In button
  const allNavItems = [
    ...navItems,
    { path: '/login', label: 'Sign In' },
  ];



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile menu component
  const MobileMenu = () => (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              zIndex: 1200,
            }}
            onClick={handleDrawerToggle}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '320px',
              maxWidth: '80vw',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              zIndex: 1300,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
            }}
          >
            {/* Close button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  color: '#1d1d1f',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Close sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            {/* Navigation items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {allNavItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    component={Link}
                    to={item.path}
                    onClick={handleDrawerToggle}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      py: 2,
                      px: 3,
                      fontSize: '17px',
                      fontWeight: item.label === 'Sign In' ? 600 : 400,
                      color: location.pathname === item.path ? '#007AFF' : (item.label === 'Sign In' ? '#007AFF' : '#1d1d1f'),
                      backgroundColor: 'transparent',
                      borderRadius: '12px',
                      textTransform: 'none',
                      position: 'relative',
                      border: item.label === 'Sign In' ? '1px solid #007AFF' : 'none',
                      marginTop: item.label === 'Sign In' ? 2 : 0,
                      '&:hover': {
                        backgroundColor: item.label === 'Sign In' ? 'rgba(0, 122, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                      },
                      '&::after': location.pathname === item.path && item.label !== 'Sign In' ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#007AFF',
                        borderRadius: '1px',
                      } : {},
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Apple-style Navigation Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease-in-out',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar 
              sx={{ 
                justifyContent: 'space-between', 
                minHeight: '44px',
                px: { xs: 1, sm: 2 },
              }}
            >
              {/* Padlock Icon (Apple-style) */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    component={Link}
                    to="/"
                    sx={{ 
                      width: 32,
                      height: 32,
                      color: '#1d1d1f',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Lock sx={{ fontSize: 20 }} />
                  </IconButton>
                </motion.div>
              </Box>

              {/* Desktop Navigation Items - Evenly Spaced */}
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flex: 1,
                  gap: 0
                }}>
                  {allNavItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <Button
                        component={Link}
                        to={item.path}
                        sx={{
                          color: location.pathname === item.path ? '#007AFF' : '#1d1d1f',
                          backgroundColor: 'transparent',
                          fontWeight: 400,
                          fontSize: '12px',
                          px: 3,
                          py: 1.5,
                          textTransform: 'none',
                          minWidth: 'auto',
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            color: '#007AFF',
                          },
                          '&::after': location.pathname === item.path ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '20px',
                            height: '2px',
                            backgroundColor: '#007AFF',
                            borderRadius: '1px',
                          } : {},
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              )}

              {/* Right side icons */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Search Icon */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    component={Link}
                    to="/search"
                    sx={{ 
                      width: 32,
                      height: 32,
                      color: '#1d1d1f',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </motion.div>
              </Box>

              {/* Mobile Menu Button */}
              {isMobile && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleDrawerToggle}
                    sx={{ 
                      width: 32,
                      height: 32,
                      color: '#1d1d1f',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Menu sx={{ fontSize: 20 }} />
                  </IconButton>
                </motion.div>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
};

export default Navbar;
