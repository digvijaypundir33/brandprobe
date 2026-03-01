import { NextRequest, NextResponse } from 'next/server';
import { getReportById, recordReportView } from '@/lib/supabase';

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

    // Record view (don't await to not slow down response)
    const source = request.nextUrl.searchParams.get('source') as 'direct' | 'shared' | 'email' | null;
    recordReportView(id, source || 'direct').catch(console.error);

    return NextResponse.json({
      success: true,
      report,
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
