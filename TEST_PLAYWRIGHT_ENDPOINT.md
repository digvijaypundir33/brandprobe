# Testing Playwright on Vercel

## 🧪 Test Endpoint Created

**URL:** `/api/test-playwright`

This endpoint tests if Playwright is properly installed and working on Vercel.

---

## 📋 How to Use

### Step 1: Wait for Deployment
Wait for Vercel to deploy the latest commit (`28d7d76`)

### Step 2: Test on Production
```bash
curl https://brandprobe.io/api/test-playwright
```

Or visit in browser:
```
https://brandprobe.io/api/test-playwright
```

### Step 3: Check the Response

#### ✅ Success Response (Playwright Working):
```json
{
  "success": true,
  "message": "Playwright is working perfectly!",
  "totalTime": "2500ms",
  "breakdown": {
    "browserLaunch": "950ms",
    "pageNavigation": "800ms"
  },
  "scrapedData": {
    "title": "Example Domain",
    "url": "https://example.com/",
    "h1Count": 1
  },
  "logs": [
    "Step 1: Starting Playwright test...",
    "Step 2: Checking chromium availability...",
    "Step 3: Launching chromium browser...",
    "Step 4: Browser launched successfully in 950ms",
    "Step 5: Creating browser context...",
    "Step 6: Context created successfully",
    "Step 7: Page created successfully",
    "Step 8: Navigating to example.com...",
    "Step 9: Page loaded in 800ms",
    "Step 10: Extracting page data...",
    "Step 11: Data extracted - Title: \"Example Domain\"",
    "Step 12: Closing browser...",
    "Step 13: Browser closed successfully"
  ],
  "environment": {
    "nodeVersion": "v20.x.x",
    "platform": "linux",
    "arch": "x64",
    "memory": {...}
  }
}
```

**This means:** ✅ Playwright is installed and working!

---

#### ❌ Error Response (Playwright NOT Working):
```json
{
  "success": false,
  "error": "browserType.launch: Executable doesn't exist at /vercel/.cache/ms-playwright/chromium-1234/chrome-linux/chrome",
  "stack": "...",
  "logs": [
    "Step 1: Starting Playwright test...",
    "Step 2: Checking chromium availability...",
    "Step 3: Launching chromium browser...",
    "ERROR: Executable doesn't exist..."
  ],
  "environment": {...}
}
```

**This means:** ❌ Playwright didn't install correctly

---

## 🔍 What to Check

### If Success Response:
✅ **Playwright is working!** The issue is somewhere else:
- Check if AI analysis is timing out (60s limit)
- Check Groq API rate limits
- Check function logs for actual scan errors

### If Error Response:

#### Error: "Executable doesn't exist"
**Cause:** Chromium binary wasn't installed

**Check:**
1. Go to Vercel Dashboard → Deployments → Latest
2. Check build logs
3. Search for: `playwright install chromium`
4. Should see: "Chromium downloaded successfully"

**If missing:** Postinstall script didn't run

**Fix:**
```bash
# Force a rebuild
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

---

#### Error: "Cannot find module 'playwright'"
**Cause:** Playwright package not installed

**Check:**
1. Verify `package.json` has: `"playwright": "^1.58.2"` in dependencies
2. Check build logs for npm install errors

**Fix:**
```bash
npm install playwright
git add package.json package-lock.json
git commit -m "Add playwright dependency"
git push origin main
```

---

#### Error: "Task timed out after 60.00 seconds"
**Cause:** Test is taking too long (Hobby plan limit)

**This is OK!** It means:
- Browser is trying to launch (good sign)
- But takes >60s (need optimization or Pro plan)

---

## 📊 Performance Expectations

### Hobby Plan (1GB RAM, 60s timeout):
- Browser launch: 1-2 seconds
- Page navigation: 0.5-1 second
- Total test time: 2-4 seconds
- **Should pass easily** ✅

### If test passes but scans fail:
The issue is NOT Playwright, it's:
- AI analysis timing out (takes 30-40s)
- Combined with scraping (15-20s)
- Total >60s timeout

**Solution:** Apply optimizations from `HOBBY_PLAN_OPTIMIZATION.md`

---

## 🚀 Next Steps

### After Testing:

#### If Test PASSES:
1. ✅ Playwright is working
2. The issue is scan timeout or AI analysis
3. Check Vercel function logs for actual scan
4. May need to optimize for 60s limit

#### If Test FAILS:
1. ❌ Playwright not installed
2. Check build logs for installation errors
3. Verify postinstall script ran
4. May need to debug Vercel build process

---

## 🐛 Debugging Commands

### Test locally first:
```bash
npm run dev
curl http://localhost:3001/api/test-playwright
```

### Test on production:
```bash
curl https://brandprobe.io/api/test-playwright | jq
```

### Check with verbose output:
```bash
curl -v https://brandprobe.io/api/test-playwright
```

---

## 📝 What This Test Does

1. **Launches Chromium** - Verifies browser binary exists and works
2. **Creates browser context** - Tests Playwright API
3. **Navigates to page** - Tests network and rendering
4. **Extracts data** - Tests JavaScript execution
5. **Closes cleanly** - Tests resource cleanup

**All in ~2-4 seconds**

If this passes, Playwright is 100% working!

---

## ✅ Success Criteria

**Test must show:**
- ✅ `"success": true`
- ✅ Browser launched in <2 seconds
- ✅ Page loaded successfully
- ✅ Data extracted correctly
- ✅ Total time <5 seconds

**If ALL above pass:** Playwright is working perfectly! 🎉

---

## 🔄 After Testing

Once you confirm Playwright works:

1. **If test passes:** The issue is scan timeout or AI analysis
2. **Optimize scan for 60s limit** (see HOBBY_PLAN_OPTIMIZATION.md)
3. **Or upgrade to Vercel Pro** for 300s timeout

**You can delete this test route later:**
```bash
rm src/app/api/test-playwright/route.ts
git commit -m "Remove test endpoint"
git push
```

---

**Test URL:** https://brandprobe.io/api/test-playwright
**Commit:** 28d7d76
**Status:** Deploying now...
