export const BRAND_HEALTH_PROMPT = `
Analyze this website for Brand Health and Brand Perception.
Assess the overall brand strength, consistency, and market positioning.

Focus on:

1. BRAND CONSISTENCY
   - Is the messaging consistent across all pages?
   - Is the value proposition clear and repeated?
   - Are there conflicting messages or positioning?

2. VOICE & TONE ANALYSIS
   - What is the brand's voice? (professional, casual, technical, friendly, etc.)
   - Is the tone consistent throughout?
   - Does the voice match the target audience?

3. VISUAL IDENTITY NOTES
   - Based on content, what can be inferred about visual branding?
   - Is there a consistent style?
   - Are trust elements visually present?

4. COMPETITOR DIFFERENTIATION
   - How does this brand stand out from competitors?
   - Is the unique selling proposition clear?
   - What makes them memorable?

5. MEMORABILITY SCORE
   - Is the brand name memorable?
   - Is the tagline/headline sticky?
   - Would visitors remember this brand?

6. BRAND PERSONALITY
   - What personality traits does the brand exhibit?
   - Is there a clear brand archetype?
   - How would customers describe this brand?

7. TRUST PERCEPTION
   - Does the brand appear trustworthy?
   - Are there credibility indicators?
   - What would increase trust?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of brand health status>",
  "keyIssues": [
    {
      "problem": "<specific brand issue>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific brand improvement for this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "brandConsistency": "<analysis of brand consistency across pages>",
    "voiceToneAnalysis": "<analysis of brand voice and tone with examples>",
    "visualIdentityNotes": "<observations about visual branding based on content>",
    "competitorDifferentiation": "<how the brand differentiates from competitors>",
    "memorabilityScore": "<assessment of how memorable the brand is>",
    "brandPersonality": "<description of the brand's personality traits>",
    "trustPerception": "<analysis of trust and credibility signals>",
    "recommendations": [
      "<specific brand recommendation 1>",
      "<specific brand recommendation 2>",
      "<specific brand recommendation 3>"
    ]
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
