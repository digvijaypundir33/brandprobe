import { NextRequest, NextResponse } from 'next/server';
import { getShowcaseDetail, incrementShowcaseViews } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET /api/showcase/[id]/detail - Get full showcase detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // Try to get email from session for upvote status
    let userEmail: string | undefined;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value);
        userEmail = session.email;
      } catch {
        // Invalid session
      }
    }

    const detail = await getShowcaseDetail(reportId, userEmail);

    if (!detail) {
      return NextResponse.json(
        { success: false, error: 'Showcase not found' },
        { status: 404 }
      );
    }

    // Increment views (don't await)
    incrementShowcaseViews(reportId).catch(console.error);

    return NextResponse.json({ success: true, detail });
  } catch (error) {
    console.error('Get showcase detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get showcase detail' },
      { status: 500 }
    );
  }
}
