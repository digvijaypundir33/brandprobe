import { NextRequest, NextResponse } from 'next/server';
import { incrementShowcaseClicks, getReportById } from '@/lib/supabase';

// POST /api/showcase/[id]/click - Track click-through to report (unique views via cookie)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // Verify report exists and is showcased
    const report = await getReportById(reportId);
    if (!report || !report.showcaseEnabled) {
      return NextResponse.json(
        { success: false, error: 'Showcase not found' },
        { status: 404 }
      );
    }

    // Check if user has already viewed this showcase (cookie-based tracking)
    const cookieName = `showcase_viewed_${reportId}`;
    const hasViewed = request.cookies.get(cookieName);

    // Only increment if this is a unique view
    if (!hasViewed) {
      // Increment clicks (don't await to not slow down response)
      incrementShowcaseClicks(reportId).catch(console.error);

      // Set cookie to mark as viewed (expires in 24 hours)
      const response = NextResponse.json({ success: true, counted: true });
      response.cookies.set(cookieName, '1', {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });

      return response;
    }

    // Already viewed, don't increment
    return NextResponse.json({ success: true, counted: false });
  } catch (error) {
    console.error('Track showcase click error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
