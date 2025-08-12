import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get current user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        error: 'Please log in to access this resource'
      }, { status: 401 });
    }

    // Get user profile from our users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Continue with basic user data if profile fetch fails
    }

    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email,
      firstName: userProfile?.first_name || user.user_metadata?.first_name || '',
      lastName: userProfile?.last_name || user.user_metadata?.last_name || '',
      phone: userProfile?.phone || user.user_metadata?.phone || null,
      emailVerified: user.email_confirmed_at ? true : false,
      createdAt: user.created_at,
      lastLoginAt: userProfile?.last_login_at || null
    };

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred while fetching user data'
    }, { status: 500 });
  }
}