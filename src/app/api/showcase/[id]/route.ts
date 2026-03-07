import { NextRequest, NextResponse } from 'next/server';
import {
  getShowcaseProfileByReportId,
  updateShowcaseProfile,
  deleteShowcaseProfile,
  setShowcaseEnabled,
  getReportById,
  updateShowcaseRank,
  calculateShowcaseRank,
} from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';
import type { ShowcaseCategory } from '@/types/report';

// GET /api/showcase/[id] - Get single showcase profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    const profile = await getShowcaseProfileByReportId(reportId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Showcase profile not found' },
        { status: 404 }
      );
    }

    // Get report for additional data
    const report = await getReportById(reportId);

    return NextResponse.json({
      success: true,
      profile,
      report: report
        ? {
            id: report.id,
            url: report.url,
            overallScore: report.overallScore,
            showcaseViews: report.showcaseViews,
            showcaseClicks: report.showcaseClicks,
            createdAt: report.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error('Get showcase profile error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get showcase profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/showcase/[id] - Update showcase profile (authenticated)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // Verify authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
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
        { success: false, error: 'Forbidden - You can only edit your own showcase' },
        { status: 403 }
      );
    }

    // Check if showcase profile exists
    const existingProfile = await getShowcaseProfileByReportId(reportId);
    if (!existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Showcase profile not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { displayName, tagline, description, iconUrl, screenshotUrl, category, isPriority } = body;

    // Validate category if provided
    const validCategories = [
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

    // Validate isPriority based on subscription tier
    let finalIsPriority = existingProfile.isPriority || false;
    if (isPriority !== undefined) {
      // Get user's subscription status
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('subscription_status')
        .eq('id', report.userId)
        .single();

      const subscriptionStatus = userData?.subscription_status || 'free';

      // Check tier limits
      if (isPriority === true) {
        // Free users can't enable priority
        if (subscriptionStatus === 'free') {
          return NextResponse.json(
            { success: false, error: 'Priority Showcase is only available for Starter and Pro users. Upgrade to enable this feature.' },
            { status: 403 }
          );
        }

        // Check how many priority showcases the user already has
        const { data: priorityShowcases } = await supabaseAdmin
          .from('showcase_profiles')
          .select(`
            report_id,
            reports!inner(user_id)
          `)
          .eq('reports.user_id', report.userId)
          .eq('is_priority', true);

        const currentPriorityCount = priorityShowcases?.filter((p: any) => p.report_id !== reportId).length || 0;

        // Enforce limits: Starter = 1, Pro = 2
        const maxPriority = subscriptionStatus === 'starter' ? 1 : subscriptionStatus === 'pro' ? 2 : 0;

        if (currentPriorityCount >= maxPriority) {
          return NextResponse.json(
            {
              success: false,
              error: `You've reached your limit of ${maxPriority} featured showcase${maxPriority > 1 ? 's' : ''}. Disable priority on another showcase first.`
            },
            { status: 400 }
          );
        }
      }

      finalIsPriority = isPriority;
    }

    // Update profile
    await updateShowcaseProfile(reportId, {
      displayName: displayName !== undefined ? displayName?.slice(0, 100) : undefined,
      tagline: tagline !== undefined ? tagline?.slice(0, 120) : undefined,
      description: description !== undefined ? description?.slice(0, 500) : undefined,
      iconUrl: iconUrl !== undefined ? iconUrl : undefined,
      screenshotUrl: screenshotUrl !== undefined ? screenshotUrl : undefined,
      category: category as ShowcaseCategory | undefined,
      isPriority: isPriority !== undefined ? finalIsPriority : undefined,
    });

    // Recalculate rank
    const hasCustomProfile = !!(
      displayName ||
      tagline ||
      description ||
      iconUrl ||
      category ||
      existingProfile.displayName ||
      existingProfile.tagline ||
      existingProfile.description ||
      existingProfile.iconUrl ||
      existingProfile.category
    );
    const rank = calculateShowcaseRank(
      report.overallScore,
      report.createdAt,
      report.showcaseViews,
      report.showcaseClicks,
      hasCustomProfile
    );
    await updateShowcaseRank(reportId, rank);

    // Get updated profile
    const updatedProfile = await getShowcaseProfileByReportId(reportId);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Showcase profile updated!',
    });
  } catch (error) {
    console.error('Update showcase profile error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update showcase profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/showcase/[id] - Disable showcase (authenticated)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // Verify authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
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
        { success: false, error: 'Forbidden - You can only remove your own showcase' },
        { status: 403 }
      );
    }

    // Delete showcase profile
    await deleteShowcaseProfile(reportId);

    // Disable showcase on report
    await setShowcaseEnabled(reportId, false);

    return NextResponse.json({
      success: true,
      message: 'Showcase disabled',
    });
  } catch (error) {
    console.error('Delete showcase error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to disable showcase',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
