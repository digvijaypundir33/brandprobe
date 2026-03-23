import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

export async function GET(request: NextRequest) {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Google OAuth not configured' },
      { status: 500 }
    );
  }

  // Check for redirect parameter (e.g., from access-reports page)
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect');

  // Build Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  // Pass redirect destination through OAuth state parameter
  if (redirectTo) {
    googleAuthUrl.searchParams.set('state', JSON.stringify({ redirect: redirectTo }));
  }

  // Redirect to Google OAuth
  return NextResponse.redirect(googleAuthUrl.toString());
}
