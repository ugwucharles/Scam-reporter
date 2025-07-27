# API Security Guide

## 🔐 Protecting Your Google API Key

### 1. **Google Cloud Console Restrictions** (CRITICAL)

Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and restrict your API key:

#### A. **Application Restrictions**
- Set to "HTTP referrers (web sites)"
- Add your domains:
  ```
  http://localhost:3000/*
  http://localhost:5000/*
  https://yourdomain.com/*
  https://www.yourdomain.com/*
  ```

#### B. **API Restrictions**
- Restrict to only: "Safe Browsing API"
- This prevents the key from being used for other Google services

#### C. **Usage Quotas**
- Set daily request limits (e.g., 1000 requests/day)
- Enable billing alerts

### 2. **Environment Security** ✅

Your `.env` file is already in `.gitignore` - Good!

### 3. **Backend-Only Implementation** ✅

API key is only used in backend - Good!
- Frontend never sees the API key
- All requests go through your server

### 4. **Rate Limiting** (Implemented below)

### 5. **Request Validation** (Implemented below)

### 6. **Monitoring & Alerts**

Enable in Google Cloud Console:
- API usage monitoring
- Unusual traffic alerts
- Quota exceeded notifications

## 🚨 Security Red Flags

**NEVER:**
- Commit `.env` files to Git
- Expose API keys in frontend code
- Share API keys in plain text
- Use the same key for multiple projects
- Ignore usage spikes

**ALWAYS:**
- Rotate API keys regularly
- Monitor usage patterns
- Set up billing alerts
- Use HTTPS only
- Validate all inputs
