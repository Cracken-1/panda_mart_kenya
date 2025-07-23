import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser } from '@/lib/security/auth'

// PUT /api/cart/[itemId] - Update cart item quantity
export async function PUT(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId } = params
    const body = await request.json()
    const { quantity } = body

    // Validate input
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 99' },
        { status: 400 }
      )
    }

    // Check if cart item exists and belongs to user
    const checkQuery = `
      SELECT ci.id, ci.product_id, p.name, p.price, p.is_active
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = $1 AND ci.user_id = $2
    `
    const checkResult = await db.query(checkQuery, [itemId, user.userId])

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const item = checkResult.rows[0]
    if (!item.is_active) {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      )
    }

    // Update the cart item
    const updateQuery = `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, quantity, updated_at
    `
    const updateResult = await db.query(updateQuery, [quantity, itemId])

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
      item: {
        id: updateResult.rows[0].id,
        productId: item.product_id,
        quantity: updateResult.rows[0].quantity,
        updatedAt: updateResult.rows[0].updated_at,
        product: {
          name: item.name,
          price: parseFloat(item.price)
        }
      }
    })

  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId } = params

    // Check if cart item exists and belongs to user
    const checkQuery = `
      SELECT id, product_id
      FROM cart_items
      WHERE id = $1 AND user_id = $2
    `
    const checkResult = await db.query(checkQuery, [itemId, user.userId])

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Delete the cart item
    const deleteQuery = `
      DELETE FROM cart_items
      WHERE id = $1
    `
    await db.query(deleteQuery, [itemId])

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}