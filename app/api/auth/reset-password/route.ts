import { NextRequest, NextResponse } from 'next/server'
import { verifyResetToken, resetPassword } from '@/lib/auth/passwordReset'
import { headers } from 'next/headers'
import rateLimit from '@/lib/utils/rateLimit'

// Rate limiting: 5 attempts per hour per IP
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500, // Max 500 unique IPs per hour
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }
    
    const result = await verifyResetToken(token)
    
    if (result.valid) {
      return NextResponse.json({ 
        valid: true, 
        message: result.message 
      })
    } else {
      return NextResponse.json(
        { 
          valid: false, 
          error: result.message 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Reset token verification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    // Apply rate limiting
    try {
      await limiter.check(5, ipAddress) // 5 attempts per hour
    } catch {
      return NextResponse.json(
        { error: 'Too many reset attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { token, password } = body
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }
    
    // Basic password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }
    
    const result = await resetPassword(token, password, ipAddress)
    
    if (result.success) {
      return NextResponse.json({ message: result.message })
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Password reset API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}