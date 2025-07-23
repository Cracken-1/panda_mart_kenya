import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser } from '@/lib/security/auth'

// GET /api/orders/[orderId] - Get order details
export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = params

    // Get order details
    const orderQuery = `
      SELECT 
        o.id, o.order_number, o.status, o.subtotal, o.tax_amount,
        o.delivery_fee, o.total_amount, o.currency, o.delivery_method,
        o.delivery_address, o.payment_method, o.payment_status,
        o.notes, o.created_at, o.updated_at,
        u.first_name, u.last_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND o.user_id = $2
    `

    const orderResult = await db.query(orderQuery, [orderId, user.userId])

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = orderResult.rows[0]

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.id, oi.product_id, oi.product_name, oi.quantity,
        oi.unit_price, oi.total_price,
        p.slug, p.images
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `

    const itemsResult = await db.query(itemsQuery, [orderId])

    // Get order status history
    const statusQuery = `
      SELECT status, notes, created_at
      FROM order_status_history
      WHERE order_id = $1
      ORDER BY created_at ASC
    `

    const statusResult = await db.query(statusQuery, [orderId])

    // Format response
    const orderDetails = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      subtotal: parseFloat(order.subtotal),
      taxAmount: parseFloat(order.tax_amount),
      deliveryFee: parseFloat(order.delivery_fee || 0),
      totalAmount: parseFloat(order.total_amount),
      currency: order.currency,
      deliveryMethod: order.delivery_method,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customer: {
        firstName: order.first_name,
        lastName: order.last_name,
        email: order.email,
        phone: order.phone
      },
      items: itemsResult.rows.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productSlug: item.slug,
        productImages: item.images || [],
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price),
        totalPrice: parseFloat(item.total_price)
      })),
      statusHistory: statusResult.rows.map(status => ({
        status: status.status,
        notes: status.notes,
        timestamp: status.created_at
      }))
    }

    return NextResponse.json({
      success: true,
      order: orderDetails
    })

  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[orderId] - Update order (limited fields)
export async function PUT(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = params
    const body = await request.json()
    const { action, notes } = body

    // Check if order exists and belongs to user
    const orderQuery = `
      SELECT id, status, order_number
      FROM orders
      WHERE id = $1 AND user_id = $2
    `

    const orderResult = await db.query(orderQuery, [orderId, user.userId])

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = orderResult.rows[0]

    // Handle different actions
    if (action === 'cancel') {
      // Only allow cancellation if order is pending or confirmed
      if (!['pending', 'confirmed'].includes(order.status)) {
        return NextResponse.json(
          { error: 'Order cannot be cancelled at this stage' },
          { status: 400 }
        )
      }

      // Update order status
      const updateQuery = `
        UPDATE orders
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1
        RETURNING status, updated_at
      `

      const updateResult = await db.query(updateQuery, [orderId])

      // Add to status history
      const statusQuery = `
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES ($1, $2, $3)
      `
      await db.query(statusQuery, [orderId, 'cancelled', notes || 'Cancelled by customer'])

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order: {
          id: orderId,
          orderNumber: order.order_number,
          status: updateResult.rows[0].status,
          updatedAt: updateResult.rows[0].updated_at
        }
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}