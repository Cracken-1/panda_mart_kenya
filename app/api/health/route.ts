import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database connection
    const dbHealth = await db.healthCheck()
    
    const responseTime = Date.now() - startTime
    
    const healthStatus = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbHealth.status,
          responseTime: dbHealth.responseTime,
          message: dbHealth.message
        },
        api: {
          status: 'healthy',
          responseTime,
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