/**
 * Comprehensive Security Middleware
 * Integrates all security measures into a single middleware
 */

import { NextRequest, NextResponse } from 'next/server'
import { SECURITY_CONFIG } from './config'
import { RateLimiter } from './auth'

// Security event types
type SecurityEvent = 
  | 'rate_limit_exceeded'
  | 'suspicious_request'
  | 'malicious_payload'
  | 'unauthorized_access'
  | 'csrf_violation'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'file_upload_violation'

// Security context
interface SecurityContext {
  ip: string
  userAgent: string
  origin?: string
  referer?: string
  path: string
  method: string
  timestamp: number
}

// Security violation
interface SecurityViolation {
  type: SecurityEvent
  severity: 'low' | 'medium' | 'high' | 'critical'
  context: SecurityContext
  details: string
  blocked: boolean
}

class SecurityLogger {
  private static violations: SecurityViolation[] = []

  static log(violation: SecurityViolation) {
    this.violations.push(violation)
    
    // Log to console (in production, send to monitoring service)
    const logLevel = violation.severity === 'critical' ? 'error' : 
                    violation.severity === 'high' ? 'warn' : 'info'
    
    console[logLevel](`[SECURITY] ${violation.type}: ${violation.details}`, {
      ip: violation.context.ip,
      path: violation.context.path,
      userAgent: violation.context.userAgent,
      blocked: violation.blocked
    })

    // In production, send alerts for high/critical violations
    if (process.env.NODE_ENV === 'production' && 
        ['high', 'critical'].includes(violation.severity)) {
      this.sendAlert(violation)
    }
  }

  private static async sendAlert(violation: SecurityViolation) {
    // Send to monitoring service (Sentry, Slack, etc.)
    try {
      // Example: Send to webhook
      if (process.env.SECURITY_WEBHOOK_URL) {
        await fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Security Alert: ${violation.type}`,
            attachments: [{
              color: violation.severity === 'critical' ? 'danger' : 'warning',
              fields: [
                { title: 'Type', value: violation.type, short: true },
                { title: 'Severity', value: violation.severity, short: true },
                { title: 'IP', value: violation.context.ip, short: true },
                { title: 'Path', value: violation.context.path, short: true },
                { title: 'Details', value: violation.details, short: false }
              ]
            }]
          })
        })
      }
    } catch (error) {
      console.error('Failed to send security alert:', error)
    }
  }

  static getViolations(limit: number = 100): SecurityViolation[] {
    return this.violations.slice(-limit)
  }

  static clearOldViolations() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    this.violations = this.violations.filter(v => v.context.timestamp > oneDayAgo)
  }
}

class SecurityAnalyzer {
  static analyzeRequest(request: NextRequest): SecurityContext {
    return {
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      origin: request.headers.get('origin') || undefined,
      referer: request.headers.get('referer') || undefined,
      path: request.nextUrl.pathname,
      method: request.method,
      timestamp: Date.now()
    }
  }

  static getClientIP(request: NextRequest): string {
    // Check various headers for the real IP
    const headers = [
      'cf-connecting-ip', // Cloudflare
      'x-real-ip',
      'x-forwarded-for',
      'x-client-ip',
      'x-cluster-client-ip'
    ]

    for (const header of headers) {
      const value = request.headers.get(header)
      if (value) {
        // Handle comma-separated IPs (take the first one)
        return value.split(',')[0].trim()
      }
    }

    return request.ip || 'unknown'
  }

  static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      // Security scanners
      /sqlmap/i, /nikto/i, /nessus/i, /openvas/i, /nmap/i,
      /masscan/i, /zap/i, /burp/i, /w3af/i, /skipfish/i,
      
      // Automated tools
      /curl/i, /wget/i, /python-requests/i, /go-http-client/i,
      /java/i, /apache-httpclient/i, /okhttp/i,
      
      // Suspicious keywords
      /hack/i, /exploit/i, /payload/i, /injection/i,
      /xss/i, /csrf/i, /backdoor/i, /shell/i
    ]

    return suspiciousPatterns.some(pattern => pattern.test(userAgent))
  }

  static hasSuspiciousPayload(request: NextRequest): boolean {
    const url = request.nextUrl.toString()
    const suspiciousPatterns = [
      // SQL injection patterns
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
      /('|\"|;|--|\*|\|)/,
      
      // XSS patterns
      /<script[^>]*>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>/i,
      
      // Path traversal
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/i,
      /%2e%2e%5c/i,
      
      // Command injection
      /(\||&|;|\$\(|\`)/,
      /(nc|netcat|telnet|wget|curl)\s/i,
      
      // File inclusion
      /(file|http|https|ftp):\/\//i,
      /\.(php|asp|jsp|cgi)\?/i
    ]

    return suspiciousPatterns.some(pattern => pattern.test(url))
  }

  static isRateLimited(context: SecurityContext, endpoint: string): boolean {
    const limits = SECURITY_CONFIG.RATE_LIMITS
    let config = limits.GLOBAL

    // Determine specific rate limit based on endpoint
    if (endpoint.includes('/auth/')) {
      config = limits.AUTH
    } else if (endpoint.includes('/contact')) {
      config = limits.CONTACT
    } else if (endpoint.includes('/search')) {
      config = limits.SEARCH
    } else if (endpoint.includes('/upload')) {
      config = limits.UPLOAD
    }

    return RateLimiter.isRateLimited(
      `${context.ip}:${endpoint}`,
      config.max,
      config.windowMs
    )
  }

  static validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    // Skip validation for GET requests without sensitive operations
    if (request.method === 'GET' && !request.nextUrl.pathname.includes('/api/')) {
      return true
    }

    const allowedOrigins = SECURITY_CONFIG.API_CONFIG.corsOrigins
    
    // Check origin header
    if (origin && !allowedOrigins.includes(origin)) {
      return false
    }

    // Check referer as fallback
    if (!origin && referer) {
      try {
        const refererOrigin = new URL(referer).origin
        return allowedOrigins.includes(refererOrigin)
      } catch {
        return false
      }
    }

    return true
  }

  static checkCSRF(request: NextRequest): boolean {
    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true
    }

    const csrfToken = request.headers.get('x-csrf-token') || 
                     request.headers.get('x-xsrf-token')
    
    // In a real implementation, validate the CSRF token
    // For now, just check if it exists for POST/PUT/DELETE requests
    return !!csrfToken
  }
}

export async function securityMiddleware(request: NextRequest): Promise<NextResponse> {
  const context = SecurityAnalyzer.analyzeRequest(request)
  const response = NextResponse.next()

  // Add security headers
  Object.entries(SECURITY_CONFIG.HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add request ID for tracing
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)

  try {
    // 1. Check for suspicious user agent
    if (SecurityAnalyzer.isSuspiciousUserAgent(context.userAgent)) {
      SecurityLogger.log({
        type: 'suspicious_request',
        severity: 'medium',
        context,
        details: `Suspicious user agent: ${context.userAgent}`,
        blocked: true
      })

      return new NextResponse('Forbidden', { 
        status: 403,
        headers: response.headers
      })
    }

    // 2. Check for malicious payload
    if (SecurityAnalyzer.hasSuspiciousPayload(request)) {
      SecurityLogger.log({
        type: 'malicious_payload',
        severity: 'high',
        context,
        details: `Malicious payload detected in URL: ${request.nextUrl.pathname}`,
        blocked: true
      })

      return new NextResponse('Bad Request', { 
        status: 400,
        headers: response.headers
      })
    }

    // 3. Rate limiting
    if (SecurityAnalyzer.isRateLimited(context, context.path)) {
      SecurityLogger.log({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        context,
        details: `Rate limit exceeded for ${context.path}`,
        blocked: true
      })

      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Retry-After': '900',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0'
        }
      })
    }

    // 4. Origin validation for API requests
    if (request.nextUrl.pathname.startsWith('/api/') && 
        !SecurityAnalyzer.validateOrigin(request)) {
      SecurityLogger.log({
        type: 'unauthorized_access',
        severity: 'high',
        context,
        details: `Invalid origin: ${context.origin}`,
        blocked: true
      })

      return new NextResponse('Forbidden', { 
        status: 403,
        headers: response.headers
      })
    }

    // 5. CSRF protection
    if (!SecurityAnalyzer.checkCSRF(request)) {
      SecurityLogger.log({
        type: 'csrf_violation',
        severity: 'high',
        context,
        details: 'Missing or invalid CSRF token',
        blocked: true
      })

      return new NextResponse('Forbidden', { 
        status: 403,
        headers: response.headers
      })
    }

    // 6. Request size validation
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
      SecurityLogger.log({
        type: 'malicious_payload',
        severity: 'medium',
        context,
        details: `Request too large: ${contentLength} bytes`,
        blocked: true
      })

      return new NextResponse('Payload Too Large', { 
        status: 413,
        headers: response.headers
      })
    }

    // 7. Add security context to response headers (for debugging in dev)
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('X-Security-Context', JSON.stringify({
        ip: context.ip,
        timestamp: context.timestamp,
        requestId
      }))
    }

    // Log successful request (only for API endpoints in production)
    if (process.env.NODE_ENV === 'production' && 
        request.nextUrl.pathname.startsWith('/api/')) {
      console.log(`[API] ${context.method} ${context.path} - ${context.ip} - ${requestId}`)
    }

    return response

  } catch (error) {
    // Log security middleware errors
    console.error('[SECURITY] Middleware error:', error)
    
    SecurityLogger.log({
      type: 'suspicious_request',
      severity: 'critical',
      context,
      details: `Security middleware error: ${error}`,
      blocked: false
    })

    // Don't block the request on middleware errors
    return response
  }
}

// Cleanup function to be called periodically
export function cleanupSecurityLogs() {
  SecurityLogger.clearOldViolations()
}

// Export security logger for use in API routes
export { SecurityLogger }

// Health check endpoint data
export function getSecurityHealth() {
  const violations = SecurityLogger.getViolations(50)
  const criticalCount = violations.filter(v => v.severity === 'critical').length
  const highCount = violations.filter(v => v.severity === 'high').length
  
  return {
    status: criticalCount === 0 ? 'healthy' : 'warning',
    violations: {
      total: violations.length,
      critical: criticalCount,
      high: highCount,
      medium: violations.filter(v => v.severity === 'medium').length,
      low: violations.filter(v => v.severity === 'low').length
    },
    lastViolation: violations.length > 0 ? violations[violations.length - 1] : null
  }
}