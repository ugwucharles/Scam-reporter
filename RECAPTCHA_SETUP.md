# reCAPTCHA Setup Guide for ScamGuard

This guide will help you set up Google reCAPTCHA to protect the scam reporting form from bots and malicious submissions.

## 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to register a new site
3. Choose "reCAPTCHA v2" with "I'm not a robot" checkbox
4. Add your domains:
   - For development: `localhost`, `127.0.0.1`
   - For production: Your actual domain (e.g., `scamguard.com`)
5. Accept the terms and click "Submit"
6. Copy the **Site Key** and **Secret Key**

## 2. Backend Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/scam-reporter

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

Replace `your_recaptcha_secret_key_here` with the Secret Key from Google reCAPTCHA.

## 3. Frontend Configuration

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# reCAPTCHA Configuration
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

Replace `your_recaptcha_site_key_here` with the Site Key from Google reCAPTCHA.

## 4. How It Works

### Frontend (React)
- The `ReCaptcha` component renders the Google reCAPTCHA widget
- When users complete the verification, a token is generated
- This token is sent with the form submission

### Backend (Node.js)
- The `verifyRecaptcha` middleware validates the token with Google's API
- If verification fails, the request is rejected
- If verification succeeds, the report submission proceeds

## 5. Security Features

- **Bot Protection**: Prevents automated form submissions
- **Rate Limiting**: Additional protection against spam
- **Token Validation**: Server-side verification of reCAPTCHA tokens
- **Error Handling**: Graceful handling of verification failures

## 6. Testing

### Development Testing
- Use the test keys provided by Google for development
- The system will work with test keys but won't provide real protection

### Production Testing
- Use real reCAPTCHA keys for production
- Test with different browsers and devices
- Monitor reCAPTCHA analytics in Google Admin Console

## 7. Troubleshooting

### Common Issues

1. **"reCAPTCHA verification failed"**
   - Check that your secret key is correct
   - Ensure the domain is properly configured in Google Admin Console

2. **"reCAPTCHA configuration error"**
   - Verify that `RECAPTCHA_SECRET_KEY` is set in your `.env` file
   - Restart the backend server after adding environment variables

3. **Widget not loading**
   - Check that `REACT_APP_RECAPTCHA_SITE_KEY` is set correctly
   - Ensure the domain is allowed in Google Admin Console

### Debug Mode

The system includes detailed logging for debugging:
- Check backend console for reCAPTCHA verification results
- Frontend console shows token generation and submission

## 8. Advanced Configuration

### Customizing reCAPTCHA Theme
You can modify the `ReCaptcha` component to use different themes:
- `theme="light"` (default)
- `theme="dark"`

### Adjusting Score Threshold
For reCAPTCHA v3, you can adjust the score threshold in `backend/middleware/recaptcha.js`:
```javascript
if (score !== undefined && score < 0.5) { // Adjust this value
```

## 9. Monitoring

- Monitor reCAPTCHA analytics in Google Admin Console
- Check server logs for verification failures
- Track user experience and completion rates

## 10. Best Practices

1. **Keep keys secure**: Never commit `.env` files to version control
2. **Use HTTPS**: Always use HTTPS in production for security
3. **Monitor usage**: Regularly check reCAPTCHA analytics
4. **Test thoroughly**: Test with various browsers and devices
5. **Update regularly**: Keep reCAPTCHA library updated

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google reCAPTCHA documentation
3. Check server logs for detailed error messages
4. Verify environment variable configuration 