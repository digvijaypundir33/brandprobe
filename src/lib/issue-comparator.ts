/**
 * Issue Comparator Service
 *
 * Uses AI to semantically compare issues between scans and identify:
 * - Resolved: Issues from previous scan that are no longer present
 * - New: Issues in current scan that weren't in previous scan
 * - Persisting: Issues that exist in both scans
 */

import Groq from 'groq-sdk';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { Report, IssueComparison, ResolvedIssue, NewIssue, PersistingIssue } from '@/types/report';
import { getAIProvider } from './ai';

const ISSUE_COMPARISON_PROMPT = `You are comparing two sets of marketing issues from website scans to track improvement.

TASK: Compare the PREVIOUS issues (Set A) with the CURRENT issues (Set B) and categorize each issue.

CRITICAL: Be SEMANTIC, not literal. These are the SAME issue even if worded differently:
- "Headline lacks specific benefit statement" = "Main headline doesn't communicate distinct value"
- "No clear call-to-action" = "CTA button is missing" = "Missing call to action"
- "Page load time is slow" = "Website performance issues"

CATEGORIES:
1. RESOLVED: Issues from Set A that are NO LONGER present in Set B (user fixed them!)
2. NEW: Issues in Set B that were NOT in Set A (new problems discovered)
3. PERSISTING: Issues that appear in BOTH sets (still need to be fixed)

PREVIOUS ISSUES (Set A):
{previousIssues}

CURRENT ISSUES (Set B):
{currentIssues}

Return ONLY valid JSON in this exact format:
{
  "resolved": [
    {"category": "messaging", "previousIssue": "exact text from Set A", "confidence": "high|medium"}
  ],
  "new": [
    {"category": "seo", "issue": "exact text from Set B", "priority": "high|medium|low"}
  ],
  "persisting": [
    {"category": "conversion", "issue": "exact text from Set B", "previousIssue": "matched text from Set A"}
  ]
}

RULES:
- Use the EXACT text from the issue sets, don't paraphrase
- "confidence" for resolved: high = clearly gone, medium = might be reworded
- "priority" for new: based on impact (high = critical, medium = important, low = minor)
- If unsure whether an issue persists or is new, prefer "persisting"
- Return empty arrays if no issues in a category`;

interface AIComparisonResult {
  resolved: Array<{ category: string; previousIssue: string; confidence: 'high' | 'medium' }>;
  new: Array<{ category: string; issue: string; priority: 'high' | 'medium' | 'low' }>;
  persisting: Array<{ category: string; issue: string; previousIssue: string }>;
}

/**
 * Extract all issues from a report organized by category
 */
function extractIssuesFromReport(report: Report): Record<string, string[]> {
  const issues: Record<string, string[]> = {};

  const sections = [
    { key: 'messaging', data: report.messagingAnalysis },
    { key: 'seo', data: report.seoOpportunities },
    { key: 'content', data: report.contentStrategy },
    { key: 'ads', data: report.adAngles },
    { key: 'conversion', data: report.conversionOptimization },
    { key: 'distribution', data: report.distributionStrategy },
    { key: 'aiSearch', data: report.aiSearchVisibility },
    { key: 'technical', data: report.technicalPerformance },
    { key: 'brandHealth', data: report.brandHealth },
    { key: 'designAuth', data: report.designAuthenticity },
  ];

  for (const section of sections) {
    if (section.data?.keyIssues) {
      issues[section.key] = section.data.keyIssues.map((issue) => {
        // Issue type has 'problem' and 'solution' fields
        if (typeof issue === 'object' && issue !== null) {
          return (issue as { problem?: string; issue?: string; title?: string }).problem ||
                 (issue as { problem?: string; issue?: string; title?: string }).issue ||
                 (issue as { problem?: string; issue?: string; title?: string }).title || '';
        }
        return String(issue);
      }).filter(Boolean);
    }
  }

  return issues;
}

/**
 * Format issues for the AI prompt
 */
function formatIssuesForPrompt(issues: Record<string, string[]>): string {
  const lines: string[] = [];
  for (const [category, categoryIssues] of Object.entries(issues)) {
    if (categoryIssues.length > 0) {
      lines.push(`[${category}]`);
      categoryIssues.forEach((issue, idx) => {
        lines.push(`  ${idx + 1}. ${issue}`);
      });
    }
  }
  return lines.length > 0 ? lines.join('\n') : '(No issues found)';
}

/**
 * Parse JSON from AI response, handling markdown wrapping
 */
function parseAIResponse<T>(content: string): T {
  let jsonStr = content.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  // Try to extract JSON if there's extra text
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  return JSON.parse(jsonStr) as T;
}

/**
 * Call AI to compare issues
 */
async function callAIForComparison(prompt: string): Promise<AIComparisonResult> {
  const provider = getAIProvider();

  switch (provider) {
    case 'groq': {
      const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      return parseAIResponse<AIComparisonResult>(response.choices[0]?.message?.content || '{}');
    }

    case 'openai': {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      return parseAIResponse<AIComparisonResult>(response.choices[0]?.message?.content || '{}');
    }

    case 'anthropic': {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });
      const textContent = response.content.find((block) => block.type === 'text');
      return parseAIResponse<AIComparisonResult>(textContent?.type === 'text' ? textContent.text : '{}');
    }

    case 'ollama': {
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      const model = process.env.OLLAMA_MODEL || 'llama3.2';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
          format: 'json',
        }),
      });
      const data = await response.json();
      return parseAIResponse<AIComparisonResult>(data.message?.content || '{}');
    }

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

/**
 * Compare issues between two reports using AI
 */
export async function compareIssues(
  previousReport: Report,
  currentReport: Report
): Promise<IssueComparison> {
  const previousIssues = extractIssuesFromReport(previousReport);
  const currentIssues = extractIssuesFromReport(currentReport);

  // Build the prompt
  const prompt = ISSUE_COMPARISON_PROMPT
    .replace('{previousIssues}', formatIssuesForPrompt(previousIssues))
    .replace('{currentIssues}', formatIssuesForPrompt(currentIssues));

  console.log('[IssueComparator] Comparing issues between scans...');

  try {
    const result = await callAIForComparison(prompt);

    // Transform AI result to our types
    const resolved: ResolvedIssue[] = (result.resolved || []).map((r) => ({
      category: r.category,
      issue: r.previousIssue,
      resolvedInScan: currentReport.scanNumber || 2,
    }));

    const newIssues: NewIssue[] = (result.new || []).map((n) => ({
      category: n.category,
      issue: n.issue,
      priority: n.priority,
    }));

    const persisting: PersistingIssue[] = (result.persisting || []).map((p) => ({
      category: p.category,
      issue: p.issue,
      firstSeenScan: previousReport.scanNumber || 1,
      scanCount: 2,
    }));

    // Calculate overall progress
    const resolvedCount = resolved.length;
    const newCount = newIssues.length;
    const persistingCount = persisting.length;

    let overallProgress: 'improving' | 'stable' | 'declining';
    if (resolvedCount > newCount) {
      overallProgress = 'improving';
    } else if (newCount > resolvedCount) {
      overallProgress = 'declining';
    } else {
      overallProgress = 'stable';
    }

    console.log(`[IssueComparator] Results: ${resolvedCount} resolved, ${newCount} new, ${persistingCount} persisting`);

    return {
      resolved,
      new: newIssues,
      persisting,
      summary: {
        resolvedCount,
        newCount,
        persistingCount,
        overallProgress,
      },
    };
  } catch (error) {
    console.error('[IssueComparator] Error comparing issues:', error);

    // Return empty comparison on error
    return {
      resolved: [],
      new: [],
      persisting: [],
      summary: {
        resolvedCount: 0,
        newCount: 0,
        persistingCount: 0,
        overallProgress: 'stable',
      },
    };
  }
}
