export const AI_SEARCH_PROMPT = `
Analyze this website for AI Search Visibility and Answer Engine Optimization (AEO).
This measures how well the brand will appear in AI-powered search engines like ChatGPT, Perplexity, Google AI Overviews, and Microsoft Copilot.

IMPORTANT: Check the "Technical Data" section in the input for actual schema markup detection:
- If "Structured Data: Yes" - the site HAS JSON-LD schema markup (award 15-20 points for this)
- If "Schema Types: Organization, FAQPage, etc." - these are the detected schemas (recognize this achievement)
- If "FAQ Schema: Yes" - the site has FAQ structured data (award 10-15 points for this)
- DO NOT suggest adding schema markup if it's already present according to Technical Data

Focus on:

1. ENTITY CLARITY
   - Is the brand identity clear and consistent?
   - Can AI systems easily identify who they are and what they do?
   - Is there a clear "About" or company description?

2. CITATION READINESS
   - Is content structured in a way that AI can cite?
   - Are there clear, quotable statements and facts?
   - Is information organized with clear headings and sections?

3. AI SEARCH APPEARANCE POTENTIAL
   - What types of queries might this brand appear for in AI search?
   - What topics could they be cited as an authority on?
   - Are they answering questions their audience asks?

4. CONTENT STRUCTURE FOR AI
   - Is there structured data (JSON-LD) that helps AI understand the content?
   - Are there FAQ sections that could be cited?
   - Is content comprehensive and well-organized?

5. SCHEMA MARKUP ANALYSIS (Use Technical Data section)
   - Check "Structured Data" and "Schema Types" from Technical Data section
   - If schemas are present, acknowledge them positively
   - Only suggest additional schemas if there are clear gaps
   - DO NOT suggest adding schemas that already exist

6. FAQ OPPORTUNITIES
   - What questions should they answer on their site?
   - What FAQ content would help them get cited by AI?

SCORING GUIDELINES:
- Base score starts at 30 for any functional website
- +15-20 points if "Structured Data: Yes" in Technical Data
- +10-15 points if "FAQ Schema: Yes" in Technical Data
- +10-15 points for clear entity/brand identity
- +10-15 points for citable, well-structured content
- +5-10 points for comprehensive FAQ content on page
- Deduct points only for genuine missing elements, not for things already present

Return JSON in this exact format:
{
  "score": <0-100 - calculate based on scoring guidelines above>,
  "summary": "<2-3 sentence summary of AI search visibility status>",
  "keyIssues": [
    {
      "problem": "<specific AI search visibility issue>",
      "solution": "<actionable fix for this issue>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "quickWins": [
    {
      "action": "<specific AI search fix they can do this week>",
      "impact": "<expected result or improvement>",
      "effort": "easy" | "medium" | "hard"
    }
  ],
  "detailedAnalysis": {
    "aeoScore": <0-100 specific score for Answer Engine Optimization>,
    "entityClarity": "<analysis of how clear the brand identity is for AI systems>",
    "citationReadiness": "<analysis of how citable the content is>",
    "aiSearchAppearance": [
      "<query type they could appear for 1>",
      "<query type they could appear for 2>",
      "<query type they could appear for 3>"
    ],
    "contentStructureForAI": "<analysis of content structure for AI consumption>",
    "schemaMarkupAnalysis": "<MUST reference Technical Data section - state which schemas ARE present before suggesting additions>",
    "faqOpportunities": [
      "<FAQ question they should answer 1>",
      "<FAQ question they should answer 2>",
      "<FAQ question they should answer 3>"
    ],
    "recommendations": [
      "<specific recommendation 1>",
      "<specific recommendation 2>",
      "<specific recommendation 3>"
    ]
  }
}

Provide 3-5 key issues with solutions, prioritized by impact. Provide 3-5 quick wins that are easy to implement.

CRITICAL: Do NOT list "add schema markup" as an issue or quick win if Technical Data shows "Structured Data: Yes".
Instead, focus on content improvements, additional schema types, or optimization of existing markup.
`;
