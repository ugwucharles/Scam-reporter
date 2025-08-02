const axios = require('axios');

// Mock API endpoints for external partner verification
const PARTNER_API = 'https://api.partner.com/verify';

// Function for external checks in collaboration with partners
async function externalCheck(report) {
  try {
    // Send data to partner for verification
    const partnerResponse = await axios.post(PARTNER_API, {
      title: report.title,
      description: report.description,
      scammerInfo: report.scammerInfo,
    });

    if (partnerResponse.data.isVerified) {
      report.validation.comments = 'Verified through external partner';
      report.status = 'approved';
      await report.save();

      return {
        success: true,
        message: 'Report verified by external partner',
      };
    }

    return {
      success: false,
      message: 'Report not verified by external partner',
    };
  } catch (error) {
    console.error('Error during external check:', error);
    return {
      success: false,
      message: 'Error during external check',
    };
  }
}

module.exports = externalCheck;

