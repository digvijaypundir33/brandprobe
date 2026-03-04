import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getReportById } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * PATCH /api/report/[id]/privacy
 * Update report privacy setting (public/private)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get report to verify ownership
    const report = await getReportById(id);
    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Get report owner
    const { data: owner } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', report.userId)
      .single();

    if (!owner || owner.email !== session.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - You can only update privacy for your own reports' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isPublic must be a boolean' },
        { status: 400 }
      );
    }

    // Update privacy setting
    const { error } = await supabaseAdmin
      .from('reports')
      .update({ is_public: isPublic })
      .eq('id', id);

    if (error) {
      console.error('Privacy update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update privacy setting' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isPublic,
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update privacy setting',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
