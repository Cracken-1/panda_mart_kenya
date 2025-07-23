import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { authenticateUser } from '@/lib/security/auth'

// GET /api/orders - Get user's orders
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const offset = (page - 1) * limit
    const status = searchParams.get('status')

    // Build query with optional status filter
    let whereClause = 'WHERE o.user_id = $1'
    const queryParams = [user.userId]

    if (status) {
      whereClause += ' AND o.status = $2'
      queryParams.push(status)
    }

    // Get orders with basic info
    const ordersQuery = `
      SELECT 
        o.id, o.order_number, o.status, o.total_amount, o.currency,
        o.delivery_method, o.delivery_address, o.delivery_fee,
        o.created_at, o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `

    queryParams.push(limit, offset)
    const ordersResult = await db.query(ordersQuery, queryParams)

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `
    const countResult = await db.query(countQuery, queryParams.slice(0, -2))
    const totalItems = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(totalItems / limit)

    // Format orders
    const orders = ordersResult.rows.map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      totalAmount: parseFloat(order.total_amount),
      currency: order.currency,
      deliveryMethod: order.delivery_method,
      deliveryAddress: order.delivery_address,
      deliveryFee: order.delivery_fee ? parseFloat(order.delivery_fee) : 0,
      itemCount: parseInt(order.item_count),
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }))

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
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
    const {
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      notes
    } = body

    // Validate required fields
    if (!deliveryMethod || !deliveryAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Delivery method, address, and payment method are required' },
        { status: 400 }
      )
    }

    // Validate delivery method
    const validDeliveryMethods = ['pickup', 'delivery']
    if (!validDeliveryMethods.includes(deliveryMethod)) {
      return NextResponse.json(
        { error: 'Invalid delivery method' },
        { status: 400 }
      )
    }

    // Validate payment method
    const validPaymentMethods = ['mpesa', 'card', 'cash']
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Start transaction
    const client = await db.getClient()

    try {
      await client.query('BEGIN')

      // Get cart items
      const cartQuery = `
        SELECT 
          ci.product_id, ci.quantity,
          p.name, p.price, p.is_active
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1 AND p.is_active = true
      `
      const cartResult = await client.query(cartQuery, [user.userId])

      if (cartResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json(
          { error: 'Cart is empty or contains no active products' },
          { status: 400 }
        )
      }

      // Calculate totals
      let subtotal = 0
      const orderItems = cartResult.rows.map((item: any) => {
        const itemTotal = parseFloat(item.price) * item.quantity
        subtotal += itemTotal
        return {
          productId: item.product_id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price),
          totalPrice: itemTotal
        }
      })

      // Calculate delivery fee (simplified logic)
      const deliveryFee = deliveryMethod === 'delivery' ? 200 : 0 // KES 200 for delivery

      // Calculate tax (16% VAT)
      const taxRate = 0.16
      const tax = subtotal * taxRate
      const totalAmount = subtotal + tax + deliveryFee

      // Generate order number
      const orderNumber = `PM${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          user_id, order_number, status, subtotal, tax_amount, 
          delivery_fee, total_amount, currency, delivery_method, 
          delivery_address, payment_method, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, order_number, created_at
      `

      const orderResult = await client.query(orderQuery, [
        user.userId,
        orderNumber,
        'pending',
        subtotal,
        tax,
        deliveryFee,
        totalAmount,
        'KES',
        deliveryMethod,
        deliveryAddress,
        paymentMethod,
        notes || null
      ])

      const order = orderResult.rows[0]

      // Create order items
      for (const item of orderItems) {
        const itemQuery = `
          INSERT INTO order_items (
            order_id, product_id, product_name, quantity, 
            unit_price, total_price
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `
        await client.query(itemQuery, [
          order.id,
          item.productId,
          item.productName,
          item.quantity,
          item.unitPrice,
          item.totalPrice
        ])
      }

      // Clear cart
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [user.userId])

      // Create order status history
      const statusQuery = `
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES ($1, $2, $3)
      `
      await client.query(statusQuery, [order.id, 'pending', 'Order created'])

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.order_number,
          status: 'pending',
          subtotal,
          tax,
          deliveryFee,
          totalAmount,
          currency: 'KES',
          deliveryMethod,
          paymentMethod,
          itemCount: orderItems.length,
          createdAt: order.created_at
        }
      })

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}