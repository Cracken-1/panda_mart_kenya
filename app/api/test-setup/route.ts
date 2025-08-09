import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase Setup...')

    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const envCheck = {
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
      serviceRoleKey: !!serviceRoleKey
    }

    console.log('📋 Environment Variables:', envCheck)

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing required environment variables',
        envCheck
      }, { status: 500 })
    }

    // Test 1: Basic connection
    console.log('🔌 Testing database connection...')
    const supabaseAdmin = createSupabaseAdmin()
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message,
        envCheck
      }, { status: 500 })
    }

    console.log('✅ Database connection successful')

    // Test 2: Check if tables exist
    console.log('📊 Checking table structure...')
    const tables = [
      'users', 'user_profiles', 'categories', 'brands', 
      'stores', 'products', 'cart_items', 'wishlist', 
      'orders', 'points_transactions'
    ]

    const tableStatus = {}
    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
          tableStatus[table] = { status: 'error', message: error.message }
        } else {
          console.log(`✅ Table '${table}': OK`)
          tableStatus[table] = { status: 'ok', count: data?.length || 0 }
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`)
        tableStatus[table] = { status: 'error', message: err.message }
      }
    }

    // Test 3: Check sample data
    console.log('📦 Checking sample data...')
    
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('*')
      .limit(5)
    
    const { data: stores } = await supabaseAdmin
      .from('stores')
      .select('*')

    const sampleData = {
      categories: categories?.length || 0,
      stores: stores?.length || 0,
      storeDetails: stores?.map(store => ({
        name: store.name,
        phone: store.phone,
        email: store.email
      })) || []
    }

    console.log('🎉 Supabase setup verification complete!')

    return NextResponse.json({
      success: true,
      message: 'Supabase setup verification complete',
      envCheck,
      tableStatus,
      sampleData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Setup test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}