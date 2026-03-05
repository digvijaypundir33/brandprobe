# Production Debug - Scanning Stuck at "4/10 Sections"

## Issue
Scan stuck at: "4/10 Sections Scanning..." on https://brandprobe.io

## Most Likely Causes

### 1. Playwright Not Installed ⚠️ (MOST LIKELY)
During Vercel deployment, Chromium browser wasn't installed.

### 2. Function Timeout
Function is timing out before completion.

### 3. Memory Issues
Not enough memory allocated for Chromium.

---

## Diagnostic Steps

### Step 1: Check Vercel Build Logs

1. Go to: https://vercel.com/dashboard
2. Click on your BrandProbe project
3. Click: **Deployments** tab
4. Click on the **latest deployment** (the one from your recent push)
5. Click: **Building** section to expand build logs

**Look for these lines:**

✅ **GOOD - Playwright installed:**
```
Running "npm install"
...
> brandprobe-init@0.1.0 postinstall
> playwright install chromium --with-deps

Downloading Chromium 123.0.6312.4...
Chromium 123.0.6312.4 downloaded successfully
```

❌ **BAD - Playwright NOT installed:**
```
Running "npm install"
...
(no postinstall script output)
```

---

### Step 2: Check Function Logs

1. In Vercel Dashboard → Click **Logs** tab
2. Filter by: Last 1 hour
3. Look for errors related to the stuck report

**Look for these error patterns:**

❌ **Browser not found:**
```
Error: Executable doesn't exist at /vercel/.cache/ms-playwright/chromium-1234/chrome-linux/chrome
```
**Solution:** Playwright didn't install → Check Step 3

❌ **Function timeout:**
```
Task timed out after 10.00 seconds
```
**Solution:** Need to increase timeout → Check Step 4

❌ **Out of memory:**
```
Runtime.ExitError: RequestId: xxx Error: Runtime exited with error: signal: killed
```
**Solution:** Need more memory → Check Step 5

---

### Step 3: Verify vercel.json Deployed

Check if vercel.json is in your deployment:

1. Go to: Vercel Dashboard → Deployments → Latest
2. Click: **Source** tab
3. Look for `vercel.json` in the file list

**Should contain:**
```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 300,
      "memory": 3008
    }
  },
  "buildCommand": "npm run build",
  "installCommand": "npm install && playwright install chromium --with-deps"
}
```

If missing or different → vercel.json wasn't deployed correctly

---

### Step 4: Check Environment Variables

Go to: Vercel Dashboard → Settings → Environment Variables

**Verify these exist for Production:**

✅ Required:
- `NEXT_PUBLIC_SUPABASE_ENV` = `production`
- `GROQ_API_KEY` = (your Groq key)
- `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase key)
- All other keys from VERCEL_ENV_VARS.example.txt

❌ Should NOT exist:
- `BROWSERLESS_API_KEY` (remove if present)

---

## Solutions

### Solution 1: Redeploy with Playwright Installation

If Playwright wasn't installed in build logs:

1. **Verify vercel.json is committed:**
   ```bash
   git log -1 --name-only | grep vercel.json
   ```
   Should show: `vercel.json`

2. **If not committed:**
   ```bash
   git add vercel.json
   git commit -m "Add vercel.json for Playwright deployment"
   git push origin main
   ```

3. **If already committed, force redeploy:**
   - Vercel Dashboard → Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Check: **"Use existing Build Cache"** = OFF (important!)
   - Click: Redeploy

4. **Watch build logs** for Playwright installation

---

### Solution 2: Increase Function Timeout

If you're on Vercel Hobby plan (10s timeout):

**Upgrade to Pro:**
- Vercel Hobby: 10s max function timeout ❌
- Vercel Pro: 300s max function timeout ✅

Or **reduce scan scope** (not recommended):
```typescript
// In src/lib/ai.ts or scan route
// Reduce number of sections analyzed
```

---

### Solution 3: Check Vercel Plan Limits

Go to: Vercel Dashboard → Settings → General

**Required for BrandProbe:**
- Plan: **Pro** ($20/month)
- Function timeout: 300s
- Function memory: 3008MB

If on Hobby plan → Upgrade to Pro

---

### Solution 4: Manual Playwright Test on Vercel

Create a test endpoint to verify Playwright works:

**File:** `src/app/api/test-playwright/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET() {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    await browser.close();

    return NextResponse.json({
      success: true,
      title,
      message: 'Playwright is working!',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
```

**Deploy and test:**
```bash
# After deploying
curl https://brandprobe.io/api/test-playwright
```

**Expected response:**
```json
{
  "success": true,
  "title": "Example Domain",
  "message": "Playwright is working!"
}
```

If you get an error about "Executable doesn't exist" → Playwright not installed

---

## Quick Fix Checklist

Run these checks in order:

1. [ ] Check Vercel build logs for "playwright install chromium"
2. [ ] Verify vercel.json is in deployment source
3. [ ] Check function logs for specific error
4. [ ] Verify Vercel Pro plan (not Hobby)
5. [ ] Check all environment variables are set
6. [ ] Remove BROWSERLESS_API_KEY if present
7. [ ] Redeploy without build cache
8. [ ] Test with /api/test-playwright endpoint

---

## Most Common Issue: Playwright Not Installed

**Why it happens:**
- vercel.json not deployed
- installCommand not running
- postinstall script failing silently

**How to fix:**
1. Go to Vercel Dashboard → Deployments → Latest → Build Logs
2. Search for "postinstall" or "playwright"
3. If missing → vercel.json not being used
4. Redeploy without cache
5. Verify installCommand runs in build logs

---

## Need More Help?

**Check these files:**
- Build logs: Vercel Dashboard → Deployments → Latest → Building
- Function logs: Vercel Dashboard → Logs
- Source code: Vercel Dashboard → Deployments → Latest → Source

**Report ID from your test:**
- Report stuck at: "4/10 Sections"
- URL: https://chatcrafterai.com
- Time: Mar 5, 2026 at 2:34 PM

**Look for this report ID in Vercel logs to see the exact error**

---

## Expected Behavior After Fix

After Playwright is properly installed:

1. ✅ Scan starts: "1/10 Sections"
2. ✅ Progress updates every 5-10 seconds
3. ✅ Completes all 10 sections in 60-90 seconds
4. ✅ Shows final report with score

---

## Contact Info

If none of these work, share:
1. Screenshot of Vercel build logs (search for "playwright")
2. Screenshot of Vercel function logs (filter by report ID)
3. Your Vercel plan (Hobby vs Pro)
