import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const start = Date.now()
    
    // Perform comprehensive database health check
    const healthCheck = await db.healthCheck()
    const responseTime = Date.now() - start

    // Additional database-specific checks
    const additionalChecks = await Promise.all([
      // Check critical tables exist
      db.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'products', 'orders')"),
      
      // Check database size
      db.query("SELECT pg_size_pretty(pg_database_size(current_database())) as size"),
      
      // Check active connections
      db.query("SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active'"),
      
      // Check for long-running queries
      db.query(`
        SELECT count(*) as long_queries 
        FROM pg_stat_activity 
        WHERE state = 'active' 
        AND query_start < NOW() - INTERVAL '5 minutes'
        AND query NOT LIKE '%pg_stat_activity%'
      `)
    ])

    const [tablesCheck, sizeCheck, connectionsCheck, longQueriesCheck] = additionalChecks

    const result = {
      status: healthCheck.healthy ? 'healthy' : 'unhealthy',
      message: healthCheck.message,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      details: {
        ...healthCheck.stats,
        databaseSize: sizeCheck.rows[0].size,
        activeConnections: parseInt(connectionsCheck.rows[0].active_connections),
        longRunningQueries: parseInt(longQueriesCheck.rows[0].long_queries),
        criticalTablesCount: parseInt(tablesCheck.rows[0].count)
      },
      checks: {
        connection: healthCheck.healthy,
        criticalTables: parseInt(tablesCheck.rows[0].count) === 3,
        connectionPool: parseInt(connectionsCheck.rows[0].active_connections) < 50,
        performance: parseInt(longQueriesCheck.rows[0].long_queries) === 0
      }
    }

    // Determine if any checks failed
    const allChecksPassed = Object.values(result.checks).every(check => check === true)
    
    if (!allChecksPassed) {
      result.status = 'degraded'
      result.message = 'Some database checks failed'
    }

    const statusCode = result.status === 'healthy' ? 200 : 503

    return NextResponse.json(result, { status: statusCode })

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: `Database health check failed: ${error.message}`,
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}