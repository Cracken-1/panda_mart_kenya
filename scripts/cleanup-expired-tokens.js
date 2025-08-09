#!/usr/bin/env node

/**
 * Cleanup Expired Tokens Script
 * 
 * This script removes expired email verification tokens and password reset tokens
 * from the database. Should be run periodically via cron job.
 */

const { db } = require('../lib/database')

async function cleanupExpiredTokens() {
  console.log('Starting cleanup of expired tokens...')
  
  try {
    // Clean up expired email verification tokens
    const emailTokensResult = await db.query(
      'DELETE FROM email_verification_tokens WHERE expires_at < NOW()'
    )
    
    // Clean up expired password reset tokens
    const passwordTokensResult = await db.query(
      'DELETE FROM password_reset_tokens WHERE expires_at < NOW()'
    )
    
    // Clean up expired user sessions
    const sessionsResult = await db.query(
      'DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = FALSE'
    )
    
    // Clean up old auth activity logs (keep last 90 days)
    const authLogsResult = await db.query(
      `DELETE FROM auth_activity_log 
       WHERE created_at < NOW() - INTERVAL '90 days'`
    )
    
    // Clean up old email logs (keep last 30 days)
    const emailLogsResult = await db.query(
      `DELETE FROM email_log 
       WHERE sent_at < NOW() - INTERVAL '30 days'`
    )
    
    console.log('Cleanup completed successfully:')
    console.log(`- Email verification tokens: ${emailTokensResult.rowCount || 0} deleted`)
    console.log(`- Password reset tokens: ${passwordTokensResult.rowCount || 0} deleted`)
    console.log(`- Expired sessions: ${sessionsResult.rowCount || 0} deleted`)
    console.log(`- Old auth logs: ${authLogsResult.rowCount || 0} deleted`)
    console.log(`- Old email logs: ${emailLogsResult.rowCount || 0} deleted`)
    
  } catch (error) {
    console.error('Error during cleanup:', error)
    process.exit(1)
  } finally {
    await db.close()
  }
}

// Run cleanup if script is executed directly
if (require.main === module) {
  cleanupExpiredTokens()
}

module.exports = { cleanupExpiredTokens }