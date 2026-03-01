export const TECHNICAL_PROMPT = `
Analyze this website for Technical Performance and Website Health.
Use the technical data provided to assess the website's technical foundation.

Focus on:

1. PAGE SPEED ASSESSMENT
   - Based on page size and complexity, estimate performance
   - Are there obvious performance issues?
   - What could be slowing down the page?

2. MOBILE READINESS
   - Does the site appear mobile-friendly?
   - Is there a viewport meta tag?
   - Are there mobile-specific concerns?

3. SECURITY INDICATORS
   - Is HTTPS enabled?
   - Are there other security concerns visible?
   - What security improvements are needed?

4. ACCESSIBILITY FLAGS
   - Are images properly tagged with alt text?
   - Is the heading structure logical?
   - What accessibility improvements are needed?

5. CORE WEB VITALS ESTIMATE
   - Based on page structure, estimate LCP, CLS, INP potential
   - What might cause poor core web vitals?

6. STRUCTURED DATA PRESENCE
   - What schema types are present?
   - Is structured data being used effectively?
   - What's missing?

7. IMAGE OPTIMIZATION
   - Based on image alt text presence, assess image SEO
   - Are images likely optimized?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of technical health status>",
  "keyIssues": [
    {
      "problem": "<specific technical issue>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific technical fix they can do this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "pageSpeedEstimate": "<Fast|Medium|Slow>",
    "mobileReadiness": "<analysis of mobile-friendliness with specific notes>",
    "securityIndicators": [
      "<security indicator 1>",
      "<security indicator 2>",
      "<security indicator 3>"
    ],
    "accessibilityFlags": [
      "<accessibility issue 1>",
      "<accessibility issue 2>",
      "<accessibility issue 3>"
    ],
    "coreWebVitalsEstimate": "<analysis of likely core web vitals performance>",
    "structuredDataPresence": "<analysis of schema markup usage>",
    "imageOptimization": "<analysis of image optimization state>",
    "recommendations": [
      "<specific recommendation 1>",
      "<specific recommendation 2>",
      "<specific recommendation 3>"
    ]
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
