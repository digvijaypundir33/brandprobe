import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// Get admin emails from environment variable (comma-separated)
// Example: ADMIN_EMAILS=digvijay@gmail.com,admin@brandprobe.io
const getAdminEmails = (): string[] => {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
  console.log('[Admin Users API] ADMIN_EMAILS env:', adminEmailsEnv ? `"${adminEmailsEnv}"` : '(not set)');
  const emails = adminEmailsEnv
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
  console.log('[Admin Users API] Parsed admin emails:', emails);
  return emails;
};

const isAdmin = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  const userEmailLower = email.toLowerCase();
  const result = adminEmails.includes(userEmailLower);
  console.log('[Admin Users API] isAdmin check:', { userEmail: userEmailLower, adminEmails, result });
  return result;
};

export async function GET() {
  console.log('[Admin Users API] GET request received');
  try {
    // Check authentication
    const session = await getSession();
    console.log('[Admin Users API] Session:', session ? { email: session.email, userId: session.userId } : null);

    if (!session) {
      console.log('[Admin Users API] No session found - returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.email)) {
      console.log('[Admin Users API] User is not admin - returning 403');
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    console.log('[Admin Users API] Admin check passed, fetching users...');

    // Fetch all users with their report counts
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('[Admin Users API] Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    console.log('[Admin Users API] Fetched', users?.length || 0, 'users');

    // Fetch report counts for each user
    const usersWithReports = await Promise.all(
      users.map(async (user) => {
        const { count: totalReports } = await supabaseAdmin
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: completedReports } = await supabaseAdmin
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'ready');

        const { count: failedReports } = await supabaseAdmin
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'failed');

        return {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          company: user.company,
          subscriptionStatus: user.subscription_status,
          subscriptionId: user.subscription_id,
          stripeCustomerId: user.stripe_customer_id,
          reportsUsedThisMonth: user.reports_used_this_month,
          reportsLimit: user.reports_limit,
          emailVerified: user.email_verified,
          lastLoginAt: user.last_login_at,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          // Report stats
          totalReports: totalReports || 0,
          completedReports: completedReports || 0,
          failedReports: failedReports || 0,
        };
      })
    );

    console.log('[Admin Users API] Successfully processed', usersWithReports.length, 'users with reports');
    return NextResponse.json({
      success: true,
      users: usersWithReports,
      total: usersWithReports.length,
    });
  } catch (error) {
    console.error('[Admin Users API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update user subscription status
export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.email)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, subscriptionStatus, reportsLimit } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (subscriptionStatus !== undefined) {
      updates.subscription_status = subscriptionStatus;
    }
    if (reportsLimit !== undefined) {
      updates.reports_limit = reportsLimit;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin users PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
