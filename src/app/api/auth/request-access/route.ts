import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail, createMagicLink, getReportsByUserId } from '@/lib/supabase';
import { sendMagicLinkEmail } from '@/lib/email';

const requestSchema = z.object({
  email: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    // Check if user exists
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'No account found',
          message: 'No BrandProbe account found with this email. Create a free report first!',
        },
        { status: 404 }
      );
    }

    // Check if user has any reports
    const reports = await getReportsByUserId(user.id);

    if (!reports || reports.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No reports found',
          message: 'You don\'t have any reports yet. Create your first free report!',
          redirectUrl: '/',
        },
        { status: 404 }
      );
    }

    // Create magic link for dashboard access (no specific report)
    const magicLink = await createMagicLink(email);
    const emailResult = await sendMagicLinkEmail(email, magicLink.token, undefined, true);

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
      message: 'Access link sent to your email',
    });
  } catch (error) {
    console.error('Request access error:', error);

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
        error: 'Failed to send access link',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
