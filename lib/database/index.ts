import { Pool, PoolClient } from 'pg'
import { env } from '@/lib/env'

// Database configuration with build-time safety
const getDatabaseConfig = () => {
  // Use DATABASE_URL if available (Supabase/production)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  }
  
  // Fallback to individual environment variables
  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME || 'pandamart_kenya',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  }
}

// Create connection pool (but don't connect during build)
let pool: Pool | null = null
let isInitializing = false

function getPool(): Pool {
  if (!pool && !isInitializing) {
    isInitializing = true
    
    try {
      const dbConfig = getDatabaseConfig()
      pool = new Pool(dbConfig)
      
      // Handle pool errors
      pool.on('error', (err) => {
        console.error('Database pool error:', err.message)
        // Don't exit process during build or in serverless environment
        if (process.env.NODE_ENV === 'development') {
          console.error('Database connection lost, please check your database server')
        }
      })
      
      console.log('Database pool initialized')
    } catch (error) {
      console.error('Failed to initialize database pool:', error.message)
    } finally {
      isInitializing = false
    }
  }
  
  if (!pool) {
    throw new Error('Database pool not initialized')
  }
  
  return pool
}

// Database interface
export const db = {
  /**
   * Execute a query with parameters
   */
  query: async (text: string, params?: any[]) => {
    // Skip database operations during build time or when no DATABASE_URL is set
    if ((process.env.VERCEL_ENV && !process.env.DATABASE_URL) || 
        (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)) {
      console.log('Skipping database query during build - no DATABASE_URL configured')
      return { rows: [], rowCount: 0 }
    }
    
    const start = Date.now()
    try {
      const pool = getPool()
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      
      // Log slow queries (> 1 second)
      if (duration > 1000) {
        console.warn('Slow query detected:', {
          text: text.substring(0, 100) + '...',
          duration: `${duration}ms`,
          rows: res.rowCount
        })
      }
      
      return res
    } catch (error) {
      console.error('Database query error:', {
        text: text.substring(0, 100) + '...',
        params: params ? 'provided' : 'none',
        error: error.message
      })
      
      // Return empty result during build instead of throwing
      if (process.env.NODE_ENV !== 'development') {
        return { rows: [], rowCount: 0 }
      }
      
      throw error
    }
  },

  /**
   * Get a client from the pool for transactions
   */
  getClient: async (): Promise<PoolClient> => {
    const pool = getPool()
    return await pool.connect()
  },

  /**
   * Execute multiple queries in a transaction
   */
  transaction: async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
    const pool = getPool()
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  /**
   * Check database connection health
   */
  healthCheck: async () => {
    try {
      // Skip health check during build or when no DATABASE_URL is set
      if ((process.env.VERCEL_ENV && !process.env.DATABASE_URL) || 
          (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)) {
        return {
          status: 'skipped',
          responseTime: 0,
          message: 'Database health check skipped during build - no DATABASE_URL configured'
        }
      }
      
      const start = Date.now()
      const pool = getPool()
      const result = await pool.query('SELECT 1')
      const duration = Date.now() - start
      
      return {
        status: 'healthy',
        responseTime: duration,
        message: 'Database connection successful'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: 0,
        message: `Database connection failed: ${error.message}`
      }
    }
  },

  /**
   * Close all connections (for graceful shutdown)
   */
  close: async (): Promise<void> => {
    if (pool) {
      await pool.end()
      pool = null
    }
  }
}

// Export pool getter for direct access if needed
export { getPool }

// Graceful shutdown handling (only in runtime, not during build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', async () => {
    console.log('Closing database connections...')
    await db.close()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('Closing database connections...')
    await db.close()
    process.exit(0)
  })
}