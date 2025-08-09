import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Debug endpoint not available in production' },
        { status: 403 }
      )
    }

    console.log('Debug: Checking Supabase connection...')
    
    const supabase = createClient()

    // Get all users (limited info for security)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id, 
        panda_id, 
        email, 
        first_name, 
        last_name, 
        auth_provider, 
        email_verified, 
        created_at,
        user_profiles (
          panda_points,
          current_tier
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10)
    
    console.log('Found users:', users?.length || 0)
    if (usersError) {
      console.error('Error fetching users:', usersError)
    }

    return NextResponse.json({
      success: true,
      database: {
        connected: !usersError,
        provider: 'Supabase'
      },
      users: {
        count: users?.length || 0,
        data: users || [],
        error: usersError?.message
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        connected: false
      }
    }, { status: 500 })
  }
}