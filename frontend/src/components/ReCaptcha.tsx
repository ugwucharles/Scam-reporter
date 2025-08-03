import React, { useRef, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  error?: string;
  required?: boolean;
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ onVerify, error, required = true }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Site key - you'll need to replace this with your actual reCAPTCHA site key
  const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LedF5krAAAAAJZ9hzDNYgjR57VRT0z72RnTrXpo';

  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  const handleExpired = () => {
    onVerify(null);
  };

  const handleError = () => {
    onVerify(null);
  };

  // Reset reCAPTCHA when error occurs
  useEffect(() => {
    if (error && recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [error]);

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {required ? 'Please complete the reCAPTCHA verification to submit your report.' : 'Complete reCAPTCHA verification (optional)'}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={handleChange}
          onExpired={handleExpired}
          onError={handleError}
          theme="light"
          size="normal"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ReCaptcha; 