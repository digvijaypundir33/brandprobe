import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './prompts/system';
import { MESSAGING_PROMPT } from './prompts/messaging';
import { SEO_PROMPT } from './prompts/seo';
import { CONTENT_PROMPT } from './prompts/content';
import { AD_ANGLES_PROMPT } from './prompts/adAngles';
import { CONVERSION_PROMPT } from './prompts/conversion';
import { DISTRIBUTION_PROMPT } from './prompts/distribution';
import type {
  MessagingAnalysis,
  SeoOpportunities,
  ContentStrategy,
  AdAngles,
  ConversionOptimization,
  DistributionStrategy,
} from '@/types/report';
import { retry } from './utils';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-5-20250929';

/**
 * Parse JSON from Claude response, handling potential markdown wrapping
 */
function parseClaudeResponse<T>(content: string): T {
  // Remove markdown code blocks if present
  let jsonStr = content.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  return JSON.parse(jsonStr) as T;
}

/**
 * Call Claude API with retry logic
 */
async function callClaude<T>(prompt: string, websiteContent: string): Promise<T> {
  return retry(async () => {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\n---\n\nWEBSITE CONTENT TO ANALYZE:\n\n${websiteContent}`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return parseClaudeResponse<T>(textContent.text);
  }, 3, 2000);
}

/**
 * Analyze all 6 sections in parallel
 */
export async function analyzeWebsite(websiteContent: string): Promise<{
  messaging: MessagingAnalysis;
  seo: SeoOpportunities;
  content: ContentStrategy;
  adAngles: AdAngles;
  conversion: ConversionOptimization;
  distribution: DistributionStrategy;
}> {
  const [messaging, seo, content, adAngles, conversion, distribution] = await Promise.all([
    callClaude<MessagingAnalysis>(MESSAGING_PROMPT, websiteContent),
    callClaude<SeoOpportunities>(SEO_PROMPT, websiteContent),
    callClaude<ContentStrategy>(CONTENT_PROMPT, websiteContent),
    callClaude<AdAngles>(AD_ANGLES_PROMPT, websiteContent),
    callClaude<ConversionOptimization>(CONVERSION_PROMPT, websiteContent),
    callClaude<DistributionStrategy>(DISTRIBUTION_PROMPT, websiteContent),
  ]);

  return {
    messaging,
    seo,
    content,
    adAngles,
    conversion,
    distribution,
  };
}

/**
 * Analyze a single section (for testing or individual analysis)
 */
export async function analyzeSection(
  section: 'messaging' | 'seo' | 'content' | 'adAngles' | 'conversion' | 'distribution',
  websiteContent: string
): Promise<unknown> {
  const prompts = {
    messaging: MESSAGING_PROMPT,
    seo: SEO_PROMPT,
    content: CONTENT_PROMPT,
    adAngles: AD_ANGLES_PROMPT,
    conversion: CONVERSION_PROMPT,
    distribution: DISTRIBUTION_PROMPT,
  };

  return callClaude(prompts[section], websiteContent);
}
