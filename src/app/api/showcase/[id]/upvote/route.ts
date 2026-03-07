import { NextRequest, NextResponse } from 'next/server';
import { getReportById, addShowcaseUpvote, removeShowcaseUpvote, hasUserUpvoted } from '@/lib/supabase';
import { cookies } from 'next/headers';

// POST /api/showcase/[id]/upvote - Toggle upvote for a showcase entry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // Get email from request body or session
    const body = await request.json().catch(() => ({}));
    let email = body.email;

    // Try to get from session cookie if not provided
    if (!email) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('session');
      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie.value);
          email = session.email;
        } catch {
          // Invalid session
        }
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required to upvote' },
        { status: 400 }
      );
    }

    // Verify report exists and is showcased
    const report = await getReportById(reportId);
    if (!report || !report.showcaseEnabled) {
      return NextResponse.json(
        { success: false, error: 'Showcase not found' },
        { status: 404 }
      );
    }

    // Check if already upvoted
    const alreadyUpvoted = await hasUserUpvoted(reportId, email);

    if (alreadyUpvoted) {
      // Remove upvote
      const result = await removeShowcaseUpvote(reportId, email);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, action: 'removed', upvoted: false });
    } else {
      // Add upvote
      const result = await addShowcaseUpvote(reportId, email);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, action: 'added', upvoted: true });
    }
  } catch (error) {
    console.error('Toggle upvote error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle upvote' },
      { status: 500 }
    );
  }
}

// GET /api/showcase/[id]/upvote - Check if user has upvoted
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;
    const { searchParams } = new URL(request.url);
    let email = searchParams.get('email');

    // Try to get from session cookie if not provided
    if (!email) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('session');
      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie.value);
          email = session.email;
        } catch {
          // Invalid session
        }
      }
    }

    if (!email) {
      return NextResponse.json({ success: true, upvoted: false });
    }

    const upvoted = await hasUserUpvoted(reportId, email);
    return NextResponse.json({ success: true, upvoted });
  } catch (error) {
    console.error('Check upvote error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check upvote status' },
      { status: 500 }
    );
  }
}
