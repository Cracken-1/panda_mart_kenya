import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser, InputSanitizer } from '@/lib/security/auth'

// GET /api/users/addresses - Get user's addresses
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user addresses
    const query = `
      SELECT 
        id, title, first_name, last_name, phone, email,
        address_line_1, address_line_2, city, county, postal_code,
        is_default, created_at, updated_at
      FROM user_addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `

    const result = await db.query(query, [user.userId])

    const addresses = result.rows.map((address: any) => ({
      id: address.id,
      title: address.title,
      firstName: address.first_name,
      lastName: address.last_name,
      phone: address.phone,
      email: address.email,
      addressLine1: address.address_line_1,
      addressLine2: address.address_line_2,
      city: address.city,
      county: address.county,
      postalCode: address.postal_code,
      isDefault: address.is_default,
      createdAt: address.created_at,
      updatedAt: address.updated_at
    }))

    return NextResponse.json({
      success: true,
      addresses
    })

  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users/addresses - Add new address
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      firstName,
      lastName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      county,
      postalCode,
      isDefault = false
    } = body

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!title || title.trim().length === 0) {
      errors['title'] = 'Address title is required'
    }

    if (!firstName || firstName.trim().length === 0) {
      errors['firstName'] = 'First name is required'
    }

    if (!lastName || lastName.trim().length === 0) {
      errors['lastName'] = 'Last name is required'
    }

    if (!phone || phone.trim().length === 0) {
      errors['phone'] = 'Phone number is required'
    }

    if (!addressLine1 || addressLine1.trim().length === 0) {
      errors['addressLine1'] = 'Address line 1 is required'
    }

    if (!city || city.trim().length === 0) {
      errors['city'] = 'City is required'
    }

    if (!county || county.trim().length === 0) {
      errors['county'] = 'County is required'
    }

    // Validate email if provided
    if (email && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors['email'] = 'Invalid email format'
      }
    }

    // Validate phone number format
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      errors['phone'] = 'Invalid Kenyan phone number format'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Start transaction
    const client = await db.getClient()

    try {
      await client.query('BEGIN')

      // If this is set as default, unset other default addresses
      if (isDefault) {
        await client.query(
          'UPDATE user_addresses SET is_default = false WHERE user_id = $1',
          [user.userId]
        )
      }

      // Check if this is the first address (make it default automatically)
      const countQuery = 'SELECT COUNT(*) as count FROM user_addresses WHERE user_id = $1'
      const countResult = await client.query(countQuery, [user.userId])
      const isFirstAddress = parseInt(countResult.rows[0].count) === 0

      // Insert new address
      const insertQuery = `
        INSERT INTO user_addresses (
          user_id, title, first_name, last_name, phone, email,
          address_line_1, address_line_2, city, county, postal_code, is_default
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, created_at
      `

      const insertResult = await client.query(insertQuery, [
        user.userId,
        InputSanitizer.sanitizeText(title),
        InputSanitizer.sanitizeName(firstName),
        InputSanitizer.sanitizeName(lastName),
        InputSanitizer.sanitizePhoneNumber(phone),
        email ? InputSanitizer.sanitizeEmail(email) : null,
        InputSanitizer.sanitizeText(addressLine1),
        addressLine2 ? InputSanitizer.sanitizeText(addressLine2) : null,
        InputSanitizer.sanitizeText(city),
        InputSanitizer.sanitizeText(county),
        postalCode ? InputSanitizer.sanitizeText(postalCode) : null,
        isDefault || isFirstAddress
      ])

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Address added successfully',
        address: {
          id: insertResult.rows[0].id,
          title: InputSanitizer.sanitizeText(title),
          firstName: InputSanitizer.sanitizeName(firstName),
          lastName: InputSanitizer.sanitizeName(lastName),
          phone: InputSanitizer.sanitizePhoneNumber(phone),
          email: email ? InputSanitizer.sanitizeEmail(email) : null,
          addressLine1: InputSanitizer.sanitizeText(addressLine1),
          addressLine2: addressLine2 ? InputSanitizer.sanitizeText(addressLine2) : null,
          city: InputSanitizer.sanitizeText(city),
          county: InputSanitizer.sanitizeText(county),
          postalCode: postalCode ? InputSanitizer.sanitizeText(postalCode) : null,
          isDefault: isDefault || isFirstAddress,
          createdAt: insertResult.rows[0].created_at
        }
      })

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}