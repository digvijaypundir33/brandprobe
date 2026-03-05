# Running BrandProbe on Vercel Hobby Plan

## ✅ Current Configuration

**vercel.json:**
```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

**Hobby Plan Limits:**
- Memory: 1GB (1024MB)
- Timeout: 60 seconds
- Cost: $0/month

---

## 🎯 Strategy for Hobby Plan

### What Should Work:
✅ **Browser Launch:** ~1-2s (fits in 1GB)
✅ **Single Page Scrape:** ~3-5s
✅ **Basic AI Analysis:** ~30-40s
✅ **Total:** ~45-55s (within 60s limit)

### What Might Be Tight:
⚠️ **4-page scraping:** 15-20s
⚠️ **10 AI sections:** 35-45s
⚠️ **Screenshot:** 5-10s
⚠️ **Total:** 55-75s (might timeout)

---

## 🔧 Optimizations (If Needed)

### If Scans Timeout at 60s:

#### Option 1: Reduce Pages Scraped
**Current:** Scrapes up to 4 pages
**Optimize:** Scrape only 1-2 pages

```typescript
// In src/lib/scraper.ts
const MAX_SUBPAGES = 1; // Reduce from 3 to 1
```

**Saves:** ~10-15 seconds

---

#### Option 2: Skip Screenshot
**Current:** Captures screenshot for design analysis
**Optimize:** Skip screenshot on Hobby plan

```typescript
// In src/app/api/scan/route.ts (line ~263)
// Replace:
const screenshotPromise = captureScreenshot(url);

// With:
const screenshotPromise = Promise.resolve(null); // Skip on Hobby plan
```

**Saves:** ~5-10 seconds

---

#### Option 3: Reduce AI Sections
**Current:** Generates all 10 sections
**Optimize:** Generate only core 6 sections for free users

This is already implemented - free users only get:
1. Messaging Analysis
2. SEO Opportunities
3. Content Strategy
4. Ad Creative Ideas

Pro sections (locked) are not generated:
5. Conversion Optimization
6. Distribution Channels
7. AI Search Visibility
8. Technical Performance
9. Brand Health
10. Design Authenticity

**Already optimized!** ✅

---

#### Option 4: Use Quick Mode
**Current:** Default is 'full' analysis
**Optimize:** Force 'quick' mode for free users

```typescript
// In src/app/api/scan/route.ts (line ~199)
// Change:
processReport(report.id, normalizedUrl, previousOverallScore, startTime, analysisType, email)

// To:
const mode = user.subscriptionStatus === 'active' ? analysisType : 'quick';
processReport(report.id, normalizedUrl, previousOverallScore, startTime, mode, email)
```

**Saves:** ~10-15 seconds (scrapes only 1 page)

---

## 📊 Expected Performance

### Current Setup (No Optimizations):
```
Browser launch: 2s
Scraping 4 pages: 15-20s
AI analysis (4 sections): 30-35s
Screenshot: 5s
TOTAL: ~52-62s
```
**Status:** Might timeout occasionally ⚠️

### With Optimization #1 (Reduce to 2 pages):
```
Browser launch: 2s
Scraping 2 pages: 8-12s
AI analysis (4 sections): 30-35s
Screenshot: 5s
TOTAL: ~45-54s
```
**Status:** Should work reliably ✅

### With Optimization #4 (Force quick mode for free):
```
Browser launch: 2s
Scraping 1 page: 4-6s
AI analysis (4 sections): 30-35s
Screenshot: 5s
TOTAL: ~41-48s
```
**Status:** Very safe ✅

---

## 🚀 Recommended Approach

### Phase 1: Test Current Setup (No Changes)
1. Wait for current deployment to complete
2. Test a scan on preview URL
3. Check if it completes within 60s

### Phase 2: If Timeouts Occur
Apply optimizations in this order:
1. **First:** Reduce MAX_SUBPAGES to 1 (easy, safe)
2. **Second:** Skip screenshot (saves time, small UX impact)
3. **Third:** Force quick mode for free users (if still timing out)

### Phase 3: Monitor & Adjust
- Monitor success rate over first week
- If >90% success → keep current setup
- If <90% success → apply optimizations

---

## 💰 Cost Analysis

### Hobby Plan (Current):
- Vercel: $0/month
- Native Playwright: $0/month
- **Total: $0/month**
- **Limitations:** 60s timeout, 1GB memory

### Pro Plan (Future):
- Vercel: $20/month
- Native Playwright: $0/month
- **Total: $20/month**
- **Benefits:** 300s timeout, 3GB memory, no limitations

**Decision:** Start with Hobby, upgrade to Pro when revenue allows.

---

## 🎯 Success Metrics for Hobby Plan

### Must Have:
- ✅ >80% scan completion rate
- ✅ No memory crashes
- ✅ Reports generate correctly

### Nice to Have:
- ✅ 4-page scraping
- ✅ Screenshot capture
- ✅ <55s completion time

### Upgrade Triggers:
- ❌ <80% completion rate
- ❌ Frequent timeouts
- ❌ User complaints
- 💰 Revenue > $100/month

---

## 📝 Current Status

**Deployment:** Testing with Hobby limits
**Memory:** 1024MB (1GB)
**Timeout:** 60 seconds
**Optimizations:** None yet (testing baseline)

**Next Steps:**
1. Wait for deployment to complete
2. Test scan on preview URL
3. Monitor completion time
4. Apply optimizations if needed

---

## 🐛 If Scans Still Fail

### Check These:
1. **Build logs** - Did Playwright install?
2. **Function logs** - What's the error?
3. **Timing** - How long before timeout?

### Common Issues:

**"Task timed out after 60.00 seconds"**
→ Apply optimization #1 or #4

**"Runtime exited with error: signal: killed"**
→ Out of memory - skip screenshot (optimization #2)

**"Executable doesn't exist"**
→ Playwright didn't install - check build logs

---

## ✅ Conclusion

**For MVP on Hobby Plan:**
- ✅ Should work with current config
- ✅ May need minor optimizations (reduce pages)
- ✅ $0/month - perfect for MVP
- 🚀 Upgrade to Pro when you have paying users

**Let's test it first before optimizing!**
