import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser } from '@/lib/security/auth'

// GET /api/cart - Get user's cart
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

    // Get cart items with product details
    const query = `
      SELECT 
        ci.id, ci.product_id, ci.quantity, ci.added_at,
        p.name, p.slug, p.price, p.images, p.is_active,
        c.name as category_name,
        b.name as brand_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE ci.user_id = $1
      ORDER BY ci.added_at DESC
    `

    const result = await db.query(query, [user.userId])

    // Calculate cart totals
    let subtotal = 0
    const items = result.rows.map((item: any) => {
      const itemTotal = parseFloat(item.price) * item.quantity
      subtotal += itemTotal

      return {
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        addedAt: item.added_at,
        product: {
          name: item.name,
          slug: item.slug,
          price: parseFloat(item.price),
          images: item.images || [],
          isActive: item.is_active,
          category: item.category_name,
          brand: item.brand_name
        },
        itemTotal
      }
    })

    // Filter out inactive products
    const activeItems = items.filter(item => item.product.isActive)
    const inactiveItems = items.filter(item => !item.product.isActive)

    // Recalculate subtotal for active items only
    const activeSubtotal = activeItems.reduce((sum, item) => sum + item.itemTotal, 0)

    // Calculate tax (16% VAT in Kenya)
    const taxRate = 0.16
    const tax = activeSubtotal * taxRate
    const total = activeSubtotal + tax

    return NextResponse.json({
      success: true,
      cart: {
        items: activeItems,
        inactiveItems,
        summary: {
          itemCount: activeItems.length,
          totalQuantity: activeItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: activeSubtotal,
          tax,
          taxRate,
          total
        }
      }
    })

  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
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
    const { productId, quantity = 1 } = body

    // Validate input
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 99' },
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

    // Check if item already exists in cart
    const existingItemQuery = `
      SELECT id, quantity
      FROM cart_items
      WHERE user_id = $1 AND product_id = $2
    `
    const existingResult = await db.query(existingItemQuery, [user.userId, productId])

    if (existingResult.rows.length > 0) {
      // Update existing item
      const existingItem = existingResult.rows[0]
      const newQuantity = Math.min(existingItem.quantity + quantity, 99)

      const updateQuery = `
        UPDATE cart_items
        SET quantity = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, quantity
      `
      const updateResult = await db.query(updateQuery, [newQuantity, existingItem.id])

      return NextResponse.json({
        success: true,
        message: 'Cart updated successfully',
        item: {
          id: updateResult.rows[0].id,
          productId,
          quantity: updateResult.rows[0].quantity,
          product: {
            name: product.name,
            price: parseFloat(product.price)
          }
        }
      })
    } else {
      // Add new item to cart
      const insertQuery = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING id, quantity, added_at
      `
      const insertResult = await db.query(insertQuery, [user.userId, productId, quantity])

      return NextResponse.json({
        success: true,
        message: 'Item added to cart successfully',
        item: {
          id: insertResult.rows[0].id,
          productId,
          quantity: insertResult.rows[0].quantity,
          addedAt: insertResult.rows[0].added_at,
          product: {
            name: product.name,
            price: parseFloat(product.price)
          }
        }
      })
    }

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete all cart items for the user
    const deleteQuery = `
      DELETE FROM cart_items
      WHERE user_id = $1
    `
    await db.query(deleteQuery, [user.userId])

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    })

  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}