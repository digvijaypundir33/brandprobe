# Vercel Environment Variable Setup

## Required for @sparticuz/chromium

After deployment, you MUST add this environment variable in Vercel Dashboard:

### Environment Variable

**Name:** `LD_LIBRARY_PATH`
**Value:** `/tmp/@sparticuz/chromium/lib`

### How to Add

1. Go to: https://vercel.com/dashboard
2. Select your project: **brandprobe**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - Key: `LD_LIBRARY_PATH`
   - Value: `/tmp/@sparticuz/chromium/lib`
6. Select environments: **Production**, **Preview**, **Development**
7. Click **Save**
8. **Redeploy** the project for changes to take effect

### Why This Is Needed

The `LD_LIBRARY_PATH` tells the Linux system where to find shared libraries needed by Chromium in the serverless environment. Without this, you'll get errors like "cannot open shared object file".

### Testing After Setup

1. Wait for deployment to complete (2-3 minutes)
2. Test the endpoint: https://www.brandprobe.io/api/test-playwright
3. Check for `"success": true` in the response
4. If successful, browser should launch in ~1-2 seconds

### Expected Response

```json
{
  "success": true,
  "message": "Playwright is working perfectly!",
  "totalTime": "1500ms",
  "scrapedData": {
    "title": "Example Domain",
    "url": "https://example.com/"
  }
}
```

### If Still Failing

Check Vercel function logs for specific errors:
1. Go to Vercel Dashboard → Logs
2. Filter by last 10 minutes
3. Look for errors related to chromium or libraries

### References

- [How to Deploy Playwright on Vercel - ZenRows](https://www.zenrows.com/blog/playwright-vercel)
- [Fix Chromium on Vercel Guide](https://medium.com/@qudratullahofficial07/how-to-fix-chromium-on-vercel-a-complete-guide-to-solving-the-libnspr4-so-error-b525790c6f6e)
- [@sparticuz/chromium GitHub](https://github.com/Sparticuz/chromium)
