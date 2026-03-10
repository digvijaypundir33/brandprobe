import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Admin email(s) - you can add multiple admins here
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || 'digvijay.pundir0@gmail.com',
];

// POST - Approve testimonial (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await getUserByEmail(session.email);
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await getUserByEmail(session.email);
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

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
