export const CONTENT_PROMPT = `
Analyze this website and provide content strategy recommendations. Focus on:

1. CONTENT PILLARS
   - What 3-5 main content themes should they own?
   - What topics establish them as the authority?

2. FORMAT RECOMMENDATIONS
   - What content formats would work best (blog, video, podcast, etc.)?
   - What format matches their audience?

3. TOPIC CLUSTERS
   - What specific topics should they cover?
   - How should content be organized?

4. DIFFERENTIATION ANGLES
   - What unique perspectives can they bring?
   - What content would competitors NOT create?

5. PUBLISHING CADENCE
   - How often should they publish?
   - What's a realistic sustainable pace?

6. PLATFORM GUIDANCE
   - Where should this content live?
   - What platforms match their audience?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of content strategy needs>",
  "keyIssues": [
    {
      "problem": "<specific content gap>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific content piece to create this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "contentPillars": [
      "<pillar 1 with explanation>",
      "<pillar 2 with explanation>",
      "<pillar 3 with explanation>"
    ],
    "formatRecommendations": [
      "<format 1 with rationale>",
      "<format 2 with rationale>"
    ],
    "topicClusters": [
      "<specific topic cluster 1>",
      "<specific topic cluster 2>",
      "<specific topic cluster 3>"
    ],
    "differentiationAngles": [
      "<unique angle 1>",
      "<unique angle 2>"
    ],
    "publishingCadence": "<recommended frequency with rationale>",
    "platformGuidance": {
      "primary": "<main platform with reason>",
      "secondary": "<secondary platform with reason>"
    }
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
