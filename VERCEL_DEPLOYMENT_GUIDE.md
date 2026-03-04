# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Production database migrations completed
- [x] Privacy toggle feature tested locally with production DB
- [x] Environment variables documented
- [ ] PayPal production keys obtained
- [ ] Vercel environment variables configured
- [ ] Domain configured (if custom)

---

## 🚀 Deployment Steps

### 1. Configure Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add all variables from `VERCEL_ENV_VARS.txt` (create this file locally with your actual values)
5. Select **Production**, **Preview**, and **Development** for each variable

**Critical Variables to Add:**

Use `VERCEL_ENV_VARS.example.txt` as a template and fill in your actual values:

```bash
# Supabase - Use BOTH sets of variables for compatibility
# Get from: https://supabase.com/dashboard/project/_/settings/api

# Primary (with _PROD_ prefix)
NEXT_PUBLIC_SUPABASE_PROD_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=your_anon_key
SUPABASE_PROD_SERVICE_ROLE_KEY=your_service_role_key

# Fallback (without _PROD_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider (Groq)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key

# Other required variables - see VERCEL_ENV_VARS.example.txt
```

### 2. Update PayPal to Production Mode

⚠️ **IMPORTANT**: Currently using sandbox PayPal keys!

**Before deploying:**
1. Create production PayPal app at: https://developer.paypal.com/dashboard/applications
2. Update these in Vercel:
   ```bash
   PAYPAL_MODE=production
   PAYPAL_CLIENT_ID=your_production_client_id
   PAYPAL_CLIENT_SECRET=your_production_client_secret
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_client_id
   PAYPAL_PRO_PLAN_ID=your_production_plan_id
   ```

**For testing, you can keep sandbox mode:**
```bash
PAYPAL_MODE=sandbox
```

### 3. Update App URL

In Vercel environment variables:
```bash
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```

Or if you have a custom domain:
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Deploy to Vercel

**Option A: Push to GitHub (Recommended)**
```bash
git add .
git commit -m "Add privacy toggle feature and prepare for production"
git push origin main
```
Vercel will automatically deploy!

**Option B: Deploy via Vercel CLI**
```bash
vercel --prod
```

---

## 🧪 Post-Deployment Testing

After deployment, test these features:

### 1. Basic Functionality
- [ ] Homepage loads
- [ ] Can create a new report
- [ ] Report generates successfully
- [ ] Can view completed report

### 2. Privacy Toggle
- [ ] Eye icon appears for report owners
- [ ] Can toggle report to private
- [ ] Private reports block non-owners (test in incognito)
- [ ] Error page shows with "Try BrandProbe" button
- [ ] Can toggle back to public
- [ ] Public reports accessible to everyone

### 3. Authentication
- [ ] Magic link email delivery
- [ ] Can log in via magic link
- [ ] Session persists correctly
- [ ] Can log out

### 4. Payment (if using production PayPal)
- [ ] Starter plan purchase works ($9)
- [ ] Pro plan subscription works ($29/month)
- [ ] PayPal webhooks processing correctly
- [ ] Subscription status updates in database

### 5. Locked Sections
- [ ] Free users see 4 unlocked sections
- [ ] Starter users see all 10 sections
- [ ] Pro users see all 10 sections
- [ ] Lock icons display correctly

---

## 🔍 Monitoring & Debugging

### Check Vercel Logs
```
Vercel Dashboard → Your Project → Logs
```

### Check Supabase Logs
```
Supabase Dashboard → Logs → API Logs
```

### Common Issues

**Issue: Environment variables not working**
- Solution: Redeploy after adding/changing env vars

**Issue: Database connection fails**
- Check: `NEXT_PUBLIC_SUPABASE_ENV=production` is set
- Check: Production URLs and keys are correct
- Check: Supabase project is not paused

**Issue: PayPal not working**
- Check: Using correct mode (sandbox vs production)
- Check: Client ID matches mode
- Check: Webhook URL is configured in PayPal dashboard

**Issue: Privacy toggle not working**
- Check: `is_public` column exists in production database
- Check: Migration was run successfully
- Check: Browser console for errors

---

## 📱 Setting Up Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Redeploy

---

## 🔄 Future Deployments

For future updates:

1. Make changes locally
2. Test with production DB: `npm run dev:prod`
3. Commit and push to GitHub
4. Vercel auto-deploys
5. Monitor logs for any issues

---

## 📊 What's Deployed

### Features Included:
- ✅ Privacy toggle for reports
- ✅ Email authentication (magic links)
- ✅ PayPal integration (Starter + Pro plans)
- ✅ Section locking (free vs paid)
- ✅ 10 analysis sections
- ✅ Report printing/PDF
- ✅ Report deletion
- ✅ Dashboard (if implemented)

### Environment Setup:
- ✅ Automatic local/production switching
- ✅ Production Supabase database
- ✅ All migrations applied
- ✅ Privacy column added
- ✅ Clean migration history

---

## 🎉 You're Ready!

Your app is production-ready with:
- Complete database schema
- Privacy toggle feature
- Environment configuration
- All migrations applied

**Deploy with confidence!** 🚀

---

## 🔒 Security Notes

**IMPORTANT:**
- Never commit `VERCEL_ENV_VARS.txt` with actual secrets to git
- Keep your API keys and service role keys private
- Use environment variables in Vercel dashboard only
- The `.example` files are safe to commit (no real secrets)
