import { NextRequest, NextResponse } from 'next/server';
import { getReportById, getShowcaseComments, addShowcaseComment, deleteShowcaseComment } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET /api/showcase/[id]/comments - Get comments for a showcase entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;
    const { searchParams } = new URL(request.url);
    const sortBy = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest';

    // Verify report exists and is showcased
    const report = await getReportById(reportId);
    if (!report || !report.showcaseEnabled) {
      return NextResponse.json(
        { success: false, error: 'Showcase not found' },
        { status: 404 }
      );
    }

    const comments = await getShowcaseComments(reportId, sortBy);
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}

// POST /api/showcase/[id]/comments - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;
    const body = await request.json();
    const { authorName, authorEmail, content } = body;

    // Validate input
    if (!authorName || !authorEmail || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and content are required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Comment too long (max 1000 characters)' },
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

    // Try to get userId from session
    let userId: string | undefined;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value);
        userId = session.userId;
      } catch {
        // Invalid session
      }
    }

    const result = await addShowcaseComment(
      {
        reportId,
        authorName,
        authorEmail,
        content,
      },
      userId
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment: result.comment });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/showcase/[id]/comments - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'Comment ID required' },
        { status: 400 }
      );
    }

    // Get userId from session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const session = JSON.parse(sessionCookie.value);
      userId = session.userId;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    const result = await deleteShowcaseComment(commentId, userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
