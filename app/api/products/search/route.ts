import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
    try {
        // Parse query parameters
        const { searchParams } = new URL(request.url)

        // Get search query
        const query = searchParams.get('q')
        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            )
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1')
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 items per page
        const offset = (page - 1) * limit

        // Filters
        const categoryId = searchParams.get('category')
        const brandId = searchParams.get('brand')
        const minPrice = parseFloat(searchParams.get('minPrice') || '0')
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')
        const sortBy = searchParams.get('sortBy') || 'relevance'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        // Validate sort parameters
        const allowedSortFields = ['relevance', 'name', 'price', 'created_at']
        const allowedSortOrders = ['asc', 'desc']

        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'relevance'
        const validSortOrder = allowedSortOrders.includes(sortOrder) ? sortOrder : 'desc'

        // Build the WHERE clause for filtering
        const whereConditions = ['p.is_active = true']
        const queryParams = [query] // First parameter is the search query

        // Add search condition using PostgreSQL full-text search
        whereConditions.push(`(
      p.name ILIKE '%' || $1 || '%' OR
      p.description ILIKE '%' || $1 || '%' OR
      p.short_description ILIKE '%' || $1 || '%' OR
      EXISTS (SELECT 1 FROM unnest(p.tags) tag WHERE tag ILIKE '%' || $1 || '%')
    )`)

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

        const whereClause = `WHERE ${whereConditions.join(' AND ')}`

        // Determine the ORDER BY clause based on sortBy
        let orderByClause = ''
        if (validSortBy === 'relevance') {
            // For relevance sorting, use a custom ranking formula
            orderByClause = `
        ORDER BY 
          CASE 
            WHEN p.name ILIKE '%' || $1 || '%' THEN 3
            WHEN p.short_description ILIKE '%' || $1 || '%' THEN 2
            WHEN p.description ILIKE '%' || $1 || '%' THEN 1
            ELSE 0
          END DESC,
          p.is_featured DESC,
          p.created_at DESC
      `
        } else {
            orderByClause = `ORDER BY p.${validSortBy} ${validSortOrder}`
        }

        // Build the complete query
        const searchQuery = `
      SELECT 
        p.id, p.sku, p.name, p.slug, p.short_description,
        p.price, p.original_price, p.images, p.tags,
        p.is_featured, p.created_at,
        c.id as category_id, c.name as category_name,
        b.id as brand_id, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ${whereClause}
      ${orderByClause}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `

        // Add pagination parameters
        queryParams.push(limit, offset)

        // Execute the query
        const result = await db.query(searchQuery, queryParams)

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
        const products = result.rows.map(product => ({
            id: product.id,
            sku: product.sku,
            name: product.name,
            slug: product.slug,
            shortDescription: product.short_description,
            price: parseFloat(product.price),
            originalPrice: product.original_price ? parseFloat(product.original_price) : null,
            images: product.images || [],
            tags: product.tags || [],
            isFeatured: product.is_featured,
            category: product.category_id ? {
                id: product.category_id,
                name: product.category_name
            } : null,
            brand: product.brand_id ? {
                id: product.brand_id,
                name: product.brand_name
            } : null,
            createdAt: product.created_at
        }))

        // Get search suggestions for future queries
        const suggestionsQuery = `
      SELECT DISTINCT tag
      FROM products p, unnest(p.tags) tag
      WHERE tag ILIKE '%' || $1 || '%'
      LIMIT 10
    `

        const suggestionsResult = await db.query(suggestionsQuery, [query])
        const suggestions = suggestionsResult.rows.map(row => row.tag)

        return NextResponse.json({
            success: true,
            query,
            products,
            suggestions,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            }
        })

    } catch (error) {
        console.error('Error searching products:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}