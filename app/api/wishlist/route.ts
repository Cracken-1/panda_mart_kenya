import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser } from '@/lib/security/auth'

// GET /api/wishlist - Get user's wishlist
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

    // Get wishlist items with product details
    const query = `
      SELECT 
        w.id, w.product_id, w.added_at,
        p.name, p.slug, p.price, p.original_price, p.images, p.is_active,
        c.name as category_name,
        b.name as brand_name
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `

    const result = await db.query(query, [user.userId])

    const items = result.rows.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      addedAt: item.added_at,
      product: {
        name: item.name,
        slug: item.slug,
        price: parseFloat(item.price),
        originalPrice: item.original_price ? parseFloat(item.original_price) : null,
        images: item.images || [],
        isActive: item.is_active,
        category: item.category_name,
        brand: item.brand_name
      }
    }))

    // Filter active and inactive items
    const activeItems = items.filter(item => item.product.isActive)
    const inactiveItems = items.filter(item => !item.product.isActive)

    return NextResponse.json({
      success: true,
      wishlist: {
        items: activeItems,
        inactiveItems,
        totalCount: activeItems.length
      }
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add item to wishlist
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
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists and is active
    const productQuery = `
      SELECT id, name, price, is_active
      FROM products
      WHERE id = $1
    `
    const productResult = await db.query(productQuery, [productId])

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = productResult.rows[0]
    if (!product.is_active) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      )
    }

    // Check if item already exists in wishlist
    const existingQuery = `
      SELECT id FROM wishlist
      WHERE user_id = $1 AND product_id = $2
    `
    const existingResult = await db.query(existingQuery, [user.userId, productId])

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      )
    }

    // Add to wishlist
    const insertQuery = `
      INSERT INTO wishlist (user_id, product_id)
      VALUES ($1, $2)
      RETURNING id, added_at
    `
    const insertResult = await db.query(insertQuery, [user.userId, productId])

    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist',
      item: {
        id: insertResult.rows[0].id,
        productId,
        addedAt: insertResult.rows[0].added_at,
        product: {
          name: product.name,
          price: parseFloat(product.price)
        }
      }
    })

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}