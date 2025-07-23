import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { db } from '../database'
import { emailService } from '../services/emailService'

export interface PasswordResetToken {
  id: string
  token: string
  user_id: string
  expires_at: Date
  used_at?: Date
}

/**
 * Generate a secure password reset token
 */
export async function generatePasswordResetToken(userId: string): Promise<PasswordResetToken> {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex')
  
  // Set expiration (1 hour from now)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)
  
  // Delete any existing tokens for this user
  await db.query(
    'DELETE FROM password_reset_tokens WHERE user_id = $1',
    [userId]
  )
  
  // Store token in database
  const query = `
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, token, user_id, expires_at
  `
  
  const result = await db.query(query, [userId, token, expiresAt])
  return result.rows[0]
}

/**
 * Request password reset - send reset email
 */
export async function requestPasswordReset(email: string, ipAddress?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find user
    const userQuery = 'SELECT * FROM users WHERE email = $1'
    const userResult = await db.query(userQuery, [email])
    
    // Don't reveal if email exists or not for security
    const standardMessage = 'If your email exists in our system, a password reset link will be sent'
    
    if (!userResult.rows.length) {
      // Log failed attempt for security monitoring
      await db.query(
        `INSERT INTO auth_activity_log (activity, success, details, ip_address)
         VALUES ($1, $2, $3, $4)`,
        ['password_reset_request', false, JSON.stringify({ email, reason: 'user_not_found' }), ipAddress]
      )
      
      return {
        success: true,
        message: standardMessage
      }
    }
    
    const user = userResult.rows[0]
    
    // Check rate limiting (max 3 requests per hour per email)
    const rateLimitQuery = `
      SELECT COUNT(*) FROM email_log 
      WHERE email = $1 
      AND subject LIKE '%Password Reset%' 
      AND sent_at > NOW() - INTERVAL '1 hour'
    `
    const rateLimitResult = await db.query(rateLimitQuery, [email])
    const requestCount = parseInt(rateLimitResult.rows[0].count)
    
    if (requestCount >= 3) {
      // Log rate limit exceeded
      await db.query(
        `INSERT INTO security_incidents (user_id, incident_type, severity, description, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, 'password_reset_rate_limit', 'medium', 
         `Excessive password reset requests from ${email}`, ipAddress]
      )
      
      return {
        success: false,
        message: 'Too many password reset requests. Please try again later.'
      }
    }
    
    // Generate reset token
    const tokenData = await generatePasswordResetToken(user.id)
    
    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${tokenData.token}`
    
    // Get email template
    const templateQuery = 'SELECT * FROM email_templates WHERE name = $1 AND is_active = TRUE'
    const templateResult = await db.query(templateQuery, ['password_reset'])
    
    if (!templateResult.rows.length) {
      throw new Error('Password reset email template not found')
    }
    
    const template = templateResult.rows[0]
    
    // Replace variables in template
    let emailBody = template.body
    emailBody = emailBody.replace(/{{reset_link}}/g, resetLink)
    emailBody = emailBody.replace(/{{name}}/g, user.first_name)
    
    let emailSubject = template.subject
    emailSubject = emailSubject.replace(/{{name}}/g, user.first_name)
    
    // Send email
    await emailService.sendEmail({
      to: user.email,
      subject: emailSubject,
      html: emailBody
    })
    
    // Log email
    await db.query(
      `INSERT INTO email_log (user_id, email, template_id, subject, body, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, user.email, template.id, emailSubject, emailBody, 'sent']
    )
    
    // Log successful request
    await db.query(
      `INSERT INTO auth_activity_log (user_id, activity, success, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, 'password_reset_request', true, JSON.stringify({ email }), ipAddress]
    )
    
    console.log(`Password reset email sent to ${user.email}`)
    
    return {
      success: true,
      message: standardMessage
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    
    // Log error
    await db.query(
      `INSERT INTO email_log (email, subject, body, status, error_message)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, 'Password Reset Request', '', 'failed', error.message]
    )
    
    return {
      success: false,
      message: 'Server error occurred'
    }
  }
}

/**
 * Verify password reset token
 */
export async function verifyResetToken(token: string): Promise<{ valid: boolean; message: string; userId?: string }> {
  try {
    // Find token in database
    const tokenQuery = `
      SELECT prt.*, u.email, u.first_name
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = $1 AND prt.expires_at > NOW() AND prt.used_at IS NULL
    `
    
    const tokenResult = await db.query(tokenQuery, [token])
    
    if (!tokenResult.rows.length) {
      return {
        valid: false,
        message: 'Invalid or expired reset token'
      }
    }
    
    const tokenData = tokenResult.rows[0]
    
    return {
      valid: true,
      message: 'Token is valid',
      userId: tokenData.user_id
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return {
      valid: false,
      message: 'Server error during verification'
    }
  }
}

/**
 * Reset password using token
 */
export async function resetPassword(
  token: string, 
  newPassword: string, 
  ipAddress?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate password strength
    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long'
      }
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return {
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    }
    
    // Find and verify token
    const tokenQuery = `
      SELECT prt.*, u.email, u.first_name
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = $1 AND prt.expires_at > NOW() AND prt.used_at IS NULL
    `
    
    const tokenResult = await db.query(tokenQuery, [token])
    
    if (!tokenResult.rows.length) {
      return {
        success: false,
        message: 'Invalid or expired reset token'
      }
    }
    
    const tokenData = tokenResult.rows[0]
    
    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    
    // Update password in database
    await db.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, tokenData.user_id]
    )
    
    // Mark token as used
    await db.query(
      `UPDATE password_reset_tokens 
       SET used_at = NOW() 
       WHERE id = $1`,
      [tokenData.id]
    )
    
    // Invalidate all user sessions for security
    await db.query(
      `UPDATE user_sessions 
       SET is_active = FALSE 
       WHERE user_id = $1`,
      [tokenData.user_id]
    )
    
    // Log successful password reset
    await db.query(
      `INSERT INTO auth_activity_log (user_id, activity, success, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [tokenData.user_id, 'password_reset', true, 
       JSON.stringify({ token_used: true, sessions_invalidated: true }), ipAddress]
    )
    
    // Send confirmation email
    try {
      await emailService.sendEmail({
        to: tokenData.email,
        subject: 'Password Reset Successful - Panda Mart Kenya',
        html: `
          <h1>Password Reset Successful</h1>
          <p>Hi ${tokenData.first_name},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
          <p>For security, all your active sessions have been logged out.</p>
          <br>
          <p>Best regards,<br>Panda Mart Kenya Team</p>
        `
      })
    } catch (emailError) {
      console.error('Error sending password reset confirmation email:', emailError)
      // Don't fail the password reset if email fails
    }
    
    console.log(`Password reset successful for user ${tokenData.email}`)
    
    return {
      success: true,
      message: 'Password reset successfully'
    }
  } catch (error) {
    console.error('Password reset error:', error)
    
    // Log failed attempt
    await db.query(
      `INSERT INTO auth_activity_log (activity, success, details, ip_address)
       VALUES ($1, $2, $3, $4)`,
      ['password_reset', false, JSON.stringify({ error: error.message }), ipAddress]
    )
    
    return {
      success: false,
      message: 'Server error occurred'
    }
  }
}

/**
 * Clean up expired tokens (should be run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await db.query(
      'DELETE FROM password_reset_tokens WHERE expires_at < NOW()'
    )
    
    const deletedCount = result.rowCount || 0
    console.log(`Cleaned up ${deletedCount} expired password reset tokens`)
    
    return deletedCount
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
    return 0
  }
}

/**
 * Get password reset statistics for monitoring
 */
export async function getPasswordResetStats(hours: number = 24): Promise<{
  totalRequests: number
  successfulResets: number
  failedAttempts: number
  topIpAddresses: Array<{ ip: string; count: number }>
}> {
  try {
    const timeframe = `${hours} hours`
    
    // Get total requests
    const requestsResult = await db.query(
      `SELECT COUNT(*) FROM auth_activity_log 
       WHERE activity = 'password_reset_request' 
       AND created_at > NOW() - INTERVAL '${timeframe}'`
    )
    
    // Get successful resets
    const successResult = await db.query(
      `SELECT COUNT(*) FROM auth_activity_log 
       WHERE activity = 'password_reset' AND success = TRUE
       AND created_at > NOW() - INTERVAL '${timeframe}'`
    )
    
    // Get failed attempts
    const failedResult = await db.query(
      `SELECT COUNT(*) FROM auth_activity_log 
       WHERE activity = 'password_reset' AND success = FALSE
       AND created_at > NOW() - INTERVAL '${timeframe}'`
    )
    
    // Get top IP addresses
    const ipResult = await db.query(
      `SELECT ip_address::text as ip, COUNT(*) as count
       FROM auth_activity_log 
       WHERE activity IN ('password_reset_request', 'password_reset')
       AND created_at > NOW() - INTERVAL '${timeframe}'
       AND ip_address IS NOT NULL
       GROUP BY ip_address
       ORDER BY count DESC
       LIMIT 10`
    )
    
    return {
      totalRequests: parseInt(requestsResult.rows[0].count),
      successfulResets: parseInt(successResult.rows[0].count),
      failedAttempts: parseInt(failedResult.rows[0].count),
      topIpAddresses: ipResult.rows
    }
  } catch (error) {
    console.error('Error getting password reset stats:', error)
    return {
      totalRequests: 0,
      successfulResets: 0,
      failedAttempts: 0,
      topIpAddresses: []
    }
  }
}