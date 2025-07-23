import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser } from '@/lib/security/auth'

// DELETE /api/wishlist/[itemId] - Remove item from wishlist
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

    // Check if wishlist item exists and belongs to user
    const checkQuery = `
      SELECT id, product_id
      FROM wishlist
      WHERE id = $1 AND user_id = $2
    `
    const checkResult = await db.query(checkQuery, [itemId, user.userId])

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    // Delete the wishlist item
    const deleteQuery = `
      DELETE FROM wishlist
      WHERE id = $1
    `
    await db.query(deleteQuery, [itemId])

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist'
    })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}