# JD Fusion Technologies — Step-by-Step Deployment Guide (Free Neon + Free Vercel)

This guide walks you step-by-step through deploying **JD Fusion Technologies** using:
- **Free Database**: Serverless PostgreSQL on [Neon.tech](https://neon.tech) (Free Tier: 0.5 GB storage, scale to zero, SSL included)
- **Free Hosting**: High-speed edge hosting on [Vercel](https://vercel.com) (Free Hobby Tier: automatic SSL, global CDN, serverless functions)

---

## Part 1: Set Up Free PostgreSQL on Neon

1. **Create an Account**:
   - Go to [https://neon.tech](https://neon.tech) and sign up for a free account (you can sign in with your GitHub or Google account).

2. **Create a New Project**:
   - Click **Create Project**.
   - **Project Name**: `jd-fusion-technologies`
   - **Postgres version**: 16 (default)
   - **Region**: Choose the region closest to your target audience (e.g., `AWS Europe (Frankfurt)` or `AWS US East (Ohio)`).
   - Click **Create Project**.

3. **Copy your PostgreSQL Connection String**:
   - In the Neon dashboard project view, look at the **Connection Details** card.
   - Ensure **Pooled connection** or standard connection is selected.
   - Copy the connection URI string. It looks like:
     ```
     postgresql://neondb_owner:npg_AbCdEf123456@ep-cool-fog-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
     ```
   - Keep this string safe; you will paste this into Vercel as `DATABASE_URL`.

4. **Initialize Database Tables (Run Schema Migration)**:
   - In Neon's dashboard, click the **SQL Editor** tab on the left.
   - Or, from your local terminal with `DATABASE_URL` set in `.env`:
     ```bash
     npx drizzle-kit push
     ```
   - *Note*: If you run the app without pushing migrations, the built-in storage engine automatically self-seeds in memory with fallback so your site never crashes.

---

## Part 2: Push Your Code to GitHub

1. Open your terminal in the project directory:
   ```bash
   git init
   git add .
   git commit -m "JD Fusion Technologies production release"
   ```

2. Create a new repository on [GitHub](https://github.com/new) named `jd-fusion-technologies` (public or private).

3. Link and push your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/jd-fusion-technologies.git
   git push -u origin main
   ```

---

## Part 3: Deploy to Free Vercel

1. **Sign in to Vercel**:
   - Visit [https://vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Your Repository**:
   - Click **Add New...** -> **Project**.
   - Find your `jd-fusion-technologies` repository and click **Import**.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (or leave default `vite build`)
   - **Output Directory**: `dist` (default)

4. **Add Environment Variables**:
   Under the **Environment Variables** accordion, add the following key-value pairs:

   | Variable Name | Value | Purpose |
   | ------------- | ----- | ------- |
   | `DATABASE_URL` | `postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require` | Your Neon database connection string |
   | `JWT_SECRET` | `your-secure-32-char-random-string` | Signs admin session tokens securely |
   | `NODE_ENV` | `production` | Enables production optimizations |

5. **Deploy**:
   - Click the blue **Deploy** button.
   - Vercel will install dependencies, build the Vite frontend, compile serverless API routes, and deploy edge routing.
   - When finished, you will receive a production URL such as `https://jd-fusion-technologies.vercel.app`.

---

## Part 4: Accessing the Admin CMS Portal

- The public website does **not** display any admin buttons or credentials.
- To access the administrator dashboard, navigate directly to:
  ```
  https://your-domain.vercel.app/admin
  ```
- Enter your admin credentials to log in.
- **Admin Capabilities**:
  - **Testimonials Approval**: Review incoming client submissions submitted via the website. Click **Approve & Publish** to instantly make them live.
  - **Inquiries & Leads**: Real-time customer quote requests and messages.
  - **Web & Graphic Projects**: Manage portfolio showcases without code changes.
  - **Cybersecurity & Activity Logs**: Monitor automated exploit probe blocks and administrative audit trails.

---

## Part 5: (Optional) Connect Your Custom Domain

1. In the Vercel Dashboard, go to **Settings** -> **Domains**.
2. Enter your custom domain (e.g. `jdfusiontech.com` or `jdfusion.co.ke`).
3. Add the DNS records (A record or CNAME) shown by Vercel into your domain registrar (e.g. Truehost, Safaricom, Namecheap, GoDaddy).
4. Vercel will automatically generate and renew a free SSL/TLS certificate for your domain.
