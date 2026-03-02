# 🔍 BrandProbe

**Paste your website. Know why you're not growing in 60 seconds.**

BrandProbe is an AI-powered marketing intelligence tool that analyzes your website and delivers a brutally honest diagnosis of your positioning, content gaps, conversion leaks, and growth opportunities.

## What It Does

A founder pastes their website URL → BrandProbe scrapes the site → AI analyzes the marketing strategy → delivers a 6-section strategic report with scores and actionable fixes.

### Report Sections
1. **Messaging & Positioning Analysis** — Is your message clear? (Free)
2. **SEO & Content Opportunities** — What keywords are you missing? (Free)
3. **Content Strategy Recommendations** — What should you create to stand out? (Paid)
4. **Ad Angle Suggestions** — What hooks would work for paid ads? (Paid)
5. **Conversion Optimization** — Where and why are you losing visitors? (Paid)
6. **Distribution Strategy Brief** — Which channels, what tone? (Paid)

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude API (Anthropic)
- **Scraping:** Playwright via Browserless.io
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel
- **Analytics:** PostHog

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key
- Stripe account
- Browserless.io account
- Resend account

### Installation

```bash
git clone https://github.com/yourusername/brandprobe.git
cd brandprobe
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_claude_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_ID=your_price_id

# Browserless
BROWSERLESS_API_KEY=your_browserless_key

# Resend
RESEND_API_KEY=your_resend_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Performance Configuration (Optional)
AI_PARALLEL_CALLS=3           # Parallel API calls in legacy mode (1-9)
USE_CONSOLIDATED_PROMPTS=true # Use 2 consolidated calls instead of 9
```

## Performance Tuning

BrandProbe offers two analysis modes:

### Consolidated Mode (Recommended, Default)
- Uses 2 large prompts instead of 9 separate calls
- ~4x faster than legacy mode (1 min vs 4 min for Ollama)
- Works with all providers
- Set `USE_CONSOLIDATED_PROMPTS=true` (default)

### Legacy Mode (9 Separate Calls)
- More granular analysis with individual prompts
- Configurable parallelism via `AI_PARALLEL_CALLS`
- Set `USE_CONSOLIDATED_PROMPTS=false`

**Parallel Call Configuration:**

```env
# Default settings (recommended)
AI_PARALLEL_CALLS=3  # Ollama: 3 parallel calls (balance speed vs. memory)
AI_PARALLEL_CALLS=9  # Cloud providers: 9 parallel calls (full parallelism)

# Low-memory systems (Ollama)
AI_PARALLEL_CALLS=2

# Sequential processing (slowest but minimal memory)
AI_PARALLEL_CALLS=1
```

**Provider-Specific Recommendations:**
- **Ollama (local)**: 2-5 (depends on model size and RAM)
- **OpenAI**: 5-9 (watch free tier rate limits)
- **Groq**: 9 (excellent rate limits, max parallelism)
- **Anthropic**: 5-9 (standard tier)

**Note**: Valid range is 1-9 (maximum 9 since legacy mode has 9 API calls total)

### Database Setup

Run the migration in your Supabase SQL editor:

```bash
# See supabase/migrations/001_initial.sql
```

## Running the Project

### Local Development

```bash
# Start development server (hot reload enabled)
npm run dev
# or
npm run dev:local

# Open http://localhost:3001
```

### Production Build

```bash
# Build and start production server
npm run dev:prod

# Or build and start separately
npm run build
npm run start

# Open http://localhost:3001
```

### Clean Build Cache

```bash
# Remove .next build cache
npm run clean

# Clean and rebuild
npm run clean:build
```

### Database Management

```bash
# Clear all report data (keeps users)
npm run clear-reports
# or
npm run db:clear
```

## Project Structure

```
brandprobe/
├── src/
│   ├── app/                    # Next.js App Router pages + API routes
│   ├── components/             # React components
│   ├── lib/                    # Core logic (scraper, claude, prompts, stripe)
│   └── types/                  # TypeScript types
├── supabase/migrations/        # Database schema
└── public/                     # Static assets
```

## License

MIT