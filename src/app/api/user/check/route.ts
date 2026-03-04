import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/user/check?email={email}
 * Check if a user exists and their subscription status
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, subscription_status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      // User doesn't exist
      return NextResponse.json({
        success: true,
        exists: false,
        subscriptionStatus: null,
      });
    }

    // User exists
    return NextResponse.json({
      success: true,
      exists: true,
      subscriptionStatus: user.subscription_status || 'free',
    });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
