import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Security,
  Report,
  Search,
  Home,
  Info,
  PrivacyTip,
  Policy,
  Support,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/', icon: <Home fontSize="small" /> },
    { name: 'Search Scams', href: '/search', icon: <Search fontSize="small" /> },
    { name: 'Report Scam', href: '/report', icon: <Report fontSize="small" /> },
    { name: 'About Us', href: '/about', icon: <Info fontSize="small" /> },
  ];

  const supportLinks = [
    { name: 'Privacy Policy', href: '/privacy', icon: <PrivacyTip fontSize="small" /> },
    { name: 'Terms of Service', href: '/terms', icon: <Policy fontSize="small" /> },
    { name: 'Support Center', href: '/support', icon: <Support fontSize="small" /> },
    { name: 'Contact Us', href: '/contact', icon: <Email fontSize="small" /> },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook />, href: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter />, href: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram />, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <LinkedIn />, href: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FF6B35 0%, #FF8A5B 50%, #FF6B35 100%)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Company Info */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h5" fontWeight={700}>
                  Scam Reporter
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Protecting communities from fraud and scams through collective reporting and awareness.
                Together, we can make the digital world safer for everyone.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Secure"
                  size="small"
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Trusted"
                  size="small"
                  sx={{
                    bgcolor: 'info.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Community"
                  size="small"
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>

            {/* Contact Info */}
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Contact Information
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, fontSize: 20 }} />
                  <Link href="mailto:support@scamreporter.com" color="inherit" underline="hover">
                    support@scamreporter.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1, fontSize: 20 }} />
                  <Link href="tel:+1234567890" color="inherit" underline="hover">
                    +1 (234) 567-890
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Global Community
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'secondary.main',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {link.icon}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Support
              </Typography>
              <Stack spacing={1}>
                {supportLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    color="inherit"
                    underline="hover"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'secondary.main',
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {link.icon}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {link.name}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Newsletter & Social */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Stay Connected
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              Follow us on social media for the latest scam alerts and security tips.
            </Typography>

            {/* Social Media Links */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'secondary.main',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>

          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} Scam Reporter. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link href="/cookies" color="inherit" underline="hover" variant="body2">
              Cookie Policy
            </Link>
          </Box>
        </Box>

        {/* Disclaimer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            This platform is for educational and reporting purposes only. 
            Always verify information independently and contact official authorities for legal matters.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 