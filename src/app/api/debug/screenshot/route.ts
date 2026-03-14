import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('reportId');

  if (!reportId) {
    return NextResponse.json({ error: 'reportId required' }, { status: 400 });
  }

  try {
    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .select('scraped_data, design_authenticity')
      .eq('id', reportId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      scrapedData: report.scraped_data,
      designAuth: report.design_authenticity,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
