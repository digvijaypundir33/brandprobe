# Web Scraping Service Comparison

## Current Setup: Native Playwright ✅ RECOMMENDED

**Cost:** FREE
**Concurrency:** Unlimited (limited by Vercel function limits)
**Already Implemented:** YES

---

## Alternative Services (If You Ever Need Them)

### 1. **Browserless** (What you were using before)
- **Website:** https://browserless.io
- **Pricing:**
  - Hobby: $0/month - **2 concurrent sessions**
  - Starter: $19/month - 5 concurrent sessions
  - Growth: $49/month - 10 concurrent sessions
  - Business: $99/month - 20 concurrent sessions
- **Pros:**
  - Easy to set up
  - Managed service (no infrastructure)
  - WebSocket connection (fast)
- **Cons:**
  - ❌ Very limited concurrency on lower tiers
  - ❌ Expensive for high volume
  - ❌ External dependency
- **Best for:** Small projects with <100 scrapes/day

**Verdict:** Not worth it when Playwright is free and unlimited.

---

### 2. **ScrapingBee** ⭐ (Best Paid Alternative)
- **Website:** https://www.scrapingbee.com
- **Pricing:**
  - Freelance: $49/month - 150,000 API credits
  - Startup: $99/month - 350,000 API credits
  - Business: $249/month - 1,000,000 API credits
- **Credits per request:**
  - Simple page: 10 credits (~15,000 scrapes/month on Freelance)
  - JavaScript rendering: 25 credits (~6,000 scrapes/month)
  - Premium proxy: 75 credits (~2,000 scrapes/month)
- **Pros:**
  - ✅ Higher limits than Browserless
  - ✅ Built-in proxy rotation
  - ✅ JavaScript rendering included
  - ✅ Screenshot support
  - ✅ Simple API (no browser management)
- **Cons:**
  - ❌ Credit-based (can run out mid-month)
  - ❌ More expensive than managing your own
- **Best for:** High-volume scraping with anti-bot protection needs

**Integration example:**
```typescript
// npm install scrapingbee
import { ScrapingBeeClient } from 'scrapingbee';

const client = new ScrapingBeeClient(process.env.SCRAPINGBEE_API_KEY);
const response = await client.get({
  url: 'https://example.com',
  params: { render_js: 'true' }
});
```

---

### 3. **Bright Data (Scraping Browser)** 💰 (Enterprise Grade)
- **Website:** https://brightdata.com/products/scraping-browser
- **Pricing:**
  - Pay-as-you-go: ~$3 per 1,000 page loads
  - Monthly plans: Starting at $500/month
- **Pros:**
  - ✅ Best-in-class proxy network (residential IPs)
  - ✅ Handles the most aggressive anti-bot systems
  - ✅ CAPTCHA solving included
  - ✅ Extremely reliable
  - ✅ Enterprise support
- **Cons:**
  - ❌ Very expensive
  - ❌ Overkill for most use cases
  - ❌ Complex setup
- **Best for:** Scraping sites with heavy anti-bot protection (Amazon, Google, etc.)

**When to use:** Only if you're scraping sites that block Playwright/standard browsers.

---

### 4. **ZenRows**
- **Website:** https://www.zenrows.com
- **Pricing:**
  - Starter: $49/month - 250,000 API credits
  - Growth: $149/month - 1,000,000 API credits
  - Business: $399/month - 3,500,000 API credits
- **Credits per request:**
  - Static page: 1 credit
  - JavaScript rendering: 5 credits (~50,000 scrapes/month on Starter)
  - Premium proxy: 25 credits (~10,000 scrapes/month)
- **Pros:**
  - ✅ Generous credit allocation
  - ✅ Modern API design
  - ✅ Good documentation
  - ✅ Anti-CAPTCHA included
- **Cons:**
  - ❌ Newer service (less proven)
  - ❌ Credit-based system
- **Best for:** Mid-volume scraping with some anti-bot needs

---

### 5. **Apify** 🤖 (Scraping + Automation Platform)
- **Website:** https://apify.com
- **Pricing:**
  - Free: $0/month - $5 free usage
  - Starter: $49/month - $49 platform credits
  - Team: $499/month - $499 platform credits
- **Pricing model:**
  - Pay for compute time (~$0.25 per compute hour)
  - Each scrape uses compute minutes
- **Pros:**
  - ✅ Full platform (not just scraping)
  - ✅ Pre-built scrapers (Actors) for popular sites
  - ✅ Scheduling and monitoring
  - ✅ Data storage included
  - ✅ Can run custom Playwright scripts
- **Cons:**
  - ❌ Complex pricing model
  - ❌ Overkill if you just need scraping
  - ❌ Steeper learning curve
- **Best for:** When you need full scraping infrastructure + scheduling + data management

---

### 6. **Puppeteer/Playwright on AWS Lambda** (DIY)
- **Website:** Self-hosted
- **Pricing:**
  - AWS Lambda: ~$0.20 per 1 million requests
  - Plus compute time: ~$0.0000166667 per GB-second
- **Pros:**
  - ✅ Very cheap at scale
  - ✅ Full control
  - ✅ Unlimited concurrency
- **Cons:**
  - ❌ Complex setup (Lambda layers, container images)
  - ❌ Need to manage Chrome binaries
  - ❌ Cold start latency
- **Best for:** Very high volume (millions of scrapes/month) where DIY makes sense

---

## Recommendation by Use Case

### For BrandProbe (Your Case):
**Use Native Playwright on Vercel** ✅

**Reasons:**
- You're scraping 1-4 pages per report
- You're likely doing <1,000 reports/month on free tier
- You don't need proxy rotation (scraping legitimate business sites)
- You don't need anti-bot features
- **FREE** and unlimited concurrency

**Cost savings vs Browserless:** $228-$1,188/year

---

### If You Ever Need to Upgrade:

#### Scenario 1: "We're doing 10,000+ reports/month"
**Solution:** Still use native Playwright, just upgrade Vercel plan
- Vercel Pro: $20/month for higher limits
- Still way cheaper than scraping services

#### Scenario 2: "Sites are blocking us / CAPTCHA challenges"
**Solution:** Use ScrapingBee or ZenRows
- ScrapingBee Freelance: $49/month
- Includes proxy rotation + anti-bot

#### Scenario 3: "We need to scrape Amazon, Google, etc."
**Solution:** Bright Data Scraping Browser
- $500+/month
- Only option that reliably works on heavily protected sites

#### Scenario 4: "We want scheduled scraping + data pipelines"
**Solution:** Apify Platform
- $49-$499/month depending on volume
- Full infrastructure included

---

## Performance Comparison Table

| Service | Cost/Month | Scrapes/Month | Concurrent | Anti-Bot | Proxy |
|---------|-----------|---------------|------------|----------|-------|
| **Playwright (Vercel)** | **$0** | **Unlimited*** | **Unlimited** | ❌ | ❌ |
| Browserless Hobby | $0 | Unlimited* | 2 | ❌ | ❌ |
| Browserless Starter | $19 | Unlimited* | 5 | ❌ | ❌ |
| ScrapingBee Freelance | $49 | ~15,000 | Unlimited | ✅ | ✅ |
| ZenRows Starter | $49 | ~50,000 | Unlimited | ✅ | ✅ |
| Bright Data | $500+ | Pay-per-use | Unlimited | ✅✅✅ | ✅✅✅ |
| Apify Starter | $49 | ~10,000 | Unlimited | ✅ | ✅ |

**Unlimited = Limited by Vercel function limits (very high)*

---

## Migration Effort

If you ever need to switch:

### From Playwright → ScrapingBee:
**Effort:** 2-3 hours
**Code changes:** Minimal (replace browser launch with API call)

### From Playwright → Bright Data:
**Effort:** 3-4 hours
**Code changes:** Moderate (different connection method)

### From Playwright → Apify:
**Effort:** 1-2 days
**Code changes:** Major (rewrite as Apify Actor)

---

## Current Recommendation: Stick with Playwright

**Why:**
1. ✅ FREE (save $228-$1,188/year)
2. ✅ Already working perfectly
3. ✅ Unlimited concurrent sessions
4. ✅ Fast (no network overhead)
5. ✅ Reliable (no external dependency)
6. ✅ Simple (no API keys to manage)

**When to switch:**
- Only if you start getting blocked by sites (unlikely for business sites)
- Only if you need >100,000 scrapes/month (then cost-benefit favors paid service)

For now: **Keep using Playwright. It's perfect for your needs.**

---

## Bottom Line

| Your Needs | Best Solution | Cost |
|------------|--------------|------|
| <10,000 scrapes/month, business sites | **Native Playwright** | **$0** |
| 10,000-100,000 scrapes/month, some anti-bot | **ScrapingBee** | $49-$99 |
| 100,000+ scrapes/month, heavy anti-bot | **Bright Data** | $500+ |
| Full scraping infrastructure + scheduling | **Apify** | $49-$499 |

**Current choice: Playwright (FREE, unlimited) ✅**
