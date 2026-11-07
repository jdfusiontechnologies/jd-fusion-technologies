import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'node:crypto';
import { AdminUser } from '../../types';
import { postgresStore } from '../../db/store.ts';

const TOKEN_EXPIRY = '7d';

interface LoginAttempt {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

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
  static isRateLimited(ip: string): { limited: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const record = loginAttempts.get(ip);
    if (!record) return { limited: false };
    if (record.lockedUntil && record.lockedUntil > now) {
      return { limited: true, retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000) };
    }
    if (now - record.lastAttempt > 15 * 60 * 1000) {
      loginAttempts.delete(ip);
      return { limited: false };
    }
    return { limited: false };
  }

  static recordFailedAttempt(ip: string): number {
    const now = Date.now();
    const record = loginAttempts.get(ip) || { attempts: 0, lastAttempt: now };
    record.attempts += 1;
    record.lastAttempt = now;
    if (record.attempts >= 5) record.lockedUntil = now + 5 * 60 * 1000;
    loginAttempts.set(ip, record);
    return record.attempts;
  }

  static clearAttempts(ip: string): void {
    loginAttempts.delete(ip);
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

    const rateCheck = this.isRateLimited(clientIp);
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
      const attemptsCount = this.recordFailedAttempt(clientIp);
      await postgresStore.recordActivity({
        type: attemptsCount >= 3 ? 'hack_attempt' : 'login_failed',
        title: attemptsCount >= 3 ? `Repeated Login Failure Alert (Attempt #${attemptsCount})` : 'Failed Admin Login Attempt',
        description: `Failed admin login attempt for identifier '${cleanId}' from IP ${clientIp}.`,
        severity: attemptsCount >= 3 ? 'danger' : 'warning',
        ip: clientIp,
        userAgent,
        path: '/api/auth/login',
        metadata: { attemptedIdentifier: cleanId, attemptsCount },
      });
      return { success: false, error: 'Invalid username/email or password.' };
    }

    this.clearAttempts(clientIp);
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
