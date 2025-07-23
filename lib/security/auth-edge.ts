/**
 * Edge Runtime Compatible Authentication Utilities
 * This file contains auth utilities that work in Edge Runtime
 */

// Simple JWT utilities for Edge Runtime
export class EdgeTokenManager {
  /**
   * Create a simple JWT-like token for Edge Runtime
   * Note: This is a simplified version for Edge compatibility
   */
  static async createToken(payload: any, secret: string): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + (15 * 60) // 15 minutes
    }

    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(tokenPayload))
    
    const data = `${encodedHeader}.${encodedPayload}`
    const signature = await this.sign(data, secret)
    
    return `${data}.${signature}`
  }

  /**
   * Verify token in Edge Runtime
   */
  static async verifyToken(token: string, secret: string): Promise<any> {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format')
    }

    const [encodedHeader, encodedPayload, signature] = parts
    const data = `${encodedHeader}.${encodedPayload}`
    
    const expectedSignature = await this.sign(data, secret)
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature')
    }

    const payload = JSON.parse(atob(encodedPayload))
    
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired')
    }

    return payload
  }

  /**
   * Create HMAC signature using Web Crypto API (Edge Runtime compatible)
   */
  private static async sign(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    const uint8Array = new Uint8Array(signature)
    const chars = Array.from(uint8Array, byte => String.fromCharCode(byte))
    return btoa(chars.join(''))
  }
}

// Edge-compatible input sanitization
export class EdgeInputSanitizer {
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  static sanitizeName(name: string): string {
    return name.trim().replace(/[^a-zA-Z\s'-]/g, '')
  }

  static sanitizeText(text: string): string {
    return text.trim().replace(/[<>]/g, '')
  }
}

// Edge-compatible rate limiting (simplified)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export class EdgeRateLimiter {
  static isRateLimited(
    identifier: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    const now = Date.now()
    const record = rateLimitStore.get(identifier)

    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    if (record.count >= maxAttempts) {
      return true
    }

    record.count++
    return false
  }

  static resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier)
  }
}