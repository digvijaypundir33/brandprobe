export const DISTRIBUTION_PROMPT = `
Analyze this website and recommend distribution strategy. Focus on:

1. CHANNEL RECOMMENDATIONS
   - Which marketing channels fit this business?
   - Rank channels by potential fit (1-10)
   - Where is their audience?

2. CONTENT-CHANNEL MAPPING
   - What content types work on which channels?
   - How to repurpose content across channels?

3. TONE/VOICE PER PLATFORM
   - How should tone adapt per platform?
   - What works on each channel?

4. PARTNERSHIP SUGGESTIONS
   - Who could they partner with?
   - What co-marketing opportunities exist?
   - What communities should they engage?

5. DISTRIBUTION QUICK WINS
   - What can they do this week?
   - What low-effort, high-impact actions?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of distribution potential>",
  "keyIssues": [
    {
      "problem": "<distribution gap>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific distribution action for this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "channelRecommendations": [
      {"channel": "<channel 1>", "fit": <1-10>, "rationale": "<why this channel>"},
      {"channel": "<channel 2>", "fit": <1-10>, "rationale": "<why this channel>"},
      {"channel": "<channel 3>", "fit": <1-10>, "rationale": "<why this channel>"},
      {"channel": "<channel 4>", "fit": <1-10>, "rationale": "<why this channel>"}
    ],
    "contentChannelMapping": {
      "<content type 1>": ["<channel a>", "<channel b>"],
      "<content type 2>": ["<channel c>", "<channel d>"]
    },
    "tonePerPlatform": {
      "twitter": "<tone guidance for Twitter/X>",
      "linkedin": "<tone guidance for LinkedIn>",
      "instagram": "<tone guidance for Instagram>"
    },
    "partnershipSuggestions": [
      "<partnership idea 1>",
      "<partnership idea 2>",
      "<partnership idea 3>"
    ]
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
