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
| Analysis Modes | **Quick** (1 page, 30s) OR **Full** (4 pages, 60s) — user choice |
| Major Brand Support | Hybrid recognition: instant for top 30 brands + dynamic detection for others |

---

## 2. USER FLOW

```
1. User lands on brandprobe.io
2. Sees: "Paste your website. Know why you're not growing in 60 seconds."
3. Enters URL + email address + (OPTIONAL) selects Quick vs Full analysis
4. Waits 30-60 seconds (animated progress: "Probing your brand...")
5. Gets report with 10 sections (6 free, 4 locked):
   ✅ Section 1: Messaging & Positioning Analysis — FREE
   ✅ Section 2: SEO & Content Opportunities — FREE
   ✅ Section 3: Content Strategy Recommendations — FREE
   ✅ Section 4: Ad Angle Suggestions — FREE
   ✅ Section 5: Conversion Optimization — FREE
   ✅ Section 6: Distribution Strategy Brief — FREE
   🔒 Section 7: AI Search Visibility — LOCKED
   🔒 Section 8: Technical Performance — LOCKED
   🔒 Section 9: Brand Health — LOCKED
   🔒 Section 10: Design Authenticity — LOCKED
6. All sections show scores. Locked sections show blurred preview + "Unlock Full Report"
7. User pays $29/mo → instant unlock + 9 more reports this month
8. Report has unique URL for bookmarking/sharing
9. Paid users get automatic monthly re-scan with progress tracking
10. Major brands (Facebook, LinkedIn, Apple) routed to public pages with baseline scores (88-95)
```

---

## 3. MONETIZATION

| Plan | Price | Includes |
|------|-------|---------|
| Free | $0 | 1 report ever per email. Sections 1-6 fully visible. Sections 7-10 blurred with scores shown. |
| Paid | $29/mo | 10 full reports/month. All 10 sections unlocked. Monthly auto re-scan + progress tracking. Cancel anytime. |

**Critical design decision:** All 10 sections are generated for EVERY report, including free users. The paywall is FRONTEND ONLY (blurred display). This means:
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

## 5. MULTI-PAGE ANALYSIS STRATEGY

### Analysis Modes

BrandProbe supports two analysis depths to meet different user needs:

| Mode | Pages | Time | Best For |
|------|-------|------|----------|
| **Quick Scan** | 1 page | 30s | Landing page optimization, quick checks, A/B testing single pages |
| **Full Website** | 4 pages | 60s | Comprehensive brand analysis, brand health assessment, cross-page consistency (DEFAULT) |

**Backend Implementation:** Both modes fully implemented. Frontend toggle optional (defaults to Full if not selected).

### Intelligent Page Selection (Full Mode)

Instead of randomly selecting pages, BrandProbe uses a three-tier strategy:

#### Tier 1: Major Brand Routing (Top 30 Brands)
For major brands with login walls (Facebook, LinkedIn, Apple, etc.):
- **Instant Recognition:** Domain matched against curated list (0ms)
- **Smart Routing:** Redirects to public-accessible pages
  - Example: `facebook.com` → `facebook.com/business`, `facebook.com/business/marketing`, `facebook.com/business/ads`, `about.meta.com`
- **Baseline Scores:** Minimum scores applied (88-95) to ensure fair assessment

#### Tier 2: Sitemap Intelligence (Sites with sitemap.xml)
For sites with sitemap.xml:
- **Fetches:** sitemap.xml (5-second timeout)
- **Scoring Algorithm:** Priority (0-10) + Pattern match (+20 for /about, /pricing) + Recency (+10 if updated in 30 days) - Depth penalty (-2 per level)
- **Metadata Extraction:** Total pages, blog count, product count, content freshness, URL quality
- **Best Pages:** Selects top 3 pages based on scoring + homepage

#### Tier 3: Navigation Fallback (Default)
For sites without sitemap:
- **Current Method:** Extracts nav links, prioritizes /about, /pricing, /features, /product, /solutions
- **Top 3 Pages:** Selected from navigation + homepage

### Hybrid Brand Recognition System

**Fast Path (Instant - 0ms):**
- Curated list of top 30 brands (Facebook, LinkedIn, Apple, Google, Microsoft, Amazon, Netflix, Shopify, Stripe, Notion, Figma, Slack, Zoom, Spotify, Adobe, Salesforce, HubSpot, Mailchimp, Canva, Dropbox, Airbnb, Uber, Tesla, Nike, Adidas, Coca-Cola, McDonald's, Starbucks, IBM, Oracle)
- Pre-configured public URLs to bypass login walls
- Pre-set baseline scores (88-95 range)

**Slow Path (Dynamic - 2-5s):**
For unknown domains, multi-signal detection:
1. **Domain Age:** DNS-based heuristic (15+ years = likely major brand)
2. **CDN Detection:** Cloudflare, Akamai, Fastly headers (enterprise signal)
3. **Security Headers:** HSTS, CSP (enterprise security practices)
4. **Subdomain Count:** crt.sh certificate transparency logs (20+ subdomains = large org)
5. **Wikipedia Page:** Existence check (strong notability signal)
6. **Scoring:** Combines signals to calculate confidence (high/medium/low)

**Caching:**
- Results stored in `brand_recognition_cache` table
- 30-day TTL (expires_at)
- Tracks hit count for analytics
- Gradual improvement as cache grows

**Why Hybrid?**
- Best of both worlds: Speed for known brands + scalability for new ones
- No manual updates needed beyond initial 30
- Global coverage (discovers regional brands dynamically)

---

## 6. REPORT STRUCTURE — 10 Sections

### Section 1: Messaging & Positioning Analysis ✅ FREE
**Question it answers:** "Is my message clear? Do people understand what I do?"

Covers: headline analysis, value proposition clarity, differentiation signals, CTA analysis, brand voice, key issues, quick wins.

### Section 2: SEO & Content Opportunities ✅ FREE
**Question it answers:** "What keywords am I missing? What should I write about?"

Covers: keyword gap analysis, meta tag review, content gap identification, competitor keyword inference, technical SEO flags, sitemap metadata (pages, blog count, freshness), quick wins.

### Section 3: Content Strategy Recommendations ✅ FREE
**Question it answers:** "What content should I create to stand out?"

Covers: content pillar suggestions, format recommendations, topic clusters, differentiation angles, publishing cadence, platform-specific guidance.

### Section 4: Ad Angle Suggestions ✅ FREE
**Question it answers:** "What hooks and angles would work for paid ads?"

Covers: ad hook generation, psychological trigger mapping, audience angle variations, headline/copy suggestions, platform-specific creative direction.

### Section 5: Conversion Optimization ✅ FREE
**Question it answers:** "Where and why am I losing visitors?"

Covers: trust signal audit, CTA optimization, page structure analysis, friction points, social proof assessment, above-fold effectiveness, quick wins.

### Section 6: Distribution Strategy Brief ✅ FREE
**Question it answers:** "Which channels should I focus on and what tone?"

Covers: channel recommendations (ranked by fit), content-channel mapping, tone/voice per platform, partnership suggestions, distribution quick wins.

### Section 7: AI Search Visibility 🔒 PAID
**Question it answers:** "Will AI assistants (ChatGPT, Claude, Perplexity) recommend my brand?"

Covers: citation readiness, semantic authority, structured data for AI, FAQ optimization, brand entity signals, AI-friendly content format.

### Section 8: Technical Performance 🔒 PAID
**Question it answers:** "Are technical issues killing my SEO and conversions?"

Covers: SSL, structured data (Schema.org), meta tags quality, image optimization, link health, mobile responsiveness signals, technical quick wins.

### Section 9: Brand Health 🔒 PAID
**Question it answers:** "How strong is my brand positioning and consistency?"

Covers: brand consistency analysis (across multiple pages), positioning clarity, trust and credibility signals, competitive differentiation strength, brand voice authenticity.

### Section 10: Design Authenticity 🔒 PAID
**Question it answers:** "Does my design look unique or generic?"

Covers: visual uniqueness assessment, design pattern analysis, authenticity vs template detection, screenshot-based visual review, design improvement recommendations.

---

## 6A. REPORT SECTION COLORS & VISUAL IDENTITY

Each section uses distinct color schemes for visual differentiation and brand consistency:

### Section Color Mapping

| Section | Primary Color | Usage | Rationale |
|---------|--------------|-------|-----------|
| **Messaging & Positioning** | Default/Gray | Standard card | Foundation section, neutral tone |
| **SEO & Content** | Default/Gray | Standard card | Objective analysis, professional |
| **Content Strategy** | Default/Gray | Standard card | Strategic planning, clear focus |
| **Ad Angles** | Default/Gray | Standard card | Creative but professional |
| **Conversion Optimization** | Green | Quick wins, success states | Growth-focused, action-oriented |
| **Distribution Strategy** | Default/Gray | Standard card | Multi-channel strategy |
| **AI Search Visibility** | Indigo | Primary theme, highlights | Modern AI technology focus |
| **Technical Performance** | Blue/Yellow/Red | Status indicators | Technical metrics: Blue (info), Yellow (warnings), Red (errors), Green (success) |
| **Brand Health** | Blue/Purple/Indigo | Analysis sections | Trust, authority, brand strength |
| **Design Authenticity** | Red/Yellow/Blue/Purple/Green | Multi-status | Red (issues), Yellow (clichés), Blue (originality), Purple (patterns), Green (strengths) |

### Color Psychology

- **Green** (`bg-green-50`, `text-green-700`): Success, growth, quick wins, positive actions
- **Blue** (`bg-blue-50`, `text-blue-700`): Trust, information, technical details
- **Indigo** (`bg-indigo-50`, `text-indigo-700`): Modern, AI/tech-forward, innovation
- **Purple** (`bg-purple-50`, `text-purple-700`): Premium, brand authority, creativity
- **Yellow** (`bg-yellow-50`, `text-yellow-700`): Warnings, attention needed, clichés
- **Red** (`bg-red-50`, `text-red-700`): Critical issues, errors, immediate action required

### Badge Colors

- **Score Labels:** Black (`bg-gray-900 text-white`) - High contrast, clear hierarchy
- **Locked Sections:** Gray (`bg-gray-100 text-gray-600`) - Subdued, non-intrusive
- **Action Priority:** Green (`bg-green-600 text-white`) - High priority quick wins
- **Technical Status:**
  - Pass: Green (`bg-green-100 text-green-600`)
  - Warning: Yellow (`bg-yellow-100 text-yellow-600`)
  - Fail: Red (`bg-red-100 text-red-600`)

### Design System Consistency

All sections follow these design patterns:
- **Card Background:** White (`bg-white`) with subtle border (`border-gray-200`)
- **Hover State:** Light gray (`hover:bg-gray-50`)
- **Section Backgrounds:** 50-shade with matching 100-border (e.g., `bg-blue-50 border-blue-100`)
- **Text Hierarchy:**
  - Primary: `text-gray-900` (headings)
  - Secondary: `text-gray-600` (body)
  - Tertiary: `text-gray-500` (captions)
- **Border Radius:** Consistent rounded corners (`rounded-lg`, `rounded-xl`)

---

## 7. SCORING SYSTEM

```
OVERALL SCORE = Average of 10 section scores

Each section scored 0-100 by AI (Claude via Groq with consolidated prompts).

Score Interpretation:
  0-25:   CRITICAL — Major foundational issues
  26-50:  WEAK — Common problems, significant room to improve
  51-70:  DEVELOPING — Foundation exists, specific fixes needed
  71-85:  STRONG — Above average, fine-tuning required
  86-100: EXCELLENT — Top tier marketing

Reality: Most SMB websites score 25-45. That's normal.
Major brands (Facebook, LinkedIn, Apple) score 88-95 with baseline application.
The score creates urgency, not demoralization.
```

**All 10 section scores are visible to free users.** They can see they scored 28/100 on Conversion — they just can't see the details of WHY or the specific fixes. This is what drives payment.

### Brand Baseline Scores (for Major Brands)

When analyzing major brands (detected via hybrid recognition), baseline scores are applied using `Math.max(aiScore, baselineScore)`:
- **Facebook/LinkedIn:** Technical: 95, Brand Health: 95, Messaging: 88, Design: 85
- **Apple:** Technical: 98, Brand Health: 95, Messaging: 92, Design: 90
- **Google/Microsoft:** Technical: 96, Brand Health: 92, Messaging: 90, Design: 88

This ensures fair scoring when login walls or redirects block content scraping.

---

## 8. TECH STACK

```
Framework:      Next.js 16.1.6 (App Router) + TypeScript
Styling:        Tailwind CSS
AI:             Primary: Groq (llama-3.3-70b-versatile) via consolidated prompts
                Fallback: Claude API (claude-sonnet-4-5-20250929)
                Mode: 2 parallel API calls for efficiency
Scraping:       Playwright via Browserless.io (free: 1000 sessions/mo)
                Modes: Quick (1 page, 30s) OR Full (4 pages, 60s)
                Intelligence: Sitemap.xml parsing + brand routing
Database:       Supabase (PostgreSQL — free tier with local dev)
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

## 9. DATABASE SCHEMA (Updated with Sites + Progress Tracking + Analysis Type + Brand Cache)

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
  content_strategy          JSONB,        -- Section 3 (FREE)
  ad_angles                 JSONB,        -- Section 4 (FREE)
  conversion_optimization   JSONB,        -- Section 5 (FREE)
  distribution_strategy     JSONB,        -- Section 6 (FREE)
  ai_search_visibility      JSONB,        -- Section 7 (PAID)
  technical_performance     JSONB,        -- Section 8 (PAID)
  brand_health              JSONB,        -- Section 9 (PAID)
  design_authenticity       JSONB,        -- Section 10 (PAID)

  -- Scores (ALL visible to free users)
  overall_score             INT,
  messaging_score           INT,
  seo_score                 INT,
  content_score             INT,
  ads_score                 INT,
  conversion_score          INT,
  distribution_score        INT,
  ai_search_score           INT,
  technical_score           INT,
  brand_health_score        INT,
  design_authenticity_score INT,

  -- Progress tracking
  previous_overall_score    INT,          -- Score from last scan of same site
  score_change              INT,          -- Delta from previous

  -- Analysis metadata (NEW)
  analysis_type             TEXT DEFAULT 'full',  -- 'quick' | 'full'
  pages_analyzed            INT,          -- Actual pages scraped

  -- Meta
  scan_time_ms              INT,
  is_auto_rescan            BOOLEAN DEFAULT false,
  created_at                TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_analysis_type CHECK (analysis_type IN ('quick', 'full'))
);

-- Brand Recognition Cache (NEW)
CREATE TABLE brand_recognition_cache (
  domain              TEXT PRIMARY KEY,
  is_major_brand      BOOLEAN NOT NULL,
  confidence          TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  signals             JSONB NOT NULL DEFAULT '[]'::jsonb,
  baseline_scores     JSONB,
  suggested_urls      TEXT[],
  cached_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  hits                INT DEFAULT 0,
  last_hit_at         TIMESTAMPTZ
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
CREATE INDEX idx_reports_analysis_type ON reports(analysis_type);
CREATE INDEX idx_sites_user ON sites(user_id);
CREATE INDEX idx_sites_primary ON sites(user_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);
CREATE INDEX idx_brand_cache_expires ON brand_recognition_cache(expires_at);
CREATE INDEX idx_brand_cache_major_brands ON brand_recognition_cache(is_major_brand) WHERE is_major_brand = true;
```

---

## 10. PROJECT STRUCTURE

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
│   │   │   │   └── route.ts             # POST: URL → scrape → analyze → save (with analysis type)
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
│   │   ├── URLInput.tsx                 # Landing page form (with Quick/Full toggle - optional)
│   │   ├── MessagingCard.tsx            # Section 1 card
│   │   ├── SEOCard.tsx                  # Section 2 card
│   │   ├── ContentCard.tsx              # Section 3 card
│   │   ├── AdAnglesCard.tsx             # Section 4 card
│   │   ├── ConversionCard.tsx           # Section 5 card
│   │   ├── DistributionCard.tsx         # Section 6 card
│   │   ├── AISearchCard.tsx             # Section 7 card (NEW)
│   │   ├── TechnicalCard.tsx            # Section 8 card (NEW)
│   │   ├── BrandHealthCard.tsx          # Section 9 card (NEW)
│   │   └── DesignAuthenticityCard.tsx   # Section 10 card (NEW)
│   │
│   ├── lib/
│   │   ├── scraper.ts                   # Playwright scraping logic (Quick/Full + brand routing + sitemap)
│   │   ├── sitemap-parser.ts            # Sitemap.xml fetching and intelligent page selection (NEW)
│   │   ├── brand-recognizer.ts          # Hybrid brand recognition (instant + dynamic) (NEW)
│   │   ├── technical-analyzer.ts        # Rules-based technical performance analysis (NEW)
│   │   ├── ai.ts                        # AI wrapper (Groq primary, Claude fallback) + baseline application
│   │   ├── prompts/
│   │   │   ├── consolidated.ts         # Consolidated prompts (2 parallel API calls) (NEW)
│   │   │   ├── system.ts               # Shared system prompt
│   │   │   ├── messaging.ts            # Section 1 prompt
│   │   │   ├── seo.ts                  # Section 2 prompt
│   │   │   ├── content.ts              # Section 3 prompt
│   │   │   ├── adAngles.ts             # Section 4 prompt
│   │   │   ├── conversion.ts           # Section 5 prompt
│   │   │   ├── distribution.ts         # Section 6 prompt
│   │   │   ├── aiSearch.ts             # Section 7 prompt (NEW)
│   │   │   └── brandHealth.ts          # Section 9 prompt (NEW)
│   │   ├── stripe.ts                   # Stripe helpers
│   │   ├── supabase.ts                 # DB client + queries (updated with new fields)
│   │   ├── email.ts                    # Resend templates
│   │   └── utils.ts                    # URL validation, helpers
│   │
│   └── types/
│       ├── report.ts                   # Report type definitions (with SitemapMetadata)
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

## 11. SYSTEM PROMPT (Shared Across All Sections)

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

## 12. COMPETITOR HANDLING (v1)

In v1, competitors are AI-INFERRED, not scraped:
1. AI analyzes scraped content to infer business niche
2. AI uses training data to identify 3-5 likely competitors
3. AI compares user's messaging against what it knows about those competitors
4. Report clearly states: "Competitors identified by AI analysis. For exact comparison, upgrade to provide competitor URLs directly."

**Why:** Scraping competitors = 4x more Playwright calls = slower + more expensive. AI inference is surprisingly good for most niches. Live competitor scraping becomes a Phase 1 premium feature.

---

## 13. BUILD TIMELINE — 3 Weeks

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

## 14. LAUNCH COPY

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

## 15. VALIDATION GATE — Do NOT Build Phase 1 Until

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

## 16. DECISIONS — ALL LOCKED

| Decision | Answer | Do Not Revisit |
|----------|--------|----------------|
| Product name | BrandProbe | ✅ |
| Domain | brandprobe.io | ✅ |
| Report structure | 10 sections (6 free, 4 locked) | ✅ |
| Free sections | 1-6 (Messaging, SEO, Content, Ads, Conversion, Distribution) | ✅ |
| Paid sections | 7-10 (AI Search, Technical, Brand Health, Design Authenticity) | ✅ |
| Scores visible to free users | Yes — all 10 scores shown, details locked for 7-10 | ✅ |
| All sections generated for all users | Yes — paywall is frontend only | ✅ |
| Pricing | $29/mo for 10 reports | ✅ |
| Retention hook | Monthly auto re-scan + progress tracking | ✅ |
| Competitor handling | AI-inferred in v1, live scraping in Phase 1 | ✅ |
| Auth system | Email-based (no complex auth for v1) | ✅ |
| Tech stack | Next.js + Groq/Claude + Playwright + Supabase + Stripe | ✅ |
| Hosting | Vercel | ✅ |
| Scan time promise | "About 60 seconds" (realistic: 60-90s) | ✅ |
| Analysis modes | Quick (1 page, 30s) OR Full (4 pages, 60s) | ✅ |
| Page selection | Sitemap intelligence + brand routing + nav fallback | ✅ |
| Brand recognition | Hybrid (30 instant + dynamic detection + 30-day cache) | ✅ |
| Brand baseline scores | 88-95 for major brands (Facebook, LinkedIn, Apple, etc.) | ✅ |

---

## 17. THE ONE RULE

**Build insight first, automation later.**

BrandProbe Phase 0 is a diagnosis tool. It tells founders what's wrong. It does NOT fix anything for them. That's the product for Phase 3+.

The only thing that matters in March 2026: Can 200 people paste their URL and find the report useful enough that 10 of them pay $29/month?

Everything else is a distraction.

---

## 18. SHOWCASE & PROMOTION FEATURE

### Purpose
Allow analyzed websites/applications to be showcased on BrandProbe, creating a discovery platform where:
1. **Users benefit:** Get exposure and promotion for their websites
2. **BrandProbe benefits:** More organic traffic, social proof, and content
3. **Visitors benefit:** Discover and explore real website analyses

### Phase Strategy
| Phase | Who Gets Showcased | Priority |
|-------|-------------------|----------|
| **Phase 1 (Now)** | All users (free + paid) who opt-in | Equal visibility |
| **Phase 2 (Later)** | Paid users get priority placement | Featured sections for paid |
| **Phase 3 (Future)** | Paid-only featured spots, free in general listing | Premium showcase tiers |

---

### 18.1 DATABASE SCHEMA CHANGES

```sql
-- Add showcase fields to reports table
ALTER TABLE reports ADD COLUMN showcase_enabled BOOLEAN DEFAULT false;
ALTER TABLE reports ADD COLUMN showcase_approved BOOLEAN DEFAULT false;  -- Admin approval for quality
ALTER TABLE reports ADD COLUMN showcase_rank INT DEFAULT 0;  -- For sorting (higher = better placement)
ALTER TABLE reports ADD COLUMN showcase_featured BOOLEAN DEFAULT false;  -- Manual feature flag
ALTER TABLE reports ADD COLUMN showcase_featured_at TIMESTAMPTZ;
ALTER TABLE reports ADD COLUMN showcase_views INT DEFAULT 0;  -- Track showcase-specific views
ALTER TABLE reports ADD COLUMN showcase_clicks INT DEFAULT 0;  -- Track click-throughs

-- Showcase profile for customization
CREATE TABLE showcase_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id         UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id),

  -- Display Information (user-editable)
  display_name      TEXT,                    -- App/Company name (default: extracted from site)
  tagline           TEXT,                    -- Short description (max 120 chars)
  description       TEXT,                    -- Longer description (max 500 chars)
  icon_url          TEXT,                    -- App icon URL (default: favicon)
  screenshot_url    TEXT,                    -- Hero screenshot (default: scraped screenshot)
  category          TEXT,                    -- Business category (SaaS, E-commerce, Agency, etc.)

  -- Auto-extracted defaults (populated from report)
  default_name      TEXT,                    -- Auto-extracted from scraped data
  default_tagline   TEXT,                    -- Auto-extracted headline/value prop
  default_icon_url  TEXT,                    -- Favicon from site

  -- Social links (optional)
  website_url       TEXT NOT NULL,           -- The analyzed URL
  twitter_url       TEXT,
  linkedin_url      TEXT,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(report_id)
);

-- User showcase preferences
ALTER TABLE users ADD COLUMN showcase_opt_in_global BOOLEAN DEFAULT false;  -- Global preference
ALTER TABLE users ADD COLUMN showcase_notifications BOOLEAN DEFAULT true;    -- Notify on views/features

-- Indexes for showcase queries
CREATE INDEX idx_reports_showcase ON reports(showcase_enabled, showcase_approved)
  WHERE showcase_enabled = true AND showcase_approved = true;
CREATE INDEX idx_reports_showcase_rank ON reports(showcase_rank DESC)
  WHERE showcase_enabled = true;
CREATE INDEX idx_reports_showcase_featured ON reports(showcase_featured, showcase_featured_at DESC)
  WHERE showcase_featured = true;
CREATE INDEX idx_showcase_profiles_category ON showcase_profiles(category);
CREATE INDEX idx_showcase_profiles_user ON showcase_profiles(user_id);
```

---

### 18.2 RANKING ALGORITHM

Showcase ranking determines visibility on the homepage and showcase page:

```typescript
// Ranking factors and weights
const calculateShowcaseRank = (report: Report, profile: ShowcaseProfile, user: User): number => {
  let rank = 0;

  // Base score (0-100 points) - Quality indicator
  rank += report.overall_score;

  // Paid user bonus (+50 points) - Phase 2+
  if (user.subscription_status === 'active') {
    rank += 50;
  }

  // Profile completeness (+30 points max)
  if (profile.display_name) rank += 5;
  if (profile.tagline) rank += 5;
  if (profile.description) rank += 10;
  if (profile.icon_url && profile.icon_url !== profile.default_icon_url) rank += 5;
  if (profile.category) rank += 5;

  // Engagement bonus (+20 points max)
  rank += Math.min(profile.showcase_views / 100, 10);  // Up to 10 points for views
  rank += Math.min(profile.showcase_clicks / 50, 10);  // Up to 10 points for clicks

  // Recency bonus (+20 points, decays over 30 days)
  const daysSinceCreated = daysSince(report.created_at);
  rank += Math.max(0, 20 - (daysSinceCreated * 0.67));

  // Featured bonus (+100 points) - Admin-controlled
  if (report.showcase_featured) {
    rank += 100;
  }

  return Math.round(rank);
};
```

**Ranking Update Triggers:**
- On report creation (if auto-showcase enabled)
- On profile update
- Daily cron job to refresh engagement-based rankings
- On admin feature/unfeature action

---

### 18.3 SHOWCASE CATEGORIES

Predefined categories for filtering and organization:

| Category | Examples |
|----------|----------|
| **SaaS** | Software products, web apps |
| **E-commerce** | Online stores, marketplaces |
| **Agency** | Marketing, design, dev agencies |
| **Portfolio** | Personal sites, freelancer portfolios |
| **Startup** | Early-stage companies |
| **Blog/Media** | Content sites, publications |
| **Non-profit** | Charities, foundations |
| **Local Business** | Restaurants, services, retail |
| **Other** | Doesn't fit other categories |

---

### 18.4 USER FLOW — ENABLING SHOWCASE

```
1. User completes a report scan
2. On report page, sees "Showcase this site" toggle (off by default)
3. User clicks toggle → Modal appears:

   ┌─────────────────────────────────────────────────┐
   │  🎉 Showcase Your Site on BrandProbe           │
   │                                                 │
   │  Get discovered by other founders and          │
   │  marketers browsing BrandProbe!                │
   │                                                 │
   │  [Icon Preview]  [Upload Custom Icon]          │
   │                                                 │
   │  Display Name: [Auto-filled: Company Name]     │
   │  Tagline:      [Auto-filled: Hero text]        │
   │  Category:     [Dropdown: SaaS ▼]              │
   │                                                 │
   │  Description (optional):                       │
   │  [                                         ]   │
   │                                                 │
   │  ☑ Use my BrandProbe score as a badge         │
   │  ☑ Notify me when someone views my showcase   │
   │                                                 │
   │  [Cancel]              [Enable Showcase →]     │
   └─────────────────────────────────────────────────┘

4. User fills/confirms details → showcase_enabled = true
5. Site appears on /showcase page (pending approval if configured)
6. User can edit/disable from Dashboard
```

---

### 18.5 PAGES & COMPONENTS

#### New Pages

| Route | Purpose |
|-------|---------|
| `/showcase` | Main showcase gallery with search/filters |
| `/showcase/[id]` | Individual showcase profile (redirects to report) |

#### New Components

| Component | Purpose |
|-----------|---------|
| `ShowcaseGallery.tsx` | Main grid of showcase cards with infinite scroll |
| `ShowcaseCard.tsx` | Individual card: icon, name, tagline, score, category |
| `ShowcaseFeatured.tsx` | Carousel of featured sites for homepage |
| `ShowcaseToggle.tsx` | Toggle + modal for enabling showcase on report |
| `ShowcaseProfileEditor.tsx` | Edit profile (name, tagline, icon, etc.) |
| `ShowcaseFilters.tsx` | Category, score range, search filters |
| `ShowcaseStats.tsx` | Dashboard widget showing views/clicks |

#### Homepage Integration

Add "Featured Sites" section to homepage (below "How It Works"):

```
┌──────────────────────────────────────────────────────────────┐
│  🏆 Sites Analyzed by BrandProbe                             │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Icon   │  │  Icon   │  │  Icon   │  │  Icon   │         │
│  │ Name    │  │ Name    │  │ Name    │  │ Name    │         │
│  │ Score:72│  │ Score:58│  │ Score:84│  │ Score:45│         │
│  │ SaaS    │  │ Agency  │  │ Startup │  │ E-comm  │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                              │
│            [View All Analyzed Sites →]                       │
└──────────────────────────────────────────────────────────────┘
```

---

### 18.6 API ENDPOINTS

```typescript
// Showcase public endpoints
GET  /api/showcase                    // List showcase entries (paginated, filtered)
GET  /api/showcase/featured           // Get featured entries for homepage
GET  /api/showcase/[id]               // Get single showcase profile

// Showcase management (authenticated)
POST   /api/showcase                  // Enable showcase for a report
PATCH  /api/showcase/[id]             // Update showcase profile
DELETE /api/showcase/[id]             // Disable showcase

// Analytics
POST /api/showcase/[id]/view          // Track view (called on showcase card view)
POST /api/showcase/[id]/click         // Track click-through to full report

// User preferences
PATCH /api/user/showcase-preferences  // Update global showcase settings

// Admin (future)
POST  /api/admin/showcase/[id]/feature    // Feature a showcase
POST  /api/admin/showcase/[id]/approve    // Approve for showcase
DELETE /api/admin/showcase/[id]/feature   // Unfeature
```

---

### 18.7 SHOWCASE CARD DESIGN

```
┌────────────────────────────────────┐
│  [Icon]   Company Name             │
│  32×32    "Short tagline here"     │
│                                    │
│  ┌──────────────────────────────┐  │
│  │     Screenshot/Preview       │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  Score: ██████████░░ 72/100        │
│                                    │
│  🏷️ SaaS    👁️ 234 views           │
│                                    │
│  [View Full Report →]              │
└────────────────────────────────────┘
```

**Card Data:**
- `icon_url` - 32x32 app icon (fallback: first letter avatar)
- `display_name` - Company/app name
- `tagline` - 120 char max
- `screenshot_url` - Optional preview image
- `overall_score` - Visual progress bar + number
- `category` - Badge
- `showcase_views` - View count
- Link to `/report/[id]`

---

### 18.8 DEFAULT VALUES & AUTO-EXTRACTION

When user enables showcase, auto-populate from scraped data:

| Field | Source | Fallback |
|-------|--------|----------|
| `display_name` | `scraped_data.title` or `scraped_data.og.title` | Domain name |
| `tagline` | `scraped_data.hero.headline` or `scraped_data.meta.description` (truncated) | "Analyzed by BrandProbe" |
| `icon_url` | `scraped_data.favicon` | Generated letter avatar |
| `screenshot_url` | `scraped_data.screenshot` (if captured) | None |
| `category` | AI-inferred from `messaging_analysis` | "Other" |

---

### 18.9 SEARCH & FILTERING

Showcase page supports:

| Filter | Options |
|--------|---------|
| **Search** | Full-text on display_name, tagline, description |
| **Category** | Dropdown multi-select |
| **Score Range** | Slider: 0-100 (default: all) |
| **Sort By** | Featured, Highest Score, Newest, Most Viewed |

**Pagination:** Infinite scroll, 20 items per load

---

### 18.10 PRIVACY & CONSENT

**Explicit Opt-In Only:**
- Showcase is OFF by default
- User must actively enable for each report
- Clear messaging about what's public
- Easy disable from dashboard

**What's Public on Showcase:**
- Display name, tagline, description, icon
- Overall score only (not section scores)
- Category and website URL
- View count

**What's NOT Public:**
- Full report content (behind report link)
- User email
- Section-level scores
- Detailed analysis

**Global Opt-Out:**
Users can set `showcase_opt_in_global = false` to hide all their showcased sites.

---

### 18.11 BUILD PRIORITY

| Priority | Task | Phase |
|----------|------|-------|
| 1 | Database schema changes | Phase 1 |
| 2 | ShowcaseToggle + modal on report page | Phase 1 |
| 3 | ShowcaseProfileEditor for editing | Phase 1 |
| 4 | `/showcase` gallery page with basic grid | Phase 1 |
| 5 | ShowcaseCard component | Phase 1 |
| 6 | Homepage featured section (4 cards) | Phase 1 |
| 7 | Search and category filtering | Phase 1 |
| 8 | View/click tracking analytics | Phase 2 |
| 9 | Dashboard showcase stats widget | Phase 2 |
| 10 | Paid user priority ranking | Phase 2 |
| 11 | Admin approval workflow | Phase 2 |
| 12 | Featured curation by admin | Phase 2 |

---

### 18.12 SUCCESS METRICS

| Metric | Target | Why |
|--------|--------|-----|
| Showcase opt-in rate | 20%+ of reports | Users see value in exposure |
| Showcase page visits | 500+/month | Discovery is happening |
| Click-through rate | 15%+ | Showcase drives report views |
| Time on showcase page | 2+ min avg | Users exploring |
| Organic traffic from showcase | 10%+ of total | SEO benefit realized |

---

### 18.13 FUTURE ENHANCEMENTS (Post-Phase 2)

- **Showcase Badges:** Embeddable "Analyzed by BrandProbe" badges for user websites
- **Score History:** Show score improvement over time on showcase
- **Comparison View:** Compare two showcased sites side-by-side
- **Industry Benchmarks:** "Top 10 SaaS sites by score"
- **Social Sharing:** One-click share to Twitter/LinkedIn with OG preview
- **Premium Showcase Tier:** $9/mo for permanent featured placement
- **API Access:** Allow users to fetch their showcase data programmatically

---

*Section added: March 5, 2026*

---

*Document locked: March 1, 2026*
*Section 18 added: March 5, 2026*
*Next action: git init brandprobe*
