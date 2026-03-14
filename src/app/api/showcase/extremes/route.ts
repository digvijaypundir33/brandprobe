import { NextResponse } from 'next/server';
import { getShowcaseExtremes } from '@/lib/supabase';

export async function GET() {
  try {
    const entries = await getShowcaseExtremes();

    return NextResponse.json({
      success: true,
      entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Failed to fetch extreme entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}
