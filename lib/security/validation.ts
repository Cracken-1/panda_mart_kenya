/**
 * Comprehensive Input Validation and Sanitization
 * Protects against XSS, SQL Injection, and other attacks
 */

import DOMPurify from 'isomorphic-dompurify'
import { VALIDATION_RULES, SQL_INJECTION_PATTERNS, XSS_PATTERNS } from './config'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: any
}

export class InputValidator {
  /**
   * Validate and sanitize user input
   */
  static validateInput(
    value: any,
    type: 'email' | 'phone' | 'name' | 'password' | 'text' | 'html',
    options: {
      required?: boolean
      minLength?: number
      maxLength?: number
      pattern?: RegExp
      customRules?: ((value: any) => string | null)[]
    } = {}
  ): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = value

    // Check if required
    if (options.required && (!value || value.toString().trim() === '')) {
      errors.push('This field is required')
      return { isValid: false, errors }
    }

    // Skip validation if empty and not required
    if (!value || value.toString().trim() === '') {
      return { isValid: true, errors: [], sanitizedValue: '' }
    }

    // Convert to string for validation
    const stringValue = value.toString()

    // Check for SQL injection patterns
    if (this.containsSqlInjection(stringValue)) {
      errors.push('Invalid input detected')
      return { isValid: false, errors }
    }

    // Check for XSS patterns
    if (this.containsXss(stringValue)) {
      errors.push('Invalid input detected')
      return { isValid: false, errors }
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        return this.validateEmail(stringValue, options)
      case 'phone':
        return this.validatePhone(stringValue, options)
      case 'name':
        return this.validateName(stringValue, options)
      case 'password':
        return this.validatePassword(stringValue, options)
      case 'text':
        return this.validateText(stringValue, options)
      case 'html':
        return this.validateHtml(stringValue, options)
      default:
        return this.validateGeneric(stringValue, options)
    }
  }

  /**
   * Validate email address
   */
  private static validateEmail(value: string, options: any): ValidationResult {
    const errors: string[] = []
    const rules = VALIDATION_RULES.user.email

    // Normalize email
    const normalizedEmail = value.toLowerCase().trim()

    // Length check
    if (normalizedEmail.length > rules.maxLength) {
      errors.push(`Email must be less than ${rules.maxLength} characters`)
    }

    // Pattern check
    if (!rules.pattern.test(normalizedEmail)) {
      errors.push('Please enter a valid email address')
    }

    // Check for disposable email domains
    if (this.isDisposableEmail(normalizedEmail)) {
      errors.push('Disposable email addresses are not allowed')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: normalizedEmail
    }
  }

  /**
   * Validate phone number (Kenya format)
   */
  private static validatePhone(value: string, options: any): ValidationResult {
    const errors: string[] = []
    const rules = VALIDATION_RULES.user.phone

    // Remove all non-digits
    let cleanPhone = value.replace(/\D/g, '')

    // Convert to Kenya format
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.substring(1)
    } else if (!cleanPhone.startsWith('254')) {
      cleanPhone = '254' + cleanPhone
    }

    const formattedPhone = '+' + cleanPhone

    // Pattern check
    if (!rules.pattern.test(formattedPhone)) {
      errors.push('Please enter a valid Kenyan phone number')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: formattedPhone
    }
  }

  /**
   * Validate name
   */
  private static validateName(value: string, options: any): ValidationResult {
    const errors: string[] = []
    const rules = VALIDATION_RULES.user.name

    // Sanitize name
    const sanitizedName = value.trim().replace(/[^a-zA-Z\s'-]/g, '')

    // Length checks
    if (sanitizedName.length < rules.minLength) {
      errors.push(`Name must be at least ${rules.minLength} characters`)
    }

    if (sanitizedName.length > rules.maxLength) {
      errors.push(`Name must be less than ${rules.maxLength} characters`)
    }

    // Pattern check
    if (!rules.pattern.test(sanitizedName)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedName
    }
  }

  /**
   * Validate password
   */
  private static validatePassword(value: string, options: any): ValidationResult {
    const errors: string[] = []
    const rules = VALIDATION_RULES.user.password

    // Length checks
    if (value.length < rules.minLength) {
      errors.push(`Password must be at least ${rules.minLength} characters`)
    }

    if (value.length > rules.maxLength) {
      errors.push(`Password must be less than ${rules.maxLength} characters`)
    }

    // Complexity checks
    if (rules.requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (rules.requireLowercase && !/[a-z]/.test(value)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (rules.requireNumbers && !/\d/.test(value)) {
      errors.push('Password must contain at least one number')
    }

    if (rules.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      errors.push('Password must contain at least one special character')
    }

    // Check forbidden patterns
    for (const pattern of rules.forbiddenPatterns) {
      if (pattern.test(value)) {
        errors.push('Password contains forbidden patterns')
        break
      }
    }

    // Check against common passwords
    if (this.isCommonPassword(value)) {
      errors.push('Password is too common, please choose a stronger password')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: value // Don't sanitize passwords
    }
  }

  /**
   * Validate text content
   */
  private static validateText(value: string, options: any): ValidationResult {
    const errors: string[] = []

    // Sanitize text
    const sanitizedText = this.sanitizeText(value)

    // Length checks
    if (options.minLength && sanitizedText.length < options.minLength) {
      errors.push(`Text must be at least ${options.minLength} characters`)
    }

    if (options.maxLength && sanitizedText.length > options.maxLength) {
      errors.push(`Text must be less than ${options.maxLength} characters`)
    }

    // Pattern check
    if (options.pattern && !options.pattern.test(sanitizedText)) {
      errors.push('Text contains invalid characters')
    }

    // Profanity filter
    if (this.containsProfanity(sanitizedText)) {
      errors.push('Text contains inappropriate content')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedText
    }
  }

  /**
   * Validate HTML content
   */
  private static validateHtml(value: string, options: any): ValidationResult {
    const errors: string[] = []

    // Sanitize HTML
    const sanitizedHtml = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOW_DATA_ATTR: false
    })

    // Length check
    if (options.maxLength && sanitizedHtml.length > options.maxLength) {
      errors.push(`Content must be less than ${options.maxLength} characters`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedHtml
    }
  }

  /**
   * Generic validation
   */
  private static validateGeneric(value: string, options: any): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = this.sanitizeText(value)

    // Length checks
    if (options.minLength && sanitizedValue.length < options.minLength) {
      errors.push(`Value must be at least ${options.minLength} characters`)
    }

    if (options.maxLength && sanitizedValue.length > options.maxLength) {
      errors.push(`Value must be less than ${options.maxLength} characters`)
    }

    // Pattern check
    if (options.pattern && !options.pattern.test(sanitizedValue)) {
      errors.push('Value contains invalid characters')
    }

    // Custom rules
    if (options.customRules) {
      for (const rule of options.customRules) {
        const error = rule(sanitizedValue)
        if (error) {
          errors.push(error)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  /**
   * Check for SQL injection patterns
   */
  private static containsSqlInjection(value: string): boolean {
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value))
  }

  /**
   * Check for XSS patterns
   */
  private static containsXss(value: string): boolean {
    return XSS_PATTERNS.some(pattern => pattern.test(value))
  }

  /**
   * Sanitize text input
   */
  private static sanitizeText(value: string): string {
    return value
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
  }

  /**
   * Check if email is from a disposable email provider
   */
  private static isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'temp-mail.org'
    ]

    const domain = email.split('@')[1]?.toLowerCase()
    return disposableDomains.includes(domain)
  }

  /**
   * Check if password is commonly used
   */
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey'
    ]

    return commonPasswords.includes(password.toLowerCase())
  }

  /**
   * Check for profanity (basic implementation)
   */
  private static containsProfanity(text: string): boolean {
    // Basic profanity filter - in production, use a comprehensive library
    const profanityWords = [
      // Add profanity words here
    ]

    const lowerText = text.toLowerCase()
    return profanityWords.some(word => lowerText.includes(word))
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File): ValidationResult {
    const errors: string[] = []
    const rules = VALIDATION_RULES.upload

    // Size check
    if (file.size > rules.maxSize) {
      errors.push(`File size must be less than ${rules.maxSize / (1024 * 1024)}MB`)
    }

    // Type check
    if (!rules.allowedTypes.includes(file.type)) {
      errors.push('File type not allowed')
    }

    // Extension check
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!rules.allowedExtensions.includes(extension)) {
      errors.push('File extension not allowed')
    }

    // Name validation
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      errors.push('File name contains invalid characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate JSON input
   */
  static validateJson(value: string, maxDepth: number = 10): ValidationResult {
    const errors: string[] = []

    try {
      const parsed = JSON.parse(value)
      
      // Check depth
      if (this.getObjectDepth(parsed) > maxDepth) {
        errors.push('JSON structure too deep')
      }

      // Check for dangerous properties
      if (this.containsDangerousProperties(parsed)) {
        errors.push('JSON contains dangerous properties')
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: parsed
      }
    } catch (error) {
      errors.push('Invalid JSON format')
      return { isValid: false, errors }
    }
  }

  /**
   * Get object depth
   */
  private static getObjectDepth(obj: any): number {
    if (typeof obj !== 'object' || obj === null) {
      return 0
    }

    let maxDepth = 0
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this.getObjectDepth(obj[key])
        maxDepth = Math.max(maxDepth, depth)
      }
    }

    return maxDepth + 1
  }

  /**
   * Check for dangerous properties in JSON
   */
  private static containsDangerousProperties(obj: any): boolean {
    const dangerousProps = [
      '__proto__',
      'constructor',
      'prototype',
      'eval',
      'function',
      'script'
    ]

    const checkObject = (o: any): boolean => {
      if (typeof o !== 'object' || o === null) {
        return false
      }

      for (const key in o) {
        if (dangerousProps.includes(key.toLowerCase())) {
          return true
        }

        if (typeof o[key] === 'object' && checkObject(o[key])) {
          return true
        }
      }

      return false
    }

    return checkObject(obj)
  }

  /**
   * Validate URL
   */
  static validateUrl(url: string, allowedProtocols: string[] = ['http:', 'https:']): ValidationResult {
    const errors: string[] = []

    try {
      const parsedUrl = new URL(url)

      // Protocol check
      if (!allowedProtocols.includes(parsedUrl.protocol)) {
        errors.push('URL protocol not allowed')
      }

      // Check for dangerous URLs
      if (this.isDangerousUrl(parsedUrl)) {
        errors.push('URL not allowed')
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: parsedUrl.toString()
      }
    } catch (error) {
      errors.push('Invalid URL format')
      return { isValid: false, errors }
    }
  }

  /**
   * Check if URL is dangerous
   */
  private static isDangerousUrl(url: URL): boolean {
    const dangerousHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1'
    ]

    const dangerousPaths = [
      '/admin',
      '/config',
      '/private',
      '/.env',
      '/etc/passwd'
    ]

    // Check host
    if (dangerousHosts.includes(url.hostname)) {
      return true
    }

    // Check for private IP ranges
    if (this.isPrivateIp(url.hostname)) {
      return true
    }

    // Check path
    if (dangerousPaths.some(path => url.pathname.startsWith(path))) {
      return true
    }

    return false
  }

  /**
   * Check if IP is in private range
   */
  private static isPrivateIp(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^fc00:/,
      /^fe80:/
    ]

    return privateRanges.some(range => range.test(ip))
  }
}

// Export validation functions
export const {
  validateInput,
  validateFile,
  validateJson,
  validateUrl
} = InputValidator