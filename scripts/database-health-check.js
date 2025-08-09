#!/usr/bin/env node

/**
 * Database Health Check Script
 * 
 * This script performs comprehensive health checks on the database
 * including connection, performance, and data integrity checks.
 */

const { db } = require('../lib/database')

async function performHealthCheck() {
  console.log('Starting database health check...')
  
  const results = {
    connection: false,
    performance: {},
    integrity: {},
    security: {},
    recommendations: []
  }
  
  try {
    // 1. Connection Test
    console.log('1. Testing database connection...')
    const connectionTest = await db.healthCheck()
    results.connection = connectionTest.healthy
    
    if (connectionTest.healthy) {
      console.log('✓ Database connection is healthy')
      console.log(`  Response time: ${connectionTest.stats.responseTime}`)
      console.log(`  Active connections: ${connectionTest.stats.totalConnections}`)
    } else {
      console.log('✗ Database connection failed:', connectionTest.message)
      return results
    }
    
    // 2. Performance Checks
    console.log('\n2. Checking database performance...')
    
    // Check table sizes
    const tableSizes = await db.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10
    `)
    
    results.performance.tableSizes = tableSizes.rows
    console.log('✓ Top 10 largest tables:')
    tableSizes.rows.forEach(table => {
      console.log(`  ${table.tablename}: ${table.size}`)
    })
    
    // Check index usage
    const indexUsage = await db.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_tup_read,
        idx_tup_fetch,
        CASE WHEN idx_tup_read = 0 THEN 'Unused' ELSE 'Used' END as status
      FROM pg_stat_user_indexes 
      WHERE idx_tup_read = 0
      ORDER BY schemaname, tablename
    `)
    
    results.performance.unusedIndexes = indexUsage.rows
    if (indexUsage.rows.length > 0) {
      console.log(`⚠ Found ${indexUsage.rows.length} unused indexes`)
      results.recommendations.push('Consider removing unused indexes to improve write performance')
    } else {
      console.log('✓ All indexes are being used')
    }
    
    // Check slow queries (if pg_stat_statements is available)
    try {
      const slowQueries = await db.query(`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          rows
        FROM pg_stat_statements 
        WHERE mean_time > 1000
        ORDER BY mean_time DESC 
        LIMIT 5
      `)
      
      results.performance.slowQueries = slowQueries.rows
      if (slowQueries.rows.length > 0) {
        console.log(`⚠ Found ${slowQueries.rows.length} slow queries (>1s average)`)
        results.recommendations.push('Optimize slow queries or add appropriate indexes')
      }
    } catch (error) {
      console.log('ℹ pg_stat_statements extension not available for query analysis')
    }
    
    // 3. Data Integrity Checks
    console.log('\n3. Checking data integrity...')
    
    // Check for orphaned records
    const orphanedOrderItems = await db.query(`
      SELECT COUNT(*) as count
      FROM order_items oi
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.id IS NULL
    `)
    
    const orphanedCartItems = await db.query(`
      SELECT COUNT(*) as count
      FROM cart_items ci
      LEFT JOIN users u ON ci.user_id = u.id
      WHERE u.id IS NULL
    `)
    
    results.integrity.orphanedOrderItems = parseInt(orphanedOrderItems.rows[0].count)
    results.integrity.orphanedCartItems = parseInt(orphanedCartItems.rows[0].count)
    
    if (results.integrity.orphanedOrderItems > 0) {
      console.log(`⚠ Found ${results.integrity.orphanedOrderItems} orphaned order items`)
      results.recommendations.push('Clean up orphaned order items')
    }
    
    if (results.integrity.orphanedCartItems > 0) {
      console.log(`⚠ Found ${results.integrity.orphanedCartItems} orphaned cart items`)
      results.recommendations.push('Clean up orphaned cart items')
    }
    
    // Check for duplicate emails
    const duplicateEmails = await db.query(`
      SELECT email, COUNT(*) as count
      FROM users
      GROUP BY email
      HAVING COUNT(*) > 1
    `)
    
    results.integrity.duplicateEmails = duplicateEmails.rows
    if (duplicateEmails.rows.length > 0) {
      console.log(`⚠ Found ${duplicateEmails.rows.length} duplicate email addresses`)
      results.recommendations.push('Investigate and resolve duplicate email addresses')
    } else {
      console.log('✓ No duplicate email addresses found')
    }
    
    // 4. Security Checks
    console.log('\n4. Performing security checks...')
    
    // Check for users without email verification
    const unverifiedUsers = await db.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE is_verified = FALSE AND created_at < NOW() - INTERVAL '7 days'
    `)
    
    results.security.unverifiedUsers = parseInt(unverifiedUsers.rows[0].count)
    if (results.security.unverifiedUsers > 0) {
      console.log(`⚠ Found ${results.security.unverifiedUsers} unverified users older than 7 days`)
      results.recommendations.push('Consider cleaning up old unverified user accounts')
    }
    
    // Check for expired tokens
    const expiredTokens = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM email_verification_tokens WHERE expires_at < NOW()) as expired_email_tokens,
        (SELECT COUNT(*) FROM password_reset_tokens WHERE expires_at < NOW()) as expired_reset_tokens
    `)
    
    const expiredEmailTokens = parseInt(expiredTokens.rows[0].expired_email_tokens)
    const expiredResetTokens = parseInt(expiredTokens.rows[0].expired_reset_tokens)
    
    if (expiredEmailTokens > 0 || expiredResetTokens > 0) {
      console.log(`⚠ Found ${expiredEmailTokens} expired email tokens and ${expiredResetTokens} expired reset tokens`)
      results.recommendations.push('Run token cleanup script to remove expired tokens')
    } else {
      console.log('✓ No expired tokens found')
    }
    
    // Check recent failed login attempts
    const failedLogins = await db.query(`
      SELECT COUNT(*) as count
      FROM auth_activity_log
      WHERE activity = 'login' AND success = FALSE 
      AND created_at > NOW() - INTERVAL '24 hours'
    `)
    
    results.security.recentFailedLogins = parseInt(failedLogins.rows[0].count)
    if (results.security.recentFailedLogins > 100) {
      console.log(`⚠ High number of failed login attempts: ${results.security.recentFailedLogins} in last 24 hours`)
      results.recommendations.push('Investigate potential brute force attacks')
    }
    
    // 5. Summary
    console.log('\n5. Health Check Summary')
    console.log('========================')
    
    if (results.recommendations.length === 0) {
      console.log('✓ Database is healthy - no issues found')
    } else {
      console.log(`⚠ Found ${results.recommendations.length} recommendations:`)
      results.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`)
      })
    }
    
    return results
    
  } catch (error) {
    console.error('Error during health check:', error)
    results.error = error.message
    return results
  } finally {
    await db.close()
  }
}

// Run health check if script is executed directly
if (require.main === module) {
  performHealthCheck().then(results => {
    if (results.error) {
      process.exit(1)
    }
  })
}

module.exports = { performHealthCheck }