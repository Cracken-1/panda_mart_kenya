import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/products - Get products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 items per page
    const offset = (page - 1) * limit
    
    // Filters
    const categoryId = searchParams.get('category')
    const brandId = searchParams.get('brand')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured') === 'true'
    
    // Validate sort parameters to prevent SQL injection
    const allowedSortFields = ['name', 'price', 'created_at']
    const allowedSortOrders = ['asc', 'desc']
    
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = allowedSortOrders.includes(sortOrder) ? sortOrder : 'desc'
    
    // Build the WHERE clause for filtering
    const whereConditions = ['p.is_active = true']
    const queryParams = []
    
    if (categoryId) {
      whereConditions.push(`p.category_id = $${queryParams.length + 1}`)
      queryParams.push(categoryId)
    }
    
    if (brandId) {
      whereConditions.push(`p.brand_id = $${queryParams.length + 1}`)
      queryParams.push(brandId)
    }
    
    whereConditions.push(`p.price >= $${queryParams.length + 1}`)
    queryParams.push(minPrice)
    
    whereConditions.push(`p.price <= $${queryParams.length + 1}`)
    queryParams.push(maxPrice)
    
    if (featured) {
      whereConditions.push('p.is_featured = true')
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Build the complete query
    const query = `
      SELECT 
        p.id, p.sku, p.name, p.slug, p.description, p.short_description,
        p.price, p.original_price, p.images, p.features, p.tags,
        p.is_featured, p.created_at, p.updated_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        b.id as brand_id, b.name as brand_name, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ${whereClause}
      ORDER BY p.${validSortBy} ${validSortOrder}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `
    
    // Add pagination parameters
    queryParams.push(limit, offset)
    
    // Execute the query
    const result = await db.query(query, queryParams)
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `
    
    const countResult = await db.query(countQuery, queryParams.slice(0, -2))
    const totalItems = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(totalItems / limit)
    
    // Format the response
    const products = result.rows.map((product: any) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      images: product.images || [],
      features: product.features || [],
      tags: product.tags || [],
      isFeatured: product.is_featured,
      category: product.category_id ? {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug
      } : null,
      brand: product.brand_id ? {
        id: product.brand_id,
        name: product.brand_name,
        slug: product.brand_slug
      } : null,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }))
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}