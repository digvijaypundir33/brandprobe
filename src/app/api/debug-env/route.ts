import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check ALL environment variables
 * Visit: https://brandprobe.io/api/debug-env
 */
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment_variables: {
      // Resend
      RESEND_API_KEY: process.env.RESEND_API_KEY ? `SET (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : 'NOT SET',
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'NOT SET',

      // App URL
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',

      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `SET (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...)` : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',

      // Groq
      GROQ_API_KEY: process.env.GROQ_API_KEY ? `SET (${process.env.GROQ_API_KEY.substring(0, 10)}...)` : 'NOT SET',

      // Browserless
      BROWSERLESS_API_KEY: process.env.BROWSERLESS_API_KEY ? 'SET' : 'NOT SET',

      // PayPal
      PAYPAL_MODE: process.env.PAYPAL_MODE || 'NOT SET',
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET',

      // Auth
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    },
    vercel_info: {
      VERCEL: process.env.VERCEL || 'NOT SET',
      VERCEL_ENV: process.env.VERCEL_ENV || 'NOT SET',
      VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
    },
    instructions: 'Check which environment variables are missing. Then add them in Vercel Dashboard → Settings → Environment Variables and redeploy.'
  });
}
