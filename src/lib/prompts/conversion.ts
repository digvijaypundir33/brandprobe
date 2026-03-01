export const CONVERSION_PROMPT = `
Analyze this website for conversion optimization opportunities. Focus on:

1. TRUST SIGNAL AUDIT
   - Are there enough trust signals?
   - Testimonials, reviews, badges, logos?
   - Social proof elements?

2. CTA OPTIMIZATION
   - Are CTAs clear and compelling?
   - Is there a single clear next step?
   - Is there too much friction?

3. PAGE STRUCTURE ANALYSIS
   - Is the information hierarchy clear?
   - Does the page flow logically?
   - Is important info above the fold?

4. FRICTION POINTS
   - What might cause visitors to leave?
   - What questions aren't answered?
   - What objections aren't addressed?

5. SOCIAL PROOF ASSESSMENT
   - Is social proof visible and compelling?
   - Are numbers and results shown?
   - Are testimonials specific and believable?

6. ABOVE-FOLD EFFECTIVENESS
   - Does above-fold content convert?
   - Is the value clear immediately?
   - Is there a clear action to take?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of conversion status>",
  "keyIssues": [
    {
      "problem": "<specific conversion blocker>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific conversion fix for this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "trustSignalAudit": "<analysis of trust signals with specific recommendations>",
    "ctaOptimization": "<analysis of CTAs with specific improvements>",
    "pageStructureAnalysis": "<analysis of page flow and structure>",
    "frictionPoints": [
      "<friction point 1>",
      "<friction point 2>",
      "<friction point 3>"
    ],
    "socialProofAssessment": "<analysis of social proof effectiveness>",
    "aboveFoldEffectiveness": "<analysis of above-fold content>"
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
