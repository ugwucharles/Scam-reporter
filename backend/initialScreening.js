const mongoose = require('mongoose');
const ScamReport = require('./models/ScamReport');

// Function to automatically screen reports
async function initialScreening(report) {
  try {
    // Check if report has all required fields
    if (!report.title || !report.description) {
      return {
        success: false,
        message: 'Report is incomplete',
      };
    }

    // Check for duplicates by finding a report with the same title and description
    const duplicate = await ScamReport.findOne({
      title: report.title,
      description: report.description,
    });

    if (duplicate) {
      return {
        success: false,
        message: 'Duplicate report',
      };
    }

    // If no issues, mark the report as ready for next steps
    report.validation.step = 'automated_verification';
    await report.save();

    return {
      success: true,
      message: 'Report passed initial screening',
    };
  } catch (error) {
    console.error('Error during initial screening:', error);
    return {
      success: false,
      message: 'Error during initial screening',
    };
  }
}

module.exports = initialScreening;

