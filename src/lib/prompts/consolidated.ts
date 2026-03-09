// Consolidated prompts to reduce AI calls from 9 to 2

export const CORE_MARKETING_PROMPT = `
Analyze this website and provide a comprehensive marketing analysis. Return a single JSON object with all sections.

IMPORTANT SCORING GUIDANCE:
- Score HONESTLY based on what you actually see, not brand reputation
- Most SMB websites realistically score 35-55. That's normal - don't inflate scores
- 71-85 = genuinely STRONG marketing (above average), not just "decent"
- 86-100 = EXCELLENT (top tier, rare) - reserve for truly exceptional execution
- If content is limited (login walls, bot protection), score based on what's visible
- Well-executed basics (clear messaging, good CTA, mobile-friendly) should reach 50-65

## SECTION 1: MESSAGING ANALYSIS
Analyze the website's messaging:
- Core value proposition clarity
- Target audience identification
- Emotional hooks used
- Credibility indicators (testimonials, logos, stats)
- Call-to-action effectiveness

## SECTION 2: BRAND HEALTH
Evaluate brand perception:
- Voice and tone consistency
- Brand personality traits
- Visual identity observations
- Memorability factors
- Trust perception elements
- Competitor differentiation

## SECTION 3: CONTENT STRATEGY
Assess content approach:
- Content pillars (3-5 themes)
- Format recommendations
- Topic clusters
- Differentiation angles
- Publishing cadence suggestions

## SECTION 4: AD ANGLES
Generate advertising ideas:
- 5 ad hooks/headlines
- 3 psychological triggers
- Platform-specific creative direction
- Audience angle variations

Return JSON in this exact format:
{
  "messaging": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "headlineAnalysis": "<headline effectiveness and clarity analysis>",
      "valuePropositionClarity": "<value proposition clarity and strength>",
      "differentiationSignals": "<how they differentiate from competitors>",
      "ctaAnalysis": "<cta effectiveness and recommendations>",
      "brandVoice": "<brand voice consistency and personality>"
    }
  },
  "brandHealth": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "voiceToneAnalysis": "<voice analysis>",
      "brandPersonality": "<personality traits>",
      "visualIdentityNotes": "<visual observations>",
      "memorabilityScore": "<memorability assessment>",
      "trustPerception": "<trust analysis>",
      "brandConsistency": "<consistency evaluation>",
      "competitorDifferentiation": "<differentiation analysis>"
    }
  },
  "content": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "contentPillars": ["<pillar1>", "<pillar2>", "<pillar3>"],
      "formatRecommendations": ["<format1>", "<format2>"],
      "topicClusters": ["<topic1>", "<topic2>"],
      "differentiationAngles": ["<angle1>", "<angle2>"],
      "publishingCadence": "<cadence recommendation>",
      "platformGuidance": {"blog": "<guidance>", "social": "<guidance>"}
    }
  },
  "adAngles": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "adHooks": ["<hook1>", "<hook2>", "<hook3>", "<hook4>", "<hook5>"],
      "headlineSuggestions": ["<headline1>", "<headline2>", "<headline3>"],
      "psychologicalTriggers": ["<trigger1>", "<trigger2>", "<trigger3>"],
      "platformCreativeDirection": {"facebook": "<direction>", "google": "<direction>", "linkedin": "<direction>"},
      "audienceAngleVariations": ["<variation1>", "<variation2>"]
    }
  }
}

IMPORTANT - Issue Count Based on Score:
- For scores 70-100: Provide only 1-2 high-priority issues (the site is already doing well)
- For scores 50-69: Provide 2-3 medium-priority issues
- For scores below 50: Provide 3-5 issues covering all priority levels

Always provide 3-5 quick wins regardless of score (opportunities exist at any level).
`;

export const TECHNICAL_DISTRIBUTION_PROMPT = `
Analyze this website's technical aspects and distribution potential. Return a single JSON object with all sections.

NOTE: Technical Performance is analyzed separately using rules-based checks. Focus on the sections below.

IMPORTANT SCORING GUIDANCE:
- Score HONESTLY based on what you actually see, not brand reputation
- Most SMB websites realistically score 35-55. That's normal - don't inflate scores
- 71-85 = genuinely STRONG marketing (above average), not just "decent"
- 86-100 = EXCELLENT (top tier, rare) - reserve for truly exceptional execution
- If content is limited (login walls, bot protection), score based on what's visible
- Well-executed basics (clear messaging, good CTA, mobile-friendly) should reach 50-65

## SECTION 1: SEO OPPORTUNITIES
Analyze SEO factors:
- Keyword opportunities
- Meta tag assessment
- Content gaps
- Link building opportunities
- Local SEO potential

## SECTION 2: CONVERSION OPTIMIZATION
Assess conversion factors:
- Friction points in user journey
- Trust signal audit
- CTA optimization opportunities
- Page structure analysis
- Social proof assessment
- Above-fold effectiveness

## SECTION 4: DISTRIBUTION STRATEGY
Recommend distribution channels:
- Channel recommendations with fit scores (1-10)
- Content-channel mapping
- Tone guidance per platform
- Partnership suggestions

## SECTION 5: AI SEARCH VISIBILITY
Evaluate AI search readiness:
- AEO (Answer Engine Optimization) score
- Entity clarity
- Citation readiness
- Content structure for AI
- Schema markup analysis
- FAQ opportunities

## SECTION 6: DESIGN AUTHENTICITY
Analyze the website for AI-generated design patterns and authenticity:

### Cliché Phrase Detection
Scan the copy for these common AI-generated phrases:
- "transform your", "everything you need to", "join thousands of", "unlock the power"
- "revolutionize your", "game-changing", "next-level", "cutting-edge"
- "seamlessly integrate", "effortlessly", "empower your"
- Rate severity: high (5+ phrases), medium (2-4), low (1), none (0)

### Layout Pattern Analysis
Identify common AI-generated page structures:
- Classic pattern: Hero section → Features grid → Pricing table → Final CTA
- Alternative patterns: Video hero, Story-driven, Product-led, etc.
- Rate authenticity: unique (custom structure), common (variations on theme), generic (exact AI template)

### Icon Library Detection
Check for default icon libraries:
- Look for consistent SVG stroke patterns (typical of Heroicons, Lucide)
- Check if icons appear to be from a standard library vs. custom illustrations
- Note: Heroicons signature = 24x24 viewBox, 2px stroke, round linecap

### Overall Assessment
- Provide an authenticity rating: "Authentic", "Somewhat Generic", or "AI-Generated Pattern"
- Summarize strengths (what makes it unique)
- Give 3-5 recommendations to improve authenticity

Return JSON in this exact format:
{
  "seo": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "keywordGapAnalysis": "<keyword opportunities and gaps analysis>",
      "metaTagReview": "<meta tags assessment and recommendations>",
      "contentGapIdentification": "<content gaps and missing topics>",
      "competitorKeywordInference": "<competitor keyword analysis>",
      "technicalSeoFlags": ["<flag1>", "<flag2>"]
    }
  },
  "conversion": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "frictionPoints": ["<point1>", "<point2>"],
      "trustSignalAudit": "<audit>",
      "ctaOptimization": "<recommendations>",
      "pageStructureAnalysis": "<analysis>",
      "socialProofAssessment": "<assessment>",
      "aboveFoldEffectiveness": "<effectiveness>"
    }
  },
  "distribution": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "channelRecommendations": [
        {"channel": "LinkedIn", "fit": <1-10>, "rationale": "<why>"},
        {"channel": "Twitter", "fit": <1-10>, "rationale": "<why>"},
        {"channel": "Email", "fit": <1-10>, "rationale": "<why>"},
        {"channel": "SEO/Blog", "fit": <1-10>, "rationale": "<why>"}
      ],
      "contentChannelMapping": {"blog": ["<channel1>"], "video": ["<channel2>"]},
      "tonePerPlatform": {"linkedin": "<tone>", "twitter": "<tone>"},
      "partnershipSuggestions": ["<suggestion1>", "<suggestion2>"]
    }
  },
  "aiSearch": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary>",
    "keyIssues": [{"problem": "<issue>", "solution": "<fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<action>", "impact": "<result>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "aeoScore": <0-100>,
      "entityClarity": "<clarity assessment>",
      "citationReadiness": "<readiness>",
      "aiSearchAppearance": ["<query1>", "<query2>"],
      "contentStructureForAI": "<structure assessment>",
      "schemaMarkupAnalysis": "<analysis>",
      "faqOpportunities": ["<question1>", "<question2>"]
    }
  },
  "designAuthenticity": {
    "score": <0-100>,
    "summary": "<2-3 sentence summary of authenticity assessment>",
    "keyIssues": [{"problem": "<specific AI pattern detected>", "solution": "<how to fix>", "priority": "high"|"medium"|"low"}],
    "quickWins": [{"action": "<easy improvement>", "impact": "<authenticity boost>", "effort": "easy"|"medium"|"hard"}],
    "detailedAnalysis": {
      "clichePhrasesDetected": ["<phrase1>", "<phrase2>"],
      "clicheCount": <number>,
      "clicheSeverity": "high"|"medium"|"low"|"none",
      "layoutPattern": "<description of layout structure>",
      "layoutAuthenticity": "unique"|"common"|"generic",
      "layoutDescription": "<detailed layout analysis>",
      "iconLibrariesFound": ["<library1>", "<library2>"],
      "usesCustomIcons": true|false,
      "iconAnalysis": "<icon usage analysis>",
      "authenticityRating": "Authentic"|"Somewhat Generic"|"AI-Generated Pattern",
      "strengthsSummary": "<what makes this site unique>",
      "recommendations": ["<rec1>", "<rec2>", "<rec3>"]
    }
  }
}

IMPORTANT - Issue Count Based on Score:
- For scores 70-100: Provide only 1-2 high-priority issues (the site is already doing well)
- For scores 50-69: Provide 2-3 medium-priority issues
- For scores below 50: Provide 3-5 issues covering all priority levels

Always provide 3-5 quick wins regardless of score (opportunities exist at any level).
`;
