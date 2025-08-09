import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      email_notifications: true,
      sms_notifications: false,
      marketing_emails: true,
      order_updates: true,
      newsletter: false,
      currency: 'USD',
      language: 'en',
      timezone: 'UTC'
    };

    return NextResponse.json({ 
      preferences: preferences || defaultPreferences 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      email_notifications,
      sms_notifications,
      marketing_emails,
      order_updates,
      newsletter,
      currency,
      language,
      timezone
    } = body;

    // Check if preferences exist
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let preferences;
    let error;

    if (existingPrefs) {
      // Update existing preferences
      const result = await supabase
        .from('user_preferences')
        .update({
          email_notifications,
          sms_notifications,
          marketing_emails,
          order_updates,
          newsletter,
          currency,
          language,
          timezone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      preferences = result.data;
      error = result.error;
    } else {
      // Create new preferences
      const result = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          email_notifications,
          sms_notifications,
          marketing_emails,
          order_updates,
          newsletter,
          currency,
          language,
          timezone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      preferences = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}