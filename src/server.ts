import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

interface ErrorWithStatus extends Error {
  status?: number;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock prediction endpoint
app.post('/api/predict', (req: Request, res: Response) => {
  const { feature1, feature2 } = req.body;
  
  // Simple mock prediction logic
  const prediction = {
    prediction: Math.random() > 0.5 ? 'A' : 'B',
    confidence: Math.random().toFixed(2),
    features: { feature1, feature2 },
    timestamp: new Date().toISOString()
  };
  
  res.json(prediction);
});

// Error handling
app.use((err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
