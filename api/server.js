require('dotenv').config();
const express = require('express');
const cors = require('cors');
const diagnoseRouter = require('./routes/diagnose');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/diagnose', diagnoseRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🌱 CropWatch API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
