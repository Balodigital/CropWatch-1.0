const express = require('express');
const router = express.Router();
const { runSupportChat } = require('../services/support');

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const aiResponse = await runSupportChat(messages);

    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error('Support Chat Error:', error);
    return res.status(500).json({
      error: 'Support Chat Failure',
      message: error.message
    });
  }
});

// Ticket creation endpoint
router.post('/ticket', async (req, res) => {
  try {
    const { summary, description, screenshot } = req.body;

    // In a real app, you would save this to a database (Supabase/PostgreSQL)
    // For now, we simulate success
    console.log('Ticket Created:', { summary, description, hasScreenshot: !!screenshot });

    return res.status(200).json({
      success: true,
      ticketId: `CW-${Math.floor(1000 + Math.random() * 9000)}`,
      message: 'Your ticket has been submitted successfully'
    });

  } catch (error) {
    console.error('Ticket Creation Error:', error);
    return res.status(500).json({
      error: 'Ticket Creation Failure',
      message: error.message
    });
  }
});

module.exports = router;
