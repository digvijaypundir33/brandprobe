import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST - Submit testimonial for approval (authenticated users)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await getUserByEmail(session.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      authorName,
      authorRole,
      companyName,
      websiteUrl,
      testimonialText,
      rating = 5,
    } = body;

    // Validation
    if (!authorName || !authorRole || !testimonialText) {
      return NextResponse.json(
        { success: false, error: 'Author name, role, and testimonial text are required' },
        { status: 400 }
      );
    }

    if (testimonialText.length < 20) {
      return NextResponse.json(
        { success: false, error: 'Testimonial must be at least 20 characters' },
        { status: 400 }
      );
    }

    if (testimonialText.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Testimonial must be less than 500 characters' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has already submitted a testimonial
    const { data: existingTestimonials } = await supabase
      .from('testimonials')
      .select('id')
      .eq('submitted_by_user_id', user.id)
      .limit(1);

    if (existingTestimonials && existingTestimonials.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted a testimonial. Please contact support if you need to update it.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        author_name: authorName,
        author_role: authorRole,
        company_name: companyName,
        website_url: websiteUrl,
        testimonial_text: testimonialText,
        rating,
        is_verified: false, // Requires admin approval
        is_featured: false,
        is_active: true,
        display_order: 999, // Will be set by admin when approved
        submitted_by_user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted and is pending approval.',
      testimonial: data,
    });
  } catch (error) {
    console.error('Error in POST /api/testimonials/submit:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
