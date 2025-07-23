import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/stores - Get all stores
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const county = searchParams.get('county')

    // Build query with optional filters
    let query = `
      SELECT 
        id, name, slug, description, phone, email,
        address_line_1, address_line_2, city, county, postal_code,
        latitude, longitude, opening_hours, is_active, created_at
      FROM stores
      WHERE is_active = true
    `

    const queryParams = []

    if (city) {
      query += ' AND LOWER(city) = LOWER($1)'
      queryParams.push(city)
    }

    if (county) {
      const paramIndex = queryParams.length + 1
      query += ` AND LOWER(county) = LOWER($${paramIndex})`
      queryParams.push(county)
    }

    query += ' ORDER BY name ASC'

    const result = await db.query(query, queryParams)

    const stores = result.rows.map(store => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      phone: store.phone,
      email: store.email,
      address: {
        line1: store.address_line_1,
        line2: store.address_line_2,
        city: store.city,
        county: store.county,
        postalCode: store.postal_code
      },
      coordinates: {
        latitude: store.latitude ? parseFloat(store.latitude) : null,
        longitude: store.longitude ? parseFloat(store.longitude) : null
      },
      openingHours: store.opening_hours,
      isActive: store.is_active,
      createdAt: store.created_at
    }))

    return NextResponse.json({
      success: true,
      stores
    })

  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}