export const SEO_PROMPT = `
Analyze this website's SEO and content opportunities. Focus on:

1. KEYWORD GAP ANALYSIS
   - What keywords should they be targeting based on their business?
   - What obvious keywords are they missing?
   - What long-tail opportunities exist?

2. META TAG REVIEW
   - Is the title tag optimized?
   - Is the meta description compelling and keyword-rich?
   - Are there missed opportunities in meta tags?

3. CONTENT GAP IDENTIFICATION
   - What content is missing that their audience needs?
   - What questions should they be answering?
   - What topics would establish authority?

4. COMPETITOR KEYWORD INFERENCE
   - Based on their niche, what keywords are competitors likely ranking for?
   - What content types are probably working in this space?

5. TECHNICAL SEO FLAGS
   - Any obvious technical issues from the content?
   - Heading structure issues?
   - Content organization problems?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of SEO/content status>",
  "keyIssues": [
    {
      "problem": "<specific SEO issue>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific SEO fix they can do this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "keywordGapAnalysis": "<detailed keyword opportunities>",
    "metaTagReview": "<analysis of their meta tags with specific suggestions>",
    "contentGapIdentification": "<what content they need to create>",
    "competitorKeywordInference": "<what competitors are likely ranking for>",
    "technicalSeoFlags": [
      "<technical issue 1>",
      "<technical issue 2>"
    ]
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
