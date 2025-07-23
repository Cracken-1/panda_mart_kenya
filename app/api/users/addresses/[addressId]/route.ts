import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser, InputSanitizer } from '@/lib/security/auth'

// GET /api/users/addresses/[addressId] - Get specific address
export async function GET(request: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { addressId } = params

    // Get address
    const query = `
      SELECT 
        id, title, first_name, last_name, phone, email,
        address_line_1, address_line_2, city, county, postal_code,
        is_default, created_at, updated_at
      FROM user_addresses
      WHERE id = $1 AND user_id = $2
    `

    const result = await db.query(query, [addressId, user.userId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    const address = result.rows[0]

    return NextResponse.json({
      success: true,
      address: {
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
      }
    })

  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users/addresses/[addressId] - Update address
export async function PUT(request: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { addressId } = params
    const body = await request.json()

    // Check if address exists and belongs to user
    const checkQuery = `
      SELECT id, is_default
      FROM user_addresses
      WHERE id = $1 AND user_id = $2
    `

    const checkResult = await db.query(checkQuery, [addressId, user.userId])

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    const currentAddress = checkResult.rows[0]

    // Validate and sanitize inputs
    const updates: Record<string, any> = {}
    const errors: Record<string, string> = {}

    if (body.title !== undefined) {
      if (typeof body.title === 'string' && body.title.trim().length > 0) {
        updates['title'] = InputSanitizer.sanitizeText(body.title)
      } else {
        errors['title'] = 'Title cannot be empty'
      }
    }

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
        const phoneRegex = /^(\+254|0)[17]\d{8}$/
        if (phoneRegex.test(body.phone.replace(/\s/g, ''))) {
          updates['phone'] = InputSanitizer.sanitizePhoneNumber(body.phone)
        } else {
          errors['phone'] = 'Invalid Kenyan phone number format'
        }
      } else {
        errors['phone'] = 'Phone number cannot be empty'
      }
    }

    if (body.email !== undefined) {
      if (body.email === null || body.email === '') {
        updates['email'] = null
      } else if (typeof body.email === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(body.email)) {
          updates['email'] = InputSanitizer.sanitizeEmail(body.email)
        } else {
          errors['email'] = 'Invalid email format'
        }
      }
    }

    if (body.addressLine1 !== undefined) {
      if (typeof body.addressLine1 === 'string' && body.addressLine1.trim().length > 0) {
        updates['address_line_1'] = InputSanitizer.sanitizeText(body.addressLine1)
      } else {
        errors['addressLine1'] = 'Address line 1 cannot be empty'
      }
    }

    if (body.addressLine2 !== undefined) {
      if (body.addressLine2 === null || body.addressLine2 === '') {
        updates['address_line_2'] = null
      } else if (typeof body.addressLine2 === 'string') {
        updates['address_line_2'] = InputSanitizer.sanitizeText(body.addressLine2)
      }
    }

    if (body.city !== undefined) {
      if (typeof body.city === 'string' && body.city.trim().length > 0) {
        updates['city'] = InputSanitizer.sanitizeText(body.city)
      } else {
        errors['city'] = 'City cannot be empty'
      }
    }

    if (body.county !== undefined) {
      if (typeof body.county === 'string' && body.county.trim().length > 0) {
        updates['county'] = InputSanitizer.sanitizeText(body.county)
      } else {
        errors['county'] = 'County cannot be empty'
      }
    }

    if (body.postalCode !== undefined) {
      if (body.postalCode === null || body.postalCode === '') {
        updates['postal_code'] = null
      } else if (typeof body.postalCode === 'string') {
        updates['postal_code'] = InputSanitizer.sanitizeText(body.postalCode)
      }
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Check if there are any updates to make
    if (Object.keys(updates).length === 0 && body.isDefault === undefined) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Start transaction
    const client = await db.getClient()

    try {
      await client.query('BEGIN')

      // Handle default address change
      if (body.isDefault === true && !currentAddress.is_default) {
        // Unset other default addresses
        await client.query(
          'UPDATE user_addresses SET is_default = false WHERE user_id = $1',
          [user.userId]
        )
        updates['is_default'] = true
      } else if (body.isDefault === false && currentAddress.is_default) {
        // Check if there are other addresses to set as default
        const otherAddressQuery = `
          SELECT id FROM user_addresses 
          WHERE user_id = $1 AND id != $2 
          ORDER BY created_at ASC 
          LIMIT 1
        `
        const otherResult = await client.query(otherAddressQuery, [user.userId, addressId])
        
        if (otherResult.rows.length > 0) {
          // Set another address as default
          await client.query(
            'UPDATE user_addresses SET is_default = true WHERE id = $1',
            [otherResult.rows[0].id]
          )
          updates['is_default'] = false
        } else {
          // This is the only address, keep it as default
          return NextResponse.json(
            { error: 'Cannot remove default status from the only address' },
            { status: 400 }
          )
        }
      }

      // Update the address if there are field updates
      if (Object.keys(updates).length > 0) {
        const updateFields = Object.keys(updates)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(', ')

        const updateQuery = `
          UPDATE user_addresses
          SET ${updateFields}, updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `

        const values = [addressId, ...Object.values(updates)]
        const updateResult = await client.query(updateQuery, values)

        await client.query('COMMIT')

        const updatedAddress = updateResult.rows[0]

        return NextResponse.json({
          success: true,
          message: 'Address updated successfully',
          address: {
            id: updatedAddress.id,
            title: updatedAddress.title,
            firstName: updatedAddress.first_name,
            lastName: updatedAddress.last_name,
            phone: updatedAddress.phone,
            email: updatedAddress.email,
            addressLine1: updatedAddress.address_line_1,
            addressLine2: updatedAddress.address_line_2,
            city: updatedAddress.city,
            county: updatedAddress.county,
            postalCode: updatedAddress.postal_code,
            isDefault: updatedAddress.is_default,
            updatedAt: updatedAddress.updated_at
          }
        })
      } else {
        await client.query('COMMIT')
        return NextResponse.json({
          success: true,
          message: 'Address updated successfully'
        })
      }

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/addresses/[addressId] - Delete address
export async function DELETE(request: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { addressId } = params

    // Start transaction
    const client = await db.getClient()

    try {
      await client.query('BEGIN')

      // Check if address exists and belongs to user
      const checkQuery = `
        SELECT id, is_default
        FROM user_addresses
        WHERE id = $1 AND user_id = $2
      `

      const checkResult = await client.query(checkQuery, [addressId, user.userId])

      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        )
      }

      const address = checkResult.rows[0]

      // If this is the default address, set another one as default
      if (address.is_default) {
        const otherAddressQuery = `
          SELECT id FROM user_addresses 
          WHERE user_id = $1 AND id != $2 
          ORDER BY created_at ASC 
          LIMIT 1
        `
        const otherResult = await client.query(otherAddressQuery, [user.userId, addressId])
        
        if (otherResult.rows.length > 0) {
          await client.query(
            'UPDATE user_addresses SET is_default = true WHERE id = $1',
            [otherResult.rows[0].id]
          )
        }
      }

      // Delete the address
      await client.query('DELETE FROM user_addresses WHERE id = $1', [addressId])

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Address deleted successfully'
      })

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}