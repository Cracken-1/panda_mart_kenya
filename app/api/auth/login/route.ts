import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Missing credentials',
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format',
        error: 'Please enter a valid email address'
      }, { status: 400 });
    }

    const supabase = createClient();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      let errorMessage = 'Login failed';
      
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please try again later';
      }

      return NextResponse.json({
        success: false,
        message: errorMessage,
        error: authError.message
      }, { status: 401 });
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json({
        success: false,
        message: 'Login failed',
        error: 'Invalid response from authentication service'
      }, { status: 500 });
    }

    // Get user profile from our users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Continue with basic user data if profile fetch fails
    }

    // Update last login timestamp
    await supabase
      .from('users')
      .update({ 
        last_login_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);

    // Prepare user data
    const user = {
      id: authData.user.id,
      email: authData.user.email,
      firstName: userProfile?.first_name || authData.user.user_metadata?.first_name || '',
      lastName: userProfile?.last_name || authData.user.user_metadata?.last_name || '',
      phone: userProfile?.phone || authData.user.user_metadata?.phone || null,
      emailVerified: authData.user.email_confirmed_at ? true : false,
      createdAt: authData.user.created_at,
      lastLoginAt: new Date().toISOString()
    };

    // Prepare tokens
    const tokens = {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: authData.session.expires_in || 3600
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
      tokens
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred during login'
    }, { status: 500 });
  }
}