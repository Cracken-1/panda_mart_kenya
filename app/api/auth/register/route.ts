import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        error: 'Email, password, first name, and last name are required'
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'Password too weak',
        error: 'Password must be at least 8 characters long'
      }, { status: 400 });
    }

    const supabase = createClient();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null
        }
      }
    });

    if (authError) {
      return NextResponse.json({
        success: false,
        message: 'Registration failed',
        error: authError.message
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        message: 'Registration failed',
        error: 'Failed to create user account'
      }, { status: 500 });
    }

    // Create user profile in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        email_verified: false,
        auth_provider: 'email'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the registration if profile creation fails
    }

    // Create user preferences with defaults
    await supabase
      .from('user_preferences')
      .insert({
        user_id: authData.user.id,
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: true,
        order_updates: true,
        newsletter: false,
        currency: 'KSH',
        language: 'en',
        timezone: 'Africa/Nairobi'
      });

    // Get session for tokens
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      return NextResponse.json({
        success: false,
        message: 'Registration completed but login failed',
        error: 'Please try logging in manually'
      }, { status: 500 });
    }

    // Return success response with user data and tokens
    const user = {
      id: authData.user.id,
      pandaId: `PANDA-${authData.user.id.slice(-6).toUpperCase()}`,
      email: authData.user.email,
      firstName: firstName,
      lastName: lastName,
      phone: phone || null,
      emailVerified: authData.user.email_confirmed_at ? true : false,
      createdAt: authData.user.created_at,
      updatedAt: new Date().toISOString()
    };

    const tokens = {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      expiresIn: sessionData.session.expires_in || 3600
    };

    return NextResponse.json({
      success: true,
      message: authData.user.email_confirmed_at 
        ? 'Account created successfully!' 
        : 'Account created! Please check your email to verify your account.',
      user,
      tokens
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred during registration'
    }, { status: 500 });
  }
}