const express = require('express');
const router = express.Router();
const { validateScanInput } = require('../utils/validation');
const { runDeepSeekAnalysis, validateAndMapConfidence } = require('../services/deepseek');

router.post('/', async (req, res) => {
  try {
    const { image_base64, description, crop_type } = req.body;

    const { isValid, errors, cleanDesc } = validateScanInput(
      image_base64,
      crop_type,
      description
    );

    if (!isValid) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: errors
      });
    }

    const rawDiagnosisJson = await runDeepSeekAnalysis(
      image_base64,
      cleanDesc,
      crop_type
    );

    const mappedDiagnoses = validateAndMapConfidence(rawDiagnosisJson);

    return res.status(200).json({
      diagnosis: mappedDiagnoses,
      crop_type,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Diagnose Endpoint Error:', error);
    return res.status(500).json({
      error: 'Antigravity Pipeline Failure',
      message: error.message
    });
  }
});

module.exports = router;
