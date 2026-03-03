import { NextRequest, NextResponse } from 'next/server';
import { getReportById, recordReportView } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';

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
      .select('subscription_status, email')
      .eq('id', report.userId)
      .single();

    const subscriptionStatus = user?.subscription_status || 'free';
    const userEmail = user?.email || '';

    // Determine if user has access to all sections
    // free = 4 sections visible, starter/active = all 10 sections
    const hasFullAccess = subscriptionStatus === 'starter' || subscriptionStatus === 'active';

    // Record view (don't await to not slow down response)
    const source = request.nextUrl.searchParams.get('source') as 'direct' | 'shared' | 'email' | null;
    recordReportView(id, source || 'direct').catch(console.error);

    return NextResponse.json({
      success: true,
      report,
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
