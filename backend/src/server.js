import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import apiRoutes from './routes/api.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 GivEnergy Dashboard API running on http://localhost:${config.port}`);
  console.log(`📊 Dashboard endpoint: http://localhost:${config.port}/api/dashboard`);
});
