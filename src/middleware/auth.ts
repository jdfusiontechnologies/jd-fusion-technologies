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
  if (req.user) return next();
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split('Bearer ')[1].trim();
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
  const requestPath = req.originalUrl.split('?')[0];
  if (user.mustChangePassword && !requestPath.includes('/change-password') && !requestPath.includes('/profile')) {
    return res.status(403).json({ error: 'Change your temporary password before using the administration portal.' });
  }
  if (user.role === 'super_admin' && (user.id === 'admin-env' || typeof user.id === 'string')) return next();
  // Authentication alone is not administrator authorization.
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access is required.' });
  }
  if (!Array.isArray(user.permissions)) {
    return res.status(403).json({ error: 'Administrator permissions are missing.' });
  }

  const module = routeModule(req.originalUrl.split('?')[0]);
  if (module === null) return next();
  // The site-data response is filtered by permissions in the route handler,
  // but only after the caller has been confirmed as an administrator.
  if (module === 'site-data') return next();

  // Project managers need read/upload access to the media library to manage
  // project cover and gallery images. Keep media deletion restricted to users
  // who also have the dedicated media permission.
  if (
    module === 'media' &&
    user.permissions.includes('web-projects') &&
    (req.method === 'GET' || (req.method === 'POST' && /\/admin\/media\/upload$/.test(requestPath)))
  ) {
    return next();
  }

  if (user.permissions.includes(module)) return next();
  return res.status(403).json({ error: 'You do not have permission to access this administration module.' });
};
