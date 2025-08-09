// Test script to verify Supabase setup
const { createClient } = require('@supabase/supabase-js')

async function testSupabaseSetup() {
    console.log('🧪 Testing Supabase Setup...\n')

    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('📋 Environment Variables:')
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('- SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
    console.log('- SERVICE_ROLE_KEY:', serviceRoleKey ? '✅ Set' : '❌ Missing')
    console.log()

    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing required environment variables')
        return
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || supabaseKey)

    try {
        // Test 1: Basic connection
        console.log('🔌 Testing database connection...')
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('count')
            .limit(1)

        if (error) {
            console.log('❌ Connection failed:', error.message)
            return
        }
        console.log('✅ Database connection successful')

        // Test 2: Check if tables exist
        console.log('\n📊 Checking table structure...')
        const tables = [
            'users', 'user_profiles', 'categories', 'brands',
            'stores', 'products', 'cart_items', 'wishlist',
            'orders', 'points_transactions'
        ]

        for (const table of tables) {
            try {
                const { data, error } = await supabaseAdmin
                    .from(table)
                    .select('*')
                    .limit(1)

                if (error) {
                    console.log(`❌ Table '${table}': ${error.message}`)
                } else {
                    console.log(`✅ Table '${table}': OK`)
                }
            } catch (err) {
                console.log(`❌ Table '${table}': ${err.message}`)
            }
        }

        // Test 3: Check sample data
        console.log('\n📦 Checking sample data...')

        const { data: categories } = await supabaseAdmin
            .from('categories')
            .select('*')
            .limit(5)

        console.log(`✅ Categories: ${categories?.length || 0} found`)

        const { data: stores } = await supabaseAdmin
            .from('stores')
            .select('*')

        console.log(`✅ Stores: ${stores?.length || 0} found`)
        if (stores && stores.length > 0) {
            stores.forEach(store => {
                console.log(`   - ${store.name}: ${store.phone}`)
            })
        }

        console.log('\n🎉 Supabase setup verification complete!')

    } catch (error) {
        console.log('❌ Test failed:', error.message)
    }
}

// Run the test
testSupabaseSetup().catch(console.error)