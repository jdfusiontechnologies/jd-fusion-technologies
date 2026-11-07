# JD Fusion Technologies — Full-Stack Enterprise Platform & CMS

> **Where Ideas Become Innovation**  
> A high-performance, production-grade full-stack web platform and content management system engineered for **JD Fusion Technologies**. Delivering modern web development, custom software systems, enterprise IT support, and turnkey digital solutions.

---

## 🌟 Overview & Key Highlights

JD Fusion Technologies combines cutting-edge frontend engineering with resilient full-stack architecture, featuring:

1. **Brand Showcase & Continuous Slogan Ticker**: Modern typography, responsive layouts, live interactive project showcases, and animated ticker banners.
2. **Four Core Technology Divisions**:
   - 🌐 **Website Development**: Responsive, accessible, SEO-optimized web applications and high-conversion landing portals.
   - ⚙️ **Systems Development**: Enterprise resource planning, automated workflows, custom APIs, and real-time telemetry systems.
   - 🛡️ **IT Support & Maintenance**: 24/7 technical assistance, infrastructure maintenance, hardware/software troubleshooting, and network uptime.
   - 💡 **Turnkey IT Solutions**: Cloud integrations, data security, digital transformation consulting, and customized technological strategies.
3. **Interactive Client Review & Approval Workflow**:
   - Clients can submit testimonials directly via the public **"Submit a Review"** modal.
   - Submitted reviews enter a pending queue and **only appear live on the public site once approved by an Admin**.
   - Admins can feature, edit, approve, or reject testimonials from the admin portal.
   - Testimonial auto-scrolling carousel with rating stars and company details.
4. **Traffic & Visitor Analytics Engine**:
   - Real-time visitor logging on page navigation (`POST /api/analytics/track`).
   - Dynamic traffic metrics across four timeframes: **Today**, **This Week**, **This Month**, and **This Year**.
   - Visual trend charts, unique visitor counts, and pageview breakdown.
5. **Live User Contact & Interaction Tracking**:
   - Real-time detection and logging whenever a visitor initiates a **WhatsApp chat**, dials a **phone call**, clicks an **email link**, or submits a **project quote form**.
   - Accessible via the dedicated **"User Activities & Leads"** tab in the Admin panel.
   - Includes visitor IP address, user-agent/device type, target number/email, page of interaction, and relative timestamp with quick-response buttons.
6. **Dynamic Social Channels Management**:
   - Admins can add any social channel (Facebook, LinkedIn, WhatsApp, X/Twitter, Instagram, YouTube, GitHub, Telegram, TikTok, Discord, or any custom platform).
   - 1-click active/inactive toggle switch controls whether each channel appears live on the public website.
   - Deactivated channels are immediately hidden from public footers and floating quick-connect buttons without deleting configurations.
7. **Hardened Security & Discreet Administration**:
   - No public "Admin" button in the navigation or footer.
   - Admin portal is accessible exclusively via direct route at `/admin`.
   - JWT authentication, bcrypt password hashing, IP rate limiting, and brute-force threat defense logging.
8. **Universal Database Compatibility**:
   - Supports **Free Neon Serverless PostgreSQL** via Drizzle ORM.
   - Public pages can fall back to bundled read-only content if the database is unavailable. Admin writes, enquiries, visitor tracking, and authentication require a healthy PostgreSQL connection and return an error rather than claiming unsaved data was stored.

---

## 📂 Project Directory Structure

```text
├── api/                     # Vercel Serverless Function entry point (api/index.ts)
├── drizzle/                 # Generated Drizzle migration files
├── public/                  # Static assets, SVG icons, and uploads
├── src/
│   ├── assets/              # App images, logos, and graphics
│   ├── components/          # Reusable UI components & modals
│   │   ├── admin/           # Admin CMS Views (Analytics, Testimonials, Projects, Socials, etc.)
│   │   ├── Navbar.tsx       # Public navigation bar (Clean, no admin button)
│   │   ├── Hero.tsx         # Hero banner with slogan ticker
│   │   ├── Services.tsx     # 4 Core Technology Divisions
│   │   ├── Portfolio.tsx    # Interactive web & systems project showcase
│   │   ├── Testimonials.tsx # Auto-sliding reviews & Review Submission modal
│   │   ├── Contact.tsx      # Contact form & GPS location
│   │   └── Footer.tsx       # Footer with dynamically rendered active social channels
│   ├── context/             # React Contexts (Theme, SiteData)
│   ├── db/
│   │   ├── schema.ts        # Comprehensive PostgreSQL Drizzle Schema (18 tables + models)
│   │   ├── store.ts         # High-availability persistent data store & analytics engine
│   │   └── drizzle.config.ts# Drizzle ORM configuration for PostgreSQL
│   ├── server/              # Express backend API & authentication
│   │   ├── auth/            # JWT & bcrypt authentication service
│   │   ├── routes/          # API routes (/api/site-data, /api/testimonials, /api/analytics, etc.)
│   │   └── db/              # Seed data and store helpers
│   ├── App.tsx              # Main routing & analytics tracking hook
│   └── main.tsx             # React DOM root entry
├── .env.example             # Template for environment variables
├── drizzle.config.ts        # Root Drizzle configuration for CLI
├── package.json             # NPM package scripts and dependencies
├── server.ts                # Full-stack Node.js Express & Vite development server
├── vercel.json              # Vercel zero-config serverless deployment configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## 💻 Local Setup & Development (VS Code)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **VS Code** (or your preferred editor)

### Step 1: Open the Project in VS Code
Open your terminal in the project directory:
```bash
code .
```

### Step 2: Install Dependencies
Run the standard package installation:
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your settings:
```env
# Neon PostgreSQL Database Connection (Optional for local dev, uses resilient store by default)
DATABASE_URL="postgresql://username:password@ep-host.region.aws.neon.tech/neondb?sslmode=require"

# JWT Secret for Admin Session Tokens
JWT_SECRET="jd-fusion-tech-secure-jwt-secret-key-2026"

# Admin Authentication
ADMIN_EMAIL="admin@jdfusiontech.com"
ADMIN_PASSWORD="YOUR_CHOSEN_PASSWORD"
```

### Step 4: Run the Development Server
```bash
npm run dev
```

The application will start on:
- **Public Website**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin`
- **API Health Check**: `http://localhost:3000/api/health`

---

## 🗄️ Setting Up Free Neon PostgreSQL Database

[Neon](https://neon.tech) offers a free-tier Serverless PostgreSQL database that sleeps when inactive and wakes instantly.

### Step-by-Step Neon Setup:

1. **Sign Up for Neon**:
   - Go to [https://neon.tech](https://neon.tech) and sign up for a free account (GitHub or Google sign-in supported).
2. **Create a New Project**:
   - Click **"Create Project"**.
   - Project Name: `jd-fusion-technologies`
   - Postgres Version: Select `Postgres 16` (or latest).
   - Region: Choose the region nearest to you (e.g., `AWS US East (Ohio)` or `EU Frankfurt`).
3. **Copy the Connection String**:
   - On the Neon project dashboard, locate the **Connection Details** box.
   - Select **Connection string** and check **Pooled connection** or direct.
   - It will look like:
     ```text
     postgresql://neondb_owner:npg_AbCdEf123456@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
4. **Add to `.env`**:
   - Paste this URL into your `.env` file as `DATABASE_URL`.
5. **Push Database Schema**:
   - In VS Code terminal, run:
     ```bash
     npm run db:push
     ```
   - Drizzle Kit will automatically connect to Neon and create all 18 tables:
     - `site_settings`
     - `about_content`
     - `services`
     - `web_projects`
     - `graphic_projects`
     - `testimonials` (with moderation status)
     - `inquiries`
     - `contact_settings`
     - `location_settings`
     - `social_links` (Facebook, LinkedIn, WhatsApp)
     - `media_files` & `media_blobs`
     - `seo_settings`
     - `activity_logs`
     - `founders`
     - `visitor_visits` (analytics hits)
     - `visitor_daily_rollups` (traffic metrics)

---

## 🐙 Pushing to GitHub (Step-by-Step)

To deploy to Vercel, push your code to a GitHub repository:

### Step 1: Initialize Git
If git is not already initialized in your project:
```bash
git init
```

### Step 2: Check Git Status
```bash
git status
```
*(Notice that `node_modules/`, `dist/`, and `.env` are automatically excluded by `.gitignore`)*

### Step 3: Stage and Commit Files
```bash
git add .
git commit -m "feat: JD Fusion Technologies initial production release"
```

### Step 4: Create a Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Repository name: `jd-fusion-technologies`.
3. Set to **Public** or **Private**.
4. Leave "Initialize this repository with a README" **unchecked** (we already have one).
5. Click **Create repository**.

### Step 5: Link Remote and Push
```bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/jd-fusion-technologies.git
git push -u origin main
```

---

## ⚡ Deploying to Free Vercel Hosting (Step-by-Step)

Vercel provides free global hosting for Vite frontends and Node.js serverless functions.

### Step-by-Step Vercel Deployment:

1. **Sign Up / Log in to Vercel**:
   - Navigate to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. **Import GitHub Repository**:
   - Click **"Add New..."** -> **"Project"**.
   - Locate `jd-fusion-technologies` from your GitHub repository list and click **"Import"**.
3. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` or `vite build` (preset automatically configured by `vercel.json`).
   - **Output Directory**: `dist` (default).
4. **Add Environment Variables**:
   Expand the **Environment Variables** section and add the following keys:
   | Key | Value Example | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://...@...neon.tech/neondb?sslmode=require` | Your Neon database string |
   | `JWT_SECRET` | `your-secure-random-32-char-jwt-secret` | Session token signing key |
   | `ADMIN_EMAIL` | `admin@jdfusiontech.com` | Primary admin login identifier |
   | `ADMIN_PASSWORD`| `YourSecurePassword2026!` | Admin portal password |
5. **Click "Deploy"**:
   - Vercel will install dependencies, compile the production build, package the `/api/index.ts` serverless route, and provision a free SSL-secured domain:
     `https://jd-fusion-technologies.vercel.app`
6. **Custom Domain (Optional)**:
   - In Vercel Project Settings -> **Domains**, you can connect your custom domain (e.g. `jdfusiontech.com`) with automated free Let's Encrypt SSL.

---

## 🔐 Admin Portal Access & Credentials

- **Direct Portal Route**: `https://your-domain.vercel.app/admin` (or `http://localhost:3000/admin` locally).
- **Default Login Identifiers**:
  - Email: `admin@jdfusiontech.com` or `joshuamwenda36@gmail.com`
  - Username: `joshuamwenda`
- **Default Password**: `Admin@JDFusion2026!` (or the `ADMIN_PASSWORD` you configured in your `.env` / Vercel settings).
- **Security Features**:
  - Attempts are rate-limited after 5 consecutive failures with a 5-minute cooldown.
  - All logins and brute-force threats are recorded under the **Security Audit Logs** tab in the admin panel.
  - You can update your password and display profile directly within the admin dashboard settings.

---

## 🛠️ NPM Scripts Summary

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the full-stack Express + Vite dev server on port 3000 |
| `npm run build` | Compiles Vite production frontend and bundles `server.cjs` |
| `npm run start` | Runs the production Node.js server |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run db:push` | Pushes the Drizzle schema directly to your Neon PostgreSQL database |
| `npm run db:generate` | Generates SQL migration files in the `/drizzle` directory |

---

## 📄 License & Ownership

© 2026 **JD Fusion Technologies**. All rights reserved.  
Built for high-reliability digital transformation and modern software engineering.
# jd-fusion-technologies
