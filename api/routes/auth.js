const express = require('express');
const router = express.Router();
const { sendResetEmail } = require('../services/emailService');

/**
 * POST /api/auth/reset-password
 * Triggers a password reset email
 */
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // 1. Generate a mock token (In a real app, save this to DB with expiry)
    const mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // 2. Send the email
    console.log(`Attempting to send reset email to: ${email}`);
    
    // For demo purposes, we catch errors if SMTP is not configured
    try {
      await sendResetEmail(email, mockToken);
      res.json({ 
        message: 'Password reset email sent successfully',
        token: process.env.NODE_ENV === 'development' ? mockToken : undefined 
      });
    } catch (emailErr) {
      console.warn('SMTP failed, returning success for demo purposes but logging error.');
      console.error(emailErr);
      
      // If SMTP fails, we might still want to return a message that looks like success for security 
      // OR we return an error if it's a critical system failure.
      // Here we return 500 if SMTP_USER is missing, which is a misconfiguration.
      if (!process.env.SMTP_USER) {
        return res.status(500).json({ 
          error: 'SMTP Configuration missing', 
          message: 'Server is not configured to send emails. Please set SMTP_USER and SMTP_PASS in .env'
        });
      }
      throw emailErr;
    }

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
});

module.exports = router;
