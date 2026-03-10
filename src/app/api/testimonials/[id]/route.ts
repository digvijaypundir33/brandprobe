import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PUT - Update testimonial (admin only)
export async function PUT(
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

    const { id } = await params;
    const body = await request.json();
    const {
      authorName,
      authorRole,
      companyName,
      websiteUrl,
      testimonialText,
      rating,
      isFeatured,
      displayOrder,
      isActive,
    } = body;

    // Build update object with only provided fields
    const updates: any = {};
    if (authorName !== undefined) updates.author_name = authorName;
    if (authorRole !== undefined) updates.author_role = authorRole;
    if (companyName !== undefined) updates.company_name = companyName;
    if (websiteUrl !== undefined) updates.website_url = websiteUrl;
    if (testimonialText !== undefined) updates.testimonial_text = testimonialText;
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
      updates.rating = rating;
    }
    if (isFeatured !== undefined) updates.is_featured = isFeatured;
    if (displayOrder !== undefined) updates.display_order = displayOrder;
    if (isActive !== undefined) updates.is_active = isActive;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonial: data,
    });
  } catch (error) {
    console.error('Error in PUT /api/testimonials/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial (admin only)
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

    const { id } = await params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/testimonials/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
