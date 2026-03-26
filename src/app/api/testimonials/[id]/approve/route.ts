import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';
import { getUserByEmail } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Get admin emails from environment variable (comma-separated)
const getAdminEmails = (): string[] => {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
  return adminEmailsEnv
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
};

// POST - Approve testimonial (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await getUserByEmail(session.email);
    const adminEmails = getAdminEmails();
    if (!user || !adminEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { isFeatured = false, displayOrder = 0 } = body;

    // Approve and optionally set as featured
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by_admin_email: user.email,
        is_featured: isFeatured,
        display_order: displayOrder,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error approving testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to approve testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial: data,
    });
  } catch (error) {
    console.error('Error in POST /api/testimonials/[id]/approve:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Reject testimonial (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await getUserByEmail(session.email);
    const adminEmails = getAdminEmails();
    if (!user || !adminEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Delete the testimonial (rejection)
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error rejecting testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to reject testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial rejected and deleted',
    });
  } catch (error) {
    console.error('Error in DELETE /api/testimonials/[id]/approve:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
