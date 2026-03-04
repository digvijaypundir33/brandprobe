import { NextRequest, NextResponse } from 'next/server';
import { getReportById, recordReportView } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = await getReportById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Get user subscription status and email
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('subscription_status, email, one_time_purchase_id')
      .eq('id', report.userId)
      .single();

    const subscriptionStatus = user?.subscription_status || 'free';
    const userEmail = user?.email || '';

    // Get current session to check if viewer is the report owner
    const session = await getSessionFromRequest(request);
    const isOwner = session?.email === userEmail;

    // Check privacy setting - if report is private and viewer is not owner, deny access
    const isPublic = report.isPublic !== false; // Default to public if field doesn't exist
    if (!isPublic && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'This report is private. Please log in as the owner to view it.' },
        { status: 403 }
      );
    }

    // Determine if user has access to all sections
    // - free: 4 sections visible (Messaging, SEO, Content, Ads)
    // - starter: All 10 sections for owner
    // - active (Pro): All 10 sections for owner
    const hasFullAccess =
      (subscriptionStatus === 'active' && isOwner) ||
      (subscriptionStatus === 'starter' && isOwner);

    // Record view (don't await to not slow down response)
    const source = request.nextUrl.searchParams.get('source') as 'direct' | 'shared' | 'email' | null;
    recordReportView(id, source || 'direct').catch(console.error);

    // Strip locked section data for free users
    let sanitizedReport = report;
    if (!hasFullAccess) {
      // For free users, completely remove locked sections
      // Only keep scores (which are in separate fields at report level)
      sanitizedReport = {
        ...report,
        // Locked sections - completely remove all data
        conversionOptimization: null,
        distributionStrategy: null,
        aiSearchVisibility: null,
        technicalPerformance: null,
        brandHealth: null,
        designAuthenticity: null,
      };
    }

    return NextResponse.json({
      success: true,
      report: sanitizedReport,
      subscriptionStatus,
      hasFullAccess,
      userEmail,
    });
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get report',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get current session to verify ownership
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

    // Get user to verify ownership
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('id', report.userId)
      .single();

    if (!user || user.email !== session.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - You can only delete your own reports' },
        { status: 403 }
      );
    }

    // Delete the report
    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete report error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete report' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete report',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
