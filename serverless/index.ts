import express from 'express';
import { apiRouter } from '../src/server/routes/api';
import { pool, isPostgresConfigured } from '../src/db/index.ts';

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// CORS & Security headers for Vercel Serverless
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    if (!isPostgresConfigured) {
      return res.status(503).json({ status: 'degraded', database: 'not_configured', runtime: 'Vercel Serverless Function', timestamp: new Date().toISOString() });
    }
    await pool.query('SELECT 1');
    return res.json({ status: 'healthy', database: 'connected', runtime: 'Vercel Serverless Function', timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('[Health] Database connectivity check failed:', error?.message || error);
    return res.status(503).json({ status: 'degraded', database: 'unavailable', runtime: 'Vercel Serverless Function', timestamp: new Date().toISOString() });
  }
});

// Mount API routes
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
