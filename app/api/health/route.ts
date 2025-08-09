import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    const supabase = createClient()
    
    // Check database connection
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    const responseTime = Date.now() - startTime
    const dbHealthy = !dbError
    
    const healthStatus = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          responseTime: `${responseTime}ms`,
          message: dbHealthy ? 'Database connection successful' : dbError?.message || 'Database connection failed'
        },
        api: {
          status: 'healthy',
          responseTime: `${responseTime}ms`,
          message: 'API is running'
        }
      }
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503
    return NextResponse.json(healthStatus, { status: statusCode })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      error: 'Health check failed',
      services: {
        database: {
          status: 'unhealthy',
          message: 'Database connection failed'
        },
        api: {
          status: 'unhealthy',
          message: 'API health check failed'
        }
      }
    }, { status: 503 })
  }
}