import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount,
        shipping_cost,
        tax_amount,
        created_at,
        updated_at,
        shipping_address,
        billing_address,
        payment_method,
        order_items (
          id,
          product_name,
          quantity,
          unit_price,
          total_price,
          product_id
        ),
        order_status_history (
          id,
          status,
          notes,
          created_at
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // Only allow certain actions for customers
    const allowedActions = ['cancel'];
    
    if (!allowedActions.includes(action)) {
      return NextResponse.json({ error: 'Action not allowed' }, { status: 403 });
    }

    // Check if order exists and belongs to user
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order can be cancelled
    if (action === 'cancel' && !['pending', 'confirmed'].includes(existingOrder.status)) {
      return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
    }

    const newStatus = action === 'cancel' ? 'cancelled' : existingOrder.status;

    // Update order status
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: params.id,
        status: newStatus,
        notes: `Order ${action}ed by customer`,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}