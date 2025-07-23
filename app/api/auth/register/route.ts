import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { PasswordSecurity, InputSanitizer } from '@/lib/security/auth'
import { emailService } from '@/lib/services/emailService'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedEmail = InputSanitizer.sanitizeEmail(email)
    const sanitizedFirstName = InputSanitizer.sanitizeName(firstName)
    const sanitizedLastName = InputSanitizer.sanitizeName(lastName)
    const sanitizedPhone = phone ? InputSanitizer.sanitizePhoneNumber(phone) : null

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = PasswordSecurity.validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [sanitizedEmail, sanitizedPhone]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email or phone number' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await PasswordSecurity.hashPassword(password)

    // Create user
    const userQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, panda_id, email, first_name, last_name, phone, is_verified, tier, created_at
    `

    const userResult = await db.query(userQuery, [
      sanitizedEmail,
      passwordHash,
      sanitizedFirstName,
      sanitizedLastName,
      sanitizedPhone
    ])

    const newUser = userResult.rows[0]

    // Send welcome email with verification
    try {
      await emailService.sendTemplateEmail(
        'welcome_email',
        newUser.email,
        {
          name: newUser.first_name,
          panda_id: newUser.panda_id
        }
      )
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    // Log successful registration
    await db.query(
      `INSERT INTO auth_activity_log (user_id, activity, success, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [newUser.id, 'registration', true, JSON.stringify({ email: sanitizedEmail }), ipAddress]
    )

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        pandaId: newUser.panda_id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone,
        isVerified: newUser.is_verified,
        tier: newUser.tier,
        createdAt: newUser.created_at
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    // Log failed registration
    await db.query(
      `INSERT INTO auth_activity_log (activity, success, details, ip_address)
       VALUES ($1, $2, $3, $4)`,
      ['registration', false, JSON.stringify({ error: error.message }), 'unknown']
    )

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}