import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API to manually clean up stuck reports
// Can be called via cron or manually when needed
export async function POST(request: NextRequest) {
  try {
    // Check for admin auth (optional - add your own auth logic)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || process.env.ADMIN_SECRET;

    // Skip auth check if no secret is set (dev mode)
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Call the database function to mark stuck reports as failed
    const { data, error } = await supabase.rpc('mark_stuck_reports_as_failed');

    if (error) {
      console.error('Error marking stuck reports:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to clean up stuck reports',
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log(`Cleaned up ${data?.length || 0} stuck reports`);

    return NextResponse.json({
      success: true,
      cleanedCount: data?.length || 0,
      reports: data || [],
      message: `Successfully marked ${data?.length || 0} stuck reports as failed`,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow GET for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}
