const axios = require('axios');
const ScamReport = require('./models/ScamReport');

// Mock API endpoints for demonstration purposes
const SCAM_DATABASE_API = 'https://api.scams.com/verify';
const EMAIL_VERIFICATION_API = 'https://api.emailverify.com/verify';

// Function for automated data verification
async function automatedVerification(report) {
  try {
    // Check against known scam databases
    const scamResponse = await axios.post(SCAM_DATABASE_API, {
      title: report.title,
      description: report.description,
      scammerInfo: report.scammerInfo,
    });

    if (scamResponse.data.isScam) {
      report.validation.comments = 'Matched known scam database';
      report.status = 'rejected';
      await report.save();
      return {
        success: false,
        message: 'Report matches known scams',
      };
    }

    // Validate email through an email verification API
    if (report.scammerInfo.email) {
      const emailResponse = await axios.get(`${EMAIL_VERIFICATION_API}?email=${report.scammerInfo.email}`);

      if (!emailResponse.data.isValid) {
        report.validation.comments = 'Invalid scammer email';
        await report.save();
        return {
          success: false,
          message: 'Scammer email is invalid',
        };
      }
    }

    // Update status to indicate next step
// Check if report should be flagged as high target scammer
    const flagResult = await checkHighTargetScammer(report);
    if (flagResult.success) {
      report.validation.comments = flagResult.message;
      report.status = 'under_review';
    } else {
      report.validation.step = 'manual_review';
    }
    await report.save();

    return {
      success: true,
      message: 'Report passed automated verification',
    };
  } catch (error) {
    console.error('Error during automated verification:', error);
    return {
      success: false,
      message: 'Error during automated verification',
    };
  }
}

module.exports = automatedVerification;

