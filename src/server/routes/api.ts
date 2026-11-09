import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { postgresStore } from '../../db/store.ts';
import { requireAuth, requireAdminPermission, AuthenticatedRequest } from '../../middleware/auth.ts';
import { AuthService } from '../auth/authService.ts';
import { pool } from '../../db/index.ts';

export const apiRouter = Router();

// Configure Multer for In-Memory uploads (Direct PostgreSQL Blob Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

const handleGetPublicSiteData = async (_req: Request, res: Response) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
  try {
    const data = await postgresStore.getPublicSiteData();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching public site data:', error);
    try {
      const fallbackData = await postgresStore.getPublicSiteData();
      res.json(fallbackData);
    } catch {
      res.json({
        settings: {
          siteName: 'JD Fusion Technologies',
          brandName: 'JD Fusion Technologies',
          tagline: 'Modern Digital Technology & Creative Engineering Solutions',
          logoUrl: '/logo-icon.svg',
          iconUrl: '/logo-icon.svg',
          heroHeadline: 'Building Digital Experiences. Creating Powerful Brands.',
          heroSubheadline: 'We engineer high-performance websites, bespoke graphic identities, and seamless cyber digital services.',
          heroBadgeText: 'Empowering Modern Enterprises & Creators',
          primaryCtaText: "Let's Work Together",
          secondaryCtaText: 'Explore Projects',
          updatedAt: new Date().toISOString(),
        },
        about: {
          title: 'Engineering Digital Excellence & Visual Impact',
          intro: 'JD Fusion Technologies is a hybrid digital agency and technology consultancy.',
          bio: 'Founded with a mission to bridge technical innovation with creative branding.',
          mission: 'To deliver tailored, scalable digital software and visually stunning brand identities.',
          vision: 'To be the most reliable, creative, and transformative digital technology partner.',
          approach: 'We blend modern design aesthetics with enterprise-grade engineering.',
          highlights: ['Engineered for speed', 'Vector brand graphics', 'Cyber compliance', 'Dedicated support'],
          updatedAt: new Date().toISOString(),
        },
        services: [],
        webProjects: [],
        graphicProjects: [],
        testimonials: [],
        contact: {
          email: 'info@jdfusiontech.com',
          phone: '+254 700 000 000',
          whatsapp: '+254 700 000 000',
          description: 'Get in touch with our team.',
          businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
          updatedAt: new Date().toISOString(),
        },
        location: {
          locationName: 'JD Fusion Technologies Physical & Digital Hub',
          address: 'Commercial Business Centre, Nairobi, Kenya',
          mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
          coordinates: '-1.286389, 36.817223',
          description: 'Conveniently located for in-person consultations.',
          updatedAt: new Date().toISOString(),
        },
        socials: [],
        seo: {
          siteTitle: 'JD Fusion Technologies | Digital Web & Design Agency',
          metaDescription: 'Modern web development, creative graphic design, and cyber digital compliance services in Nairobi, Kenya.',
          ogImageUrl: '/og-preview.png',
          keywords: 'web design, full stack development, logo design, KRA returns, HELB loan, Kenya',
          canonicalUrl: '',
          robotsDirective: 'index, follow',
          updatedAt: new Date().toISOString(),
        },
      });
    }
  }
};

// Support multiple route aliases for public site data
apiRouter.get('/site-data', handleGetPublicSiteData);
apiRouter.get('/site', handleGetPublicSiteData);
apiRouter.get('/public/site', handleGetPublicSiteData);
apiRouter.get('/public/site-data', handleGetPublicSiteData);
apiRouter.get('/public/data', handleGetPublicSiteData);
apiRouter.get('/data', handleGetPublicSiteData);

// Lead / Inquiry submission with anti-spam check
const recentInquiryIps = new Map<string, number>();

const handleInquirySubmission = async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastSubmit = recentInquiryIps.get(ip);

    // Rate limit: 1 inquiry per 5 seconds per IP
    if (lastSubmit && now - lastSubmit < 5000) {
      return res.status(429).json({
        error: 'Please wait a moment before sending another message.',
      });
    }

    const { name, email, phone, service, description, preferredContact } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        error: 'Name, email, and description are required fields.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newInquiry = await postgresStore.addInquiry({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      service: String(service || 'General Inquiry').trim(),
      description: String(description).trim(),
      preferredContact: ['email', 'whatsapp', 'phone'].includes(preferredContact)
        ? preferredContact
        : 'whatsapp',
    });

    // Record in user activity logs
    void postgresStore.recordActivity({
      type: 'contact_inquiry',
      title: `Project Inquiry: ${newInquiry.name}`,
      description: `Visitor submitted lead for '${newInquiry.service}'. Preferred contact: ${newInquiry.preferredContact.toUpperCase()} (${newInquiry.phone || newInquiry.email}).`,
      severity: 'success',
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || ip,
      userAgent: (req.headers['user-agent'] as string) || 'Web Browser',
      path: '/contact',
      metadata: {
        inquiryId: newInquiry.id,
        name: newInquiry.name,
        email: newInquiry.email,
        phone: newInquiry.phone,
        service: newInquiry.service,
        preferredContact: newInquiry.preferredContact,
      },
    }).catch(() => {});

    recentInquiryIps.set(ip, now);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received! JD Fusion Technologies will respond promptly.',
      inquiry: newInquiry,
      inquiryId: newInquiry.id,
    });
  } catch (error: any) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: error.message || 'Failed to submit inquiry.' });
  }
};

apiRouter.post('/inquiries', handleInquirySubmission);
apiRouter.post('/inquiry', handleInquirySubmission);
apiRouter.post('/public/inquiry', handleInquirySubmission);

// Public client testimonial submission (Draft / Pending Admin Approval)
const handleTestimonialSubmission = async (req: Request, res: Response) => {
  try {
    const { clientName, clientRole, clientCompany, message, rating, clientImage } = req.body;
    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ error: 'Please provide your name.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please enter your review / testimonial message.' });
    }

    const created = await postgresStore.saveTestimonial({
      clientName: String(clientName).trim(),
      clientRole: String(clientRole || 'Client').trim(),
      clientCompany: String(clientCompany || '').trim(),
      message: String(message).trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      clientImage: clientImage ? String(clientImage).trim() : undefined,
      isPublished: false, // Critical: user submissions are drafts until admin approves!
      isFeatured: false,
    });

    try {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.ip ||
        '127.0.0.1';
      void postgresStore.recordActivity({
        type: 'data_update',
        title: 'New Client Testimonial Submitted',
        description: `Client testimonial submitted by "${clientName}" (${clientCompany || 'Client'}). Awaiting administrative approval.`,
        severity: 'info',
        ip: clientIp,
        path: '/admin/testimonials',
      }).catch(() => {});
    } catch {
      // ignore
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted successfully and will appear live once approved by our team.',
      testimonial: created,
    });
  } catch (error: any) {
    console.error('Error submitting public testimonial:', error);
    res.status(500).json({ error: error.message || 'Failed to submit testimonial.' });
  }
};

apiRouter.post('/testimonials/submit', handleTestimonialSubmission);
apiRouter.post('/testimonials', handleTestimonialSubmission);
apiRouter.post('/public/testimonials', handleTestimonialSubmission);

// Public Visitor Traffic Analytics Tracking
const handleTrackVisit = async (req: Request, res: Response) => {
  try {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Standard Browser';
    const path = req.body?.path || req.query?.path || '/';

    const result = await postgresStore.recordVisit(clientIp, String(path), String(userAgent));
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Tracking failed' });
  }
};

apiRouter.post('/analytics/track', handleTrackVisit);
apiRouter.post('/track-visit', handleTrackVisit);
apiRouter.post('/analytics/pageview', handleTrackVisit);

// User Contact Action Tracking (WhatsApp, Phone Call, Email)
const handleTrackUserAction = async (req: Request, res: Response) => {
  try {
    const { actionType, target, path: clientPath, details } = req.body || {};
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Standard Browser';

    let title = 'User Contact Interaction';
    let description = `Visitor clicked contact action: ${target || actionType}`;
    let type: any = 'admin_action';
    let severity: any = 'info';

    if (actionType === 'whatsapp') {
      type = 'contact_whatsapp';
      title = 'WhatsApp Consultation Initiated';
      description = `Visitor clicked to start a direct WhatsApp conversation (${target || 'WhatsApp link'}).`;
      severity = 'success';
    } else if (actionType === 'call') {
      type = 'contact_call';
      title = 'Direct Phone Call Dialed';
      description = `Visitor clicked to place telephone call to ${target || 'company line'}.`;
      severity = 'success';
    } else if (actionType === 'email') {
      type = 'contact_email';
      title = 'Direct Email Message Initiated';
      description = `Visitor clicked to draft email message to ${target || 'info@jdfusiontech.com'}.`;
      severity = 'info';
    } else if (actionType === 'inquiry') {
      type = 'contact_inquiry';
      title = 'Project Inquiry Submitted';
      description = `Lead submitted: ${details?.name || 'Client'} (${details?.email || details?.phone || 'Contact'}).`;
      severity = 'success';
    } else if (actionType === 'testimonial') {
      type = 'testimonial_submitted';
      title = 'Client Testimonial Submitted';
      description = `Review submitted by ${details?.clientName || 'Visitor'} (${details?.clientCompany || 'Client'}).`;
      severity = 'info';
    }

    const log = await postgresStore.recordActivity({
      type,
      title,
      description,
      severity,
      ip: clientIp,
      userAgent,
      path: String(clientPath || '/'),
      metadata: {
        actionType,
        target,
        details,
        timestamp: new Date().toISOString(),
      },
    });

    res.json({ success: true, log });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Tracking failed' });
  }
};

apiRouter.post('/activity/track-action', handleTrackUserAction);
apiRouter.post('/analytics/track-action', handleTrackUserAction);

// Serve media file blobs directly from PostgreSQL without external buckets
apiRouter.get('/media/blob/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blob = await postgresStore.getMediaBlob(id);
    if (!blob) {
      return res.status(404).send('File not found');
    }

    res.setHeader('Content-Type', blob.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(blob.data);
  } catch (error) {
    console.error('Error streaming media from PostgreSQL:', error);
    res.status(500).send('Error reading media');
  }
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginId = identifier || email || username;

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Username or email and password are required' });
    }

    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const result = await AuthService.authenticateAdmin(loginId, password, clientIp, userAgent);
    if (!result.success) {
      return res.status(401).json({ error: result.error || 'Invalid username/email or password' });
    }

    res.json({ token: result.token, user: result.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Authentication error' });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// 3. ADMIN MANAGEMENT ROUTES (PostgreSQL)
// ==========================================
// Every /admin API is authenticated and permission-checked server-side.
apiRouter.use('/admin', requireAuth, requireAdminPermission);

const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if ((req.user as any)?.role !== 'super_admin' && (req.user as any)?.id !== 'admin-env') {
    return res.status(403).json({ error: 'Only Super Admins can manage administrator accounts.' });
  }
  next();
};

const ADMIN_MODULES = ['inquiries', 'services', 'testimonials', 'about', 'media', 'settings', 'seo', 'web-projects'];

apiRouter.get('/admin/users', requireAuth, requireSuperAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, permissions, is_active, must_change_password, created_at, last_login_at FROM admin_accounts ORDER BY created_at ASC'
    );
    res.json(result.rows.map((row) => ({
      id: row.id, email: row.email, name: row.name, role: row.role,
      permissions: row.permissions || [], isActive: row.is_active,
      mustChangePassword: row.must_change_password, createdAt: row.created_at, lastLoginAt: row.last_login_at,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load accounts.' });
  }
});

apiRouter.post('/admin/users', requireAuth, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, name, role, permissions, temporaryPassword } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !cleanName) {
      return res.status(400).json({ error: 'A valid email and name are required.' });
    }
    if (!['super_admin', 'admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid account role.' });
    if (typeof temporaryPassword !== 'string' || temporaryPassword.length < 12) {
      return res.status(400).json({ error: 'Temporary password must be at least 12 characters.' });
    }
    const safePermissions = role === 'admin' && Array.isArray(permissions)
      ? [...new Set(permissions.filter((item: unknown) => typeof item === 'string' && ADMIN_MODULES.includes(item as string)))]
      : [];
    const passwordHash = await AuthService.hashPassword(temporaryPassword);
    const result = await pool.query(
      'INSERT INTO admin_accounts (email, name, password_hash, role, permissions, is_active, must_change_password, created_by) VALUES ($1, $2, $3, $4, $5::jsonb, true, true, $6) RETURNING id, email, name, role, permissions, is_active, must_change_password, created_at',
      [cleanEmail, cleanName, passwordHash, role, JSON.stringify(safePermissions), (req.user as any)?.id === 'admin-env' ? null : (req.user as any)?.id]
    );
    const row = result.rows[0];
    res.status(201).json({ user: {
      id: row.id, email: row.email, name: row.name, role: row.role,
      permissions: row.permissions || [], isActive: row.is_active,
      mustChangePassword: row.must_change_password, createdAt: row.created_at,
    } });
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'An account with that email already exists.' });
    res.status(500).json({ error: err.message || 'Could not create account.' });
  }
});

apiRouter.patch('/admin/users/:id', requireAuth, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, permissions, isActive } = req.body || {};
    if (!['super_admin', 'admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid account role.' });
    if ((req.user as any)?.id === req.params.id) return res.status(400).json({ error: 'You cannot change your own role or deactivate your own account.' });
    const safePermissions = role === 'admin' && Array.isArray(permissions)
      ? [...new Set(permissions.filter((item: unknown) => typeof item === 'string' && ADMIN_MODULES.includes(item as string)))]
      : [];
    const result = await pool.query(
      'UPDATE admin_accounts SET role = $1, permissions = $2::jsonb, is_active = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, name, role, permissions, is_active, must_change_password',
      [role, JSON.stringify(safePermissions), Boolean(isActive), req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Account not found.' });
    const row = result.rows[0];
    res.json({ user: {
      id: row.id, email: row.email, name: row.name, role: row.role,
      permissions: row.permissions || [], isActive: row.is_active, mustChangePassword: row.must_change_password,
    } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not update account.' });
  }
});


apiRouter.get('/admin/site-data', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await postgresStore.getFullAdminSiteData();
    const user = req.user as any;
    if (user?.role !== 'super_admin' && Array.isArray(user.permissions)) {
      const allowed = new Set(user.permissions);
      res.json({
        ...data,
        settings: allowed.has('homepage') ? data.settings : null,
        about: allowed.has('about') ? data.about : null,
        services: allowed.has('services') ? data.services : [],
        webProjects: allowed.has('web-projects') ? data.webProjects : [],
        graphicProjects: allowed.has('web-projects') ? data.graphicProjects : [],
        testimonials: allowed.has('testimonials') ? data.testimonials : [],
        founders: [],
        contact: null,
        location: null,
        socials: [],
        seo: allowed.has('seo') ? data.seo : null,
      });
      return;
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/dashboard', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await postgresStore.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings & About
const handleUpdateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateSiteSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/settings', requireAuth, handleUpdateSettings);
apiRouter.patch('/admin/settings', requireAuth, handleUpdateSettings);

const handleUpdateAbout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateAboutContent(req.body);
    res.json({ success: true, about: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/about', requireAuth, handleUpdateAbout);
apiRouter.patch('/admin/about', requireAuth, handleUpdateAbout);

// Admin Profile & Password Updates
apiRouter.put('/admin/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const currentUser = req.user as any;
    if (currentUser?.id === 'admin-env') AuthService.updateProfile(name, email);
    const user = await AuthService.updateAccountProfile(
      currentUser.id,
      String(name || currentUser.name || ''),
      String(email || currentUser.email || '')
    );
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

apiRouter.put('/admin/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 12) {
      return res.status(400).json({ error: 'New password must be at least 12 characters.' });
    }
    const currentUser = req.user as any;
    if (currentUser?.id === 'admin-env') AuthService.updatePassword(newPassword);
    await AuthService.updateAccountPassword(currentUser.id, String(currentPassword || ''), newPassword);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

// Services
apiRouter.get('/admin/services', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getServices();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/services', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveService(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/services/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveService({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/services/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteService(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Web Projects
apiRouter.get('/admin/web-projects', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getWebProjects();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/web-projects', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    if (typeof body.title !== 'string' || !body.title.trim() || typeof body.category !== 'string' || !body.category.trim()) {
      return res.status(400).json({ error: 'Project title and category are required.' });
    }
    const created = await postgresStore.saveWebProject({
      ...body,
      title: body.title.trim(),
      category: body.category.trim(),
      additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages.filter((url: unknown) => typeof url === 'string' && url.trim()) : [],
      technologies: Array.isArray(body.technologies) ? body.technologies.filter((item: unknown) => typeof item === 'string' && item.trim()) : [],
    });
    return res.status(201).json(created);
  } catch (err: any) {
    console.error('[Admin] Project creation failed:', err);
    const message = err?.message || 'Could not create project.';
    const unavailable = /database is unavailable|DATABASE_URL|POSTGRES_URL/i.test(message);
    return res.status(unavailable ? 503 : 500).json({
      error: unavailable
        ? 'Project storage is unavailable. Check the Vercel DATABASE_URL configuration and PostgreSQL connection, then try again.'
        : message,
    });
  }
});

apiRouter.put('/admin/web-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    const updated = await postgresStore.saveWebProject({
      ...body,
      id: req.params.id,
      additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages.filter((url: unknown) => typeof url === 'string' && url.trim()) : [],
      technologies: Array.isArray(body.technologies) ? body.technologies.filter((item: unknown) => typeof item === 'string' && item.trim()) : [],
    });
    return res.json(updated);
  } catch (err: any) {
    console.error('[Admin] Project update failed:', err);
    const message = err?.message || 'Could not update project.';
    const unavailable = /database is unavailable|DATABASE_URL|POSTGRES_URL/i.test(message);
    return res.status(unavailable ? 503 : 500).json({
      error: unavailable
        ? 'Project storage is unavailable. Check the Vercel DATABASE_URL configuration and PostgreSQL connection, then try again.'
        : message,
    });
  }
});

apiRouter.delete('/admin/web-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteWebProject(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Graphic Projects
apiRouter.get('/admin/graphic-projects', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getGraphicProjects();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/graphic-projects', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveGraphicProject(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/graphic-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveGraphicProject({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/graphic-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteGraphicProject(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Testimonials
apiRouter.get('/admin/testimonials', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getTestimonials();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/testimonials', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveTestimonial(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/testimonials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveTestimonial({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/testimonials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteTestimonial(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Founders & Leadership
apiRouter.get('/admin/founders', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getFounders();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/founders', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveFounder(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/founders/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveFounder({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/founders/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteFounder(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Inquiries
apiRouter.get('/admin/inquiries', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getInquiries();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/admin/inquiries/:id/status', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await postgresStore.updateInquiryStatus(req.params.id, status);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/inquiries/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteInquiry(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Contact, Location, Socials, SEO
const handleUpdateContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateContactSettings(req.body);
    res.json({ success: true, contact: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/contact', requireAuth, handleUpdateContact);
apiRouter.patch('/admin/contact', requireAuth, handleUpdateContact);

const handleUpdateLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateLocationSettings(req.body);
    res.json({ success: true, location: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/location', requireAuth, handleUpdateLocation);
apiRouter.patch('/admin/location', requireAuth, handleUpdateLocation);

apiRouter.get('/admin/socials', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getSocialLinks();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/socials', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveSocialLink(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/socials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveSocialLink({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/admin/socials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveSocialLink({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/admin/socials/:id/toggle', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getSocialLinks();
    const existing = list.find((s) => s.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    const currentActive = existing.isPublished ?? existing.isEnabled ?? true;
    const newActive = !currentActive;
    const updated = await postgresStore.saveSocialLink({
      ...existing,
      id: req.params.id,
      isPublished: newActive,
      isEnabled: newActive,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/socials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteSocialLink(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Visitor Analytics endpoint
apiRouter.get('/admin/analytics/visitors', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await postgresStore.getVisitorStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const handleUpdateSEO = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateSEOSettings(req.body);
    res.json({ success: true, seo: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/seo', requireAuth, handleUpdateSEO);
apiRouter.patch('/admin/seo', requireAuth, handleUpdateSEO);

// Direct PostgreSQL Media Uploads (NO BUCKETS REQUIRED)
apiRouter.get('/admin/media', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getMediaFiles();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post(
  '/admin/media/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided for upload.' });
      }

      const media = await postgresStore.storeMediaInPostgres(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(201).json({
        success: true,
        media,
        message: 'File stored successfully in PostgreSQL database!',
      });
    } catch (err: any) {
      console.error('Error uploading media to PostgreSQL:', err);
      res.status(500).json({ error: err.message || 'Failed to save media in database.' });
    }
  }
);

apiRouter.delete('/admin/media/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteMedia(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Backup & Seed reset in PostgreSQL
const handleResetSeed = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await postgresStore.seedAll();
    res.json({ success: true, message: 'Database reset to default seed successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.post('/admin/reset-seed', requireAuth, handleResetSeed);
apiRouter.post('/admin/backup/reset-seed', requireAuth, handleResetSeed);

apiRouter.get('/admin/backup/export', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await postgresStore.getFullAdminSiteData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=jd-fusion-backup-${Date.now()}.json`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/backup/restore', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const backup = req.body;
    if (backup.settings) await postgresStore.updateSiteSettings(backup.settings);
    if (backup.about) await postgresStore.updateAboutContent(backup.about);
    if (backup.contact) await postgresStore.updateContactSettings(backup.contact);
    if (backup.location) await postgresStore.updateLocationSettings(backup.location);
    if (backup.seo) await postgresStore.updateSEOSettings(backup.seo);
    res.json({ success: true, message: 'Backup restored successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. ACTIVITY & SECURITY AUDIT ROUTES
// ==========================================

apiRouter.get('/admin/security/logs', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 100;
    const logs = await postgresStore.getActivityLogs(limit);
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dedicated endpoint returning user contact actions & lead activities (WhatsApp, Phone Call, Email, Inquiries)
apiRouter.get('/admin/user-activities', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 150;
    const allLogs = await postgresStore.getActivityLogs(limit * 3);
    const userContactTypes = [
      'contact_whatsapp',
      'contact_call',
      'contact_email',
      'contact_inquiry',
      'testimonial_submitted',
    ];
    const filtered = allLogs.filter((log) => userContactTypes.includes(log.type));
    res.json(filtered.slice(0, limit));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/security/stats', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await postgresStore.getSecurityStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/security/logs', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await postgresStore.clearActivityLogs();
    await postgresStore.recordActivity({
      type: 'admin_action',
      title: 'Security Audit Logs Reset',
      description: 'Activity history cleared by authorized administrator.',
      severity: 'info',
      ip: '127.0.0.1',
      path: '/api/admin/security/logs',
    });
    res.json({ success: true, message: 'Activity logs cleared.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Diagnostic / Testing Route: Allows admin to simulate an intrusion probe to verify real-time alerts
apiRouter.post('/admin/security/simulate-probe', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type } = req.body;
    let simulatedLog;

    if (type === 'sql_injection_probe') {
      simulatedLog = await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Blocked SQL Injection Vector Probe',
        description: 'Attack signature detected: `UNION SELECT 1,2,username,password FROM users--` in query parameter `q`.',
        severity: 'danger',
        ip: '197.232.84.112',
        userAgent: 'sqlmap/1.7.2#stable (https://sqlmap.org)',
        location: 'Nairobi (Simulated)',
        path: '/api/search?q=UNION+SELECT+1,2,password+FROM+users',
        metadata: { vector: 'SQLi', blockedRule: 'RULE_SQLI_KEYWORD_MATCH', action: 'FIREWALL_DROP' },
      });
    } else if (type === 'path_traversal_probe') {
      simulatedLog = await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Blocked Directory Traversal Probe',
        description: 'Exploit signature detected: `../../../../etc/passwd` attempting to leak root file system.',
        severity: 'danger',
        ip: '185.220.101.5',
        userAgent: 'Nikto/2.1.6 Vulnerability Scanner',
        location: 'Tor Exit Node (Simulated)',
        path: '/api/files?file=../../../../etc/passwd',
        metadata: { vector: 'LFI_Path_Traversal', blockedRule: 'RULE_PATH_TRAVERSAL', action: 'FIREWALL_DROP' },
      });
    } else {
      simulatedLog = await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Blocked Vulnerability Scanner Bot',
        description: 'Automated exploit bot probed non-existent sensitive path `/wp-login.php`.',
        severity: 'danger',
        ip: '45.154.255.89',
        userAgent: 'WPScan v3.8.22 (Automated Exploit Bot)',
        location: 'External Scanner',
        path: '/wp-login.php',
        metadata: { vector: 'Vulnerability_Scan', blockedRule: 'RULE_SENSITIVE_PATH_PROBE', action: 'FIREWALL_DROP' },
      });
    }

    res.json({
      success: true,
      message: 'Simulated intrusion logged successfully for security diagnostic.',
      log: simulatedLog,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

