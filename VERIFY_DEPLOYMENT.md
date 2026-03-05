# Verify Playwright Deployment

## ✅ Code Pushed Successfully
- Commit: `06aa57b`
- Branch: `main`
- Time: Just now

---

## 📋 Verification Steps

### 1. Watch Vercel Deployment (2-3 minutes)

Go to: https://vercel.com/dashboard

**Check:**
- [ ] New deployment should appear
- [ ] Status should be "Building"
- [ ] Wait for "Ready" status

---

### 2. Check Build Logs (CRITICAL)

1. Click on the new deployment
2. Click "Building" to expand logs
3. **Search for:** `playwright install chromium`

**You MUST see this:**
```
Running "npm install && playwright install chromium --with-deps"
...
> brandprobe-init@0.1.0 postinstall
> playwright install chromium --with-deps

Downloading Chromium 123.0.6312.4 (playwright build v1234) - 137.9 Mb
Chromium 123.0.6312.4 (playwright build v1234) downloaded to /vercel/.cache/ms-playwright/chromium-1234
```

**Good signs:**
✅ "playwright install chromium" appears in logs
✅ "Chromium downloaded successfully"
✅ "Build completed" at the end

**Bad signs:**
❌ No "playwright install" in logs
❌ "postinstall script failed"
❌ Build failed

---

### 3. Check vercel.json Was Deployed

In deployment view:
1. Click "Source" tab
2. Look for `vercel.json` in file list
3. Click on it to verify contents

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

---

### 4. Remove BROWSERLESS_API_KEY (If Not Done)

Go to: Vercel Dashboard → Settings → Environment Variables

**Check:**
- [ ] Find `BROWSERLESS_API_KEY`
- [ ] If exists, click "..." → Delete
- [ ] Delete from Production, Preview, Development
- [ ] Click "Save"

**After deleting:**
- [ ] Redeploy (optional, but recommended)

---

### 5. Test a Scan

Go to: https://brandprobe.io

1. **Submit scan:**
   - URL: `https://stripe.com`
   - Email: Your real email
   - Click "Probe Your Brand"

2. **Check email:**
   - Should receive magic link
   - Click link to start scan

3. **Watch progress:**
   - Should go from "1/10" to "10/10"
   - Should complete in 60-90 seconds
   - Should show final report

4. **If it gets stuck:**
   - Go to Vercel Dashboard → Logs
   - Filter by last 10 minutes
   - Look for errors with your report ID

---

### 6. Check Function Logs for Errors

Vercel Dashboard → Logs → Filter: Last 1 hour

**Look for:**
- `[reportId] Starting scrape` ✅
- `[reportId] Starting AI analysis` ✅
- `[reportId] Report complete` ✅

**Watch for errors:**
- `Executable doesn't exist` ❌ (Playwright not installed)
- `Task timed out` ❌ (Need more time)
- `Runtime exited` ❌ (Out of memory)

---

## 🐛 If Scan Still Fails

### Issue: "Executable doesn't exist"
**Cause:** Playwright didn't install during build

**Fix:**
1. Check build logs - is "playwright install" there?
2. If NO → vercel.json not being used
3. Verify vercel.json is in Source tab
4. Try: Manual redeploy without cache
   - Deployments → ... → Redeploy
   - Uncheck "Use existing build cache"

### Issue: Scan times out at 10 seconds
**Cause:** You're on Vercel Hobby plan (10s limit)

**Fix:**
- Upgrade to Vercel Pro ($20/month)
- Pro gives 300s function timeout

### Issue: Out of memory
**Cause:** Not enough memory allocated

**Fix:**
- Verify vercel.json has `"memory": 3008`
- Redeploy to apply settings

---

## 📊 Success Indicators

After deployment, you should see:

✅ Build logs show Playwright installation
✅ vercel.json in deployment source
✅ Scans complete all 10 sections
✅ Reports generate successfully
✅ No browser launch errors in logs
✅ Function duration: 45-90 seconds

---

## 🎯 Expected Performance

**First request (cold start):**
- Browser launch: ~1-2 seconds
- Total scan: ~70-100 seconds

**Subsequent requests (warm):**
- Browser launch: ~0.5-1 second
- Total scan: ~60-80 seconds

---

## 📝 Test Checklist

- [ ] Deployment completed successfully
- [ ] Build logs show Playwright installation
- [ ] vercel.json is in deployment
- [ ] BROWSERLESS_API_KEY removed
- [ ] Test scan completes successfully
- [ ] Report shows all sections
- [ ] No errors in function logs
- [ ] Print page shows 6 locked sections (for free users)

---

## 💬 Report Status

**If successful:**
"✅ Playwright deployed successfully! Scans are working!"

**If failed:**
Share:
1. Screenshot of build logs (search for "playwright")
2. Screenshot of error in function logs
3. Report ID that's stuck
4. What section it's stuck on

---

## Next Steps After Success

1. ✅ Test 2-3 more scans to confirm stability
2. ✅ Cancel Browserless subscription (save $228-1,188/year)
3. ✅ Monitor first week for any issues
4. ✅ Enjoy unlimited free scraping!

---

**Deployment Time:** Just now
**Commit:** 06aa57b
**Status:** Waiting for Vercel deployment...
