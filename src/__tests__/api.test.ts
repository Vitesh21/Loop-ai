import request from 'supertest';
import { Server } from 'http';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../server';

describe('API Routes', () => {
  let server: Server;

  beforeAll(async () => {
    // Start the server before tests
    const PORT = process.env.PORT || 3001;
    await new Promise<void>((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    // Close the server after tests
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });
  it('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('POST /api/predict should return predictions', async () => {
    const testData = {
      feature1: 0.6,
      feature2: 1.1
    };
    
    const res = await request(app)
      .post('/api/predict')
      .send(testData);
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('prediction');
    expect(['A', 'B']).toContain(res.body.prediction);
    expect(res.body).toHaveProperty('confidence');
    expect(res.body).toHaveProperty('features', testData);
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({ invalid: 'data' });
      
    expect(res.status).toBe(400);
  });
});
