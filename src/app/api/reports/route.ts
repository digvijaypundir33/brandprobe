import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getReportsByUserId, getUserByEmail } from '@/lib/supabase';

// GET /api/reports - Get all reports for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get user
    const user = await getUserByEmail(session.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all reports for this user
    const reports = await getReportsByUserId(user.id);

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get reports',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
