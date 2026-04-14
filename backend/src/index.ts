import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AdPulse backend is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`AdPulse backend running on port ${PORT}`);
});

export default app;