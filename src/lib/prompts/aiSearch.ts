export const AI_SEARCH_PROMPT = `
Analyze this website for AI Search Visibility and Answer Engine Optimization (AEO).
This measures how well the brand will appear in AI-powered search engines like ChatGPT, Perplexity, Google AI Overviews, and Microsoft Copilot.

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

5. SCHEMA MARKUP ANALYSIS
   - What schema types are present?
   - Are they using FAQ, HowTo, or Article schemas?
   - What schema types are missing that could help?

6. FAQ OPPORTUNITIES
   - What questions should they answer on their site?
   - What FAQ content would help them get cited by AI?

Return JSON in this exact format:
{
  "score": <0-100>,
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
    "schemaMarkupAnalysis": "<analysis of current schema and what's missing>",
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
`;
