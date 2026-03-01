# BrandProbe.io — Phase 0 Final Lockdown Document

## Date: March 1, 2026 | Status: LOCKED — No More Thinking, Start Building

---

## 1. IDENTITY

| Decision | Locked Answer |
|----------|--------------|
| Product Name | **BrandProbe** |
| Domain | **brandprobe.io** |
| One-Line Pitch | "Paste your website. Know why you're not growing in 60 seconds." |
| Category | Marketing Intelligence (diagnosis, not execution) |
| Target User | Founders, solopreneurs, SMBs |
| What it IS | A marketing Brain — strategic intelligence that sits ABOVE execution tools |
| What it IS NOT | Not a content writer, not a scheduler, not a CRM, not an SEO crawler, not an ads manager |

---

## 2. USER FLOW

```
1. User lands on brandprobe.io
2. Sees: "Paste your website. Know why you're not growing in 60 seconds."
3. Enters URL + email address
4. Waits 30-60 seconds (animated progress: "Probing your brand...")
5. Gets report with 6 sections:
   ✅ Section 1: Messaging & Positioning Analysis — FREE
   ✅ Section 2: SEO & Content Opportunities — FREE
   🔒 Section 3: Content Strategy Recommendations — LOCKED
   🔒 Section 4: Ad Angle Suggestions — LOCKED
   🔒 Section 5: Conversion Optimization — LOCKED
   🔒 Section 6: Distribution Strategy Brief — LOCKED
6. All sections show scores. Locked sections show blurred preview + "Unlock Full Report"
7. User pays $29/mo → instant unlock + 9 more reports this month
8. Report has unique URL for bookmarking/sharing
9. Paid users get automatic monthly re-scan with progress tracking
```

---

## 3. MONETIZATION

| Plan | Price | Includes |
|------|-------|---------|
| Free | $0 | 1 report ever per email. Sections 1-2 fully visible. Sections 3-6 blurred with scores shown. |
| Paid | $29/mo | 10 full reports/month. All 6 sections unlocked. Monthly auto re-scan + progress tracking. Cancel anytime. |

**Critical design decision:** All 6 sections are generated for EVERY report, including free users. The paywall is FRONTEND ONLY (blurred display). This means:
- No wasted API calls when users upgrade (report already exists)
- Instant unlock — pay → immediately see full report
- Simpler backend — no conditional generation logic

---

## 4. RETENTION HOOK — Monthly Re-scan + Progress Tracking

**Why someone pays month 2:** Every month, BrandProbe automatically re-scans the user's primary URL and generates a fresh report. The user gets an email: "Your monthly BrandProbe re-scan is ready. Your messaging score went from 34 to 41."

**How it works:**
- On subscription creation, save the user's first scanned URL as their "primary site" in the `sites` table
- On each billing cycle renewal (or 1st of month), trigger an automatic re-scan via Vercel Cron or Supabase Edge Function
- Generate a fresh full 6-section report linked to the same site
- Send email via Resend with score comparison: "Last month: 34 → This month: 41"
- Report page shows a "Progress" section — simple line chart of overall + section scores over time

**What this adds to the build:**
- `sites` table in database
- `reports` linked to `sites` (not just users)
- Progress comparison component on report page
- Cron job for monthly re-scan
- Email template for "Your re-scan is ready"

**Build priority:** The core re-scan logic can be added in Week 3 polish. The progress UI can be minimal at launch (just show previous score vs current score — no fancy charts needed for v1).

---

## 5. REPORT STRUCTURE — 6 Sections

### Section 1: Messaging & Positioning Analysis ✅ FREE
**Question it answers:** "Is my message clear? Do people understand what I do?"

Covers: headline analysis, value proposition clarity, differentiation signals, CTA analysis, brand voice, key issues, quick wins.

### Section 2: SEO & Content Opportunities ✅ FREE
**Question it answers:** "What keywords am I missing? What should I write about?"

Covers: keyword gap analysis, meta tag review, content gap identification, competitor keyword inference, technical SEO flags, quick wins.

### Section 3: Content Strategy Recommendations 🔒 PAID
**Question it answers:** "What content should I create to stand out?"

Covers: content pillar suggestions, format recommendations, topic clusters, differentiation angles, publishing cadence, platform-specific guidance.

### Section 4: Ad Angle Suggestions 🔒 PAID
**Question it answers:** "What hooks and angles would work for paid ads?"

Covers: ad hook generation, psychological trigger mapping, audience angle variations, headline/copy suggestions, platform-specific creative direction.

### Section 5: Conversion Optimization 🔒 PAID
**Question it answers:** "Where and why am I losing visitors?"

Covers: trust signal audit, CTA optimization, page structure analysis, friction points, social proof assessment, above-fold effectiveness, quick wins.

### Section 6: Distribution Strategy Brief 🔒 PAID
**Question it answers:** "Which channels should I focus on and what tone?"

Covers: channel recommendations (ranked by fit), content-channel mapping, tone/voice per platform, partnership suggestions, distribution quick wins.

---

## 6. SCORING SYSTEM

```
OVERALL SCORE = Average of 6 section scores

Each section scored 0-100 by Claude.

Score Interpretation:
  0-25:   CRITICAL — Major foundational issues
  26-50:  WEAK — Common problems, significant room to improve
  51-70:  DEVELOPING — Foundation exists, specific fixes needed
  71-85:  STRONG — Above average, fine-tuning required
  86-100: EXCELLENT — Top tier marketing

Reality: Most SMB websites score 25-45. That's normal.
The score creates urgency, not demoralization.
```

**All 6 section scores are visible to free users.** They can see they scored 28/100 on Conversion — they just can't see the details of WHY or the specific fixes. This is what drives payment.

---

## 7. TECH STACK

```
Framework:      Next.js 14 (App Router) + TypeScript
Styling:        Tailwind CSS
AI:             Claude API (claude-sonnet-4-5-20250929)
Scraping:       Playwright via Browserless.io (free: 1000 sessions/mo)
Database:       Supabase (PostgreSQL — free tier)
Payments:       Stripe Checkout + Billing
Email:          Resend (free: 3000 emails/mo)
Hosting:        Vercel (free tier → Pro $20/mo if needed for timeouts)
Analytics:      PostHog (free tier)
Domain:         brandprobe.io
```

### Monthly Cost
| Stage | Claude API | Browserless | Hosting | Total |
|-------|-----------|-------------|---------|-------|
| Launch (0-100 users) | ~$15 | Free | Free | ~$15/mo |
| Growing (100-500) | ~$75 | $40/mo | $20/mo | ~$135/mo |
| Scaling (500-2000) | ~$300 | $100/mo | $20/mo | ~$420/mo |

At 100 paying users × $29/mo = $2,900 MRR vs $135/mo cost = 95%+ gross margin.

---

## 8. DATABASE SCHEMA (Updated with Sites + Progress Tracking)

```sql
-- Users (simple email-based)
CREATE TABLE users (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                   TEXT UNIQUE NOT NULL,
  stripe_customer_id      TEXT,
  subscription_status     TEXT DEFAULT 'free',  -- free | active | cancelled | past_due
  subscription_id         TEXT,
  reports_used_this_month INT DEFAULT 0,
  reports_limit           INT DEFAULT 1,        -- 1 for free, 10 for paid
  current_period_start    TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Sites (tracks URLs for re-scanning)
CREATE TABLE sites (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  url               TEXT NOT NULL,
  domain            TEXT NOT NULL,
  is_primary        BOOLEAN DEFAULT false,      -- Primary site for auto re-scan
  first_scanned_at  TIMESTAMPTZ DEFAULT NOW(),
  last_scanned_at   TIMESTAMPTZ,
  total_scans       INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, url)
);

-- Reports (linked to sites for history tracking)
CREATE TABLE reports (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID REFERENCES users(id),
  site_id                   UUID REFERENCES sites(id),
  url                       TEXT NOT NULL,
  status                    TEXT DEFAULT 'scanning',  -- scanning | ready | failed

  -- Scraped data
  scraped_data              JSONB,

  -- Report sections (ALL generated, visibility controlled in frontend)
  messaging_analysis        JSONB,        -- Section 1 (FREE)
  seo_opportunities         JSONB,        -- Section 2 (FREE)
  content_strategy          JSONB,        -- Section 3 (PAID)
  ad_angles                 JSONB,        -- Section 4 (PAID)
  conversion_optimization   JSONB,        -- Section 5 (PAID)
  distribution_strategy     JSONB,        -- Section 6 (PAID)

  -- Scores (ALL visible to free users)
  overall_score             INT,
  messaging_score           INT,
  seo_score                 INT,
  content_score             INT,
  ads_score                 INT,
  conversion_score          INT,
  distribution_score        INT,

  -- Progress tracking
  previous_overall_score    INT,          -- Score from last scan of same site
  score_change              INT,          -- Delta from previous

  -- Meta
  scan_time_ms              INT,
  is_auto_rescan            BOOLEAN DEFAULT false,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- Report views (simple analytics)
CREATE TABLE report_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   UUID REFERENCES reports(id),
  viewed_at   TIMESTAMPTZ DEFAULT NOW(),
  source      TEXT  -- direct | shared | email
);

-- Indexes
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_site ON reports(site_id);
CREATE INDEX idx_reports_url ON reports(url);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_sites_user ON sites(user_id);
CREATE INDEX idx_sites_primary ON sites(user_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);
```

---

## 9. PROJECT STRUCTURE

```
brandprobe/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Landing page (URL input + email)
│   │   ├── report/
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Report display page
│   │   ├── api/
│   │   │   ├── scan/
│   │   │   │   └── route.ts             # POST: URL → scrape → analyze → save
│   │   │   ├── report/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts         # GET: fetch report data
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/
│   │   │   │   │   └── route.ts         # POST: create checkout session
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts         # POST: handle Stripe events
│   │   │   └── cron/
│   │   │       └── rescan/
│   │   │           └── route.ts         # GET: monthly auto re-scan job
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ScoreGauge.tsx               # Circular score visual
│   │   ├── ReportSection.tsx            # Expandable report section
│   │   ├── LockedSection.tsx            # Blurred section + CTA
│   │   ├── ProgressTracker.tsx          # Score comparison (prev vs current)
│   │   ├── ScanningAnimation.tsx        # Loading state
│   │   └── URLInput.tsx                 # Landing page form
│   │
│   ├── lib/
│   │   ├── scraper.ts                   # Playwright scraping logic
│   │   ├── claude.ts                    # Claude API wrapper
│   │   ├── prompts/
│   │   │   ├── system.ts               # Shared system prompt
│   │   │   ├── messaging.ts            # Section 1 prompt
│   │   │   ├── seo.ts                  # Section 2 prompt
│   │   │   ├── content.ts              # Section 3 prompt
│   │   │   ├── adAngles.ts             # Section 4 prompt
│   │   │   ├── conversion.ts           # Section 5 prompt
│   │   │   └── distribution.ts         # Section 6 prompt
│   │   ├── stripe.ts                   # Stripe helpers
│   │   ├── supabase.ts                 # DB client + queries
│   │   ├── email.ts                    # Resend templates
│   │   └── utils.ts                    # URL validation, helpers
│   │
│   └── types/
│       ├── report.ts                   # Report type definitions
│       └── scraper.ts                  # Scraper type definitions
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── public/
│   └── og-image.png
├── .env.local
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 10. SYSTEM PROMPT (Shared Across All 6 Sections)

```typescript
const systemPrompt = `
You are an elite marketing strategist who has consulted for 500+ 
startups and SMBs. You combine the strategic thinking of April Dunford 
(positioning), the conversion expertise of Peep Laja (CXL), and the 
growth mindset of Sean Ellis.

Your job is to analyze a website and provide SPECIFIC, ACTIONABLE, 
BRUTALLY HONEST marketing intelligence.

CRITICAL RULES:
1. NEVER be generic. "Improve your headline" is useless. 
   "Your headline 'We help businesses grow' should be changed to 
   '[Specific alternative]'" is useful.
2. ALWAYS reference specific text from their actual website.
3. SCORE honestly. Most websites are bad at marketing. A 7/10 
   should be genuinely good, not "average."
4. FOCUS on what a founder can do THIS WEEK, not someday.
5. DIFFERENTIATION is the #1 goal. If their messaging sounds 
   like everyone else, that IS the problem.
6. Return ONLY valid JSON. No markdown. No explanation outside JSON.
`;
```

---

## 11. COMPETITOR HANDLING (v1)

In v1, competitors are AI-INFERRED, not scraped:
1. AI analyzes scraped content to infer business niche
2. AI uses training data to identify 3-5 likely competitors
3. AI compares user's messaging against what it knows about those competitors
4. Report clearly states: "Competitors identified by AI analysis. For exact comparison, upgrade to provide competitor URLs directly."

**Why:** Scraping competitors = 4x more Playwright calls = slower + more expensive. AI inference is surprisingly good for most niches. Live competitor scraping becomes a Phase 1 premium feature.

---

## 12. BUILD TIMELINE — 3 Weeks

### WEEK 1: Core Pipeline (Scanner + AI Brain)

**Day 1-2: Project Setup + Scraper Foundation**
```
□ git init brandprobe
□ npx create-next-app@latest brandprobe --typescript --tailwind --app
□ Install: @anthropic-ai/sdk, stripe, @supabase/supabase-js, resend
□ Set up Supabase project → run migration (Section 8 schema)
□ Set up Browserless.io account (free tier)
□ Set up Stripe → create $29/mo subscription product
□ Set up Resend account
□ .env.local with all credentials
□ Deploy empty project to Vercel → confirm deployment works
□ Build Playwright connection to Browserless.io
□ Build homepage scraper (title, meta, h1, h2s, hero, CTAs)
□ Build trust signal detector (testimonials, reviews, badges, pricing)
□ Build social proof extractor
□ Test scraper on 5 websites
```

**Day 3-4: Scraper Robustness + Claude Integration**
```
□ Build nav link extractor → sub-page scraper (top 3 pages)
□ Add timeout handling (30s max total)
□ Add error handling (site down, blocked, SPA)
□ URL validation and normalization
□ Test on 10+ diverse websites
□ Build Claude API wrapper with retry logic
□ Write all 6 section prompts (messaging, seo, content, ads, conversion, distribution)
□ Build JSON response parser with error handling
□ Build parallel execution (Promise.all for 6 sections)
□ Test prompt quality on 5+ websites — iterate until excellent
```

**Day 5: Full Pipeline**
```
□ Build /api/scan endpoint (URL → validate → scrape → analyze → save)
□ Build /api/report/[id] endpoint (fetch report data)
□ Build sites table logic (create site record on first scan)
□ Build previous score lookup (for progress tracking)
□ End-to-end test: submit URL → complete 6-section report in DB
□ Test 10 websites through full pipeline
□ Measure timing — target under 90 seconds (not 60 — be honest)
□ Add 24-hour caching (same URL returns cached report)
```

**Week 1 Deliverable:** Working pipeline — URL in → 6-section report in database.

### WEEK 2: Report UI + Payments

**Day 6-7: Report Display Page**
```
□ Build /report/[id] page
□ ScoreGauge component (visual score ring — overall + per section)
□ ReportSection component (expandable, shows full analysis)
□ LockedSection component (blurred content + "Unlock" CTA)
□ ProgressTracker component (simple: "Last scan: 34 → This scan: 41")
□ ScanningAnimation component (progress screen while scanning)
□ Report status polling (check every 3s until ready)
□ Mobile responsive design
```

**Day 8-9: Landing Page**
```
□ Hero: headline + sub-headline + URL input + email field
□ "How It Works" — 3 steps (Paste URL → We Probe → You Act)
□ "What You Get" — preview of 6 report sections
□ Social proof section (placeholder — update with real testimonials post-launch)
□ FAQ section
□ Footer
□ Make it look GREAT — this is your first impression
```

**Day 10: Stripe Integration**
```
□ /api/stripe/checkout endpoint → create checkout session
□ /api/stripe/webhook endpoint → handle subscription events
□ Handle: subscription activated → unlock reports
□ Handle: subscription cancelled → revert to free
□ Handle: payment failed → flag account
□ Test full payment flow (Stripe test mode)
□ Post-payment redirect back to now-unlocked report
```

**Day 11: User System + Limits**
```
□ Email-based user tracking (no complex auth for v1)
□ Free tier: 1 report ever per email
□ Paid tier: 10 reports/month
□ Report limit enforcement
□ "Unlock" button → Stripe checkout
□ Sites table: mark first scanned URL as primary (is_primary = true)
```

**Week 2 Deliverable:** Complete web app — scan, view report, pay, unlock.

### WEEK 3: Polish + Retention + Launch

**Day 12: Monthly Re-scan + Progress**
```
□ Build /api/cron/rescan endpoint
□ Logic: find all active subscribers → find their primary site → trigger re-scan
□ After re-scan: calculate score_change and previous_overall_score
□ Send "Your monthly BrandProbe is ready" email via Resend
□ Email includes: old score → new score, link to report
□ Set up Vercel Cron to run on 1st of each month
□ Test full re-scan flow manually
```

**Day 13: Edge Cases + Error Handling**
```
□ Handle: website down / unreachable
□ Handle: scraping blocked (403, captcha)
□ Handle: SPA with no server-rendered content
□ Handle: Claude returns malformed JSON
□ Handle: Claude rate limiting
□ Handle: duplicate URL submission
□ Handle: payment failure mid-flow
□ Rate limiting on /api/scan (prevent abuse)
□ Input sanitization (prevent XSS via URL)
□ Loading states, empty states, error states everywhere
```

**Day 14: SEO + Analytics + Launch Prep**
```
□ Meta tags for all pages (title, description, OG, Twitter cards)
□ Dynamic OG image for report pages ("example.com scored 34/100")
□ PostHog analytics setup
□ Track: page views, scans started, reports completed, unlock clicks, payments
□ robots.txt + sitemap.xml
□ Google Search Console setup
□ Write launch copy (Reddit, LinkedIn, X, IndieHackers)
□ Create demo GIF / Loom video (60s showing the flow)
□ Stripe live mode
□ Final end-to-end test in production
```

**Day 15: LAUNCH 🚀**
```
Morning:
□ Deploy final version to production
□ Verify everything on brandprobe.io
□ Post on Reddit (r/SaaS first)
□ Post on LinkedIn (personal brand)
□ Post on X/Twitter

Afternoon:
□ Post on IndieHackers
□ Submit to Product Hunt (schedule for Monday)
□ Monitor and respond to EVERY comment
□ Track: scans, completions, signups, payments
□ Fix any production issues immediately
```

---

## 13. LAUNCH COPY

### Landing Page

**Headline:** "Paste your website. Know why you're not growing in 60 seconds."

**Sub-headline:** "BrandProbe analyzes your positioning, finds your content gaps, detects conversion leaks, and tells you exactly what to do this week."

### Reddit Post
```
Title: I built a free tool that tells you why your website isn't 
converting (not another SEO audit)

Most website audit tools check technical stuff — page speed, 
broken links, meta tags. But they don't answer the real question:

"Why am I not growing?"

So I built BrandProbe. You paste your URL and in 60 seconds 
you get:

• Positioning Analysis — is your message clear? Is your value 
  prop specific or generic? (This one's free)
• SEO & Content Gaps — what you're missing (Also free)
• Content Strategy — what to write and where to publish
• Ad Angles — hooks and creative angles based on psych triggers
• Conversion Leak Report — where and why visitors leave
• Distribution Brief — which channels, what tone, what to do first

The first 2 sections are free. Full report is $29/mo 
(includes re-scanning your site monthly to track progress 
and auditing competitor sites too).

Would love this community's feedback: brandprobe.io

P.S. Yes, I ran it on my own site. I scored 38/100. 
Humbling but helpful.
```

---

## 14. VALIDATION GATE — Do NOT Build Phase 1 Until

| Metric | Target | Why |
|--------|--------|-----|
| Total scans | 200+ | Proves people find it and try it |
| Report completion rate | 85%+ | Proves pipeline is reliable |
| Email capture rate | 90%+ | Required for scan anyway |
| Time on report page | 3+ min avg | Proves report is valuable |
| Free → Paid conversion | 5%+ | Proves willingness to pay |
| Paying users | 10+ | Proves revenue model |
| Month-2 retention | 60%+ | Proves re-scan hook works |

**If gate NOT hit:** Do NOT add features. Instead:
- Low scans → distribution problem → improve launch marketing
- Low completion → technical problem → fix scraper reliability
- Low time on page → quality problem → improve prompts
- Low conversion → value problem → improve locked section teasers
- Low retention → re-scan not compelling → improve progress email/UI

---

## 15. DECISIONS — ALL LOCKED

| Decision | Answer | Do Not Revisit |
|----------|--------|----------------|
| Product name | BrandProbe | ✅ |
| Domain | brandprobe.io | ✅ |
| Report structure | 6 sections | ✅ |
| Free sections | 1 (Messaging) + 2 (SEO) | ✅ |
| Paid sections | 3 (Content) + 4 (Ads) + 5 (Conversion) + 6 (Distribution) | ✅ |
| Scores visible to free users | Yes — all 6 scores shown, details locked | ✅ |
| All sections generated for all users | Yes — paywall is frontend only | ✅ |
| Pricing | $29/mo for 10 reports | ✅ |
| Retention hook | Monthly auto re-scan + progress tracking | ✅ |
| Competitor handling | AI-inferred in v1, live scraping in Phase 1 | ✅ |
| Auth system | Email-based (no complex auth for v1) | ✅ |
| Tech stack | Next.js + Claude + Playwright + Supabase + Stripe | ✅ |
| Hosting | Vercel | ✅ |
| Scan time promise | "About 60 seconds" (realistic: 60-90s) | ✅ |

---

## 16. THE ONE RULE

**Build insight first, automation later.**

BrandProbe Phase 0 is a diagnosis tool. It tells founders what's wrong. It does NOT fix anything for them. That's the product for Phase 3+.

The only thing that matters in March 2026: Can 200 people paste their URL and find the report useful enough that 10 of them pay $29/month?

Everything else is a distraction.

---

*Document locked: March 1, 2026*
*Next action: git init brandprobe*
