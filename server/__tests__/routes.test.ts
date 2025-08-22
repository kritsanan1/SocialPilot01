
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';

describe('Server Routes', () => {
  let app: express.Application;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Authentication endpoints', () => {
    it('should handle login redirect', async () => {
      const response = await request(app)
        .get('/api/login')
        .expect(302);

      expect(response.headers.location).toBeDefined();
    });
  });
});
