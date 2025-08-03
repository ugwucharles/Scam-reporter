import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { CheckCircle, Security } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { scamReportsAPI } from '../services/api';

const ReportScam: React.FC = () => {
  const [formData, setFormData] = useState({
    scamType: '',
    title: '',
    description: '',
    scammerName: '',
    scammerPhone: '',
    scammerEmail: '',
    scammerWebsite: '',
    location: '',
    amountLost: '',
    dateOccurred: '',
    contactInfo: '',
    additionalDetails: '',
    // Reporter information
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitError, setSubmitError] = useState('');

  // Common input styles for light theme
  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: 'rgba(0, 0, 0, 0.42)' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: 'rgba(0, 0, 0, 0.87)' },
    '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
    '& .MuiInputBase-input': { color: 'rgba(0, 0, 0, 0.87)' }
  };

  const scamTypes = [
    { display: 'Investment Scam', value: 'investment' },
    { display: 'Romance Scam', value: 'romance' },
    { display: 'Phishing', value: 'phishing' },
    { display: 'Tech Support Scam', value: 'tech_support' },
    { display: 'Online Shopping Scam', value: 'online_shopping' },
    { display: 'Lottery/Sweepstakes Scam', value: 'lottery' },
    { display: 'Employment Scam', value: 'fake_job' },
    { display: 'Charity Scam', value: 'charity' },
    { display: 'Rental Scam', value: 'rental' },
    { display: 'Cryptocurrency Scam', value: 'crypto' },
    { display: 'Identity Theft', value: 'identity_theft' },
    { display: 'Other', value: 'other' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    // Basic information validation
    if (!formData.scamType.trim()) {
      newErrors.scamType = 'Please select a scam type';
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title';
      isValid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
      isValid = false;
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
      isValid = false;
    }

    if (!formData.dateOccurred) {
      newErrors.dateOccurred = 'Please select the scam date';
      isValid = false;
    }

    // Scammer information validation (now required)
    if (!formData.scammerName.trim()) {
      newErrors.scammerName = 'Scammer name is required';
      isValid = false;
    }

    if (!formData.scammerEmail.trim() && !formData.scammerPhone.trim()) {
      newErrors.scammerContact = 'Please provide at least scammer email or phone number';
      isValid = false;
    }

    if (formData.scammerEmail.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.scammerEmail.trim())) {
        newErrors.scammerEmail = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Reporter information validation (now required)
    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Your name is required';
      isValid = false;
    }

    if (!formData.reporterEmail.trim()) {
      newErrors.reporterEmail = 'Your email is required';
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.reporterEmail.trim())) {
        newErrors.reporterEmail = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!formData.reporterPhone.trim()) {
      newErrors.reporterPhone = 'Your phone number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Convert form data to FormData for API
      const apiFormData = new FormData();
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Original form data:', formData);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) { // Only append non-empty values
          console.log(`Adding ${key}:`, value);
          apiFormData.append(key, value);
        } else {
          console.log(`Skipping empty ${key}`);
        }
      });
      
      console.log('FormData entries:');
      Array.from(apiFormData.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      console.log('========================');
      
      const response = await scamReportsAPI.createReport(apiFormData);
      console.log('Report submitted successfully:', response.data);
      setSubmitSuccess(true);
    } catch (error: any) {
      console.error('=== FULL SUBMISSION ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      console.error('================================');
      
      let errorMessage = 'An error occurred while submitting the report';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        errorMessage = `Validation failed: ${validationErrors.map((err: any) => err.msg).join(', ')}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <Container maxWidth="md" sx={{ pt: 16, pb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom color="success.main">
                Report Submitted Successfully!
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
                Thank you for helping protect others from scams.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({
                    scamType: '',
                    title: '',
                    description: '',
                    scammerName: '',
                    scammerPhone: '',
                    scammerEmail: '',
                    scammerWebsite: '',
                    location: '',
                    amountLost: '',
                    dateOccurred: '',
                    contactInfo: '',
                    additionalDetails: '',
                    reporterName: '',
                    reporterEmail: '',
                    reporterPhone: '',
                  });
                }}
              >
                Submit Another Report
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Container maxWidth="sm" sx={{ pt: 12, pb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#ffffff', color: 'text.primary' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Report a Scam
          </Typography>
          <Typography color="text.secondary" paragraph>
            Help protect others by sharing your experience. We require your contact information to verify reports and prevent false submissions. Your personal information will be kept confidential and only used for verification purposes.
          </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth error={!!errors.scamType} variant="standard" sx={{
              '& .MuiInput-underline:before': { borderBottomColor: 'rgba(0, 0, 0, 0.42)' },
              '& .MuiInput-underline:hover:before': { borderBottomColor: 'rgba(0, 0, 0, 0.87)' },
              '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
              '& .MuiSelect-root': { color: 'rgba(0, 0, 0, 0.87)' }
            }}>
              <InputLabel>Type of Scam</InputLabel>
              <Select
                value={formData.scamType}
                onChange={(e) => handleInputChange('scamType', e.target.value as string)}
                label="Type of Scam"
                variant="standard"
              >
                {scamTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              variant="standard"
              sx={inputStyles}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              variant="standard"
              sx={inputStyles}
            />

            {/* Evidence upload section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Evidence Submission:</strong> You can submit video evidence that can help with the investigation. 
                Videos, screenshots, and other supporting documents strengthen your report and aid authorities in their investigation.
              </Typography>
              
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleInputChange('evidence', e.target.files[0]);
                  }
                }}
                style={{ display: 'block', marginTop: '8px' }}
              />
            </Box>

            <TextField
              fullWidth
              label="Date Occurred"
              type="date"
              value={formData.dateOccurred}
              onChange={(e) => handleInputChange('dateOccurred', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.dateOccurred}
              helperText={errors.dateOccurred}
              variant="standard"
              sx={inputStyles}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="error.main">
              Scammer Information (Required)
            </Typography>

            <TextField
              fullWidth
              required
              label="Scammer's Name"
              value={formData.scammerName}
              onChange={(e) => handleInputChange('scammerName', e.target.value)}
              error={!!errors.scammerName}
              helperText={errors.scammerName}
              variant="standard"
              sx={inputStyles}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Scammer's Phone"
                value={formData.scammerPhone}
                onChange={(e) => handleInputChange('scammerPhone', e.target.value)}
                error={!!errors.scammerPhone}
                helperText={errors.scammerPhone}
                variant="standard"
              sx={inputStyles}
              />

              <TextField
                fullWidth
                label="Scammer's Email"
                value={formData.scammerEmail}
                onChange={(e) => handleInputChange('scammerEmail', e.target.value)}
                error={!!errors.scammerEmail}
                helperText={errors.scammerEmail}
                variant="standard"
              sx={inputStyles}
              />
            </Box>

            {errors.scammerContact && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {errors.scammerContact}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Scammer's Website (Optional)"
              value={formData.scammerWebsite}
              onChange={(e) => handleInputChange('scammerWebsite', e.target.value)}
              variant="standard"
              sx={inputStyles}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary.main">
              Your Information (Required)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We need your contact information to verify this report and may contact you for additional details.
            </Typography>

            <TextField
              fullWidth
              required
              label="Your Full Name"
              value={formData.reporterName}
              onChange={(e) => handleInputChange('reporterName', e.target.value)}
              error={!!errors.reporterName}
              helperText={errors.reporterName}
              variant="standard"
              sx={inputStyles}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Your Email"
                type="email"
                value={formData.reporterEmail}
                onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                error={!!errors.reporterEmail}
                helperText={errors.reporterEmail}
                variant="standard"
              sx={inputStyles}
              />

              <TextField
                fullWidth
                required
                label="Your Phone Number"
                value={formData.reporterPhone}
                onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                error={!!errors.reporterPhone}
                helperText={errors.reporterPhone}
                variant="standard"
              sx={inputStyles}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Additional Information (Optional)
            </Typography>

            <TextField
              fullWidth
              label="Location Where Scam Occurred"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              variant="standard"
              sx={inputStyles}
            />

            <TextField
              fullWidth
              label="Amount Lost (USD)"
              type="number"
              value={formData.amountLost}
              onChange={(e) => handleInputChange('amountLost', e.target.value)}
              variant="standard"
              sx={inputStyles}
            />

            <TextField
              fullWidth
              label="Additional Details"
              multiline
              rows={3}
              value={formData.additionalDetails}
              onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
              helperText="Any other information that might be helpful"
              variant="standard"
              sx={inputStyles}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={<Security />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </Box>
          </Stack>
        </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportScam;

