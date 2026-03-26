import { Router, type Request, type Response } from 'express';
import { testConnection } from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const dbHealthy = await testConnection();

  const healthCheck = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: dbHealthy ? 'healthy' : 'unhealthy',
    database: dbHealthy ? 'connected' : 'disconnected',
  };

  res.status(dbHealthy ? 200 : 503).json({
    success: dbHealthy,
    data: healthCheck,
  });
});

export default router;
