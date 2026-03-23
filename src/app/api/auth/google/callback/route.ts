import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOrCreateUser, updateUserLastLogin } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  console.log('[Google OAuth Callback] Started');
  console.log('[Google OAuth Callback] URL:', request.url);

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateParam = searchParams.get('state');

  console.log('[Google OAuth Callback] State param:', stateParam);
  console.log('[Google OAuth Callback] Has code:', !!code);
  console.log('[Google OAuth Callback] Error:', error);

  // Handle OAuth errors
  if (error) {
    console.error('[Google OAuth Callback] OAuth error:', error);
    return NextResponse.redirect(new URL('/signup?error=oauth_denied', request.url));
  }

  if (!code) {
    console.error('[Google OAuth Callback] No code provided');
    return NextResponse.redirect(new URL('/signup?error=no_code', request.url));
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('[Google OAuth Callback] Credentials not configured');
    return NextResponse.redirect(new URL('/signup?error=config_error', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/signup?error=token_exchange', request.url));
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();
    console.log('[Google OAuth Callback] Token exchange successful');

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info');
      return NextResponse.redirect(new URL('/signup?error=user_info', request.url));
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();
    console.log('[Google OAuth Callback] Got user info, email:', googleUser.email);

    if (!googleUser.email) {
      console.error('[Google OAuth Callback] No email in user info');
      return NextResponse.redirect(new URL('/signup?error=no_email', request.url));
    }

    // Get or create user in our database
    console.log('[Google OAuth Callback] Getting or creating user...');
    const user = await getOrCreateUser(googleUser.email);
    console.log('[Google OAuth Callback] User ID:', user.id, 'Subscription:', user.subscription_status);

    // Update last login
    await updateUserLastLogin(user.id);

    // Create JWT session token using the proper auth system
    console.log('[Google OAuth Callback] Creating session token...');
    const sessionToken = await createSession(
      user.id,
      user.email,
      user.subscription_status || 'free'
    );
    console.log('[Google OAuth Callback] Session token created, length:', sessionToken.length);

    // Set the session cookie
    const cookieStore = await cookies();
    console.log('[Google OAuth Callback] Setting cookies...');

    // Cookie options for production
    const cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax' | 'strict' | 'none';
      maxAge: number;
      path: string;
      domain?: string;
    } = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    };

    // Set domain for production to ensure cookie works across subdomains
    if (process.env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    cookieStore.set('brandprobe-auth', sessionToken, cookieOptions);
    console.log('[Google OAuth Callback] brandprobe-auth cookie set');

    // Also set a client-readable cookie for the email (for the signup page to use)
    cookieStore.set('user_email', googleUser.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    console.log('[Google OAuth Callback] user_email cookie set');

    // Check for redirect destination in OAuth state parameter
    let redirectTo: string | null = null;

    if (stateParam) {
      try {
        const state = JSON.parse(stateParam);
        redirectTo = state.redirect;
        console.log('[Google OAuth Callback] Parsed state, redirectTo:', redirectTo);
      } catch (parseError) {
        console.error('[Google OAuth Callback] Failed to parse state:', parseError);
      }
    }

    if (redirectTo === 'dashboard') {
      console.log('[Google OAuth Callback] Redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('[Google OAuth Callback] Redirecting to google-success page');
    // Redirect to the Google auth success page which will handle the pending URL
    return NextResponse.redirect(new URL('/auth/google-success', request.url));
  } catch (err) {
    console.error('[Google OAuth Callback] Error:', err);
    return NextResponse.redirect(new URL('/signup?error=callback_error', request.url));
  }
}
