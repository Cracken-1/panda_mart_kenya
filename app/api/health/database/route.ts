import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const start = Date.now()
    const supabase = createClient()
    
    // Test basic database connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    const responseTime = Date.now() - start
    const isHealthy = !testError

    const result = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy ? 'Database connection successful' : testError?.message || 'Database connection failed',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      details: {
        provider: 'Supabase',
        connectionTest: isHealthy
      },
      checks: {
        connection: isHealthy,
        responseTime: responseTime < 1000
      }
    }

    const statusCode = result.status === 'healthy' ? 200 : 503
    return NextResponse.json(result, { status: statusCode })

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}