import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch testimonials (public or all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includePending = searchParams.get('includePending') === 'true';

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    // Filter by featured if requested
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    // Filter by active unless admin requests all
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    // Only show verified testimonials unless admin requests pending
    if (!includePending) {
      query = query.eq('is_verified', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonials: data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
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
      isFeatured = false,
      displayOrder = 0,
      isActive = true,
    } = body;

    // Validation
    if (!authorName || !authorRole || !testimonialText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
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
        is_featured: isFeatured,
        display_order: displayOrder,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonial: data,
    });
  } catch (error) {
    console.error('Error in POST /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
