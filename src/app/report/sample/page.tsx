'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import AIPlatformVisibilityPreview from '@/components/AIPlatformVisibilityPreview';
import ScoreBarChart from '@/components/ScoreBarChart';
import QuickWinsSection from '@/components/QuickWinsSection';
import IssuesList from '@/components/IssuesList';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import WebsiteInfoCard from '@/components/WebsiteInfoCard';
import MessagingAnalysisCard from '@/components/MessagingAnalysisCard';
import SeoAnalysisCard from '@/components/SeoAnalysisCard';
import ContentPillarsCard from '@/components/ContentPillarsCard';
import AdHooksCarousel from '@/components/AdHooksCarousel';
import ConversionChecklist from '@/components/ConversionChecklist';
import ChannelFitChart from '@/components/ChannelFitChart';
import AISearchVisibilityCard from '@/components/AISearchVisibilityCard';
import TechnicalPerformanceCard from '@/components/TechnicalPerformanceCard';
import BrandHealthCard from '@/components/BrandHealthCard';
import DesignAuthenticityCard from '@/components/DesignAuthenticityCard';
import SiteQualityCard from '@/components/SiteQualityCard';
import ReportHeader from '@/components/ReportHeader';
import ReportTabNav from '@/components/ReportTabNav';
import type { Report, SiteQualityScore } from '@/types/report';

type TabType = 'overview' | 'messaging' | 'seo' | 'content' | 'ads' | 'conversion' | 'distribution' | 'aiSearch' | 'technical' | 'brandHealth' | 'designAuth';

// Comprehensive sample report data for a fictional SaaS company
const sampleReport: Report = {
  id: 'sample',
  userId: 'sample-user',
  siteId: 'sample-site',
  url: 'https://acmesaas.io',
  status: 'ready',
  isPublic: true,
  createdAt: new Date().toISOString(),
  scanTimeMs: 45000,
  isAutoRescan: false,
  scanNumber: 3,
  showcaseEnabled: true,
  showcaseRank: 1,
  showcaseViews: 1247,
  showcaseClicks: 89,
  showcaseUpvotes: 34,

  // Scores
  overallScore: 72,
  messagingScore: 78,
  seoScore: 65,
  contentScore: 70,
  adsScore: 82,
  conversionScore: 68,
  distributionScore: 75,
  aiSearchScore: 58,
  technicalScore: 85,
  brandHealthScore: 71,
  designAuthenticityScore: 66,

  // Progress tracking
  previousOverallScore: 65,
  scoreChange: 7,
  previousSectionScores: null,
  sectionScoreChanges: {
    messaging: 5,
    seo: 8,
    content: 3,
    ads: -2,
    conversion: 10,
    distribution: 4,
    aiSearch: 12,
    technical: 2,
    brandHealth: 6,
    designAuth: -1,
  },
  issueComparison: null,

  // Scraped Data
  scrapedData: {
    url: 'https://acmesaas.io',
    title: 'AcmeSaaS - AI-Powered Project Management for Growing Teams',
    metaDescription: 'Streamline your workflow with intelligent task automation, real-time collaboration, and predictive analytics. Trusted by 5,000+ teams worldwide.',
    h1: ['AI-Powered Project Management That Actually Works'],
    h2: [
      'Why Teams Choose AcmeSaaS',
      'Features Built for Modern Teams',
      'Integrations That Just Work',
      'Pricing That Scales With You',
      'What Our Customers Say',
    ],
    heroText: 'Stop managing projects. Start delivering outcomes. Our AI assistant handles the busywork while you focus on what matters.',
    ctas: ['Start Free Trial', 'Book a Demo', 'See Pricing', 'Watch Video'],
    navLinks: ['Features', 'Pricing', 'Integrations', 'Resources', 'About', 'Login'],
    testimonials: [
      '"AcmeSaaS cut our project delivery time by 40%. The AI suggestions are surprisingly accurate." - Sarah Chen, VP Engineering at TechFlow',
      '"Finally, a tool that understands how modern teams actually work." - Marcus Williams, Founder at StartupLab',
      '"We migrated from Asana and never looked back. The automation features alone save us 10 hours per week." - Jennifer Park, Product Lead at ScaleUp',
    ],
    trustSignals: [
      'SOC 2 Type II Certified',
      'GDPR Compliant',
      '99.9% Uptime SLA',
      'Used by 5,000+ teams',
      'Featured in TechCrunch',
    ],
    pricingInfo: 'Starter: $12/user/mo, Pro: $29/user/mo, Enterprise: Custom',
    socialProof: [
      '5,000+ teams',
      '4.8/5 on G2',
      'Product of the Day on Product Hunt',
      'Backed by Y Combinator',
    ],
    subPages: [],
    technicalData: {
      hasSSL: true,
      hasFavicon: true,
      hasOpenGraph: true,
      hasTwitterCards: true,
      hasStructuredData: true,
      structuredDataTypes: ['Organization', 'WebSite', 'Product', 'FAQPage'],
      hasCanonicalTag: true,
      hasRobotsTxt: true,
      hasSitemap: true,
      hasLlmsTxt: false,
      imagesWithAlt: 23,
      imagesWithoutAlt: 4,
      formCount: 3,
      videoCount: 2,
      externalLinkCount: 12,
      internalLinkCount: 45,
      hasViewportMeta: true,
      hasCharsetMeta: true,
      hasFAQSchema: true,
      loadTimeEstimate: 'fast',
      pageSize: '1.2 MB',
      htmlLang: 'en',
      titleLength: 58,
      metaDescriptionLength: 148,
      ogTitle: 'AcmeSaaS - AI-Powered Project Management',
      ogDescription: 'Streamline your workflow with intelligent task automation and real-time collaboration.',
      ogImage: 'https://acmesaas.io/og-image.png',
      ogUrl: 'https://acmesaas.io',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'AcmeSaaS - AI-Powered Project Management',
      twitterDescription: 'Streamline your workflow with intelligent task automation.',
      twitterImage: 'https://acmesaas.io/twitter-image.png',
      canonicalUrl: 'https://acmesaas.io',
      faviconUrl: 'https://acmesaas.io/favicon.ico',
      viewportContent: 'width=device-width, initial-scale=1',
      charset: 'UTF-8',
      headingsHierarchy: {
        h1Count: 1,
        h2Count: 5,
        h3Count: 12,
        h4Count: 8,
        h5Count: 0,
        h6Count: 0,
        hasProperHierarchy: true,
        hierarchyIssues: [],
      },
      robotsTxtContent: 'User-agent: *\nAllow: /',
      securityHeaders: {
        hasHSTS: true,
        hstsValue: 'max-age=31536000; includeSubDomains',
        hasCSP: true,
        cspValue: "default-src 'self'",
        hasXFrameOptions: true,
        xFrameOptionsValue: 'SAMEORIGIN',
        hasXContentTypeOptions: true,
        xContentTypeOptionsValue: 'nosniff',
        hasReferrerPolicy: true,
        referrerPolicyValue: 'strict-origin-when-cross-origin',
        hasPermissionsPolicy: false,
        permissionsPolicyValue: null,
      },
    },
  },

  // Messaging Analysis
  messagingAnalysis: {
    score: 78,
    summary: 'AcmeSaaS presents a clear value proposition centered on AI-powered project management. The messaging effectively communicates the core benefit of reducing busywork, though the differentiation from competitors could be stronger. The hero section is compelling but could better address specific pain points.',
    keyIssues: [
      {
        problem: 'Generic "AI-Powered" positioning lacks specificity',
        solution: 'Highlight specific AI capabilities (e.g., "Predicts deadline risks 2 weeks in advance" instead of just "AI-Powered")',
        priority: 'high',
      },
      {
        problem: 'Value proposition buried below the fold',
        solution: 'Move the "40% faster delivery" testimonial stat to the hero section',
        priority: 'high',
      },
      {
        problem: 'Missing comparison to alternatives',
        solution: 'Add a "Why switch from [Asana/Monday/etc]" section addressing migration concerns',
        priority: 'medium',
      },
    ],
    quickWins: [
      {
        action: 'Add specific metrics to hero headline (e.g., "Save 10+ hours/week")',
        impact: 'Increases credibility and gives visitors a tangible reason to stay',
        effort: 'easy',
      },
      {
        action: 'Replace "Book a Demo" with "See It In Action (2 min)"',
        impact: 'Reduces perceived commitment, increases demo bookings by ~20%',
        effort: 'easy',
      },
      {
        action: 'Add customer logos in hero section',
        impact: 'Builds instant trust with recognizable brand names',
        effort: 'easy',
      },
    ],
    detailedAnalysis: {
      headlineAnalysis: 'The headline "AI-Powered Project Management That Actually Works" is confident but generic. The phrase "That Actually Works" implies competitors don\'t work, which could resonate with frustrated users. However, it doesn\'t specify what makes it work better. Consider testing with specific outcomes like "Ships Projects 40% Faster."',
      valuePropositionClarity: 'Strong opening with "Stop managing projects. Start delivering outcomes." This clearly positions the product as outcome-focused rather than feature-focused. The subtext about AI handling busywork is relatable but could be more specific about which busywork exactly.',
      differentiationSignals: 'The AI positioning is present but not unique—many competitors claim AI capabilities. The strongest differentiator appears in testimonials ("cut delivery time by 40%") but isn\'t prominently featured. The Y Combinator backing is a trust signal but not a product differentiator.',
      ctaAnalysis: 'Four CTAs present: "Start Free Trial" (primary), "Book a Demo", "See Pricing", and "Watch Video." The hierarchy is clear, but "Book a Demo" could be more action-oriented. Consider A/B testing "See How It Works" vs "Book a Demo."',
      brandVoice: 'Professional yet approachable. The tone avoids corporate jargon and speaks directly to the user. Phrases like "Actually Works" and "handles the busywork" feel authentic. Consistent across sections.',
    },
  },

  // SEO Analysis
  seoOpportunities: {
    score: 65,
    summary: 'The site has solid technical SEO foundations with proper meta tags and structured data. However, there are significant opportunities in content optimization and keyword targeting. The title and meta description are well-crafted but could better target high-intent search queries.',
    keyIssues: [
      {
        problem: 'Missing llms.txt file for AI crawler optimization',
        solution: 'Create /llms.txt to help AI assistants understand and cite your content',
        priority: 'high',
      },
      {
        problem: '4 images missing alt text',
        solution: 'Add descriptive alt text to all images for accessibility and SEO',
        priority: 'medium',
      },
      {
        problem: 'No blog content targeting "project management AI" keywords',
        solution: 'Create content cluster around AI project management to capture search traffic',
        priority: 'high',
      },
    ],
    quickWins: [
      {
        action: 'Add FAQ schema for common questions',
        impact: 'Can trigger rich snippets in search results, increasing CTR by 20-30%',
        effort: 'easy',
      },
      {
        action: 'Optimize page title to include "for teams" keyword',
        impact: 'Better matches high-intent searches like "AI project management for teams"',
        effort: 'easy',
      },
      {
        action: 'Add internal links from pricing to feature pages',
        impact: 'Improves crawlability and distributes page authority',
        effort: 'easy',
      },
    ],
    detailedAnalysis: {
      keywordGapAnalysis: 'Currently ranking for "AI project management" (position 23) but missing opportunities for "project management automation," "team productivity software," and "Asana alternative." These keywords have high search volume and commercial intent.',
      metaTagReview: 'Title (58 chars) and meta description (148 chars) are well within limits. However, the meta description could include a stronger call-to-action. Consider: "Join 5,000+ teams using AI to deliver projects faster. Start free →"',
      contentGapIdentification: 'Competitors are ranking for comparison keywords ("AcmeSaaS vs Asana," "AcmeSaaS vs Monday") but you have no comparison content. Creating these pages could capture high-intent traffic.',
      competitorKeywordInference: 'Top competitors are targeting "workflow automation," "team collaboration tool," and "project tracking software." These represent opportunities for content creation and optimization.',
      technicalSeoFlags: [
        'No llms.txt file detected',
        '4 images without alt attributes',
        'Some internal links use generic anchor text ("click here")',
      ],
    },
  },

  // Content Strategy
  contentStrategy: {
    score: 70,
    summary: 'AcmeSaaS has a foundation for content marketing but lacks a comprehensive strategy. The existing content focuses heavily on product features rather than solving customer problems. There\'s an opportunity to establish thought leadership in the AI productivity space.',
    keyIssues: [
      {
        problem: 'No educational content addressing buyer pain points',
        solution: 'Create "How to" guides for common project management challenges',
        priority: 'high',
      },
      {
        problem: 'Missing bottom-of-funnel comparison content',
        solution: 'Develop honest comparison pages vs top 3 competitors',
        priority: 'high',
      },
      {
        problem: 'Blog posts lack internal linking structure',
        solution: 'Create content clusters with pillar pages and related posts',
        priority: 'medium',
      },
    ],
    quickWins: [
      {
        action: 'Turn customer testimonials into case studies',
        impact: 'Creates compelling social proof content that ranks for "[industry] project management"',
        effort: 'medium',
      },
      {
        action: 'Create a "Project Management ROI Calculator"',
        impact: 'Generates leads and backlinks as a valuable interactive tool',
        effort: 'medium',
      },
      {
        action: 'Publish weekly "AI in Project Management" newsletter',
        impact: 'Builds email list and establishes thought leadership',
        effort: 'medium',
      },
    ],
    detailedAnalysis: {
      contentPillars: [
        'AI & Automation in Project Management',
        'Team Productivity & Collaboration',
        'Project Delivery & Deadline Management',
        'Remote Team Workflows',
        'Project Management Best Practices',
      ],
      formatRecommendations: [
        'Long-form guides (2,000+ words) for pillar content',
        'Short tutorials (800 words) for specific features',
        'Video walkthroughs for complex workflows',
        'Podcast interviews with productivity experts',
        'Infographics for statistics and comparisons',
      ],
      topicClusters: [
        'AI Project Management Hub → feature tutorials, use cases, comparisons',
        'Team Productivity Center → tips, templates, workflows',
        'Integration Guides → each tool gets dedicated content',
        'Industry Solutions → vertical-specific use cases',
      ],
      differentiationAngles: [
        'Focus on AI predictions vs. reactive management',
        'Emphasize time savings with real customer metrics',
        'Highlight unique automation capabilities',
        'Position as "the smart alternative" to legacy tools',
      ],
      publishingCadence: 'Recommend 2-3 blog posts per week, 1 pillar content piece per month, weekly newsletter, monthly webinar',
      platformGuidance: {
        blog: 'Long-form SEO content, tutorials, case studies',
        linkedin: 'Thought leadership, product updates, team culture',
        twitter: 'Quick tips, product updates, industry commentary',
        youtube: 'Tutorials, webinars, customer stories',
      },
    },
  },

  // Ad Angles
  adAngles: {
    score: 82,
    summary: 'The landing page provides excellent raw material for advertising. Strong testimonials, clear benefits, and specific metrics that can be leveraged across channels. The "40% faster delivery" claim is particularly powerful for ads.',
    keyIssues: [
      {
        problem: 'No retargeting-specific messaging on site',
        solution: 'Create landing page variants for retargeted visitors with deeper feature content',
        priority: 'medium',
      },
      {
        problem: 'Missing competitor displacement angles',
        solution: 'Develop "switching from [competitor]" ad variants and landing pages',
        priority: 'medium',
      },
      {
        problem: 'Limited emotional triggers in current copy',
        solution: 'Add pain-agitating copy that addresses frustration with current tools',
        priority: 'low',
      },
    ],
    quickWins: [
      {
        action: 'Create UGC-style ad using customer quote about 40% improvement',
        impact: 'Authentic content performs 50% better than polished brand ads',
        effort: 'easy',
      },
      {
        action: 'Build competitor comparison ad: "Tired of [Asana]? Try this instead"',
        impact: 'Captures high-intent switchers who are actively evaluating alternatives',
        effort: 'easy',
      },
      {
        action: 'Develop "problem-focused" ad highlighting busywork frustration',
        impact: 'Pain-based ads often outperform benefit-based ads for problem-aware audiences',
        effort: 'easy',
      },
    ],
    detailedAnalysis: {
      adHooks: [
        '🚀 "We cut project delivery time by 40%"',
        '⏰ "Our AI saves teams 10+ hours per week"',
        '😤 "Tired of project management that creates more work?"',
        '🎯 "Finally, project management that predicts problems"',
        '💡 "What if your PM tool actually managed projects?"',
        '🔄 "Switched from Asana. Here\'s what happened..."',
      ],
      psychologicalTriggers: [
        'Fear of missing deadlines (addressed by AI predictions)',
        'Frustration with busywork (addressed by automation)',
        'Desire for control (addressed by visibility features)',
        'Social proof (5,000+ teams, notable brands)',
        'Authority (Y Combinator backed, SOC 2 certified)',
      ],
      audienceAngleVariations: [
        'Engineering leads: Focus on developer integrations and automation',
        'Product managers: Emphasize roadmap visibility and stakeholder updates',
        'Founders/CEOs: Highlight ROI and team efficiency metrics',
        'Ops managers: Focus on process automation and reporting',
      ],
      headlineSuggestions: [
        'Project management that does the managing for you',
        'Stop babysitting your project board',
        'The AI assistant your team actually needs',
        'What if projects managed themselves?',
        'Deliver faster. Stress less. Ship more.',
      ],
      copySuggestions: [
        'Your team spends 10 hours/week on project admin. What if AI handled it? AcmeSaaS automates the busywork so you can focus on building.',
        'Deadlines slipping? AcmeSaaS predicts risks 2 weeks early, so you can fix problems before they happen. Try it free.',
        'We asked 5,000 teams what they wanted. They said: "Just let me work." So we built project management that stays out of your way.',
      ],
      platformCreativeDirection: {
        'Meta/Facebook': 'UGC-style testimonials, before/after comparisons, short demo clips',
        'LinkedIn': 'Professional credibility (certifications, enterprise features), thought leadership',
        'Google Search': 'Competitor comparisons, specific feature keywords, free trial emphasis',
        'YouTube': 'Product demos, customer story documentaries, "day in the life" content',
      },
    },
  },

  // Conversion Optimization
  conversionOptimization: {
    score: 68,
    summary: 'The site has good conversion fundamentals with clear CTAs and trust signals. However, there are friction points in the signup flow and opportunities to better capture different stages of buyer intent. The free trial offering is strong but could be more prominent.',
    keyIssues: [
      {
        problem: 'Email required before seeing any product demo',
        solution: 'Offer ungated product tour or interactive demo',
        priority: 'high',
      },
      {
        problem: 'Pricing page lacks social proof elements',
        solution: 'Add testimonials and customer logos specific to each pricing tier',
        priority: 'high',
      },
      {
        problem: 'No exit-intent capture mechanism',
        solution: 'Implement tasteful exit popup offering valuable resource (ROI calculator, guide)',
        priority: 'medium',
      },
    ],
    quickWins: [
      {
        action: 'Add "No credit card required" near trial CTA',
        impact: 'Removes perceived risk, can increase signups by 20-30%',
        effort: 'easy',
      },
      {
        action: 'Show live chat widget on pricing page',
        impact: 'Captures visitors with questions who might otherwise bounce',
        effort: 'easy',
      },
      {
        action: 'Add customer count badge to primary CTA ("Join 5,000+ teams")',
        impact: 'Adds social proof at the moment of decision',
        effort: 'easy',
      },
    ],
    detailedAnalysis: {
      trustSignalAudit: 'Good trust signals present: SOC 2 badge, GDPR compliance, customer logos, testimonials. However, these are scattered across the page. Consider creating a dedicated "Trust & Security" section and adding badges near the signup form.',
      ctaOptimization: 'Primary CTA "Start Free Trial" is clear but generic. Testing "Start Building in 2 Minutes" or "Try It Free (No Card Needed)" could improve performance. The secondary CTA "Book a Demo" should be repositioned for enterprise-focused visitors.',
      pageStructureAnalysis: 'Above the fold is strong with clear value prop and CTA. Below the fold becomes feature-heavy without clear narrative flow. Consider restructuring to: Problem → Solution → Social Proof → Features → Pricing → Final CTA.',
      frictionPoints: [
        'No price transparency on homepage (must click to pricing)',
        'Demo requires form fill before any preview',
        'Pricing page lacks feature comparison matrix',
        'No option for "self-serve trial" vs "guided onboarding"',
      ],
      socialProofAssessment: 'Strong testimonials but underutilized. The 40% improvement stat should be more prominent. Consider adding video testimonials and detailed case studies with verifiable metrics.',
      aboveFoldEffectiveness: 'Hero section effectively communicates core value prop. The AI angle is clear. However, the hero image/illustration doesn\'t reinforce the product\'s capabilities. Consider using product screenshots or an animated demo.',
    },
  },

  // Distribution Strategy
  distributionStrategy: {
    score: 75,
    summary: 'AcmeSaaS has good potential for multi-channel distribution. The product lends itself well to both organic and paid channels. However, there\'s an over-reliance on traditional channels and missed opportunities in community-led growth and partnerships.',
    keyIssues: [
      {
        problem: 'No integration marketplace presence',
        solution: 'List on marketplaces of integrated tools (Slack, Zoom, etc.)',
        priority: 'high',
      },
      {
        problem: 'Missing affiliate/referral program',
        solution: 'Launch referral program with meaningful incentives',
        priority: 'high',
      },
      {
        problem: 'No presence in relevant communities',
        solution: 'Engage authentically in ProductHunt, IndieHackers, relevant Slack groups',
        priority: 'medium',
      },
    ],
    quickWins: [
      {
        action: 'Create G2/Capterra profiles if not already present',
        impact: 'Captures high-intent buyers researching solutions',
        effort: 'easy',
      },
      {
        action: 'List on "awesome-project-management" GitHub repos',
        impact: 'Free exposure to developer-focused audience',
        effort: 'easy',
      },
      {
        action: 'Submit to ProductHunt (if not already launched)',
        impact: 'Can drive significant trial signups and initial traction',
        effort: 'medium',
      },
    ],
    detailedAnalysis: {
      channelRecommendations: [
        { channel: 'LinkedIn Ads', fit: 85, rationale: 'B2B audience actively looking for productivity tools. Target by job title and company size.' },
        { channel: 'Google Search', fit: 90, rationale: 'High-intent keywords available. Competitor keywords especially valuable.' },
        { channel: 'Content Marketing', fit: 80, rationale: 'Long-term organic growth. Build authority in AI project management space.' },
        { channel: 'G2/Capterra', fit: 85, rationale: 'Essential for B2B SaaS. Buyers actively comparing solutions here.' },
        { channel: 'ProductHunt', fit: 75, rationale: 'Good for initial launch buzz. Declining for repeat launches.' },
        { channel: 'Podcast Sponsorships', fit: 70, rationale: 'Target business/tech podcasts for brand awareness.' },
        { channel: 'Partner Integrations', fit: 90, rationale: 'List on Slack/Zoom/etc. marketplaces for discovery.' },
        { channel: 'Referral Program', fit: 85, rationale: 'Low CAC acquisition from happy customers.' },
      ],
      contentChannelMapping: {
        blog: ['SEO content', 'thought leadership', 'tutorials'],
        linkedin: ['company updates', 'team culture', 'industry insights'],
        twitter: ['quick tips', 'product updates', 'engagement'],
        youtube: ['tutorials', 'webinars', 'customer stories'],
        email: ['product updates', 'educational series', 'case studies'],
      },
      tonePerPlatform: {
        linkedin: 'Professional, insightful, thought-leadership focused',
        twitter: 'Conversational, helpful, occasionally witty',
        blog: 'Educational, comprehensive, SEO-optimized',
        email: 'Personal, direct, value-focused',
        youtube: 'Friendly, tutorial-style, step-by-step',
      },
      partnershipSuggestions: [
        'Integration partnerships with complementary tools (Figma, GitHub, Notion)',
        'Co-marketing with productivity consultants and coaches',
        'Agency partner program for implementation services',
        'Educational partnerships with PM certification bodies',
      ],
    },
  },

  // AI Search Visibility
  aiSearchVisibility: {
    score: 58,
    summary: 'AcmeSaaS has moderate AI search visibility but significant room for improvement. The site lacks specific optimizations for AI assistant discovery, which is increasingly important as users turn to ChatGPT and Perplexity for product recommendations.',
    keyIssues: [
      {
        problem: 'No llms.txt file to guide AI crawlers',
        solution: 'Create comprehensive llms.txt defining company, products, and key facts',
        priority: 'high',
      },
      {
        problem: 'Limited FAQ content for AI citation',
        solution: 'Expand FAQ section with detailed answers to common questions',
        priority: 'high',
      },
      {
        problem: 'Product descriptions too marketing-focused for AI parsing',
        solution: 'Add clear, factual product specification sections',
        priority: 'medium',
      },
    ],
    quickWins: [
      {
        action: 'Add structured FAQ schema markup',
        impact: 'Increases chances of being cited by AI assistants',
        effort: 'easy',
      },
      {
        action: 'Create clear "What is AcmeSaaS?" section',
        impact: 'Provides AI with clean product definition to cite',
        effort: 'easy',
      },
      {
        action: 'Add comparison tables vs competitors',
        impact: 'AI assistants often pull from comparison content',
        effort: 'medium',
      },
    ],
    detailedAnalysis: {
      aeoScore: 58,
      entityClarity: 'AcmeSaaS is defined as an AI-powered project management tool, but the definition isn\'t prominent. Adding a clear "About AcmeSaaS" section with structured data would help AI systems understand and cite the product.',
      citationReadiness: 'The site has good content but it\'s formatted for human readers, not AI parsing. Adding more structured data, clear definitions, and fact-based content sections would improve citation likelihood.',
      aiSearchAppearance: [
        'Mentioned in some AI responses about project management tools',
        'Not appearing in "best PM tools" recommendations',
        'Competitors with better AI optimization are more frequently cited',
      ],
      contentStructureForAI: 'Content is narrative-focused rather than fact-structured. AI assistants prefer clear, declarative statements. Consider adding "Key Facts" sections to important pages.',
      schemaMarkupAnalysis: 'Good foundation with Organization and Product schemas. Missing: FAQ schema on support pages, HowTo schema on tutorial content, Review schema for testimonials.',
      faqOpportunities: [
        'What is AcmeSaaS and how does it work?',
        'How does AcmeSaaS compare to Asana/Monday/ClickUp?',
        'What AI features does AcmeSaaS offer?',
        'Is AcmeSaaS suitable for small teams?',
        'How much does AcmeSaaS cost?',
      ],
      recommendations: [
        'Create /llms.txt file with structured company and product information',
        'Expand FAQ section with 20+ detailed questions and answers',
        'Add comparison pages that AI can easily parse',
        'Include specific metrics and facts that AI can cite',
        'Implement FAQ schema on all pages with Q&A content',
      ],
    },
  },

  // Technical Performance
  technicalPerformance: {
    score: 85,
    summary: 'The site demonstrates strong technical foundations with fast load times, proper security headers, and mobile optimization. Minor improvements could be made in image optimization and some security configurations.',
    keyIssues: [
      {
        problem: '4 images missing alt text',
        solution: 'Add descriptive alt text to all images for accessibility and SEO',
        priority: 'medium',
      },
      {
        problem: 'Missing Permissions-Policy header',
        solution: 'Add Permissions-Policy header to control browser features',
        priority: 'low',
      },
      {
        problem: 'Page size could be reduced (currently 1.2MB)',
        solution: 'Compress images and implement lazy loading for below-fold content',
        priority: 'low',
      },
    ],
    quickWins: [
      {
        action: 'Add alt text to remaining 4 images',
        impact: 'Improves accessibility score and SEO',
        effort: 'easy',
      },
      {
        action: 'Implement lazy loading for below-fold images',
        impact: 'Reduces initial page load time',
        effort: 'easy',
      },
      {
        action: 'Add Permissions-Policy header',
        impact: 'Improves security posture',
        effort: 'easy',
      },
    ],
    detailedAnalysis: {
      pageSpeedEstimate: 'Fast',
      mobileReadiness: 'Site is fully responsive with proper viewport meta tag. Touch targets are appropriately sized and content reflows well on mobile devices.',
      securityIndicators: [
        'SSL/HTTPS enabled ✓',
        'HSTS header present ✓',
        'Content Security Policy present ✓',
        'X-Frame-Options present ✓',
        'X-Content-Type-Options present ✓',
        'Referrer-Policy present ✓',
        'Permissions-Policy missing ✗',
      ],
      accessibilityFlags: [
        '4 images missing alt attributes',
        'Color contrast ratios are good',
        'Keyboard navigation works properly',
        'ARIA labels present on interactive elements',
      ],
      coreWebVitalsEstimate: 'Good performance across Core Web Vitals. LCP under 2.5s, FID under 100ms, CLS under 0.1.',
      structuredDataPresence: 'Multiple schema types detected: Organization, WebSite, Product, FAQPage. Well-implemented structured data.',
      imageOptimization: 'Most images are optimized. 4 images could use better compression. Consider WebP format for further optimization.',
      recommendations: [
        'Add alt text to all images',
        'Implement Permissions-Policy header',
        'Consider WebP image format',
        'Add preconnect hints for third-party resources',
      ],
      pageSpeedInsights: {
        lcp: { value: 1800, displayValue: '1.8s', score: 0.92, rating: 'good' },
        fcp: { value: 1200, displayValue: '1.2s', score: 0.95, rating: 'good' },
        tbt: { value: 150, displayValue: '150ms', score: 0.88, rating: 'good' },
        cls: { value: 0.05, displayValue: '0.05', score: 0.96, rating: 'good' },
        speedIndex: { value: 2100, displayValue: '2.1s', score: 0.90, rating: 'good' },
        performanceScore: 92,
        seoScore: 95,
        bestPracticesScore: 88,
        accessibilityScore: 85,
        strategy: 'mobile',
        fetchTime: new Date().toISOString(),
        lighthouseVersion: '11.0.0',
        hasFieldData: true,
      },
      dataSource: 'pagespeed-api',
    },
  },

  // Brand Health
  brandHealth: {
    score: 71,
    summary: 'AcmeSaaS has established a recognizable brand identity with consistent visual language and tone. The AI positioning is modern and relevant. However, the brand could benefit from stronger emotional differentiation and more distinctive visual elements.',
    keyIssues: [
      {
        problem: 'Visual identity similar to many SaaS competitors',
        solution: 'Develop more distinctive visual elements (unique illustration style, mascot, color usage)',
        priority: 'medium',
      },
      {
        problem: 'Brand story not prominently featured',
        solution: 'Create compelling "About" and "Our Story" pages showcasing founder journey',
        priority: 'medium',
      },
      {
        problem: 'Limited brand voice guidelines visible',
        solution: 'Ensure consistent voice across all touchpoints',
        priority: 'low',
      },
    ],
    quickWins: [
      {
        action: 'Add founder photos and quotes to About page',
        impact: 'Humanizes the brand and builds trust',
        effort: 'easy',
      },
      {
        action: 'Create branded social media templates',
        impact: 'Ensures consistency across channels',
        effort: 'easy',
      },
      {
        action: 'Develop signature visual motif (beyond standard SaaS illustrations)',
        impact: 'Increases memorability and brand recognition',
        effort: 'medium',
      },
    ],
    detailedAnalysis: {
      brandConsistency: 'Good consistency across the site with uniform color palette, typography, and iconography. However, some inconsistencies in button styles and spacing on interior pages.',
      voiceToneAnalysis: 'Professional yet approachable tone. Avoids jargon effectively. Some pages are more formal than others—could benefit from voice guidelines.',
      visualIdentityNotes: 'Clean, modern aesthetic with standard SaaS visual language. Blue/purple color scheme is professional but not distinctive. Illustration style is generic.',
      competitorDifferentiation: 'Positioned as the "AI-powered" alternative, which is relevant but increasingly common. Could strengthen differentiation through unique visual identity or stronger personality.',
      memorabilityScore: 'Moderate. The product name is memorable, but visual identity could be more distinctive. No strong brand symbols or characters.',
      brandPersonality: 'Intelligent, efficient, modern, helpful. Could lean more into personality traits that differentiate from competitors.',
      trustPerception: 'Strong trust signals with Y Combinator backing, SOC 2 certification, and enterprise customer logos. Trust foundation is solid.',
      recommendations: [
        'Develop distinctive illustration style or mascot',
        'Create comprehensive brand guidelines',
        'Add founder story and team personality',
        'Consider brand refresh for more distinctive visual identity',
      ],
    },
  },

  // Design Authenticity
  designAuthenticity: {
    score: 66,
    summary: 'The site has a professional design but relies heavily on common SaaS patterns and generic elements. While functional, the design doesn\'t stand out from competitors. There are opportunities to inject more personality and authenticity.',
    keyIssues: [
      {
        problem: 'Uses many common SaaS clichés ("AI-Powered," "Revolutionary")',
        solution: 'Replace with specific, benefit-focused language',
        priority: 'medium',
      },
      {
        problem: 'Generic illustration style seen on many SaaS sites',
        solution: 'Commission custom illustrations or use real product screenshots',
        priority: 'medium',
      },
      {
        problem: 'Layout follows predictable SaaS template pattern',
        solution: 'Add unique sections or creative layouts that surprise visitors',
        priority: 'low',
      },
    ],
    quickWins: [
      {
        action: 'Replace abstract illustrations with real product screenshots',
        impact: 'Increases authenticity and shows real value',
        effort: 'easy',
      },
      {
        action: 'Remove or rewrite generic phrases like "cutting-edge" and "revolutionary"',
        impact: 'Makes copy more genuine and believable',
        effort: 'easy',
      },
      {
        action: 'Add real customer photos to testimonials',
        impact: 'Increases credibility and human connection',
        effort: 'easy',
      },
    ],
    detailedAnalysis: {
      clichePhrasesDetected: [
        'AI-Powered',
        'Revolutionary',
        'Cutting-edge',
        'Seamlessly integrate',
        'World-class',
        'Game-changing',
      ],
      clicheCount: 6,
      clicheSeverity: 'medium',
      layoutPattern: 'Standard SaaS landing page structure: Hero → Features → Social Proof → Pricing → CTA',
      layoutAuthenticity: 'common',
      layoutDescription: 'The layout follows a well-worn SaaS template pattern. While effective, it doesn\'t differentiate the brand. Consider adding unexpected sections or creative presentation.',
      iconLibrariesFound: ['Heroicons', 'Material Icons'],
      usesCustomIcons: false,
      iconAnalysis: 'Standard icon libraries used throughout. Custom iconography could enhance brand identity and provide visual differentiation.',
      authenticityRating: 'Somewhat Generic',
      strengthsSummary: 'Clean, professional design that communicates competence. Good use of whitespace and typography. Content is well-organized.',
      recommendations: [
        'Replace generic illustrations with product screenshots or custom artwork',
        'Audit and rewrite cliché phrases',
        'Add unexpected creative elements',
        'Consider custom iconography',
        'Include more real photos vs. stock/AI imagery',
      ],
      screenshotUrl: undefined,
    },
  },
};

// Sample site quality data
const sampleSiteQuality: SiteQualityScore = {
  totalScore: 92,
  maxScore: 100,
  title: {
    score: 10,
    max: 10,
    value: 'AcmeSaaS - AI-Powered Project Management for Growing Teams',
    length: 58,
    status: 'good',
  },
  metaDescription: {
    score: 10,
    max: 10,
    value: 'Streamline your workflow with intelligent task automation, real-time collaboration, and predictive analytics. Trusted by 5,000+ teams worldwide.',
    length: 148,
    status: 'good',
  },
  favicon: {
    score: 5,
    max: 5,
    present: true,
    url: 'https://acmesaas.io/favicon.ico',
  },
  viewport: {
    score: 5,
    max: 5,
    present: true,
    content: 'width=device-width, initial-scale=1',
    status: 'good',
  },
  robotsTxt: {
    score: 5,
    max: 5,
    present: true,
    content: 'User-agent: *\nAllow: /',
    status: 'good',
  },
  sitemap: {
    score: 5,
    max: 5,
    present: true,
  },
  llmsTxt: {
    score: 0,
    max: 5,
    present: false,
  },
  headings: {
    score: 10,
    max: 10,
    hasProperHierarchy: true,
    issues: [],
  },
  schemaOrg: {
    score: 10,
    max: 10,
    present: true,
    types: ['Organization', 'WebSite', 'Product', 'FAQPage'],
  },
  canonical: {
    score: 5,
    max: 5,
    present: true,
    url: 'https://acmesaas.io',
  },
  htmlLang: {
    score: 5,
    max: 5,
    present: true,
    value: 'en',
  },
  charset: {
    score: 5,
    max: 5,
    present: true,
    value: 'UTF-8',
  },
  openGraph: {
    score: 10,
    max: 10,
    title: { present: true, value: 'AcmeSaaS - AI-Powered Project Management' },
    description: { present: true, value: 'Streamline your workflow with intelligent task automation.' },
    image: { present: true, url: 'https://acmesaas.io/og-image.png' },
    url: { present: true, value: 'https://acmesaas.io' },
    type: { present: true, value: 'website' },
  },
  twitterCards: {
    score: 7,
    max: 10,
    cardType: { present: true, value: 'summary_large_image' },
    title: { present: true, value: 'AcmeSaaS - AI-Powered Project Management' },
    description: { present: true, value: 'Streamline your workflow with intelligent task automation.' },
    image: { present: true, url: 'https://acmesaas.io/twitter-image.png' },
  },
};

export default function SampleReportPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const scores = {
    messaging: sampleReport.messagingScore || 0,
    seo: sampleReport.seoScore || 0,
    content: sampleReport.contentScore || 0,
    ads: sampleReport.adsScore || 0,
    conversion: sampleReport.conversionScore || 0,
    distribution: sampleReport.distributionScore || 0,
    aiSearch: sampleReport.aiSearchScore || 0,
    technical: sampleReport.technicalScore || 0,
    brandHealth: sampleReport.brandHealthScore || 0,
    designAuth: sampleReport.designAuthenticityScore || 0,
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BrandProbe Sample Report',
        text: 'Check out this sample BrandProbe analysis',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#5B5BD5]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-gray-900">BrandProbe</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              SAMPLE REPORT
            </span>
            <Link
              href="/"
              className="px-5 py-2.5 bg-[#5B5BD5] hover:bg-[#5B5BD5]/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#5B5BD5]/20"
            >
              Analyze Your Site
            </Link>
          </div>
        </div>
      </header>

      {/* Sample Report Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-800">
              <strong>Sample report</strong> for a fictional company. Enter your URL to get a real analysis.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1"
          >
            Get Your Report
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Report Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ReportHeader
            url={sampleReport.url}
            overallScore={sampleReport.overallScore || 0}
            createdAt={sampleReport.createdAt}
            onShare={handleShare}
            onPrint={handlePrint}
            isSample={true}
          />
        </motion.div>

        {/* Tab Navigation */}
        <ReportTabNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          scores={scores}
          hasFullAccess={true}
        />

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Executive Summary */}
              <ExecutiveSummary report={sampleReport} hasFullAccess={true} />

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* AI Platform Visibility */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">AI Platform Visibility</h2>
                      <p className="text-sm text-gray-500">Your brand across AI assistants</p>
                    </div>
                  </div>
                  <AIPlatformVisibilityPreview
                    aeoScore={sampleReport.aiSearchVisibility?.detailedAnalysis?.aeoScore || 0}
                    hasFullAccess={true}
                  />
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Section Breakdown</h2>
                      <p className="text-sm text-gray-500">Score comparison by category</p>
                    </div>
                  </div>
                  <ScoreBarChart scores={scores} sectionScoreChanges={sampleReport.sectionScoreChanges} hasFullAccess={true} />
                </div>
              </div>

              {/* Website Info */}
              {sampleReport.scrapedData && (
                <WebsiteInfoCard data={sampleReport.scrapedData} />
              )}

              {/* Site Quality Card */}
              <SiteQualityCard siteQuality={sampleSiteQuality} />

              {/* Issues List */}
              <IssuesList report={sampleReport} hasFullAccess={true} />

              {/* Quick Wins */}
              <QuickWinsSection report={sampleReport} hasFullAccess={true} />
            </div>
          )}

          {activeTab === 'messaging' && sampleReport.messagingAnalysis && (
            <MessagingAnalysisCard messaging={sampleReport.messagingAnalysis} />
          )}

          {activeTab === 'seo' && sampleReport.seoOpportunities && (
            <SeoAnalysisCard seo={sampleReport.seoOpportunities} />
          )}

          {activeTab === 'content' && sampleReport.contentStrategy && (
            <ContentPillarsCard content={sampleReport.contentStrategy} />
          )}

          {activeTab === 'ads' && sampleReport.adAngles && (
            <AdHooksCarousel adAngles={sampleReport.adAngles} />
          )}

          {activeTab === 'conversion' && sampleReport.conversionOptimization && (
            <ConversionChecklist conversion={sampleReport.conversionOptimization} />
          )}

          {activeTab === 'distribution' && sampleReport.distributionStrategy && (
            <ChannelFitChart distribution={sampleReport.distributionStrategy} />
          )}

          {activeTab === 'aiSearch' && sampleReport.aiSearchVisibility && (
            <AISearchVisibilityCard aiSearch={sampleReport.aiSearchVisibility} />
          )}

          {activeTab === 'technical' && sampleReport.technicalPerformance && (
            <TechnicalPerformanceCard
              technical={sampleReport.technicalPerformance}
              technicalData={sampleReport.scrapedData?.technicalData}
            />
          )}

          {activeTab === 'brandHealth' && sampleReport.brandHealth && (
            <BrandHealthCard brandHealth={sampleReport.brandHealth} />
          )}

          {activeTab === 'designAuth' && sampleReport.designAuthenticity && (
            <DesignAuthenticityCard designAuth={sampleReport.designAuthenticity} />
          )}
        </motion.div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-[#5B5BD5] to-[#7B7BF5] rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-3">
            Ready to Analyze Your Website?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Get the same comprehensive analysis for your site. Enter your URL and receive
            actionable insights in under 60 seconds.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#5B5BD5] font-bold rounded-lg hover:bg-gray-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Analyze Your Site Free
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">BrandProbe</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BrandProbe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
            <Link href="/support" className="hover:text-gray-700">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
