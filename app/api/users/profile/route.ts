import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser, InputSanitizer } from '@/lib/security/auth'

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    // Authenticate user from JWT token
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user profile data
    const query = `
      SELECT 
        id, panda_id, email, first_name, last_name, phone, 
        date_of_birth, gender, avatar_url, is_verified, 
        tier, total_points, total_spent, store_visits, 
        preferred_language, preferred_currency, timezone,
        created_at, email_verified_at, phone_verified_at
      FROM users 
      WHERE id = $1
    `

    const result = await db.query(query, [user.userId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = result.rows[0]

    // Fetch user preferences
    const preferencesQuery = `
      SELECT notification_settings, privacy_settings, preferences
      FROM users
      WHERE id = $1
    `

    const preferencesResult = await db.query(preferencesQuery, [user.userId])
    const preferences = preferencesResult.rows[0]

    // Format response
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        pandaId: userData.panda_id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        phone: userData.phone,
        dateOfBirth: userData.date_of_birth,
        gender: userData.gender,
        avatarUrl: userData.avatar_url,
        isVerified: userData.is_verified,
        emailVerifiedAt: userData.email_verified_at,
        phoneVerifiedAt: userData.phone_verified_at,
        tier: userData.tier,
        totalPoints: userData.total_points,
        totalSpent: userData.total_spent,
        storeVisits: userData.store_visits,
        preferredLanguage: userData.preferred_language,
        preferredCurrency: userData.preferred_currency,
        timezone: userData.timezone,
        createdAt: userData.created_at,
        notificationSettings: preferences?.notification_settings || {},
        privacySettings: preferences?.privacy_settings || {},
        preferences: preferences?.preferences || {}
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user from JWT token
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Fields that can be updated
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'dateOfBirth', 'gender',
      'preferredLanguage', 'preferredCurrency', 'timezone'
    ]

    // Validate and sanitize inputs
    const updates = {}
    const errors = {}

    if (body.firstName !== undefined) {
      if (typeof body.firstName === 'string' && body.firstName.trim().length > 0) {
        updates['first_name'] = InputSanitizer.sanitizeName(body.firstName)
      } else {
        errors['firstName'] = 'First name cannot be empty'
      }
    }

    if (body.lastName !== undefined) {
      if (typeof body.lastName === 'string' && body.lastName.trim().length > 0) {
        updates['last_name'] = InputSanitizer.sanitizeName(body.lastName)
      } else {
        errors['lastName'] = 'Last name cannot be empty'
      }
    }

    if (body.phone !== undefined) {
      if (typeof body.phone === 'string' && body.phone.trim().length > 0) {
        updates['phone'] = InputSanitizer.sanitizePhoneNumber(body.phone)
      } else if (body.phone === null) {
        updates['phone'] = null
      } else {
        errors['phone'] = 'Invalid phone number format'
      }
    }

    if (body.dateOfBirth !== undefined) {
      if (body.dateOfBirth === null) {
        updates['date_of_birth'] = null
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (dateRegex.test(body.dateOfBirth)) {
          updates['date_of_birth'] = body.dateOfBirth
        } else {
          errors['dateOfBirth'] = 'Invalid date format. Use YYYY-MM-DD'
        }
      }
    }

    if (body.gender !== undefined) {
      const validGenders = ['male', 'female', 'other', 'prefer_not_to_say', null]
      if (validGenders.includes(body.gender)) {
        updates['gender'] = body.gender
      } else {
        errors['gender'] = 'Invalid gender value'
      }
    }

    if (body.preferredLanguage !== undefined) {
      const validLanguages = ['en', 'sw']
      if (validLanguages.includes(body.preferredLanguage)) {
        updates['preferred_language'] = body.preferredLanguage
      } else {
        errors['preferredLanguage'] = 'Invalid language code'
      }
    }

    if (body.preferredCurrency !== undefined) {
      const validCurrencies = ['KES', 'USD']
      if (validCurrencies.includes(body.preferredCurrency)) {
        updates['preferred_currency'] = body.preferredCurrency
      } else {
        errors['preferredCurrency'] = 'Invalid currency code'
      }
    }

    if (body.timezone !== undefined) {
      // Simple validation - would be better with a timezone library
      if (typeof body.timezone === 'string' && body.timezone.length > 0) {
        updates['timezone'] = body.timezone
      } else {
        errors['timezone'] = 'Invalid timezone'
      }
    }

    // Handle preferences update
    if (body.preferences !== undefined) {
      if (typeof body.preferences === 'object' && body.preferences !== null) {
        updates['preferences'] = body.preferences
      } else {
        errors['preferences'] = 'Preferences must be an object'
      }
    }

    // Handle notification settings update
    if (body.notificationSettings !== undefined) {
      if (typeof body.notificationSettings === 'object' && body.notificationSettings !== null) {
        updates['notification_settings'] = body.notificationSettings
      } else {
        errors['notificationSettings'] = 'Notification settings must be an object'
      }
    }

    // Handle privacy settings update
    if (body.privacySettings !== undefined) {
      if (typeof body.privacySettings === 'object' && body.privacySettings !== null) {
        updates['privacy_settings'] = body.privacySettings
      } else {
        errors['privacySettings'] = 'Privacy settings must be an object'
      }
    }

    // Check if there are validation errors
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Check if there are any updates to make
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Build the update query dynamically
    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')

    const updateQuery = `
      UPDATE users
      SET ${updateFields}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, first_name, last_name, phone, date_of_birth, gender,
                preferred_language, preferred_currency, timezone,
                notification_settings, privacy_settings, preferences
    `

    const values = [user.userId, ...Object.values(updates)]
    const result = await db.query(updateQuery, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const updatedUser = result.rows[0]

    // Format response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.date_of_birth,
        gender: updatedUser.gender,
        preferredLanguage: updatedUser.preferred_language,
        preferredCurrency: updatedUser.preferred_currency,
        timezone: updatedUser.timezone,
        notificationSettings: updatedUser.notification_settings,
        privacySettings: updatedUser.privacy_settings,
        preferences: updatedUser.preferences
      }
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}