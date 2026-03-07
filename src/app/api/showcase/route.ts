import { NextRequest, NextResponse } from 'next/server';
import {
  getShowcaseEntries,
  getReportById,
  createShowcaseProfile,
  setShowcaseEnabled,
  updateShowcaseRank,
  calculateShowcaseRank,
  getShowcaseProfileByReportId,
} from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';
import type { ShowcaseFilters, ShowcaseCategory, SHOWCASE_CATEGORIES } from '@/types/report';

// GET /api/showcase - List showcase entries (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: ShowcaseFilters = {
      category: searchParams.get('category') as ShowcaseCategory | undefined,
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined,
      maxScore: searchParams.get('maxScore') ? parseInt(searchParams.get('maxScore')!) : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as ShowcaseFilters['sortBy']) || 'rank',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const entries = await getShowcaseEntries(filters);

    // Debug logging
    console.log('[SHOWCASE API] Fetched entries:', entries.length);
    entries.forEach(entry => {
      console.log(`[SHOWCASE API] Entry: ${entry.displayName}, isPriority: ${entry.isPriority}`);
    });

    return NextResponse.json({
      success: true,
      entries,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore: entries.length === filters.limit,
      },
    });
  } catch (error) {
    console.error('Get showcase entries error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get showcase entries',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/showcase - Enable showcase for a report (authenticated)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reportId, displayName, tagline, description, iconUrl, screenshotUrl, category } = body;

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Validate category if provided
    const validCategories: readonly string[] = [
      'SaaS',
      'E-commerce',
      'Agency',
      'Portfolio',
      'Startup',
      'Blog/Media',
      'Non-profit',
      'Local Business',
      'Other',
    ];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Get report to verify ownership
    const report = await getReportById(reportId);
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
        { success: false, error: 'Forbidden - You can only showcase your own reports' },
        { status: 403 }
      );
    }

    // Check if report is public (must be public to showcase)
    if (!report.isPublic) {
      return NextResponse.json(
        { success: false, error: 'Report must be public to showcase. Please make it public first.' },
        { status: 400 }
      );
    }

    // Check if already showcased
    const existingProfile = await getShowcaseProfileByReportId(reportId);
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Report is already showcased' },
        { status: 400 }
      );
    }

    // Extract defaults from scraped data
    const scrapedData = report.scrapedData;
    const defaultName = scrapedData?.title || extractDomainFromUrl(report.url);
    const defaultTagline = scrapedData?.metaDescription || scrapedData?.heroText || 'Analyzed by BrandProbe';
    const defaultIconUrl = scrapedData?.technicalData?.hasFavicon
      ? `${new URL(report.url).origin}/favicon.ico`
      : undefined;

    // Get screenshot from design authenticity if available
    const screenshotFromReport = report.designAuthenticity?.detailedAnalysis?.screenshotUrl;

    // Create showcase profile
    const profile = await createShowcaseProfile(
      reportId,
      user.id,
      report.url,
      {
        defaultName: defaultName.slice(0, 100),
        defaultTagline: defaultTagline.slice(0, 120),
        defaultIconUrl,
      },
      {
        displayName: displayName?.slice(0, 100),
        tagline: tagline?.slice(0, 120),
        description: description?.slice(0, 500),
        iconUrl,
        screenshotUrl: screenshotUrl || screenshotFromReport,
        category: category as ShowcaseCategory,
      }
    );

    // Enable showcase on report
    await setShowcaseEnabled(reportId, true);

    // Calculate and update rank
    const hasCustomProfile = !!(displayName || tagline || description || iconUrl || category);
    const rank = calculateShowcaseRank(
      report.overallScore,
      report.createdAt,
      0, // No views yet
      0, // No clicks yet
      hasCustomProfile
    );
    await updateShowcaseRank(reportId, rank);

    return NextResponse.json({
      success: true,
      profile,
      message: 'Report is now showcased!',
    });
  } catch (error) {
    console.error('Create showcase error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create showcase',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper to extract domain from URL
function extractDomainFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
