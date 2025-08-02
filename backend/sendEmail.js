const nodemailer = require('nodemailer');

// Function to send email updates to reporters
async function sendEmail(report, user) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // replace with your email service provider
    auth: {
      user: 'your-email@gmail.com', // Your email address
      pass: 'your-email-password'  // Your email password
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Update on Your Scam Report',
    text: `Dear ${user.name},\n\nYour report is currently at the status: ${report.status}.\n\nWould you like us to contact the authorities on your behalf?\n\nBest regards,\nScam Reporter Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmail;

