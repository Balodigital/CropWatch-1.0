const nodemailer = require('nodemailer');

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App password if using Gmail
  },
});

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} token - Reset token
 */
const sendResetEmail = async (to, token) => {
  const resetLink = `https://cropwatch.app/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"CropWatch Support" <${process.env.SMTP_USER}>`,
    to: to,
    subject: 'Password Reset Request - CropWatch',
    text: `You requested a password reset. Click the link below to reset your password: \n\n ${resetLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2c6a4f;">CropWatch Password Reset</h2>
        <p>You requested a password reset for your CropWatch account.</p>
        <p>Please click the button below to set a new password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #2c6a4f; color: #fff; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">🌱 CropWatch - Nigerian Smallholder Farming AI Service</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendResetEmail,
};
