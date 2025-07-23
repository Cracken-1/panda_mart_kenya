import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/brands - Get all brands
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const includeProductCount = searchParams.get('includeProductCount') === 'true'

    // Get brands
    const query = `
      SELECT 
        id, name, slug, description, logo_url, 
        is_active, created_at
      FROM brands
      WHERE is_active = true
      ORDER BY name ASC
    `

    const result = await db.query(query)

    // Process results
    const brands = await Promise.all(result.rows.map(async (brand) => {
      const formattedBrand = {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoUrl: brand.logo_url,
        isActive: brand.is_active,
        createdAt: brand.created_at,
        productCount: 0
      }

      // Get product count if requested
      if (includeProductCount) {
        const countQuery = `
          SELECT COUNT(*) as count
          FROM products p
          WHERE p.brand_id = $1 AND p.is_active = true
        `
        const countResult = await db.query(countQuery, [brand.id])
        formattedBrand.productCount = parseInt(countResult.rows[0].count)
      }

      return formattedBrand
    }))

    return NextResponse.json({
      success: true,
      brands
    })

  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}