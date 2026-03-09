import { NextRequest, NextResponse } from 'next/server';
import { getReportsBySiteId, getReportById } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * GET /api/reports/history?siteId=xxx
 * Returns all scans for a site with summary data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const reportId = searchParams.get('reportId');

    // Get session to verify access
    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // If reportId provided, get siteId from that report
    let targetSiteId = siteId;
    if (reportId && !siteId) {
      const report = await getReportById(reportId);
      if (!report) {
        return NextResponse.json(
          { success: false, error: 'Report not found' },
          { status: 404 }
        );
      }
      targetSiteId = report.siteId;
    }

    if (!targetSiteId) {
      return NextResponse.json(
        { success: false, error: 'siteId or reportId is required' },
        { status: 400 }
      );
    }

    // Get all reports for this site
    const reports = await getReportsBySiteId(targetSiteId);

    // Filter to only ready reports and map to summary format
    const history = reports
      .filter((r) => r.status === 'ready')
      .map((report) => ({
        id: report.id,
        scanNumber: report.scanNumber ?? 1,
        createdAt: report.createdAt,
        overallScore: report.overallScore ?? 0,
        scoreChange: report.scoreChange,
        sectionScores: {
          messaging: report.messagingScore ?? 0,
          seo: report.seoScore ?? 0,
          content: report.contentScore ?? 0,
          ads: report.adsScore ?? 0,
          conversion: report.conversionScore ?? 0,
          distribution: report.distributionScore ?? 0,
          aiSearch: report.aiSearchScore ?? 0,
          technical: report.technicalScore ?? 0,
          brandHealth: report.brandHealthScore ?? 0,
          designAuth: report.designAuthenticityScore ?? 0,
        },
        issuesSummary: report.issueComparison?.summary ?? null,
      }));

    return NextResponse.json({
      success: true,
      siteId: targetSiteId,
      totalScans: history.length,
      history,
    });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
