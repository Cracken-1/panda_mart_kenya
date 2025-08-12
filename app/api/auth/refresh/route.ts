import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: 'Refresh token required',
        error: 'No refresh token provided'
      }, { status: 400 });
    }

    const supabase = createClient();

    // Refresh the session with Supabase
    const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (refreshError || !sessionData.session) {
      return NextResponse.json({
        success: false,
        message: 'Token refresh failed',
        error: refreshError?.message || 'Invalid refresh token'
      }, { status: 401 });
    }

    // Prepare new tokens
    const tokens = {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      expiresIn: sessionData.session.expires_in || 3600
    };

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      tokens
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred during token refresh'
    }, { status: 500 });
  }
}