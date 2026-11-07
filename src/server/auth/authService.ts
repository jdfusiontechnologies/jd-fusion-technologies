import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { timingSafeEqual, randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { AdminUser } from '../../types';
import { postgresStore } from '../../db/store.ts';
import { pool } from '../../db/index.ts';

const TOKEN_EXPIRY = '7d';

const deriveScryptKey = (password: string, salt: Buffer, keyLength: number, options: { N: number; r: number; p: number; maxmem: number }) =>
  new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey as Buffer);
    });
  });

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
    timingSafeEqual(actualBuffer, actualBuffer);
    return false;
  }
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export interface AdminAccountSession {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: string[];
  mustChangePassword: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
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
      return { limited: true, retryAfterSeconds: Math.max(1, Math.ceil((oldestAttempt + 900000 - Date.now()) / 1000)) };
    } catch (error) {
      console.error('[Auth] Persistent login rate-limit check failed:', error);
      return { limited: true, retryAfterSeconds: 60 };
    }
  }

  static async authenticateAdmin(
    identifier: string,
    passwordPlain: string,
    clientIp: string,
    userAgent?: string
  ): Promise<{ success: boolean; token?: string; user?: AdminUser & { permissions?: string[]; mustChangePassword?: boolean }; error?: string }> {
    const cleanId = (identifier || '').trim().toLowerCase();
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

    // Database-backed accounts take precedence over the legacy environment account.
    try {
      const accountResult = await pool.query(
        `SELECT id, email, name, password_hash, role, permissions, is_active, must_change_password,
                created_at, updated_at, last_login_at
         FROM admin_accounts WHERE lower(email) = $1 LIMIT 1`,
        [cleanId]
      );
      const account = accountResult.rows[0];
      if (account) {
        const validPassword = account.is_active && await this.verifyPassword(passwordPlain, account.password_hash);
        if (!validPassword) {
          await this.recordFailedLogin(cleanId, clientIp, userAgent);
          return { success: false, error: 'Invalid username/email or password.' };
        }
        const permissions = Array.isArray(account.permissions) ? account.permissions : [];
        await pool.query('UPDATE admin_accounts SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1', [account.id]);
        const user: AdminUser & { permissions: string[]; mustChangePassword: boolean } = {
          id: account.id,
          email: account.email,
          name: account.name,
          role: account.role,
          permissions,
          mustChangePassword: account.must_change_password,
          createdAt: new Date(account.created_at).toISOString(),
          updatedAt: new Date(account.updated_at).toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        await postgresStore.recordActivity({
          type: 'login_success',
          title: 'Admin Login Successful',
          description: `${user.name} (${user.email}) logged in successfully from IP ${clientIp}.`,
          severity: 'success',
          ip: clientIp,
          userAgent,
          path: '/api/auth/login',
          metadata: { user: user.name, email: user.email, role: user.role },
        });
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role, permissions, mustChangePassword: user.mustChangePassword },
          jwtSecret,
          { expiresIn: TOKEN_EXPIRY }
        );
        return { success: true, token, user };
      }
    } catch (error: any) {
      console.error('[Auth] Database account authentication failed:', error);
      return { success: false, error: 'Account sign-in is temporarily unavailable. Please try again.' };
    }

    // Backward-compatible legacy administrator login.
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminUsername = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
    const adminName = (process.env.ADMIN_NAME || 'JD Fusion Administrator').trim();
    const configuredPassword = process.env.ADMIN_PASSWORD || '';
    const configuredPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';
    if (!adminEmail || (!configuredPassword && !configuredPasswordHash)) {
      return { success: false, error: 'Admin authentication is not configured.' };
    }
    const validIdentifier = cleanId === adminEmail || (Boolean(adminUsername) && cleanId === adminUsername);
    let validPassword = false;
    if (configuredPasswordHash) {
      try { validPassword = await bcrypt.compare(passwordPlain, configuredPasswordHash); } catch { validPassword = false; }
    } else {
      validPassword = constantTimeStringEqual(passwordPlain, configuredPassword);
    }
    if (!validIdentifier || !validPassword) {
      await this.recordFailedLogin(cleanId, clientIp, userAgent);
      return { success: false, error: 'Invalid username/email or password.' };
    }

    const now = new Date().toISOString();
    const user: AdminUser = { id: 'admin-env', email: adminEmail, name: adminName, role: 'super_admin', createdAt: now, updatedAt: now, lastLoginAt: now };
    await postgresStore.recordActivity({
      type: 'login_success',
      title: 'Admin Login Successful',
      description: `${user.name} (${user.email}) logged in successfully from IP ${clientIp}.`,
      severity: 'success', ip: clientIp, userAgent, path: '/api/auth/login',
      metadata: { user: user.name, email: user.email },
    });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: TOKEN_EXPIRY });
    return { success: true, token, user };
  }

  private static async recordFailedLogin(identifier: string, ip: string, userAgent?: string): Promise<void> {
    await postgresStore.recordActivity({
      type: 'login_failed',
      title: 'Failed Admin Login Attempt',
      description: `Failed admin login attempt for identifier '${identifier}' from IP ${ip}.`,
      severity: 'warning', ip, userAgent, path: '/api/auth/login',
      metadata: { attemptedIdentifier: identifier },
    });
  }

  static verifyToken(token: string): { id: string; email: string; role: string; permissions?: string[]; mustChangePassword?: boolean } | null {
    try {
      return jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string; permissions?: string[]; mustChangePassword?: boolean };
    } catch { return null; }
  }

  static async getAccountSession(id: string): Promise<AdminAccountSession | null> {
    const result = await pool.query(
      `SELECT id, email, name, role, permissions, must_change_password, is_active, created_at, updated_at, last_login_at
       FROM admin_accounts WHERE id = $1 LIMIT 1`,
      [id]
    );
    const row = result.rows[0];
    if (!row || !row.is_active) return null;
    return {
      id: row.id, email: row.email, name: row.name, role: row.role,
      permissions: Array.isArray(row.permissions) ? row.permissions : [],
      mustChangePassword: Boolean(row.must_change_password),
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at).toISOString() : null,
    };
  }

  static async updateAccountPassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const result = await pool.query('SELECT password_hash FROM admin_accounts WHERE id = $1 AND is_active = true', [id]);
    if (!result.rows[0] || !(await this.verifyPassword(currentPassword, result.rows[0].password_hash))) {
      throw new Error('Current password is incorrect.');
    }
    const passwordHash = await this.hashPassword(newPassword);
    await pool.query(
      'UPDATE admin_accounts SET password_hash = $1, must_change_password = false, updated_at = NOW() WHERE id = $2',
      [passwordHash, id]
    );
  }

  static async updateAccountProfile(id: string, name: string, email: string): Promise<AdminAccountSession> {
    const result = await pool.query(
      'UPDATE admin_accounts SET name = $1, email = lower($2), updated_at = NOW() WHERE id = $3 RETURNING id',
      [name.trim(), email.trim(), id]
    );
    if (!result.rows[0]) throw new Error('Account not found.');
    const user = await this.getAccountSession(id);
    if (!user) throw new Error('Account is inactive.');
    return user;
  }

  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const delimiter = String.fromCharCode(36);
    if (!storedHash.startsWith('scrypt' + delimiter)) {
      try { return await bcrypt.compare(password, storedHash); } catch { return false; }
    }
    try {
      const [, nValue, rValue, pValue, saltValue, keyValue] = storedHash.split(delimiter);
      const N = Number(nValue), r = Number(rValue), p = Number(pValue);
      if (!Number.isInteger(N) || N < 16384 || N > 131072 || !Number.isInteger(r) || r < 1 || r > 16 || !Number.isInteger(p) || p < 1 || p > 4) return false;
      const salt = Buffer.from(saltValue, 'base64');
      const expected = Buffer.from(keyValue, 'base64');
      if (salt.length < 16 || expected.length !== 64) return false;
      const actual = await deriveScryptKey(password, salt, expected.length, { N, r, p, maxmem: 128 * 1024 * 1024 });
      return timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derivedKey = await deriveScryptKey(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    return ['scrypt', 32768, 8, 1, salt.toString('base64'), derivedKey.toString('base64')].join(String.fromCharCode(36));
  }
}
)) {
      try { return await bcrypt.compare(password, storedHash); } catch { return false; }
    }
    try {
      const [, nValue, rValue, pValue, saltValue, keyValue] = storedHash.split('
}
);
      const N = Number(nValue), r = Number(rValue), p = Number(pValue);
      if (!Number.isInteger(N) || N < 16384 || N > 131072 || !Number.isInteger(r) || r < 1 || r > 16 || !Number.isInteger(p) || p < 1 || p > 4) return false;
      const salt = Buffer.from(saltValue, 'base64');
      const expected = Buffer.from(keyValue, 'base64');
      if (salt.length < 16 || expected.length !== 64) return false;
      const actual = await deriveScryptKey(password, salt, expected.length, { N, r, p, maxmem: 128 * 1024 * 1024 });
      return timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derivedKey = await deriveScryptKey(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    return `scrypt$32768$8$1${salt.toString('base64')}${derivedKey.toString('base64')}`;
  }
}
