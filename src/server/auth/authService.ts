import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'node:crypto';
import { AdminUser } from '../../types';
import { postgresStore } from '../../db/store.ts';
import { pool } from '../../db/index.ts';

const TOKEN_EXPIRY = '7d';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 bytes.');
  }
  return secret;
}

function constantTimeStringEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (actualBuffer.length !== expectedBuffer.length) {
    // Perform a comparison anyway so length mismatch does not create a fast path.
    timingSafeEqual(actualBuffer, actualBuffer);
    return false;
  }
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export class AuthService {
  static async isRateLimited(ip: string): Promise<{ limited: boolean; retryAfterSeconds?: number }> {
    try {
      const result = await pool.query(
        `SELECT COUNT(*)::int AS attempts, MIN(created_at) AS oldest_attempt
         FROM activity_logs
         WHERE ip = $1
           AND type IN ('login_failed', 'hack_attempt')
           AND created_at >= NOW() - INTERVAL '15 minutes'`,
        [ip]
      );
      const attempts = Number(result.rows[0]?.attempts || 0);
      if (attempts < 5) return { limited: false };

      const oldestAttempt = result.rows[0]?.oldest_attempt
        ? new Date(result.rows[0].oldest_attempt).getTime()
        : Date.now();
      const retryAfterSeconds = Math.max(1, Math.ceil((oldestAttempt + 15 * 60 * 1000 - Date.now()) / 1000));
      return { limited: true, retryAfterSeconds };
    } catch (error) {
      // Fail closed: a database outage must not disable login throttling.
      console.error('[Auth] Persistent login rate-limit check failed:', error);
      return { limited: true, retryAfterSeconds: 60 };
    }
  }

  /**
   * Credentials are deliberately managed through deployment secrets.
   * A password/profile change cannot be persisted by mutating a serverless
   * process; the admin must update Vercel environment variables and redeploy.
   */
  static updatePassword(_newPassword: string): never {
    throw new Error('Administrator credentials are managed in deployment environment variables. Update ADMIN_PASSWORD or ADMIN_PASSWORD_HASH in Vercel, then redeploy.');
  }

  static updateProfile(_name?: string, _email?: string): never {
    throw new Error('Administrator profile is managed in deployment environment variables. Update ADMIN_NAME and ADMIN_EMAIL in Vercel, then redeploy.');
  }

  static async authenticateAdmin(
    identifier: string,
    passwordPlain: string,
    clientIp: string,
    userAgent?: string
  ): Promise<{ success: boolean; token?: string; user?: AdminUser; error?: string }> {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminUsername = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
    const adminName = (process.env.ADMIN_NAME || 'JD Fusion Administrator').trim();
    const configuredPassword = process.env.ADMIN_PASSWORD || '';
    const configuredPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

    if (!adminEmail || (!configuredPassword && !configuredPasswordHash)) {
      return { success: false, error: 'Admin authentication is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) in Vercel.' };
    }

    let jwtSecret: string;
    try {
      jwtSecret = getJwtSecret();
    } catch (error: any) {
      return { success: false, error: error.message || 'JWT_SECRET is not configured.' };
    }

    const rateCheck = await this.isRateLimited(clientIp);
    if (rateCheck.limited) {
      await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Brute-Force Attack Blocked (IP Locked)',
        description: `Blocked repeated login attempts from IP ${clientIp} targeting '${identifier}'.`,
        severity: 'danger',
        ip: clientIp,
        userAgent,
        path: '/api/auth/login',
        metadata: { identifier, retryAfterSeconds: rateCheck.retryAfterSeconds },
      });
      return { success: false, error: `Too many failed attempts. Retry in ${rateCheck.retryAfterSeconds} seconds.` };
    }

    const cleanId = (identifier || '').trim().toLowerCase();
    const validIdentifier = cleanId === adminEmail || (Boolean(adminUsername) && cleanId === adminUsername);
    let validPassword = false;
    if (configuredPasswordHash) {
      try {
        validPassword = await bcrypt.compare(passwordPlain, configuredPasswordHash);
      } catch {
        validPassword = false;
      }
    } else {
      validPassword = constantTimeStringEqual(passwordPlain, configuredPassword);
    }

    if (!validIdentifier || !validPassword) {
      await postgresStore.recordActivity({
        type: 'login_failed',
        title: 'Failed Admin Login Attempt',
        description: `Failed admin login attempt for identifier '${cleanId}' from IP ${clientIp}.`,
        severity: 'warning',
        ip: clientIp,
        userAgent,
        path: '/api/auth/login',
        metadata: { attemptedIdentifier: cleanId },
      });
      return { success: false, error: 'Invalid username/email or password.' };
    }

    const now = new Date().toISOString();
    const safeUser: AdminUser = {
      id: 'admin-env',
      email: adminEmail,
      name: adminName,
      role: 'super_admin',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    await postgresStore.recordActivity({
      type: 'login_success',
      title: 'Admin Login Successful',
      description: `${safeUser.name} (${safeUser.email}) logged in successfully from IP ${clientIp}.`,
      severity: 'success',
      ip: clientIp,
      userAgent,
      path: '/api/auth/login',
      metadata: { user: safeUser.name, email: safeUser.email },
    });

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, role: safeUser.role },
      jwtSecret,
      { expiresIn: TOKEN_EXPIRY }
    );
    return { success: true, token, user: safeUser };
  }

  static verifyToken(token: string): { id: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string };
      return decoded;
    } catch {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }
}
