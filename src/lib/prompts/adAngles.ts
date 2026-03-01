export const AD_ANGLES_PROMPT = `
Analyze this website and suggest ad angles and creative directions. Focus on:

1. AD HOOKS
   - What attention-grabbing hooks would work?
   - What's the compelling opening line?

2. PSYCHOLOGICAL TRIGGERS
   - What pain points can be leveraged?
   - What desires or aspirations to tap into?
   - What urgency or scarcity angles exist?

3. AUDIENCE ANGLE VARIATIONS
   - Different angles for different audience segments
   - What variations would test well?

4. HEADLINE/COPY SUGGESTIONS
   - Specific ad headlines
   - Body copy directions

5. PLATFORM-SPECIFIC CREATIVE
   - What would work on Facebook/Instagram?
   - What would work on Google?
   - What would work on LinkedIn?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of ad potential>",
  "keyIssues": [
    {
      "problem": "<why current messaging won't work in ads>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific ad to test this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "adHooks": [
      "<hook 1 - full opening line>",
      "<hook 2 - full opening line>",
      "<hook 3 - full opening line>"
    ],
    "psychologicalTriggers": [
      "<trigger 1 with how to use it>",
      "<trigger 2 with how to use it>",
      "<trigger 3 with how to use it>"
    ],
    "audienceAngleVariations": [
      "<angle for audience segment 1>",
      "<angle for audience segment 2>",
      "<angle for audience segment 3>"
    ],
    "headlineSuggestions": [
      "<specific headline 1>",
      "<specific headline 2>",
      "<specific headline 3>"
    ],
    "copySuggestions": [
      "<body copy direction 1>",
      "<body copy direction 2>"
    ],
    "platformCreativeDirection": {
      "facebook": "<specific direction for FB/IG>",
      "google": "<specific direction for Google Ads>",
      "linkedin": "<specific direction for LinkedIn>"
    }
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
