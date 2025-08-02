import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Stack,
} from '@mui/material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const productLinks = [
    { name: 'Search Scams', href: '/search' },
    { name: 'Report Scam', href: '/report' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'API', href: '/api' },
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' },
  ];

  const legalLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Cookies', href: '/cookies' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#fafafa',
        borderTop: '1px solid #e5e7eb',
        mt: 'auto',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 4,
            mb: 8,
          }}
        >
          {/* Company */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: '#111827',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Company
            </Typography>
            <Stack spacing={2}>
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  sx={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#111827',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Product */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: '#111827',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Product
            </Typography>
            <Stack spacing={2}>
              {productLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  sx={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#111827',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Resources */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: '#111827',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Resources
            </Typography>
            <Stack spacing={2}>
              {resourceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  sx={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#111827',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Legal */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: '#111827',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Legal
            </Typography>
            <Stack spacing={2}>
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  sx={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#111827',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#e5e7eb' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            pt: 6,
            gap: 4,
          }}
        >
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#111827',
                mb: 1,
                fontSize: '1.25rem',
              }}
            >
              Scam Reporter
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280',
                fontSize: '0.875rem',
              }}
            >
              Protecting communities from fraud.
            </Typography>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            © {currentYear} Scam Reporter. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
