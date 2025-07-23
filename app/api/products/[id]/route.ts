import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/products/[id] - Get a single product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      )
    }
    
    // Query for the product with related data
    const query = `
      SELECT 
        p.id, p.sku, p.name, p.slug, p.description, p.short_description,
        p.price, p.original_price, p.cost_price, p.weight, p.dimensions,
        p.images, p.features, p.specifications, p.tags,
        p.is_active, p.is_featured, p.meta_title, p.meta_description,
        p.created_at, p.updated_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        b.id as brand_id, b.name as brand_name, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = $1
    `
    
    const result = await db.query(query, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const product = result.rows[0]
    
    // Get inventory information across stores
    const inventoryQuery = `
      SELECT 
        pi.store_id, 
        s.name as store_name, 
        s.city as store_city,
        pi.quantity, 
        pi.reserved_quantity
      FROM product_inventory pi
      JOIN stores s ON pi.store_id = s.id
      WHERE pi.product_id = $1
    `
    
    const inventoryResult = await db.query(inventoryQuery, [id])
    
    // Get related products
    const relatedQuery = `
      SELECT 
        p.id, p.name, p.slug, p.price, p.images
      FROM products p
      WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = true
      LIMIT 5
    `
    
    const relatedResult = await db.query(relatedQuery, [product.category_id, id])
    
    // Get product reviews
    const reviewsQuery = `
      SELECT 
        r.id, r.rating, r.review_text, r.created_at,
        u.first_name, u.last_name, u.avatar_url
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1 AND r.is_approved = true
      ORDER BY r.created_at DESC
      LIMIT 5
    `
    
    const reviewsResult = await db.query(reviewsQuery, [id])
    
    // Format the response
    const formattedProduct = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      costPrice: product.cost_price ? parseFloat(product.cost_price) : null,
      weight: product.weight,
      dimensions: product.dimensions,
      images: product.images || [],
      features: product.features || [],
      specifications: product.specifications || {},
      tags: product.tags || [],
      isActive: product.is_active,
      isFeatured: product.is_featured,
      metaTitle: product.meta_title,
      metaDescription: product.meta_description,
      category: product.category_id ? {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug
      } : null,
      brand: product.brand_id ? {
        id: product.brand_id,
        name: product.brand_name,
        slug: product.brand_slug
      } : null,
      inventory: inventoryResult.rows.map(inv => ({
        storeId: inv.store_id,
        storeName: inv.store_name,
        storeCity: inv.store_city,
        quantity: inv.quantity,
        reservedQuantity: inv.reserved_quantity,
        availableQuantity: Math.max(0, inv.quantity - inv.reserved_quantity)
      })),
      relatedProducts: relatedResult.rows.map(related => ({
        id: related.id,
        name: related.name,
        slug: related.slug,
        price: parseFloat(related.price),
        images: related.images || []
      })),
      reviews: reviewsResult.rows.map(review => ({
        id: review.id,
        rating: review.rating,
        reviewText: review.review_text,
        createdAt: review.created_at,
        user: {
          firstName: review.first_name,
          lastName: review.last_name,
          avatarUrl: review.avatar_url
        }
      })),
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }
    
    return NextResponse.json({
      success: true,
      product: formattedProduct
    })
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}