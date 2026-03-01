export const MESSAGING_PROMPT = `
Analyze this website's messaging and positioning. Focus on:

1. HEADLINE ANALYSIS
   - Is the main headline clear and specific?
   - Does it communicate the value proposition immediately?
   - Is it differentiated from competitors?

2. VALUE PROPOSITION CLARITY
   - Can a visitor understand what this company does in 5 seconds?
   - Is the benefit to the customer clear?
   - Are there specific outcomes or results mentioned?

3. DIFFERENTIATION SIGNALS
   - What makes this different from alternatives?
   - Is the positioning clear (who is this for)?
   - Are there unique angles or approaches highlighted?

4. CTA ANALYSIS
   - Are CTAs clear and action-oriented?
   - Is there a logical next step for visitors?
   - Is there urgency or motivation to act?

5. BRAND VOICE
   - Is the tone consistent?
   - Does it match the target audience?
   - Is it memorable or generic?

Return JSON in this exact format:
{
  "score": <0-100>,
  "summary": "<2-3 sentence summary of messaging effectiveness>",
  "keyIssues": [
    {
      "problem": "<specific issue with example from website>",
      "solution": "<actionable fix for this specific issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific actionable fix>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "headlineAnalysis": "<detailed analysis of their headline with specific suggestions>",
    "valuePropositionClarity": "<analysis of how clear their value prop is>",
    "differentiationSignals": "<what makes them different or why they're not differentiated>",
    "ctaAnalysis": "<analysis of their calls-to-action>",
    "brandVoice": "<analysis of their brand voice and tone>"
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.
`;
