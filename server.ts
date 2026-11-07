import express from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes/api';
import { postgresStore } from './src/db/store.ts';

async function startServer() {
  const app = express();
  const PRIMARY_PORT = 3000;
  const SECONDARY_PORT = process.env.PORT && Number(process.env.PORT) !== PRIMARY_PORT ? Number(process.env.PORT) : null;

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Only enable compression in production to prevent interfering with Nginx sub_filter iframe injection
  if (process.env.NODE_ENV === 'production') {
    app.use(
      compression({
        level: 6,
        threshold: 1024,
      })
    );
  }

  // Security & Iframe headers (Allow AI Studio preview iframe)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Fast health check endpoint (responds instantly for platform & container probes)
  app.get(['/api/health', '/health', '/api/ping'], (_req, res) => {
    res.status(200).json({
      status: 'healthy',
      app: 'JD Fusion Technologies Full-Stack CMS',
      port: PRIMARY_PORT,
      timestamp: new Date().toISOString(),
    });
  });

  // Core Express Middleware for API routes
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Cybersecurity Sentinel & Intrusion Detection Firewall (only checks public non-asset requests)
  app.use(async (req, res, next) => {
    const rawUrl = req.originalUrl || req.url || '';

    // Bypass internal dev, Vite, and module loader requests
    if (
      rawUrl.startsWith('/@') ||
      rawUrl.startsWith('/src/') ||
      rawUrl.startsWith('/node_modules') ||
      rawUrl.startsWith('/public/') ||
      rawUrl.startsWith('/assets/') ||
      rawUrl.startsWith('/_aistudio') ||
      rawUrl.includes('vite') ||
      rawUrl.includes('hot-update')
    ) {
      return next();
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Client';

    // 1. Detect suspicious scanner paths targeting exploits (.env, wp-login, .git, phpmyadmin, etc.)
    const suspiciousProbeRegex =
      /(\.(env|git|htaccess|aws|ssh)|wp-admin|wp-login|xmlrpc|phpmyadmin|cgi-bin|actuator|eval-stdin|\.php)/i;

    if (suspiciousProbeRegex.test(rawUrl)) {
      try {
        await postgresStore.recordActivity({
          type: 'hack_attempt',
          title: 'Vulnerability Probe Intercepted',
          description: `Blocked automated exploit scanner requesting sensitive path: ${rawUrl}`,
          severity: 'danger',
          ip: clientIp,
          userAgent,
          path: rawUrl,
          metadata: { targetUrl: rawUrl, method: req.method },
        });
      } catch {
        // Fallback safely
      }
      return res.status(403).json({
        error: 'Forbidden: Request blocked by JD Fusion Technologies Security Shield.',
        threatBlocked: true,
      });
    }

    // 2. Detect common SQL Injection / Script Injection payloads in non-admin public requests
    if (!rawUrl.startsWith('/admin') && !req.headers.authorization) {
      const queryStr = req.url.includes('?') ? req.url.split('?')[1] : '';
      const injectionRegex =
        /(\bunion\s+select\b|\bselect\s+.*\s+from\b|drop\s+table|insert\s+into\s+.*\s+values|;\s*shutdown|exec\s*\(|or\s+['"]?1['"]?\s*=\s*['"]?1\b|<script\b|\.\.\/|\.\.\\)/i;

      try {
        const decodedQuery = decodeURIComponent(queryStr);
        if (injectionRegex.test(decodedQuery)) {
          await postgresStore.recordActivity({
            type: 'hack_attempt',
            title: 'Malicious Query Injection Intercepted',
            description: `Blocked SQLi/XSS payload attempt on ${req.method} ${rawUrl}`,
            severity: 'danger',
            ip: clientIp,
            userAgent,
            path: rawUrl,
            metadata: { querySnippet: decodedQuery.slice(0, 100), method: req.method },
          });
          return res.status(400).json({
            error: 'Blocked: Potentially malicious injection signature detected.',
            threatBlocked: true,
          });
        }
      } catch {
        // URI decode error, continue
      }
    }

    next();
  });

  // Serve static public folder for uploads & logo assets
  app.use(
    '/uploads',
    express.static(uploadsDir, {
      maxAge: '7d',
      etag: true,
      lastModified: true,
    })
  );
  app.use(
    express.static(path.join(process.cwd(), 'public'), {
      maxAge: '1d',
      etag: true,
      lastModified: true,
    })
  );

  // REST API Routes
  app.use('/api', apiRouter);

  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
        etag: true,
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Open primary port 3000 for Nginx reverse proxy
  app.listen(PRIMARY_PORT, '0.0.0.0', () => {
    console.log(`🚀 JD Fusion Technologies server running on http://0.0.0.0:${PRIMARY_PORT}`);
  });

  // If Cloud Run or environment set a different port, also listen on it
  if (SECONDARY_PORT) {
    try {
      app.listen(SECONDARY_PORT, '0.0.0.0', () => {
        console.log(`🚀 JD Fusion Technologies secondary listener running on http://0.0.0.0:${SECONDARY_PORT}`);
      });
    } catch {
      // Ignore if port cannot be bound concurrently
    }
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
