#!/usr/bin/env node

/**
 * Seed Initial Data Script
 * 
 * This script populates the database with initial data required for the application
 * including default categories, email templates, stores, and admin user.
 */

const { db } = require('../lib/database')
const bcrypt = require('bcryptjs')

async function seedInitialData() {
  console.log('Starting database seeding...')
  
  try {
    // 1. Seed Categories
    console.log('1. Seeding categories...')
    
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices, gadgets, and accessories',
        sort_order: 1
      },
      {
        name: 'Groceries & Food',
        slug: 'groceries-food',
        description: 'Fresh groceries, packaged foods, and beverages',
        sort_order: 2
      },
      {
        name: 'Fashion & Clothing',
        slug: 'fashion-clothing',
        description: 'Clothing, shoes, and fashion accessories',
        sort_order: 3
      },
      {
        name: 'Health & Beauty',
        slug: 'health-beauty',
        description: 'Health products, cosmetics, and personal care',
        sort_order: 4
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement, furniture, and garden supplies',
        sort_order: 5
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment, outdoor gear, and fitness products',
        sort_order: 6
      },
      {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Books, magazines, movies, and music',
        sort_order: 7
      },
      {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Toys, games, and educational products for children',
        sort_order: 8
      }
    ]
    
    for (const category of categories) {
      await db.query(`
        INSERT INTO categories (name, slug, description, sort_order, is_active)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (slug) DO NOTHING
      `, [category.name, category.slug, category.description, category.sort_order])
    }
    
    console.log(`✓ Seeded ${categories.length} categories`)
    
    // 2. Seed Brands
    console.log('2. Seeding brands...')
    
    const brands = [
      { name: 'Samsung', slug: 'samsung', description: 'Samsung Electronics' },
      { name: 'Apple', slug: 'apple', description: 'Apple Inc.' },
      { name: 'Nike', slug: 'nike', description: 'Nike Sportswear' },
      { name: 'Adidas', slug: 'adidas', description: 'Adidas Sports' },
      { name: 'Coca-Cola', slug: 'coca-cola', description: 'The Coca-Cola Company' },
      { name: 'Unilever', slug: 'unilever', description: 'Unilever Products' },
      { name: 'Procter & Gamble', slug: 'procter-gamble', description: 'P&G Products' },
      { name: 'Nestlé', slug: 'nestle', description: 'Nestlé Food & Beverages' }
    ]
    
    for (const brand of brands) {
      await db.query(`
        INSERT INTO brands (name, slug, description, is_active)
        VALUES ($1, $2, $3, TRUE)
        ON CONFLICT (slug) DO NOTHING
      `, [brand.name, brand.slug, brand.description])
    }
    
    console.log(`✓ Seeded ${brands.length} brands`)
    
    // 3. Seed Stores
    console.log('3. Seeding stores...')
    
    const stores = [
      {
        name: 'Panda Mart Nairobi CBD',
        code: 'NBO001',
        address: 'Kimathi Street, CBD',
        city: 'Nairobi',
        county: 'Nairobi',
        postal_code: '00100',
        latitude: -1.2864,
        longitude: 36.8172,
        phone: '+254700000001',
        email: 'nairobi.cbd@pandamart.co.ke',
        opening_hours: {
          monday: '08:00-22:00',
          tuesday: '08:00-22:00',
          wednesday: '08:00-22:00',
          thursday: '08:00-22:00',
          friday: '08:00-22:00',
          saturday: '08:00-22:00',
          sunday: '09:00-21:00'
        },
        services: ['pickup', 'delivery', 'returns', 'customer_service']
      },
      {
        name: 'Panda Mart Westlands',
        code: 'NBO002',
        address: 'Westlands Shopping Centre',
        city: 'Nairobi',
        county: 'Nairobi',
        postal_code: '00100',
        latitude: -1.2676,
        longitude: 36.8108,
        phone: '+254700000002',
        email: 'westlands@pandamart.co.ke',
        opening_hours: {
          monday: '08:00-22:00',
          tuesday: '08:00-22:00',
          wednesday: '08:00-22:00',
          thursday: '08:00-22:00',
          friday: '08:00-22:00',
          saturday: '08:00-22:00',
          sunday: '09:00-21:00'
        },
        services: ['pickup', 'delivery', 'returns']
      },
      {
        name: 'Panda Mart Mombasa',
        code: 'MSA001',
        address: 'Nyali Centre, Mombasa',
        city: 'Mombasa',
        county: 'Mombasa',
        postal_code: '80100',
        latitude: -4.0435,
        longitude: 39.6682,
        phone: '+254700000003',
        email: 'mombasa@pandamart.co.ke',
        opening_hours: {
          monday: '08:00-21:00',
          tuesday: '08:00-21:00',
          wednesday: '08:00-21:00',
          thursday: '08:00-21:00',
          friday: '08:00-21:00',
          saturday: '08:00-21:00',
          sunday: '09:00-20:00'
        },
        services: ['pickup', 'delivery']
      }
    ]
    
    for (const store of stores) {
      await db.query(`
        INSERT INTO stores (name, code, address, city, county, postal_code, latitude, longitude, phone, email, opening_hours, services, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
        ON CONFLICT (code) DO NOTHING
      `, [
        store.name, store.code, store.address, store.city, store.county,
        store.postal_code, store.latitude, store.longitude, store.phone,
        store.email, JSON.stringify(store.opening_hours), store.services
      ])
    }
    
    console.log(`✓ Seeded ${stores.length} stores`)
    
    // 4. Seed Email Templates
    console.log('4. Seeding email templates...')
    
    const emailTemplates = [
      {
        name: 'welcome_email',
        subject: 'Welcome to Panda Mart Kenya! 🐼',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to Panda Mart Kenya!</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi {{name}}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for joining the Panda Mart Kenya family! We're excited to have you on board.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Your unique Panda ID is: <strong style="color: #667eea;">{{panda_id}}</strong>
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>Browse our amazing deals and products</li>
                  <li>Find your nearest Panda Mart store</li>
                  <li>Start earning loyalty points with every purchase</li>
                  <li>Join our community for exclusive offers</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{app_url}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Start Shopping Now
                </a>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center;">
                Welcome to your world of amazing deals! 🛍️
              </p>
            </div>
          </div>
        `,
        variables: JSON.stringify({
          name: 'User first name',
          panda_id: 'User Panda ID',
          app_url: 'Application URL'
        })
      },
      {
        name: 'email_verification',
        subject: 'Verify Your Email Address - Panda Mart Kenya',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #667eea; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Verify Your Email</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi {{name}}!</h2>
              <p style="color: #666; line-height: 1.6;">
                Please verify your email address to complete your Panda Mart Kenya account setup.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{verification_link}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{verification_link}}" style="color: #667eea;">{{verification_link}}</a>
              </p>
              <p style="color: #999; font-size: 12px;">
                This link will expire in 24 hours. If you didn't create an account with Panda Mart Kenya, please ignore this email.
              </p>
            </div>
          </div>
        `,
        variables: JSON.stringify({
          name: 'User first name',
          verification_link: 'Email verification link'
        })
      },
      {
        name: 'password_reset',
        subject: 'Reset Your Password - Panda Mart Kenya',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f56565; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi {{name}},</h2>
              <p style="color: #666; line-height: 1.6;">
                We received a request to reset your password for your Panda Mart Kenya account.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{reset_link}}" style="background: #f56565; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{reset_link}}" style="color: #f56565;">{{reset_link}}</a>
              </p>
              <p style="color: #999; font-size: 12px;">
                This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
          </div>
        `,
        variables: JSON.stringify({
          name: 'User first name',
          reset_link: 'Password reset link'
        })
      },
      {
        name: 'order_confirmation',
        subject: 'Order Confirmed - {{order_number}} | Panda Mart Kenya',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #48bb78; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Order Confirmed! 🎉</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi {{name}},</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for your order! We've received your order and it's being processed.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> {{order_number}}</p>
                <p><strong>Total Amount:</strong> {{total_amount}} {{currency}}</p>
                <p><strong>Store:</strong> {{store_name}}</p>
                <p><strong>Fulfillment:</strong> {{fulfillment_type}}</p>
              </div>
              <p style="color: #666; line-height: 1.6;">
                We'll notify you when your order is ready for {{fulfillment_type}}.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{order_url}}" style="background: #48bb78; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Track Your Order
                </a>
              </div>
            </div>
          </div>
        `,
        variables: JSON.stringify({
          name: 'User first name',
          order_number: 'Order number',
          total_amount: 'Order total amount',
          currency: 'Currency code',
          store_name: 'Store name',
          fulfillment_type: 'pickup or delivery',
          order_url: 'Order tracking URL'
        })
      }
    ]
    
    for (const template of emailTemplates) {
      await db.query(`
        INSERT INTO email_templates (name, subject, body, variables, is_active)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (name) DO UPDATE SET
          subject = EXCLUDED.subject,
          body = EXCLUDED.body,
          variables = EXCLUDED.variables,
          updated_at = CURRENT_TIMESTAMP
      `, [template.name, template.subject, template.body, template.variables])
    }
    
    console.log(`✓ Seeded ${emailTemplates.length} email templates`)
    
    // 5. Create Admin User (if not exists)
    console.log('5. Creating admin user...')
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pandamart.co.ke'
    const adminPassword = process.env.ADMIN_PASSWORD || 'PandaAdmin2024!'
    
    // Check if admin user already exists
    const existingAdmin = await db.query('SELECT id FROM users WHERE email = $1', [adminEmail])
    
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      await db.query(`
        INSERT INTO users (
          email, phone, password_hash, first_name, last_name,
          is_verified, email_verified_at, tier, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        adminEmail,
        '+254700000000',
        hashedPassword,
        'Admin',
        'User',
        true,
        new Date(),
        'Diamond',
        true
      ])
      
      console.log(`✓ Created admin user: ${adminEmail}`)
      console.log(`  Default password: ${adminPassword}`)
      console.log('  ⚠️  Please change the admin password after first login!')
    } else {
      console.log('✓ Admin user already exists')
    }
    
    // 6. Seed Sample Rewards
    console.log('6. Seeding loyalty rewards...')
    
    const rewards = [
      {
        name: '5% Discount Coupon',
        description: 'Get 5% off your next purchase',
        points_required: 500,
        reward_type: 'discount',
        reward_value: JSON.stringify({ type: 'percentage', value: 5 }),
        terms_conditions: 'Valid for 30 days. Cannot be combined with other offers.'
      },
      {
        name: '10% Discount Coupon',
        description: 'Get 10% off your next purchase',
        points_required: 1000,
        reward_type: 'discount',
        reward_value: JSON.stringify({ type: 'percentage', value: 10 }),
        terms_conditions: 'Valid for 30 days. Cannot be combined with other offers.'
      },
      {
        name: 'Free Delivery',
        description: 'Free delivery on your next order',
        points_required: 300,
        reward_type: 'service',
        reward_value: JSON.stringify({ type: 'free_delivery' }),
        terms_conditions: 'Valid for orders above KES 1000. Valid for 30 days.'
      },
      {
        name: 'KES 100 Off',
        description: 'Get KES 100 off your next purchase',
        points_required: 800,
        reward_type: 'discount',
        reward_value: JSON.stringify({ type: 'fixed_amount', value: 100, currency: 'KES' }),
        terms_conditions: 'Valid for orders above KES 500. Valid for 30 days.'
      }
    ]
    
    for (const reward of rewards) {
      await db.query(`
        INSERT INTO rewards (name, description, points_required, reward_type, reward_value, terms_conditions, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, TRUE)
        ON CONFLICT DO NOTHING
      `, [
        reward.name, reward.description, reward.points_required,
        reward.reward_type, reward.reward_value, reward.terms_conditions
      ])
    }
    
    console.log(`✓ Seeded ${rewards.length} loyalty rewards`)
    
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Update admin password after first login')
    console.log('2. Configure email service settings')
    console.log('3. Add your product catalog')
    console.log('4. Test the authentication flow')
    
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  } finally {
    await db.close()
  }
}

// Run seeding if script is executed directly
if (require.main === module) {
  seedInitialData()
}

module.exports = { seedInitialData }