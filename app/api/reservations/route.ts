import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    let query = supabase
      .from('product_reservations')
      .select(`
        id,
        reservation_id,
        product_id,
        product_name,
        quantity,
        total_amount,
        reservation_fee,
        status,
        pickup_deadline,
        created_at,
        updated_at,
        store_id,
        customer_name,
        customer_phone,
        customer_email,
        notes,
        stores (
          id,
          name,
          address,
          phone
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: reservations, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reservations });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      product_id,
      product_name,
      store_id,
      quantity,
      total_amount,
      reservation_fee,
      reservation_days,
      customer_name,
      customer_phone,
      customer_email,
      notes,
      payment_method
    } = body;

    // Validate required fields
    if (!product_id || !product_name || !store_id || !quantity || !total_amount || !customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate reservation ID
    const reservation_id = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Calculate pickup deadline
    const pickup_deadline = new Date();
    pickup_deadline.setDate(pickup_deadline.getDate() + (reservation_days || 3));

    // Create reservation
    const { data: reservation, error } = await supabase
      .from('product_reservations')
      .insert({
        user_id: user.id,
        reservation_id,
        product_id,
        product_name,
        store_id,
        quantity,
        total_amount,
        reservation_fee: reservation_fee || 500,
        status: 'confirmed',
        pickup_deadline: pickup_deadline.toISOString(),
        customer_name,
        customer_phone,
        customer_email,
        notes,
        payment_method,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        stores (
          id,
          name,
          address,
          phone
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send confirmation SMS and email
    // TODO: Update product stock count
    // TODO: Process payment

    return NextResponse.json({ 
      reservation,
      message: 'Reservation created successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}