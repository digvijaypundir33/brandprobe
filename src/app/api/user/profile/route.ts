import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserByEmail, updateUserProfile, getCompletedReportsCountThisMonth } from '@/lib/supabase';

// GET - Fetch current user profile
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get actual completed reports count (more reliable than counter)
    const completedReportsCount = await getCompletedReportsCountThisMonth(user.id);

    return NextResponse.json({
      success: true,
      profile: {
        email: user.email,
        displayName: user.displayName,
        company: user.company,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        websiteUrl: user.websiteUrl,
        twitterHandle: user.twitterHandle,
        linkedinUrl: user.linkedinUrl,
        subscriptionStatus: user.subscriptionStatus,
        reportsUsedThisMonth: completedReportsCount, // Use actual count instead of counter
        reportsLimit: user.reportsLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate and sanitize input
    const profile: {
      displayName?: string | null;
      company?: string | null;
      bio?: string | null;
      websiteUrl?: string | null;
      twitterHandle?: string | null;
      linkedinUrl?: string | null;
    } = {};

    if (typeof body.displayName === 'string') {
      profile.displayName = body.displayName.trim().slice(0, 50) || null;
    }

    if (typeof body.company === 'string') {
      profile.company = body.company.trim().slice(0, 100) || null;
    }

    if (typeof body.bio === 'string') {
      profile.bio = body.bio.trim().slice(0, 200) || null;
    }

    if (typeof body.websiteUrl === 'string') {
      const url = body.websiteUrl.trim();
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        profile.websiteUrl = `https://${url}`;
      } else {
        profile.websiteUrl = url || null;
      }
    }

    if (typeof body.twitterHandle === 'string') {
      // Remove @ if present and trim
      profile.twitterHandle = body.twitterHandle.trim().replace(/^@/, '').slice(0, 15) || null;
    }

    if (typeof body.linkedinUrl === 'string') {
      const url = body.linkedinUrl.trim();
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        profile.linkedinUrl = `https://${url}`;
      } else {
        profile.linkedinUrl = url || null;
      }
    }

    await updateUserProfile(user.id, profile);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
