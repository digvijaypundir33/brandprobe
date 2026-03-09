import { NextRequest, NextResponse } from 'next/server';
import { getReportById } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * GET /api/reports/compare?report1=xxx&report2=yyy
 * Returns side-by-side comparison data for two reports
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const report1Id = searchParams.get('report1');
    const report2Id = searchParams.get('report2');

    if (!report1Id || !report2Id) {
      return NextResponse.json(
        { success: false, error: 'Both report1 and report2 are required' },
        { status: 400 }
      );
    }

    // Get session to verify access
    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch both reports
    const [report1, report2] = await Promise.all([
      getReportById(report1Id),
      getReportById(report2Id),
    ]);

    if (!report1 || !report2) {
      return NextResponse.json(
        { success: false, error: 'One or both reports not found' },
        { status: 404 }
      );
    }

    // Verify both reports are for the same site
    if (report1.siteId !== report2.siteId) {
      return NextResponse.json(
        { success: false, error: 'Reports must be for the same site' },
        { status: 400 }
      );
    }

    // Build comparison data
    const sections = [
      'messaging',
      'seo',
      'content',
      'ads',
      'conversion',
      'distribution',
      'aiSearch',
      'technical',
      'brandHealth',
      'designAuth',
    ] as const;

    type SectionKey = typeof sections[number];

    const scoreMap: Record<SectionKey, { field: keyof typeof report1 }> = {
      messaging: { field: 'messagingScore' },
      seo: { field: 'seoScore' },
      content: { field: 'contentScore' },
      ads: { field: 'adsScore' },
      conversion: { field: 'conversionScore' },
      distribution: { field: 'distributionScore' },
      aiSearch: { field: 'aiSearchScore' },
      technical: { field: 'technicalScore' },
      brandHealth: { field: 'brandHealthScore' },
      designAuth: { field: 'designAuthenticityScore' },
    };

    const sectionComparisons = sections.map((section) => {
      const score1 = (report1[scoreMap[section].field] as number) ?? 0;
      const score2 = (report2[scoreMap[section].field] as number) ?? 0;
      const change = score2 - score1;

      return {
        section,
        report1Score: score1,
        report2Score: score2,
        change,
        status: change > 0 ? 'improved' : change < 0 ? 'declined' : 'unchanged',
      };
    });

    const comparison = {
      report1: {
        id: report1.id,
        scanNumber: report1.scanNumber ?? 1,
        createdAt: report1.createdAt,
        overallScore: report1.overallScore ?? 0,
        url: report1.url,
      },
      report2: {
        id: report2.id,
        scanNumber: report2.scanNumber ?? 1,
        createdAt: report2.createdAt,
        overallScore: report2.overallScore ?? 0,
        url: report2.url,
      },
      overallChange: (report2.overallScore ?? 0) - (report1.overallScore ?? 0),
      sectionComparisons,
      summary: {
        improved: sectionComparisons.filter((s) => s.status === 'improved').length,
        declined: sectionComparisons.filter((s) => s.status === 'declined').length,
        unchanged: sectionComparisons.filter((s) => s.status === 'unchanged').length,
      },
    };

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error('Compare API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compare reports' },
      { status: 500 }
    );
  }
}
