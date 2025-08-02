const ScamReport = require('./models/ScamReport');

// Function to check for high-target scammers
async function checkHighTargetScammer(report) {
  try {
    const { email, phone, name } = report.scammerInfo;

    // Find reports with the same email, phone, or name
    const matchingReports = await ScamReport.find({
      $or: [
        { 'scammerInfo.email': email },
        { 'scammerInfo.phone': phone },
        { 'scammerInfo.name': name },
      ],
    });

    // Check if any of these fields appear in 20 or more reports
    if (matchingReports.length >= 20) {
      // Flag profile
      // Consider your implementation for flagging
      return {
        success: true,
        message: 'Profile flagged as high target scammer',
      };
    }

    return {
      success: false,
      message: 'Profile not flagged',
    };
  } catch (error) {
    console.error('Error checking high target scammer:', error);
    return {
      success: false,
      message: 'Error checking high target scammer',
    };
  }
}

module.exports = checkHighTargetScammer;

