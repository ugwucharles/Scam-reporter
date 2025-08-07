# Environment Variables Setup

## For Local Development

Create a `.env` file in the `backend/` directory with the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/scam-reporter

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## For Vercel Deployment

You need to set these environment variables in your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

### Required Variables:
- `MONGODB_URI` - Your MongoDB connection string (use MongoDB Atlas for production)
- `JWT_SECRET` - A secure random string for JWT token signing
- `RECAPTCHA_SITE_KEY` - Your reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY` - Your reCAPTCHA secret key

### Optional Variables:
- `NODE_ENV` - Set to "production" for production deployment
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - For email functionality

## Getting MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `MONGODB_URI` with your Atlas connection string

## Getting reCAPTCHA Keys

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v3
4. Add your domain (localhost for development, your Vercel domain for production)
5. Copy the site key and secret key 