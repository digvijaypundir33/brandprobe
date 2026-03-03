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
import { CORE_MARKETING_PROMPT, TECHNICAL_DISTRIBUTION_PROMPT } from './prompts/consolidated';
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
  DesignAuthenticity,
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

  // Respect explicit AI_PROVIDER setting (highest priority)
  const provider = process.env.AI_PROVIDER?.toLowerCase() as AIProvider;
  if (provider && ['anthropic', 'openai', 'groq', 'ollama'].includes(provider)) {
    return provider;
  }

  // Auto-detect based on available API keys (ollama doesn't need a key)
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OLLAMA_BASE_URL) return 'ollama';

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
 * Get the number of parallel API calls to use in legacy mode
 * @param provider - The AI provider being used
 * @returns Number of parallel calls (1-9)
 *
 * Configuration priority:
 * 1. AI_PARALLEL_CALLS (new, provider-agnostic)
 * 2. OLLAMA_PARALLEL_CALLS (deprecated, backward compatibility)
 * 3. Provider defaults (Ollama: 3, Cloud: 9)
 */
function getParallelCallsConfig(provider: AIProvider): number {
  // Priority 1: Check new AI_PARALLEL_CALLS
  const aiParallelCalls = process.env.AI_PARALLEL_CALLS;
  if (aiParallelCalls) {
    const parsed = parseInt(aiParallelCalls, 10);
    if (!isNaN(parsed)) {
      // Clamp between 1 and 9 (max is 9 since we have 9 API calls in legacy mode)
      const clamped = Math.max(1, Math.min(9, parsed));
      if (parsed !== clamped) {
        console.warn(`[AI] AI_PARALLEL_CALLS=${parsed} is out of range. Using ${clamped} (valid range: 1-9)`);
      }
      return clamped;
    }
    console.warn(`[AI] Invalid AI_PARALLEL_CALLS value: "${aiParallelCalls}". Using provider default.`);
  }

  // Priority 2: Check deprecated OLLAMA_PARALLEL_CALLS
  if (provider === 'ollama' && process.env.OLLAMA_PARALLEL_CALLS) {
    console.warn('[AI] OLLAMA_PARALLEL_CALLS is deprecated. Use AI_PARALLEL_CALLS instead.');
    const parsed = parseInt(process.env.OLLAMA_PARALLEL_CALLS, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(9, parsed));
      if (parsed !== clamped) {
        console.warn(`[AI] OLLAMA_PARALLEL_CALLS=${parsed} is out of range. Using ${clamped} (valid range: 1-9)`);
      }
      return clamped;
    }
  }

  // Priority 3: Provider-specific defaults
  return provider === 'ollama' ? 3 : 9;
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

// Types for consolidated responses
interface CoreMarketingResponse {
  messaging: MessagingAnalysis;
  brandHealth: BrandHealth;
  content: ContentStrategy;
  adAngles: AdAngles;
}

interface TechnicalDistributionResponse {
  seo: SeoOpportunities;
  conversion: ConversionOptimization;
  distribution: DistributionStrategy;
  aiSearch: AISearchVisibility;
  designAuthenticity: DesignAuthenticity;
}

// Default section template for when AI doesn't return complete data
function createDefaultSection(sectionName: string): Record<string, unknown> {
  return {
    score: 50,
    summary: `Analysis for ${sectionName} is being processed.`,
    keyIssues: [],
    quickWins: [],
    detailedAnalysis: {},
  };
}

// Ensure a section has required fields
function ensureSection<T extends { score?: number; summary?: string; keyIssues?: unknown[]; quickWins?: unknown[] }>(
  section: T | undefined,
  sectionName: string
): T {
  if (!section || typeof section !== 'object') {
    return createDefaultSection(sectionName) as T;
  }
  return {
    ...createDefaultSection(sectionName),
    ...section,
    score: section.score ?? 50,
    summary: section.summary ?? `Analysis for ${sectionName}.`,
    keyIssues: section.keyIssues ?? [],
    quickWins: section.quickWins ?? [],
  } as T;
}

/**
 * Analyze website using consolidated prompts (2 calls instead of 9)
 * This is ~4x faster for local Ollama models
 * Note: Technical Performance is analyzed separately using rules-based checks
 */
export async function analyzeWebsite(
  websiteContent: string,
  technical: TechnicalPerformance,
  brandConfig?: { baselineScores?: Record<string, number>; brandInfo?: any }
): Promise<{
  messaging: MessagingAnalysis;
  seo: SeoOpportunities;
  content: ContentStrategy;
  adAngles: AdAngles;
  conversion: ConversionOptimization;
  distribution: DistributionStrategy;
  aiSearch: AISearchVisibility;
  technical: TechnicalPerformance;
  brandHealth: BrandHealth;
  designAuthenticity: DesignAuthenticity;
}> {
  const provider = getAIProvider();
  console.log(`[AI] Using provider: ${provider}${provider === 'ollama' ? ` (model: ${MODELS.ollama})` : ''}`);

  // Use consolidated prompts (2 calls instead of 9)
  // This reduces total time from ~4 min to ~1 min for Ollama
  const useConsolidated = process.env.USE_CONSOLIDATED_PROMPTS !== 'false';

  if (useConsolidated) {
    // Consolidated prompts run in PARALLEL (2 calls at same time)
    console.log('[AI] Using consolidated prompts (2 API calls in PARALLEL)...');

    const [coreMarketing, techDistribution] = await Promise.all([
      (async () => {
        console.log('[AI] Starting: Core Marketing Analysis...');
        const result = await callAI<CoreMarketingResponse>(CORE_MARKETING_PROMPT, websiteContent);
        console.log('[AI] Completed: Core Marketing Analysis');
        return result;
      })(),
      (async () => {
        console.log('[AI] Starting: Technical & Distribution Analysis...');
        const result = await callAI<TechnicalDistributionResponse>(TECHNICAL_DISTRIBUTION_PROMPT, websiteContent);
        console.log('[AI] Completed: Technical & Distribution Analysis');
        return result;
      })(),
    ]);

    // Ensure all sections have required fields (smaller models may miss some)
    let result = {
      messaging: ensureSection(coreMarketing.messaging, 'Messaging') as MessagingAnalysis,
      brandHealth: ensureSection(coreMarketing.brandHealth, 'Brand Health') as BrandHealth,
      content: ensureSection(coreMarketing.content, 'Content Strategy') as ContentStrategy,
      adAngles: ensureSection(coreMarketing.adAngles, 'Ad Angles') as AdAngles,
      seo: ensureSection(techDistribution.seo, 'SEO') as SeoOpportunities,
      technical, // Use rules-based analysis passed in
      conversion: ensureSection(techDistribution.conversion, 'Conversion') as ConversionOptimization,
      distribution: ensureSection(techDistribution.distribution, 'Distribution') as DistributionStrategy,
      aiSearch: ensureSection(techDistribution.aiSearch, 'AI Search') as AISearchVisibility,
      designAuthenticity: ensureSection(techDistribution.designAuthenticity, 'Design Authenticity') as DesignAuthenticity,
    };

    // Apply brand baseline scores if applicable
    if (brandConfig?.baselineScores) {
      console.log('[AI] Applying brand baseline scores for major brand');
      const { baselineScores } = brandConfig;

      // Use Math.max to ensure minimum scores (never lower AI score, only raise it)
      if (baselineScores.technical !== undefined) {
        result.technical.score = Math.max(result.technical.score, baselineScores.technical);
      }
      if (baselineScores.brandHealth !== undefined) {
        result.brandHealth.score = Math.max(result.brandHealth.score, baselineScores.brandHealth);
      }
      if (baselineScores.messaging !== undefined) {
        result.messaging.score = Math.max(result.messaging.score, baselineScores.messaging);
      }
      if (baselineScores.designAuth !== undefined) {
        result.designAuthenticity.score = Math.max(result.designAuthenticity.score, baselineScores.designAuth);
      }

      console.log(`[AI] Baseline scores applied: T:${baselineScores.technical} B:${baselineScores.brandHealth} M:${baselineScores.messaging} D:${baselineScores.designAuth}`);
    }

    return result;
  }

  // Legacy: 9 separate calls with parallel batching
  // Parallelism level: configurable via AI_PARALLEL_CALLS env var
  // Default: 3 for Ollama (balance speed vs memory), 9 for cloud (all parallel)
  const parallelCalls = getParallelCallsConfig(provider);

  console.log(`[AI] Using legacy prompts (9 API calls, ${parallelCalls} parallel)...`);

  // Helper to run promises in batches
  async function runInBatches(tasks: (() => Promise<unknown>)[], batchSize: number): Promise<unknown[]> {
    const results: unknown[] = [];
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(tasks.length / batchSize);
      console.log(`[AI] Running batch ${batchNum}/${totalBatches} (${batch.length} calls)...`);
      const batchResults = await Promise.all(batch.map(task => task()));
      results.push(...batchResults);
    }
    return results;
  }

  const tasks: (() => Promise<unknown>)[] = [
    () => callAI<MessagingAnalysis>(MESSAGING_PROMPT, websiteContent),
    () => callAI<SeoOpportunities>(SEO_PROMPT, websiteContent),
    () => callAI<ContentStrategy>(CONTENT_PROMPT, websiteContent),
    () => callAI<AdAngles>(AD_ANGLES_PROMPT, websiteContent),
    () => callAI<ConversionOptimization>(CONVERSION_PROMPT, websiteContent),
    () => callAI<DistributionStrategy>(DISTRIBUTION_PROMPT, websiteContent),
    () => callAI<AISearchVisibility>(AI_SEARCH_PROMPT, websiteContent),
    () => callAI<BrandHealth>(BRAND_HEALTH_PROMPT, websiteContent),
  ];

  const results = await runInBatches(tasks, parallelCalls);
  const [messaging, seo, content, adAngles, conversion, distribution, aiSearch, brandHealth] = results;

  return {
    messaging: messaging as MessagingAnalysis,
    seo: seo as SeoOpportunities,
    content: content as ContentStrategy,
    adAngles: adAngles as AdAngles,
    conversion: conversion as ConversionOptimization,
    distribution: distribution as DistributionStrategy,
    aiSearch: aiSearch as AISearchVisibility,
    technical, // Use rules-based analysis passed in
    brandHealth: brandHealth as BrandHealth,
    designAuthenticity: ensureSection(undefined, 'Design Authenticity') as DesignAuthenticity, // Legacy mode doesn't support this yet
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
