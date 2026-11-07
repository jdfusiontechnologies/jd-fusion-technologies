import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthService } from '../server/auth/authService.ts';
import { getOrCreateUser } from '../db/users.ts';

export interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken | {
    id: string;
    email: string;
    name?: string;
    role: string;
    permissions?: string[];
    mustChangePassword?: boolean;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split('Bearer ')[1].trim();
  else if (typeof req.query.token === 'string') token = req.query.token.trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });

  try {
    const decodedFirebaseToken = await adminAuth.verifyIdToken(token);
    req.user = decodedFirebaseToken;
    if (decodedFirebaseToken.uid && decodedFirebaseToken.email) {
      getOrCreateUser(decodedFirebaseToken.uid, decodedFirebaseToken.email, (decodedFirebaseToken as any).name).catch((err) => {
        console.warn('[Auth] Non-blocking Firebase user sync failed:', err?.message || err);
      });
    }
    return next();
  } catch {
    const decodedJwt = AuthService.verifyToken(token);
    if (!decodedJwt) return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    if (decodedJwt.id !== 'admin-env') {
      try {
        const account = await AuthService.getAccountSession(decodedJwt.id);
        if (!account) return res.status(401).json({ error: 'This administrator account is inactive or no longer exists.' });
        req.user = account;
      } catch (error) {
        console.error('[Auth] Could not resolve administrator account:', error);
        return res.status(503).json({ error: 'Account verification is temporarily unavailable.' });
      }
    } else {
      req.user = decodedJwt;
    }
    return next();
  }
};

const routeModule = (path: string): string | null => {
  if (path.includes('/change-password') || path.includes('/profile')) return null;
  if (path.includes('/users')) return 'users';
  if (path.includes('/inquiries')) return 'inquiries';
  if (path.includes('/services')) return 'services';
  if (path.includes('/web-projects') || path.includes('/graphic-projects')) return 'web-projects';
  if (path.includes('/testimonials')) return 'testimonials';
  if (path.includes('/about')) return 'about';
  if (path.includes('/media')) return 'media';
  if (path.includes('/seo')) return 'seo';
  if (path.includes('/settings') || path.includes('/backup') || path.includes('/reset-seed')) return 'settings';
  if (path.includes('/site-data')) return 'site-data';
  if (path.includes('/dashboard')) return 'dashboard';
  return 'security';
};

export const requireAdminPermission = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role === 'super_admin' || user.id === 'admin-env') return next();
  if (!Array.isArray(user.permissions)) return next();

  const module = routeModule(req.originalUrl.split('?')[0]);
  if (module === null) return next();
  if (user.mustChangePassword) return res.status(403).json({ error: 'Change your temporary password before using the administration portal.' });
  // The site-data response is filtered by permissions in the route handler.
  if (module === 'site-data') return next();
  if (user.role === 'admin' && user.permissions.includes(module)) return next();
  return res.status(403).json({ error: 'You do not have permission to access this administration module.' });
};
