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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the migration in your Supabase SQL editor:

```bash
# See supabase/migrations/001_initial.sql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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