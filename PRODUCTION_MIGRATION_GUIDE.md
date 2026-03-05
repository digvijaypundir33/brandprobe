# Running Database Migrations on Production

## 🎯 Quick Guide

### Method 1: Run All Migrations at Once (Recommended)

1. **Open the combined migration file:**
   - File: `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`

2. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/mcsdmpejxwbyxxuhraap
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Copy & Paste the entire file contents into the SQL editor**

4. **Click "Run"** (or press Cmd/Ctrl + Enter)

5. **Verify Success:**
   - Check for green success message
   - Go to **"Table Editor"** to verify tables were created:
     - `users`
     - `sites`
     - `reports`
     - `report_views`
     - `magic_links`
     - `brand_cache`

### Method 2: Run Migrations One by One

If you prefer to run them individually (in order):

1. `001_initial.sql` - Creates base tables
2. `20260302045841_add_design_authenticity.sql` - Adds design authenticity column
3. `20260302120000_add_analysis_type.sql` - Adds analysis type tracking
4. `20260302120100_add_brand_cache.sql` - Adds brand cache table
5. `20260303000000_add_magic_links.sql` - Adds magic link authentication
6. `20260303010000_add_starter_tier.sql` - Adds starter tier support
7. `20260304000001_drop_report_shares.sql` - Drops old share tables
8. `20260304000002_add_report_privacy.sql` - Adds privacy toggle

Run each file's contents in the SQL Editor, one at a time.

## ✅ Verification Checklist

After running migrations, verify:

### Tables Created:
- [ ] `users` table exists
- [ ] `sites` table exists
- [ ] `reports` table exists
- [ ] `report_views` table exists
- [ ] `magic_links` table exists
- [ ] `brand_cache` table exists

### Columns Added to Reports Table:
- [ ] `design_authenticity` (JSONB)
- [ ] `design_authenticity_score` (INTEGER)
- [ ] `analysis_type` (TEXT)
- [ ] `pages_analyzed` (INTEGER)
- [ ] `is_public` (BOOLEAN)

### Indexes Created:
- [ ] `idx_reports_is_public` on `reports(is_public)`

### Users Table Updated:
- [ ] `one_time_purchase_id` column exists
- [ ] `email_verified` column exists
- [ ] `last_login_at` column exists

## 🚨 Troubleshooting

### Error: "relation already exists"
**Cause:** Migration already ran or table exists
**Solution:** Safe to ignore if table structure matches expected schema

### Error: "column already exists"
**Cause:** Column was added in a previous run
**Solution:** Safe to ignore, proceed to next migration

### Error: Permission denied
**Cause:** Not using service role key
**Solution:** Make sure you're logged into the correct Supabase project

## 📊 After Migration

Once migrations are complete:

1. **Test in production:**
   ```bash
   # In your terminal (with production env vars set)
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   git push origin main
   ```

3. **Verify on deployed app:**
   - Create a test report
   - Toggle privacy settings
   - Check that reports work correctly

## 🔄 Future Migrations

When you add new migrations:

1. Create new migration file in `supabase/migrations/`
2. Name it: `YYYYMMDDHHMMSS_description.sql`
3. Run it on production via SQL Editor
4. Optionally regenerate `ALL_MIGRATIONS_COMBINED.sql` if needed

---

**Need Help?** Check the Supabase logs in the dashboard for detailed error messages.
