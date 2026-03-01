import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './prompts/system';
import { MESSAGING_PROMPT } from './prompts/messaging';
import { SEO_PROMPT } from './prompts/seo';
import { CONTENT_PROMPT } from './prompts/content';
import { AD_ANGLES_PROMPT } from './prompts/adAngles';
import { CONVERSION_PROMPT } from './prompts/conversion';
import { DISTRIBUTION_PROMPT } from './prompts/distribution';
import { AI_SEARCH_PROMPT } from './prompts/aiSearch';
import { TECHNICAL_PROMPT } from './prompts/technical';
import { BRAND_HEALTH_PROMPT } from './prompts/brandHealth';
import type {
  MessagingAnalysis,
  SeoOpportunities,
  ContentStrategy,
  AdAngles,
  ConversionOptimization,
  DistributionStrategy,
  AISearchVisibility,
  TechnicalPerformance,
  BrandHealth,
} from '@/types/report';
import { retry } from './utils';

// AI Provider type
export type AIProvider = 'anthropic' | 'openai' | 'groq' | 'ollama';

// Get the configured provider from environment
export function getAIProvider(): AIProvider {
  // Check for USE_LOCAL_LLAMA flag first
  if (process.env.USE_LOCAL_LLAMA === 'true') {
    return 'ollama';
  }

  const provider = process.env.AI_PROVIDER?.toLowerCase() as AIProvider;
  if (provider && ['anthropic', 'openai', 'groq', 'ollama'].includes(provider)) {
    return provider;
  }
  // Auto-detect based on available API keys (ollama doesn't need a key)
  if (process.env.OLLAMA_BASE_URL) return 'ollama';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GROQ_API_KEY) return 'groq';
  throw new Error('No AI provider configured. Set AI_PROVIDER or add an API key.');
}

// Model configurations per provider
const MODELS = {
  anthropic: 'claude-sonnet-4-5-20250929',
  openai: 'gpt-4o',
  groq: 'llama-3.3-70b-versatile',
  ollama: process.env.OLLAMA_MODEL || 'llama3.2', // Default to llama3.2, can be overridden
};

// Ollama base URL (default to localhost)
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// Initialize clients lazily
let anthropicClient: Anthropic | null = null;
let openaiClient: OpenAI | null = null;
let groqClient: Groq | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

/**
 * Parse JSON from AI response, handling potential markdown wrapping
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
 * Call Anthropic Claude API
 */
async function callAnthropic<T>(prompt: string, websiteContent: string): Promise<T> {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: MODELS.anthropic,
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
    throw new Error('No text content in Anthropic response');
  }

  return parseAIResponse<T>(textContent.text);
}

/**
 * Call OpenAI API
 */
async function callOpenAI<T>(prompt: string, websiteContent: string): Promise<T> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: MODELS.openai,
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `${prompt}\n\n---\n\nWEBSITE CONTENT TO ANALYZE:\n\n${websiteContent}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in OpenAI response');
  }

  return parseAIResponse<T>(content);
}

/**
 * Call Groq API
 */
async function callGroq<T>(prompt: string, websiteContent: string): Promise<T> {
  const client = getGroqClient();
  const response = await client.chat.completions.create({
    model: MODELS.groq,
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `${prompt}\n\n---\n\nWEBSITE CONTENT TO ANALYZE:\n\n${websiteContent}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in Groq response');
  }

  return parseAIResponse<T>(content);
}

/**
 * Call Ollama API (local)
 */
async function callOllama<T>(prompt: string, websiteContent: string): Promise<T> {
  const model = MODELS.ollama;
  const url = `${OLLAMA_BASE_URL}/api/chat`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${prompt}\n\n---\n\nWEBSITE CONTENT TO ANALYZE:\n\n${websiteContent}`,
        },
      ],
      stream: false,
      format: 'json', // Request JSON output
      options: {
        temperature: 0.7,
        num_predict: 4096,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.message?.content;

  if (!content) {
    throw new Error('No content in Ollama response');
  }

  return parseAIResponse<T>(content);
}

/**
 * Call AI with retry logic - automatically uses configured provider
 */
async function callAI<T>(prompt: string, websiteContent: string): Promise<T> {
  const provider = getAIProvider();

  return retry(async () => {
    switch (provider) {
      case 'anthropic':
        return callAnthropic<T>(prompt, websiteContent);
      case 'openai':
        return callOpenAI<T>(prompt, websiteContent);
      case 'groq':
        return callGroq<T>(prompt, websiteContent);
      case 'ollama':
        return callOllama<T>(prompt, websiteContent);
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  }, 3, 2000);
}

/**
 * Analyze all 9 sections in parallel
 */
export async function analyzeWebsite(websiteContent: string): Promise<{
  messaging: MessagingAnalysis;
  seo: SeoOpportunities;
  content: ContentStrategy;
  adAngles: AdAngles;
  conversion: ConversionOptimization;
  distribution: DistributionStrategy;
  aiSearch: AISearchVisibility;
  technical: TechnicalPerformance;
  brandHealth: BrandHealth;
}> {
  const provider = getAIProvider();
  console.log(`[AI] Using provider: ${provider}${provider === 'ollama' ? ` (model: ${MODELS.ollama})` : ''}`);

  // For Ollama, run sequentially to avoid overwhelming local resources
  if (provider === 'ollama') {
    console.log('[AI] Running sections sequentially for Ollama...');
    const messaging = await callAI<MessagingAnalysis>(MESSAGING_PROMPT, websiteContent);
    const seo = await callAI<SeoOpportunities>(SEO_PROMPT, websiteContent);
    const content = await callAI<ContentStrategy>(CONTENT_PROMPT, websiteContent);
    const adAngles = await callAI<AdAngles>(AD_ANGLES_PROMPT, websiteContent);
    const conversion = await callAI<ConversionOptimization>(CONVERSION_PROMPT, websiteContent);
    const distribution = await callAI<DistributionStrategy>(DISTRIBUTION_PROMPT, websiteContent);
    const aiSearch = await callAI<AISearchVisibility>(AI_SEARCH_PROMPT, websiteContent);
    const technical = await callAI<TechnicalPerformance>(TECHNICAL_PROMPT, websiteContent);
    const brandHealth = await callAI<BrandHealth>(BRAND_HEALTH_PROMPT, websiteContent);

    return { messaging, seo, content, adAngles, conversion, distribution, aiSearch, technical, brandHealth };
  }

  // For cloud providers, run in parallel
  const [messaging, seo, content, adAngles, conversion, distribution, aiSearch, technical, brandHealth] = await Promise.all([
    callAI<MessagingAnalysis>(MESSAGING_PROMPT, websiteContent),
    callAI<SeoOpportunities>(SEO_PROMPT, websiteContent),
    callAI<ContentStrategy>(CONTENT_PROMPT, websiteContent),
    callAI<AdAngles>(AD_ANGLES_PROMPT, websiteContent),
    callAI<ConversionOptimization>(CONVERSION_PROMPT, websiteContent),
    callAI<DistributionStrategy>(DISTRIBUTION_PROMPT, websiteContent),
    callAI<AISearchVisibility>(AI_SEARCH_PROMPT, websiteContent),
    callAI<TechnicalPerformance>(TECHNICAL_PROMPT, websiteContent),
    callAI<BrandHealth>(BRAND_HEALTH_PROMPT, websiteContent),
  ]);

  return {
    messaging,
    seo,
    content,
    adAngles,
    conversion,
    distribution,
    aiSearch,
    technical,
    brandHealth,
  };
}

/**
 * Analyze a single section (for testing or individual analysis)
 */
export async function analyzeSection(
  section: 'messaging' | 'seo' | 'content' | 'adAngles' | 'conversion' | 'distribution' | 'aiSearch' | 'technical' | 'brandHealth',
  websiteContent: string
): Promise<unknown> {
  const prompts = {
    messaging: MESSAGING_PROMPT,
    seo: SEO_PROMPT,
    content: CONTENT_PROMPT,
    adAngles: AD_ANGLES_PROMPT,
    conversion: CONVERSION_PROMPT,
    distribution: DISTRIBUTION_PROMPT,
    aiSearch: AI_SEARCH_PROMPT,
    technical: TECHNICAL_PROMPT,
    brandHealth: BRAND_HEALTH_PROMPT,
  };

  return callAI(prompts[section], websiteContent);
}
