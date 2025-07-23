import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    
    // Check if we should include product counts
    const includeProductCount = searchParams.get('includeProductCount') === 'true'
    
    // Check if we should include subcategories
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true'
    
    // Get only top-level categories or all
    const parentId = searchParams.get('parentId')
    const topLevelOnly = searchParams.get('topLevelOnly') === 'true'
    
    // Build the query
    let query = `
      SELECT 
        c.id, c.name, c.slug, c.description, c.image_url, 
        c.parent_id, c.sort_order, c.is_active
      FROM categories c
      WHERE c.is_active = true
    `
    
    const queryParams = []
    
    if (topLevelOnly) {
      query += ' AND c.parent_id IS NULL'
    } else if (parentId) {
      query += ' AND c.parent_id = $1'
      queryParams.push(parentId)
    }
    
    query += ' ORDER BY c.sort_order ASC, c.name ASC'
    
    // Execute the query
    const result = await db.query(query, queryParams)
    
    // Process the results
    const categories = await Promise.all(result.rows.map(async (category) => {
      const formattedCategory = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.image_url,
        parentId: category.parent_id,
        sortOrder: category.sort_order,
        isActive: category.is_active,
        productCount: 0,
        subcategories: []
      }
      
      // Get product count if requested
      if (includeProductCount) {
        const countQuery = `
          SELECT COUNT(*) as count
          FROM products p
          WHERE p.category_id = $1 AND p.is_active = true
        `
        const countResult = await db.query(countQuery, [category.id])
        formattedCategory.productCount = parseInt(countResult.rows[0].count)
      }
      
      // Get subcategories if requested
      if (includeSubcategories && !parentId) {
        const subQuery = `
          SELECT 
            c.id, c.name, c.slug, c.description, c.image_url, 
            c.parent_id, c.sort_order, c.is_active
          FROM categories c
          WHERE c.parent_id = $1 AND c.is_active = true
          ORDER BY c.sort_order ASC, c.name ASC
        `
        const subResult = await db.query(subQuery, [category.id])
        
        formattedCategory.subcategories = await Promise.all(subResult.rows.map(async (sub) => {
          const formattedSub = {
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            imageUrl: sub.image_url,
            parentId: sub.parent_id,
            sortOrder: sub.sort_order,
            isActive: sub.is_active,
            productCount: 0
          }
          
          // Get product count for subcategory if requested
          if (includeProductCount) {
            const subCountQuery = `
              SELECT COUNT(*) as count
              FROM products p
              WHERE p.category_id = $1 AND p.is_active = true
            `
            const subCountResult = await db.query(subCountQuery, [sub.id])
            formattedSub.productCount = parseInt(subCountResult.rows[0].count)
          }
          
          return formattedSub
        }))
      }
      
      return formattedCategory
    }))
    
    return NextResponse.json({
      success: true,
      categories
    })
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}