import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Check sites
    const { data: sites, error: sitesError } = await supabaseAdmin
      .from('sites')
      .select('url, domain, last_scanned_at, total_scans, created_at')
      .order('last_scanned_at', { ascending: false, nullsFirst: false })
      .limit(20);

    // Check ready reports
    const { data: reports, error: reportsError } = await supabaseAdmin
      .from('reports')
      .select('id, url, status, overall_score, created_at')
      .eq('status', 'ready')
      .order('created_at', { ascending: false })
      .limit(20);

    // Check all reports by status
    const { data: allReports, error: allReportsError } = await supabaseAdmin
      .from('reports')
      .select('status')
      .order('created_at', { ascending: false })
      .limit(100);

    const statusCounts = allReports?.reduce((acc: any, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      sites: sites || [],
      sitesCount: sites?.length || 0,
      sitesError,
      reports: reports || [],
      reportsCount: reports?.length || 0,
      reportsError,
      statusCounts,
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
