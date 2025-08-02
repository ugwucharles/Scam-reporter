import React from 'react';
import {
  Box,
  Card,
  Typography,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Security,
  Info,
} from '@mui/icons-material';

interface WebsiteCheckerResultProps {
  result: {
    safe: boolean;
    message?: string;
    threats?: Array<{
      threatType: string;
      platformType: string;
      threat: {
        url: string;
      };
    }>;
    analysis?: {
      method: string;
      score: number;
      details?: any;
    };
    error?: string;
  } | null;
  url: string;
}

const WebsiteCheckerResult: React.FC<WebsiteCheckerResultProps> = ({ result, url }) => {
  if (!result) return null;

  if (result.error) {
    return (
      <Card
        sx={{
          mt: 4,
          p: 4,
          borderRadius: '16px',
          border: '1px solid #f87171',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
        }}
      >
        <Alert
          severity="error"
          icon={<Error />}
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.1rem',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Analysis Failed
          </Typography>
          <Typography variant="body1">
            {result.error}
          </Typography>
        </Alert>
      </Card>
    );
  }

  const getThreatColor = (threatType: string) => {
    switch (threatType.toLowerCase()) {
      case 'malware':
        return '#dc2626';
      case 'social_engineering':
        return '#ea580c';
      case 'unwanted_software':
        return '#d97706';
      case 'potentially_harmful_application':
        return '#ca8a04';
      default:
        return '#dc2626';
    }
  };

  const getThreatDescription = (threatType: string) => {
    switch (threatType.toLowerCase()) {
      case 'malware':
        return 'This website contains malicious software that could harm your device.';
      case 'social_engineering':
        return 'This website may try to trick you into sharing personal information.';
      case 'unwanted_software':
        return 'This website may install unwanted software on your device.';
      case 'potentially_harmful_application':
        return 'This website contains applications that could be harmful.';
      default:
        return 'This website has been flagged for security concerns.';
    }
  };

  return (
    <Card
      sx={{
        mt: 4,
        p: 4,
        borderRadius: '16px',
        border: result.safe ? '1px solid black' : '1px solid #f87171',
        background: result.safe 
          ? 'white'
          : 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {result.safe ? (
          <CheckCircle sx={{ fontSize: 40, color: '#10b981', mr: 2 }} />
        ) : (
          <Warning sx={{ fontSize: 40, color: '#dc2626', mr: 2 }} />
        )}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: result.safe ? '#166534' : '#dc2626',
              mb: 0.5,
            }}
          >
            {result.safe ? 'Website Appears Safe' : 'Security Threats Detected'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: result.safe ? '#16a34a' : '#b91c1c',
              fontSize: '0.9rem',
            }}
          >
            Analysis for: {url}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {result.safe ? (
        <Box>
          <Alert
            severity="success"
            icon={<Security />}
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1rem',
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              {result.message || 'This website appears to be safe based on our analysis.'}
            </Typography>
            {result.analysis && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ color: '#059669', mb: 1 }}>
                  <strong>Analysis Method:</strong> {result.analysis.method === 'google_safe_browsing' ? 'Google Safe Browsing API' : 'Basic Security Analysis'}
                </Typography>
                {result.analysis.method === 'basic_analysis' && result.analysis.details && (
                  <Typography variant="body2" sx={{ color: '#059669', fontSize: '0.9rem' }}>
                    <strong>Security Score:</strong> {result.analysis.score}/100
                  </Typography>
                )}
              </Box>
            )}
            <Typography variant="body2" sx={{ color: '#059669', mt: 2 }}>
              <strong>Note:</strong> Always exercise caution when sharing personal information online, 
              even with websites that appear safe.
            </Typography>
          </Alert>
        </Box>
      ) : (
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, color: '#dc2626' }}
          >
            Security Threats Found:
          </Typography>
          
          <List sx={{ py: 0 }}>
            {result.threats?.map((threat, index) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom: index < (result.threats?.length || 0) - 1 ? '1px solid #fecaca' : 'none',
                }}
              >
                <ListItemIcon>
                  <Error sx={{ color: getThreatColor(threat.threatType) }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {threat.threatType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                      <Chip
                        label={threat.platformType}
                        size="small"
                        sx={{
                          backgroundColor: getThreatColor(threat.threatType),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                      {getThreatDescription(threat.threatType)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          {result.analysis && result.analysis.method === 'basic_analysis' && result.analysis.details && (
            <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ color: '#dc2626', mb: 2, fontWeight: 600 }}>
                <strong>Analysis Details:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {result.analysis.details.suspiciousKeywords && (
                  <Typography variant="body2" sx={{ color: '#dc2626', fontSize: '0.9rem' }}>
                    • Contains suspicious keywords in domain name
                  </Typography>
                )}
                {result.analysis.details.suspiciousTLD && (
                  <Typography variant="body2" sx={{ color: '#dc2626', fontSize: '0.9rem' }}>
                    • Uses suspicious top-level domain
                  </Typography>
                )}
                {result.analysis.details.ipAddress && (
                  <Typography variant="body2" sx={{ color: '#dc2626', fontSize: '0.9rem' }}>
                    • Uses IP address instead of domain name
                  </Typography>
                )}
                {result.analysis.details.longDomain && (
                  <Typography variant="body2" sx={{ color: '#dc2626', fontSize: '0.9rem' }}>
                    • Unusually long domain name
                  </Typography>
                )}
                {result.analysis.details.excessiveSubdomains && (
                  <Typography variant="body2" sx={{ color: '#dc2626', fontSize: '0.9rem' }}>
                    • Excessive number of subdomains
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          
          <Alert
            severity="error"
            icon={<Info />}
            sx={{
              mt: 3,
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            <Typography variant="body2">
              <strong>Recommendation:</strong> Do not visit this website or share any personal information. 
              This site has been flagged as potentially dangerous.
            </Typography>
          </Alert>
        </Box>
      )}
    </Card>
  );
};

export default WebsiteCheckerResult;
