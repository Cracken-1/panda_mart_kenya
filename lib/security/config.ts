/**
 * Comprehensive Security Configuration
 * Production-ready security settings and utilities
 */

// Security Headers Configuration
export const SECURITY_HEADERS = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Restrict dangerous browser features
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'encrypted-media=(self)',
    'fullscreen=(self)',
    'picture-in-picture=(self)'
  ].join(', '),
  
  // Force HTTPS and include subdomains
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Comprehensive Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://connect.facebook.net https://static.hotjar.com https://script.hotjar.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: wss: https://api.stripe.com https://api.sendgrid.com https://api.africastalking.com https://api.cloudinary.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net",
    "frame-src 'self' https://www.google.com https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
}

// Rate Limiting Configuration
export const RATE_LIMITS = {
  // Global API rate limiting
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // attempts per window
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true
  },
  
  // Password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // attempts per window
    message: 'Too many password reset attempts, please try again later.'
  },
  
  // Contact forms
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // submissions per window
    message: 'Too many form submissions, please try again later.'
  },
  
  // Search endpoints
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30, // searches per window
    message: 'Too many search requests, please slow down.'
  },
  
  // Payment endpoints
  payment: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // payment attempts per window
    message: 'Too many payment attempts, please contact support.'
  }
}

// Input Validation Rules
export const VALIDATION_RULES = {
  // User input validation
  user: {
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      sanitize: true
    },
    email: {
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      normalize: true
    },
    phone: {
      pattern: /^\+254[0-9]{9}$/,
      sanitize: true
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      forbiddenPatterns: [
        /(.)\1{2,}/, // repeated characters
        /123|abc|qwe|password|admin/i // common patterns
      ]
    }
  },
  
  // Content validation
  content: {
    title: {
      minLength: 1,
      maxLength: 200,
      sanitize: true
    },
    description: {
      maxLength: 2000,
      sanitize: true,
      allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li']
    },
    comment: {
      maxLength: 1000,
      sanitize: true,
      profanityFilter: true
    }
  },
  
  // File upload validation
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf', '.txt'],
    scanForMalware: true,
    quarantineUntilScanned: true
  }
}

// SQL Injection Prevention
export const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(--|\/\*|\*\/|;|'|"|`)/,
  /(\bOR\b|\bAND\b).*[=<>]/i,
  /\b(WAITFOR|DELAY)\b/i,
  /\b(XP_|SP_)\w+/i,
  /(\bCAST\b|\bCONVERT\b|\bCHAR\b)/i
]

// XSS Prevention Patterns
export const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi
]

// Suspicious User Agent Patterns
export const SUSPICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /nmap/i,
  /dirb/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /burp/i,
  /zap/i,
  /acunetix/i,
  /w3af/i,
  /skipfish/i,
  /havij/i,
  /pangolin/i
]

// Blocked IP Ranges (known malicious networks)
export const BLOCKED_IP_RANGES = [
  // Add known malicious IP ranges here
  // Example: '192.168.1.0/24'
]

// Allowed Origins for CORS
export const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || 'https://pandamart.co.ke',
  'https://www.pandamart.co.ke',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
]

// Session Configuration
export const SESSION_CONFIG = {
  name: 'pandamart_session',
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const
  }
}

// JWT Configuration
export const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
    expiresIn: '15m',
    algorithm: 'HS256' as const,
    issuer: 'pandamart.co.ke',
    audience: 'pandamart-users'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expiresIn: '7d',
    algorithm: 'HS256' as const,
    issuer: 'pandamart.co.ke',
    audience: 'pandamart-users'
  },
  resetToken: {
    secret: process.env.JWT_RESET_SECRET || 'fallback-reset-secret',
    expiresIn: '1h',
    algorithm: 'HS256' as const,
    issuer: 'pandamart.co.ke',
    audience: 'pandamart-users'
  }
}

// Encryption Configuration
export const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16,
  key: process.env.ENCRYPTION_KEY || 'fallback-key-change-in-production'
}

// Password Hashing Configuration
export const PASSWORD_CONFIG = {
  saltRounds: 12,
  minLength: 8,
  maxLength: 128,
  requireComplexity: true
}

// Two-Factor Authentication Configuration
export const TWO_FACTOR_CONFIG = {
  issuer: 'Panda Mart Kenya',
  window: 1, // Allow 1 step tolerance
  step: 30, // 30 second steps
  digits: 6,
  algorithm: 'sha1' as const
}

// File Upload Security Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ],
  uploadPath: '/tmp/uploads',
  virusScanEnabled: true,
  quarantinePath: '/tmp/quarantine'
}

// Database Security Configuration
export const DATABASE_CONFIG = {
  ssl: process.env.NODE_ENV === 'production',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
}

// Logging Configuration
export const LOGGING_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  timestamp: true,
  colorize: false,
  maxFiles: 30,
  maxSize: '100m',
  auditTrail: true,
  sensitiveFields: [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session'
  ]
}

// Monitoring and Alerting Configuration
export const MONITORING_CONFIG = {
  healthCheck: {
    interval: 30000, // 30 seconds
    timeout: 5000, // 5 seconds
    retries: 3
  },
  alerts: {
    errorThreshold: 10, // errors per minute
    responseTimeThreshold: 5000, // 5 seconds
    memoryThreshold: 0.9, // 90% memory usage
    diskThreshold: 0.9 // 90% disk usage
  },
  metrics: {
    enabled: true,
    interval: 60000, // 1 minute
    retention: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}

// Backup Configuration
export const BACKUP_CONFIG = {
  enabled: true,
  schedule: '0 2 * * *', // Daily at 2 AM
  retention: 30, // Keep 30 days
  encryption: true,
  compression: true,
  destinations: [
    {
      type: 's3',
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION
    }
  ]
}

// Feature Flags for Security Features
export const SECURITY_FEATURES = {
  rateLimiting: true,
  bruteForceProtection: true,
  ipBlocking: true,
  userAgentFiltering: true,
  sqlInjectionProtection: true,
  xssProtection: true,
  csrfProtection: true,
  sessionSecurity: true,
  twoFactorAuth: process.env.FEATURE_TWO_FACTOR_AUTH === 'true',
  auditLogging: true,
  realTimeMonitoring: true,
  automaticBackups: true,
  malwareScanning: true,
  contentFiltering: true
}

// Export all configurations
export const SECURITY_CONFIG = {
  headers: SECURITY_HEADERS,
  rateLimits: RATE_LIMITS,
  validation: VALIDATION_RULES,
  sqlInjectionPatterns: SQL_INJECTION_PATTERNS,
  xssPatterns: XSS_PATTERNS,
  suspiciousUserAgents: SUSPICIOUS_USER_AGENTS,
  blockedIpRanges: BLOCKED_IP_RANGES,
  allowedOrigins: ALLOWED_ORIGINS,
  session: SESSION_CONFIG,
  jwt: JWT_CONFIG,
  encryption: ENCRYPTION_CONFIG,
  password: PASSWORD_CONFIG,
  twoFactor: TWO_FACTOR_CONFIG,
  upload: UPLOAD_CONFIG,
  database: DATABASE_CONFIG,
  logging: LOGGING_CONFIG,
  monitoring: MONITORING_CONFIG,
  backup: BACKUP_CONFIG,
  features: SECURITY_FEATURES
}