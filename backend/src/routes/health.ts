import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'hyperindex-backend',
    version: process.env.npm_package_version || '0.1.0',
  });
});
