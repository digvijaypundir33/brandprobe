import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedShowcaseEntries } from '@/lib/supabase';

// GET /api/showcase/featured - Get featured showcase entries for homepage
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 4;

    const entries = await getFeaturedShowcaseEntries(Math.min(limit, 12)); // Max 12 entries

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error('Get featured showcase entries error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get featured entries',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
