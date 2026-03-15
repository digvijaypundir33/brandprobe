import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await params;

  try {
    // Fetch current report
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('share_count')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Increment share count
    const newShareCount = (report.share_count || 0) + 1;

    const { error: updateError } = await supabaseAdmin
      .from('reports')
      .update({
        share_count: newShareCount,
        last_shared_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('Failed to update share count:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update share count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      shareCount: newShareCount,
    });
  } catch (error) {
    console.error('Failed to increment share count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment share count' },
      { status: 500 }
    );
  }
}
