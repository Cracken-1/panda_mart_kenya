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

    const { data: reservation, error } = await supabase
      .from('product_reservations')
      .select(`
        *,
        stores (
          id,
          name,
          address,
          phone,
          hours
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ reservation });
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
    const { action, extend_days } = body;

    // Check if reservation exists and belongs to user
    const { data: existingReservation } = await supabase
      .from('product_reservations')
      .select('id, status, pickup_deadline')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (!existingReservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    };

    switch (action) {
      case 'cancel':
        if (!['confirmed', 'extended'].includes(existingReservation.status)) {
          return NextResponse.json({ error: 'Cannot cancel this reservation' }, { status: 400 });
        }
        updateData.status = 'cancelled';
        break;

      case 'extend':
        if (!['confirmed', 'extended'].includes(existingReservation.status)) {
          return NextResponse.json({ error: 'Cannot extend this reservation' }, { status: 400 });
        }
        if (!extend_days || extend_days < 1 || extend_days > 2) {
          return NextResponse.json({ error: 'Invalid extension period' }, { status: 400 });
        }
        
        const currentDeadline = new Date(existingReservation.pickup_deadline);
        const newDeadline = new Date(currentDeadline);
        newDeadline.setDate(newDeadline.getDate() + extend_days);
        
        updateData.status = 'extended';
        updateData.pickup_deadline = newDeadline.toISOString();
        break;

      case 'complete':
        if (existingReservation.status !== 'confirmed' && existingReservation.status !== 'extended') {
          return NextResponse.json({ error: 'Cannot complete this reservation' }, { status: 400 });
        }
        updateData.status = 'completed';
        updateData.pickup_date = new Date().toISOString();
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { data: reservation, error } = await supabase
      .from('product_reservations')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
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

    return NextResponse.json({ 
      reservation,
      message: `Reservation ${action}ed successfully`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('product_reservations')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}