import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { PasswordSecurity, TokenManager, InputSanitizer } from '@/lib/security/auth'
import { headers } from 'next/headers'
import rateLimit from '@/lib/utils/rateLimit'

// Rate limiting: 5 attempts per 15 minutes per IP
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Apply rate limiting
    try {
      await limiter.check(5, ipAddress) // 5 attempts per 15 minutes
    } catch {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sanitize email
    const sanitizedEmail = InputSanitizer.sanitizeEmail(email)

    // Find user
    const userQuery = `
      SELECT id, panda_id, email, password_hash, first_name, last_name, phone, 
             is_verified, is_active, tier, total_points, last_login_at
      FROM users 
      WHERE email = $1
    `
    const userResult = await db.query(userQuery, [sanitizedEmail])

    if (userResult.rows.length === 0) {
      // Log failed login attempt
      await db.query(
        `INSERT INTO auth_activity_log (activity, success, details, ip_address)
         VALUES ($1, $2, $3, $4)`,
        ['login', false, JSON.stringify({ email: sanitizedEmail, reason: 'user_not_found' }), ipAddress]
      )

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    // Check if account is active
    if (!user.is_active) {
      await db.query(
        `INSERT INTO auth_activity_log (user_id, activity, success, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, 'login', false, JSON.stringify({ reason: 'account_inactive' }), ipAddress]
      )

      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await PasswordSecurity.verifyPassword(password, user.password_hash)
    
    if (!isPasswordValid) {
      // Log failed login attempt
      await db.query(
        `INSERT INTO auth_activity_log (user_id, activity, success, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, 'login', false, JSON.stringify({ reason: 'invalid_password' }), ipAddress]
      )

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      pandaId: user.panda_id,
      tier: user.tier,
      isVerified: user.is_verified
    }

    const accessToken = TokenManager.generateAccessToken(tokenPayload)
    const refreshToken = TokenManager.generateRefreshToken(tokenPayload)

    // Create session record
    const sessionQuery = `
      INSERT INTO user_sessions (user_id, session_token, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `
    
    const userAgent = headersList.get('user-agent') || 'Unknown'
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.query(sessionQuery, [
      user.id,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt
    ])

    // Update last login time
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    )

    // Log successful login
    await db.query(
      `INSERT INTO auth_activity_log (user_id, activity, success, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, 'login', true, JSON.stringify({ email: sanitizedEmail }), ipAddress]
    )

    // Return tokens and user data
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60 // 15 minutes
      },
      user: {
        id: user.id,
        pandaId: user.panda_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        isVerified: user.is_verified,
        tier: user.tier,
        totalPoints: user.total_points,
        lastLoginAt: user.last_login_at
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}