import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/security/auth'

// POST /api/auth/logout - Logout user
export async function POST(request: NextRequest) {
  try {
    // Authenticate user (optional for logout)
    const user = await authenticateUser(request)
    
    // In a production app, you might want to:
    // 1. Blacklist the current token
    // 2. Clear server-side sessions
    // 3. Log the logout event
    
    if (user) {
      // Log logout event for audit
      console.log(`User ${user.userId} logged out at ${new Date().toISOString()}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}