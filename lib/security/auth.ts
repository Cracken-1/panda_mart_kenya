/**
 * Authentication and Security Utilities
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Password security
export class PasswordSecurity {
  private static readonly SALT_ROUNDS = 12
  private static readonly MIN_LENGTH = 8
  private static readonly MAX_LENGTH = 128

  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    this.validatePassword(password)
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`)
    }

    if (password.length > this.MAX_LENGTH) {
      errors.push(`Password must be no more than ${this.MAX_LENGTH} characters long`)
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters')
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const allChars = lowercase + uppercase + numbers + symbols
    let password = ''
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
}

// JWT Token Management
export class TokenManager {
  private static readonly ACCESS_TOKEN_EXPIRY = '15m'
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'
  private static readonly RESET_TOKEN_EXPIRY = '1h'

  /**
   * Generate access token
   */
  static generateAccessToken(payload: any): string {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) throw new Error('JWT_ACCESS_SECRET not configured')

    return jwt.sign(payload, secret, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'pandamart.co.ke',
      audience: 'pandamart-users'
    })
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: any): string {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) throw new Error('JWT_REFRESH_SECRET not configured')

    return jwt.sign(payload, secret, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: 'pandamart.co.ke',
      audience: 'pandamart-users'
    })
  }

  /**
   * Generate password reset token
   */
  static generateResetToken(payload: any): string {
    const secret = process.env.JWT_RESET_SECRET
    if (!secret) throw new Error('JWT_RESET_SECRET not configured')

    return jwt.sign(payload, secret, {
      expiresIn: this.RESET_TOKEN_EXPIRY,
      issuer: 'pandamart.co.ke',
      audience: 'pandamart-users'
    })
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): any {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) throw new Error('JWT_ACCESS_SECRET not configured')

    return jwt.verify(token, secret, {
      issuer: 'pandamart.co.ke',
      audience: 'pandamart-users'
    })
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): any {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) throw new Error('JWT_REFRESH_SECRET not configured')

    return jwt.verify(token, secret, {
      issuer: 'pandamart.co.ke',
      audience: 'pandamart-users'
    })
  }

  /**
   * Verify reset token
   */
  static verifyResetToken(token: string): any {
    const secret = process.env.JWT_RESET_SECRET
    if (!secret) throw new Error('JWT_RESET_SECRET not configured')

    return jwt.verify(token, secret, {
      issuer: 'pandamart.co.ke',
      audience: 'pandamart-users'
    })
  }
}

// Two-Factor Authentication
export class TwoFactorAuth {
  /**
   * Generate 2FA secret
   */
  static generateSecret(): string {
    return crypto.randomBytes(20).toString('hex')
  }

  /**
   * Generate TOTP code
   */
  static generateTOTP(secret: string, window: number = 0): string {
    const epoch = Math.round(new Date().getTime() / 1000.0)
    const time = Math.floor((epoch + window * 30) / 30)
    
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex'))
    hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'))
    const hash = hmac.digest()
    
    const offset = hash[hash.length - 1] & 0xf
    const code = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff)
    
    return (code % 1000000).toString().padStart(6, '0')
  }

  /**
   * Verify TOTP code
   */
  static verifyTOTP(secret: string, token: string, window: number = 1): boolean {
    for (let i = -window; i <= window; i++) {
      if (this.generateTOTP(secret, i) === token) {
        return true
      }
    }
    return false
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
    }
    return codes
  }
}

// Rate Limiting
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map()

  /**
   * Check if request is rate limited
   */
  static isRateLimited(
    identifier: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    if (record.count >= maxAttempts) {
      return true
    }

    record.count++
    return false
  }

  /**
   * Reset rate limit for identifier
   */
  static resetRateLimit(identifier: string): void {
    this.attempts.delete(identifier)
  }

  /**
   * Get remaining attempts
   */
  static getRemainingAttempts(
    identifier: string, 
    maxAttempts: number = 5
  ): number {
    const record = this.attempts.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return maxAttempts
    }
    return Math.max(0, maxAttempts - record.count)
  }
}

// Session Management
export interface SessionData {
  userId: string
  email: string
  pandaId: string
  deviceInfo?: any
  ipAddress?: string
  location?: string
}

export class SessionManager {
  /**
   * Generate secure session token
   */
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Create session data
   */
  static createSession(userData: SessionData, request?: any): SessionData & { sessionToken: string; expiresAt: Date } {
    const sessionToken = this.generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    return {
      ...userData,
      sessionToken,
      expiresAt,
      deviceInfo: request?.headers?.['user-agent'] || 'Unknown',
      ipAddress: request?.ip || request?.connection?.remoteAddress || 'Unknown'
    }
  }

  /**
   * Validate session token format
   */
  static isValidSessionToken(token: string): boolean {
    return /^[a-f0-9]{64}$/.test(token)
  }
}

// Input Sanitization
export class InputSanitizer {
  /**
   * Sanitize email input
   */
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  /**
   * Sanitize phone number (Kenya format)
   */
  static sanitizePhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // Handle different Kenya phone formats
    if (digits.startsWith('254')) {
      return '+' + digits
    } else if (digits.startsWith('0')) {
      return '+254' + digits.substring(1)
    } else if (digits.length === 9) {
      return '+254' + digits
    }
    
    return phone // Return original if can't parse
  }

  /**
   * Sanitize name input
   */
  static sanitizeName(name: string): string {
    return name.trim().replace(/[^a-zA-Z\s'-]/g, '')
  }

  /**
   * Sanitize general text input
   */
  static sanitizeText(text: string): string {
    return text.trim().replace(/[<>]/g, '')
  }
}

// Security Headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-src https://www.google.com;"
}

// Audit logging
export interface AuditLog {
  userId?: string
  action: string
  resource: string
  details?: any
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  success: boolean
}

export class AuditLogger {
  /**
   * Log security event
   */
  static async logSecurityEvent(event: AuditLog): Promise<void> {
    // In production, this would write to a secure audit log
    console.log('[AUDIT]', {
      ...event,
      timestamp: event.timestamp.toISOString()
    })
    
    // TODO: Implement database logging
    // await db.securityLogs.create({ data: event })
  }

  /**
   * Log authentication event
   */
  static async logAuthEvent(
    action: 'login' | 'logout' | 'register' | 'password_reset' | '2fa_enable' | '2fa_disable',
    userId?: string,
    success: boolean = true,
    details?: any,
    request?: any
  ): Promise<void> {
    await this.logSecurityEvent({
      userId,
      action,
      resource: 'authentication',
      details,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
      timestamp: new Date(),
      success
    })
  }
}

// Authentication Middleware
import { NextRequest } from 'next/server'
import { db } from '../database'

/**
 * Authenticates a user from the request's Authorization header
 * @param request The Next.js request object
 * @returns The authenticated user payload or null if authentication fails
 */
export async function authenticateUser(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    if (!token) {
      return null
    }

    // Verify the token
    const payload = TokenManager.verifyAccessToken(token)
    if (!payload) {
      return null
    }

    // Check if user exists and is active
    const userQuery = `
      SELECT is_active 
      FROM users 
      WHERE id = $1
    `
    const result = await db.query(userQuery, [payload.userId])

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return null
    }

    return payload
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

/**
 * Checks if the authenticated user has the required role
 * @param user The authenticated user payload
 * @param requiredRole The role required for access
 * @returns Boolean indicating if the user has the required role
 */
export function hasRole(user: any, requiredRole: string) {
  if (!user || !user.roles) {
    return false
  }
  
  return user.roles.includes(requiredRole)
}

/**
 * Checks if the authenticated user has the required permission
 * @param user The authenticated user payload
 * @param requiredPermission The permission required for access
 * @returns Boolean indicating if the user has the required permission
 */
export function hasPermission(user: any, requiredPermission: string) {
  if (!user || !user.permissions) {
    return false
  }
  
  return user.permissions.includes(requiredPermission)
}