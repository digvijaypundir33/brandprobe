# Environment Configuration Guide

This project supports both **local development** and **production** environments with automatic switching.

## How It Works

The app uses `NEXT_PUBLIC_SUPABASE_ENV` to determine which Supabase instance to connect to:
- `local` → Uses local Supabase instance
- `production` → Uses production Supabase instance

## Local Development Setup

Your `.env.local` file is already configured for local development:

```bash
NEXT_PUBLIC_SUPABASE_ENV=local
NEXT_PUBLIC_SUPABASE_LOCAL_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY=sb_publishable_...
SUPABASE_LOCAL_SERVICE_ROLE_KEY=sb_secret_...
```

**Just run your local Supabase instance and start developing!**

```bash
npm run dev
```

## Production Deployment (Vercel)

### Step 1: Get Production Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Project API keys** → **anon** public key
   - **Project API keys** → **service_role** secret key (⚠️ Keep this secret!)

### Step 2: Set Vercel Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables** and add:

#### Required for Production:
```bash
# Environment selector
NEXT_PUBLIC_SUPABASE_ENV=production

# Supabase Production
NEXT_PUBLIC_SUPABASE_PROD_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=your_production_anon_key
SUPABASE_PROD_SERVICE_ROLE_KEY=your_production_service_role_key

# AI Provider
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key

# Email
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@brandprobe.io

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# PayPal Production
PAYPAL_MODE=production
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_PRO_PLAN_ID=your_production_plan_id

# Auth
JWT_SECRET=your_secure_random_jwt_secret

# Performance
USE_CONSOLIDATED_PROMPTS=true
AI_PARALLEL_CALLS=9

# Web Scraping
BROWSERLESS_API_KEY=your_browserless_api_key
```

### Step 3: Deploy

```bash
git push origin main
```

Vercel will automatically deploy with production configuration!

## Testing Production Locally

If you want to test with production Supabase locally:

1. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_ENV=production
   ```

2. Make sure production variables are set in `.env.local`

3. Run:
   ```bash
   npm run dev
   ```

4. **Don't forget to switch back to `local` when done!**

## Troubleshooting

### Issue: App can't connect to Supabase

**Check:**
1. `NEXT_PUBLIC_SUPABASE_ENV` is set correctly (`local` or `production`)
2. The corresponding URL and keys are set
3. For local: Supabase is running (`supabase start`)
4. For production: Database migration has been run

### Issue: Environment variables not updating

**Solution:**
1. Restart Next.js dev server (`npm run dev`)
2. For Vercel: Redeploy after changing environment variables

## Security Notes

⚠️ **Never commit these files:**
- `.env.local` (already in .gitignore)
- `.env.production` (if you create one)

✅ **Safe to commit:**
- `.env.production.example` (template without real values)
- This guide

---

## Quick Reference

| Environment | Variable | Location |
|------------|----------|----------|
| Local Dev | `NEXT_PUBLIC_SUPABASE_ENV=local` | `.env.local` |
| Production | `NEXT_PUBLIC_SUPABASE_ENV=production` | Vercel Environment Variables |

**That's it!** The app will automatically connect to the right database based on the environment.
