import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createMagicLink } from '@/lib/supabase';
import { sendMagicLinkEmail } from '@/lib/email';
import { isValidEmail } from '@/lib/utils';

const sendMagicLinkSchema = z.object({
  email: z.string().email('Valid email is required'),
  reportId: z.string().uuid().optional(),
});

// Rate limiting: track email requests in memory (for MVP)
// In production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const limit = rateLimitMap.get(email);

  if (!limit || now > limit.resetAt) {
    // Reset or create new limit
    rateLimitMap.set(email, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour
    });
    return { allowed: true };
  }

  if (limit.count >= 3) {
    // Max 3 requests per hour
    const retryAfter = Math.ceil((limit.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  limit.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, reportId } = sendMagicLinkSchema.parse(body);

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(email);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: `Please wait ${rateLimit.retryAfter} seconds before requesting another link`,
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Create magic link token
    const magicLink = await createMagicLink(email, reportId);

    // Send email
    const emailResult = await sendMagicLinkEmail(email, magicLink.token, reportId);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          message: 'Please try again or contact support',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent! Check your email to continue.',
      expiresIn: 900, // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Send magic link error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send magic link',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
