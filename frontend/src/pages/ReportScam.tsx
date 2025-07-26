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
  Chip,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';

import {
  CloudUpload,
  PhotoCamera,
  Delete,
  Security,
  Warning,
  CheckCircle,
  Upload,
  Description,
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { scamReportsAPI } from '../services/api';

interface FormData {
  scamType: string;
  title: string;
  description: string;
  scammerName: string;
  scammerPhone: string;
  scammerEmail: string;
  scammerWebsite: string;
  location: string;
  amountLost: string;
  dateOccurred: string;
  contactInfo: string;
  additionalDetails: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: string;
}

const ReportScam: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string>('');

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    // Required fields validation
    if (!formData.scamType?.trim()) {
      newErrors.scamType = 'Please select a scam type';
      isValid = false;
    }
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Please provide a title for your report';
      isValid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
      isValid = false;
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Please provide a detailed description';
      isValid = false;
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
      isValid = false;
    }
    
    if (!formData.dateOccurred) {
      newErrors.dateOccurred = 'Please select when the scam occurred';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.dateOccurred);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        newErrors.dateOccurred = 'Date cannot be in the future';
        isValid = false;
      }
    }

    // Optional field validations
    if (formData.scammerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.scammerEmail)) {
      newErrors.scammerEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.scammerWebsite && !/^https?:\/\//i.test(formData.scammerWebsite)) {
      newErrors.scammerWebsite = 'Please enter a valid URL (include http:// or https://)';
      isValid = false;
    }

    if (formData.amountLost && isNaN(Number(formData.amountLost))) {
      newErrors.amountLost = 'Please enter a valid amount';
      isValid = false;
    }

    setErrors(newErrors);
    
    // Scroll to first error if any
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Form data should already have the correct scam type values
      const convertedFormData = { ...formData };
      
      // Add form fields
      console.log('Form data before sending:', convertedFormData);
      Object.entries(convertedFormData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert date to ISO format for backend validation
          if (key === 'dateOccurred') {
            const date = new Date(value);
            const isoString = date.toISOString();
            console.log(`Appending ${key}: ${isoString}`);
            formDataToSend.append(key, isoString);
          } else {
            console.log(`Appending ${key}: ${value}`);
            formDataToSend.append(key, value);
          }
        }
      });

      // Add files
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((fileObj) => {
          formDataToSend.append('evidence', fileObj.file);
        });
      }

      console.log('Submitting form data:', {
        ...formData,
        fileCount: uploadedFiles.length
      });

      // Submit to backend
      const response = await scamReportsAPI.createReport(formDataToSend);
      
      console.log('Report submitted successfully:', response.data);
      
      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Submission error:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const validationErrors = error.response.data.errors.map((err: any) => `${err.path}: ${err.msg}`).join(', ');
        setSubmitError(`Validation failed: ${validationErrors}`);
      } else {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error ||
                           error.message ||
                           'Failed to submit report. Please check your connection and try again.';
        setSubmitError(errorMessage);
      }
      
      setIsSubmitting(false);
      
      // Scroll to error message
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Report Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for helping protect others from scams. Your report has been received and will be reviewed by our team.
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
                });
                setUploadedFiles([]);
                setSubmitError('');
              }}
            >
              Submit Another Report
            </Button>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Report a Scam
          </Typography>
          <Typography color="textSecondary" paragraph sx={{ mb: 4 }}>
            Help protect others by sharing your experience. All information provided will be kept confidential.
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <FormControl fullWidth error={!!errors.scamType} required>
                    <InputLabel>Type of Scam</InputLabel>
                    <Select
                      value={formData.scamType}
                      onChange={(e) => handleInputChange('scamType', e.target.value as string)}
                      label="Type of Scam"
                    >
                      {scamTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.display}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.scamType && <FormHelperText>{errors.scamType}</FormHelperText>}
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    required
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                  sx={{ mb: 2 }}
                />

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
                  required
                />
              </Box>

              {/* Scammer Information */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Scammer Information (Optional)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Scammer's Name"
                    value={formData.scammerName}
                    onChange={(e) => handleInputChange('scammerName', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Scammer's Phone"
                    value={formData.scammerPhone}
                    onChange={(e) => handleInputChange('scammerPhone', e.target.value)}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Scammer's Email"
                    value={formData.scammerEmail}
                    onChange={(e) => handleInputChange('scammerEmail', e.target.value)}
                    error={!!errors.scammerEmail}
                    helperText={errors.scammerEmail}
                  />
                  <TextField
                    fullWidth
                    label="Scammer's Website"
                    value={formData.scammerWebsite}
                    onChange={(e) => handleInputChange('scammerWebsite', e.target.value)}
                    error={!!errors.scammerWebsite}
                    helperText={errors.scammerWebsite}
                  />
                </Box>
              </Box>

              {/* Additional Details */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Additional Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Amount Lost"
                    type="number"
                    value={formData.amountLost}
                    onChange={(e) => handleInputChange('amountLost', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={!!errors.amountLost}
                    helperText={errors.amountLost}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Your Contact Information (Optional)"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  helperText="If you'd like to be contacted for more information"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Additional Details"
                  value={formData.additionalDetails}
                  onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                  multiline
                  rows={3}
                  helperText="Any other information that might be helpful"
                />
              </Box>

              {/* File Upload */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Evidence Upload (Optional)
                </Typography>
                <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="file-upload"
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploadedFiles.length >= 5}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Upload />}
                      sx={{ mb: 2 }}
                      disabled={uploadedFiles.length >= 5}
                    >
                      Choose Files
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    {uploadedFiles.length < 5 
                      ? 'Upload screenshots or other evidence (max 5 files, 10MB each)'
                      : 'Maximum 5 files reached. Remove some files to add more.'
                    }
                  </Typography>
                  
                  {/* File type restrictions notice */}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Supported formats: JPG, PNG, GIF (max 10MB per file)
                  </Typography>
                </Card>
              </Box>

              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Uploaded Files ({uploadedFiles.length}/5)
                  </Typography>
                  <Stack spacing={2}>
                    {uploadedFiles.map((file) => (
                      <Card key={file.id} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img
                              src={file.preview}
                              alt={file.name}
                              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {file.size}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => removeFile(file.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Security />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ReportScam;
