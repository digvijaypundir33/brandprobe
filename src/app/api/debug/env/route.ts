import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ENABLE_PAGESPEED_API: process.env.ENABLE_PAGESPEED_API,
    HAS_PAGESPEED_API_KEY: !!process.env.PAGESPEED_API_KEY,
    PAGESPEED_STRATEGY: process.env.PAGESPEED_STRATEGY,
    NODE_ENV: process.env.NODE_ENV,
  });
}
