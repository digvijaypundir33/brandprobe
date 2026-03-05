# Print Page - Issues and Requirements

## Date: 2026-03-03
## Status: Needs Major Fixes

---

## Current Issues

### 1. **Critical: Hardcoded isPaid Logic**
**Location:** Line 21
```typescript
const [isPaid] = useState(process.env.NODE_ENV === 'development');
```

**Problem:** This always returns `true` in development and `false` in production, ignoring actual user subscription status.

**Required Fix:** Fetch subscription status from API like the main report page does:
```typescript
const [hasFullAccess, setHasFullAccess] = useState(false);
const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');

// In fetchReport:
setHasFullAccess(data.hasFullAccess || false);
setSubscriptionStatus(data.subscriptionStatus || 'free');
```

---

### 2. **Missing Section: Design Authenticity**
**Problem:** Design Authenticity card is completely missing from print page

**Required:** Add section showing:
- Authenticity Rating
- Cliché Phrases detected
- Layout analysis
- Icon usage
- Detected AI phrases
- Strengths
- Recommendations
- Key Issues & Quick Wins

---

### 3. **Incomplete Detailed Analysis**
**Problem:** Most sections only show:
- Summary
- Key Issues
- Quick Wins

**Missing from each section:**
All the detailed analysis fields that are shown in the component cards:

#### Messaging Analysis Missing:
- Headline strength
- Value proposition clarity
- Target audience detection
- Brand voice consistency
- CTA effectiveness
- All other detailedAnalysis fields

#### SEO Opportunities Missing:
- Keywords found
- Content gaps
- Technical SEO issues
- Meta tags analysis
- All other detailed fields

#### Content Strategy Missing (if paid):
- Content pillars
- Topic recommendations
- Content calendar suggestions

#### Ad Angles Missing (if paid):
- Only shows 5 hooks/headlines
- Missing: all remaining hooks, psychological triggers, angle categories

#### Conversion Missing (if paid):
- Conversion checklist items
- Trust signals analysis
- CTA placement analysis

#### Distribution Missing (if paid):
- Only shows channel recommendations
- Missing: platform-specific guidance, content format suggestions

#### AI Search Visibility Missing (if paid):
- Missing: AEO score, entity clarity, citation readiness, content structure, schema markup
- Missing: AI search queries list
- Missing: FAQ opportunities list

#### Technical Performance Missing (if paid):
- Missing: Page speed estimate, Core Web Vitals
- Missing: Mobile readiness, image optimization, structured data
- Missing: Security indicators list
- Missing: Accessibility flags list

#### Brand Health Missing (if paid):
- Missing: Voice/Personality/Memorability/Trust metrics grid
- Missing: Brand consistency, voice & tone, visual identity, competitor differentiation cards
- Missing: Full brand personality and trust perception text

---

### 4. **Section Numbering Issues**
**Problem:** Section numbers are hardcoded (1-11) and don't adjust when sections are hidden for free users

**Example:**
- Free users see sections 1-4 (Overall, Score Breakdown, Messaging, SEO)
- Then section numbering jumps to 3, 4, 5... because paid sections use fixed numbers
- If free user, locked notice should say which sections are locked

**Required Fix:** Dynamic section numbering or remove numbers from paid sections

---

### 5. **Locked Sections Notice is Generic**
**Location:** Lines 803-819

**Problem:** Says "4 Sections Locked" but doesn't match actual locked count

**Required Fix:** List specific locked sections:
- Content Strategy
- Ad Creative Ideas
- Conversion Optimization
- Distribution Channels
- AI Search Visibility
- Technical Performance
- Brand Health
- Design Authenticity

Total: **8 locked sections** (not 4)

---

## Required Changes Summary

### Priority 1: Fix Access Control
1. Replace `isPaid` with proper `hasFullAccess` from API
2. Add `subscriptionStatus` state
3. Fetch from `/api/report/${id}` response like main report page

### Priority 2: Add Missing Sections
1. **Design Authenticity** - Complete section with all fields
2. Update locked sections count to 8

### Priority 3: Add Complete Detailed Analysis
For each section, add all fields shown in respective card components:

**Mapping:**
- Messaging → MessagingAnalysisCard fields
- SEO → SeoAnalysisCard fields
- Content → ContentPillarsCard fields
- Ads → AdHooksCarousel fields
- Conversion → ConversionChecklist fields
- Distribution → ChannelFitChart fields
- AI Search → AISearchVisibilityCard fields
- Technical → TechnicalPerformanceCard fields
- Brand Health → BrandHealthCard fields
- Design → DesignAuthenticityCard fields

### Priority 4: Fix Section Numbering
Either:
- Use dynamic numbering based on visible sections
- Remove numbers from paid section headers
- Show "🔒" icon for locked sections instead of numbers

---

## Reference: What Main Report Page Shows

### Free Tier (Always Visible):
1. Overall Score
2. Score Breakdown
3. Messaging & Positioning (full detail)
4. SEO & Content Opportunities (full detail)

### Starter Tier (Adds):
5. Content Strategy (unlocked with blur removed)
6. Ad Creative Ideas (unlocked)
7. Conversion Optimization (unlocked)
8. Distribution Channels (unlocked)

### Pro Tier (Adds):
9. AI Search Visibility (unlocked)
10. Technical Performance (unlocked)
11. Brand Health (unlocked)
12. Design Authenticity (unlocked)

---

## Backend Reminder

The backend route already handles access control properly:
- `/api/report/[id]/route.ts` lines 50-63
- Strips locked sections for free users
- Returns `hasFullAccess` and `subscriptionStatus`

**Print page just needs to use these values correctly.**

---

## Action Items

- [ ] Fix isPaid → use hasFullAccess from API
- [ ] Add Design Authenticity section
- [ ] Add all detailed analysis fields to each section
- [ ] Fix section numbering (dynamic or remove)
- [ ] Update locked notice (8 sections, list names)
- [ ] Add "Upgrade to unlock" messaging per section
- [ ] Match exact field display from card components
- [ ] Test with free, starter, and pro accounts
- [ ] Verify print CSS works with all new content
- [ ] Check page breaks don't split important content
