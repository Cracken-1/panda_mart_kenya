import crypto from 'crypto'
import { db } from '../database'
import { emailService } from '../services/emailService'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  is_verified: boolean
}

export interface VerificationToken {
  id: string
  token: string
  user_id: string
  expires_at: Date
}

/**
 * Generate a secure verification token for email verification
 */
export async function generateVerificationToken(userId: string): Promise<VerificationToken> {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex')
  
  // Set expiration (24 hours from now)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)
  
  // Delete any existing tokens for this user
  await db.query(
    'DELETE FROM email_verification_tokens WHERE user_id = $1',
    [userId]
  )
  
  // Store token in database
  const query = `
    INSERT INTO email_verification_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, token, user_id, expires_at
  `
  
  const result = await db.query(query, [userId, token, expiresAt])
  return result.rows[0]
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    // Generate verification token
    const tokenData = await generateVerificationToken(user.id)
    
    // Create verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${tokenData.token}`
    
    // Get email template
    const templateQuery = 'SELECT * FROM email_templates WHERE name = $1 AND is_active = TRUE'
    const templateResult = await db.query(templateQuery, ['email_verification'])
    
    if (!templateResult.rows.length) {
      throw new Error('Email verification template not found')
    }
    
    const template = templateResult.rows[0]
    
    // Replace variables in template
    let emailBody = template.body
    emailBody = emailBody.replace(/{{verification_link}}/g, verificationLink)
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
    
    console.log(`Verification email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending verification email:', error)
    
    // Log failed email
    await db.query(
      `INSERT INTO email_log (user_id, email, subject, body, status, error_message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, user.email, 'Email Verification', '', 'failed', error.message]
    )
    
    throw error
  }
}

/**
 * Verify email token and update user status
 */
export async function verifyEmailToken(token: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Find token in database
    const tokenQuery = `
      SELECT evt.*, u.email, u.first_name, u.last_name, u.is_verified
      FROM email_verification_tokens evt
      JOIN users u ON evt.user_id = u.id
      WHERE evt.token = $1 AND evt.expires_at > NOW()
    `
    
    const tokenResult = await db.query(tokenQuery, [token])
    
    if (!tokenResult.rows.length) {
      return {
        success: false,
        message: 'Invalid or expired verification token'
      }
    }
    
    const tokenData = tokenResult.rows[0]
    
    // Check if already verified
    if (tokenData.is_verified) {
      return {
        success: false,
        message: 'Email is already verified'
      }
    }
    
    // Update user verification status
    await db.query(
      `UPDATE users 
       SET is_verified = TRUE, email_verified_at = NOW() 
       WHERE id = $1`,
      [tokenData.user_id]
    )
    
    // Delete used token
    await db.query(
      'DELETE FROM email_verification_tokens WHERE id = $1',
      [tokenData.id]
    )
    
    // Log successful verification
    await db.query(
      `INSERT INTO auth_activity_log (user_id, activity, success, details)
       VALUES ($1, $2, $3, $4)`,
      [tokenData.user_id, 'email_verification', true, JSON.stringify({ token_used: true })]
    )
    
    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: tokenData.user_id,
        email: tokenData.email,
        first_name: tokenData.first_name,
        last_name: tokenData.last_name,
        is_verified: true
      }
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return {
      success: false,
      message: 'Server error during verification'
    }
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find user
    const userQuery = 'SELECT * FROM users WHERE email = $1'
    const userResult = await db.query(userQuery, [email])
    
    if (!userResult.rows.length) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message: 'If your email exists in our system, a verification link will be sent'
      }
    }
    
    const user = userResult.rows[0]
    
    // Check if already verified
    if (user.is_verified) {
      return {
        success: false,
        message: 'Email is already verified'
      }
    }
    
    // Check rate limiting (max 3 requests per hour)
    const rateLimitQuery = `
      SELECT COUNT(*) FROM email_log 
      WHERE email = $1 
      AND subject LIKE '%Verification%' 
      AND sent_at > NOW() - INTERVAL '1 hour'
    `
    const rateLimitResult = await db.query(rateLimitQuery, [email])
    const requestCount = parseInt(rateLimitResult.rows[0].count)
    
    if (requestCount >= 3) {
      return {
        success: false,
        message: 'Too many verification requests. Please try again later.'
      }
    }
    
    // Send new verification email
    await sendVerificationEmail(user)
    
    return {
      success: true,
      message: 'Verification email sent'
    }
  } catch (error) {
    console.error('Resend verification error:', error)
    return {
      success: false,
      message: 'Server error'
    }
  }
}

/**
 * Check if user needs email verification
 */
export async function checkVerificationStatus(userId: string): Promise<{ verified: boolean; email?: string }> {
  try {
    const query = 'SELECT email, is_verified FROM users WHERE id = $1'
    const result = await db.query(query, [userId])
    
    if (!result.rows.length) {
      return { verified: false }
    }
    
    const user = result.rows[0]
    return {
      verified: user.is_verified,
      email: user.email
    }
  } catch (error) {
    console.error('Error checking verification status:', error)
    return { verified: false }
  }
}