import { z } from 'zod'
import crypto from 'crypto'

// Payment validation schemas
export const paymentMethodSchema = z.object({
  type: z.enum(['mpesa', 'card', 'bank_transfer', 'cash']),
  mpesa: z.object({
    phoneNumber: z.string().regex(/^\+254[0-9]{9}$/, 'Invalid M-Pesa number'),
    accountReference: z.string().optional(),
  }).optional(),
  card: z.object({
    number: z.string().regex(/^[0-9]{13,19}$/, 'Invalid card number'),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
    expiryYear: z.string().regex(/^20[2-9][0-9]$/, 'Invalid year'),
    cvv: z.string().regex(/^[0-9]{3,4}$/, 'Invalid CVV'),
    holderName: z.string().min(2, 'Cardholder name required'),
  }).optional(),
  bankTransfer: z.object({
    bankCode: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
  }).optional(),
})

export const paymentRequestSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['KES', 'USD']).default('KES'),
  orderId: z.string().min(1, 'Order ID required'),
  customerId: z.string().min(1, 'Customer ID required'),
  paymentMethod: paymentMethodSchema,
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// Payment interfaces
export interface PaymentRequest {
  amount: number
  currency: 'KES' | 'USD'
  orderId: string
  customerId: string
  paymentMethod: PaymentMethod
  description?: string
  metadata?: Record<string, any>
}

export interface PaymentMethod {
  type: 'mpesa' | 'card' | 'bank_transfer' | 'cash'
  mpesa?: {
    phoneNumber: string
    accountReference?: string
  }
  card?: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    holderName: string
  }
  bankTransfer?: {
    bankCode: string
    accountNumber: string
    accountName: string
  }
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  status: PaymentStatus
  amount: number
  currency: string
  fees?: number
  message: string
  providerResponse?: any
  timestamp: Date
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'disputed'

export interface Transaction {
  id: string
  orderId: string
  customerId: string
  amount: number
  currency: string
  fees: number
  netAmount: number
  status: PaymentStatus
  paymentMethod: PaymentMethod
  providerTransactionId?: string
  providerResponse?: any
  failureReason?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  refundedAt?: Date
  metadata?: Record<string, any>
}

// Payment security utilities
export class PaymentSecurity {
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm'
  private static readonly HASH_ALGORITHM = 'sha256'

  // Card number encryption/decryption
  static encryptCardNumber(cardNumber: string, key: string): {
    encrypted: string
    iv: string
    tag: string
  } {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.ENCRYPTION_ALGORITHM, key)
    cipher.setAAD(Buffer.from('panda-mart-payment', 'utf8'))
    
    let encrypted = cipher.update(cardNumber, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    }
  }

  static decryptCardNumber(
    encryptedData: { encrypted: string; iv: string; tag: string },
    key: string
  ): string {
    const decipher = crypto.createDecipher(this.ENCRYPTION_ALGORITHM, key)
    decipher.setAAD(Buffer.from('panda-mart-payment', 'utf8'))
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'))
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // Card number masking
  static maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 8) return '*'.repeat(cardNumber.length)
    
    const firstFour = cardNumber.substring(0, 4)
    const lastFour = cardNumber.substring(cardNumber.length - 4)
    const middle = '*'.repeat(cardNumber.length - 8)
    
    return `${firstFour}${middle}${lastFour}`
  }

  // CVV validation
  static validateCVV(cvv: string, cardNumber: string): boolean {
    // American Express has 4-digit CVV, others have 3
    const isAmex = cardNumber.startsWith('34') || cardNumber.startsWith('37')
    const expectedLength = isAmex ? 4 : 3
    
    return cvv.length === expectedLength && /^\d+$/.test(cvv)
  }

  // Card number validation (Luhn algorithm)
  static validateCardNumber(cardNumber: string): {
    isValid: boolean
    cardType: string
  } {
    // Remove spaces and non-digits
    const cleanNumber = cardNumber.replace(/\D/g, '')
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return { isValid: false, cardType: 'unknown' }
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    const isValid = sum % 10 === 0
    const cardType = this.getCardType(cleanNumber)
    
    return { isValid, cardType }
  }

  private static getCardType(cardNumber: string): string {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]|^2[2-7]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
      diners: /^3[0689]/,
      jcb: /^35/
    }
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type
      }
    }
    
    return 'unknown'
  }

  // Generate payment signature for API calls
  static generatePaymentSignature(
    payload: any,
    secret: string,
    timestamp: string
  ): string {
    const data = JSON.stringify(payload) + timestamp
    return crypto
      .createHmac(this.HASH_ALGORITHM, secret)
      .update(data)
      .digest('hex')
  }

  // Verify payment webhook signature
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac(this.HASH_ALGORITHM, secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  }

  // Generate secure transaction reference
  static generateTransactionReference(prefix: string = 'PM'): string {
    const timestamp = Date.now().toString(36)
    const random = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  // Validate M-Pesa phone number
  static validateMpesaNumber(phoneNumber: string): boolean {
    // Kenyan M-Pesa numbers: +254 7XX XXX XXX or +254 1XX XXX XXX
    const mpesaRegex = /^\+254[71][0-9]{8}$/
    return mpesaRegex.test(phoneNumber)
  }

  // Amount validation
  static validateAmount(amount: number, currency: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    if (amount <= 0) {
      errors.push('Amount must be greater than zero')
    }
    
    if (currency === 'KES') {
      if (amount < 1) {
        errors.push('Minimum amount is KES 1')
      }
      if (amount > 1000000) {
        errors.push('Maximum amount is KES 1,000,000')
      }
    }
    
    // Check for reasonable decimal places
    const decimalPlaces = (amount.toString().split('.')[1] || '').length
    if (decimalPlaces > 2) {
      errors.push('Amount cannot have more than 2 decimal places')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Payment processor interface
export interface PaymentProcessor {
  name: string
  processPayment(request: PaymentRequest): Promise<PaymentResponse>
  verifyPayment(transactionId: string): Promise<PaymentResponse>
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse>
}

// M-Pesa payment processor
export class MpesaProcessor implements PaymentProcessor {
  name = 'M-Pesa'
  
  private readonly consumerKey: string
  private readonly consumerSecret: string
  private readonly shortcode: string
  private readonly passkey: string
  private readonly callbackUrl: string

  constructor(config: {
    consumerKey: string
    consumerSecret: string
    shortcode: string
    passkey: string
    callbackUrl: string
  }) {
    this.consumerKey = config.consumerKey
    this.consumerSecret = config.consumerSecret
    this.shortcode = config.shortcode
    this.passkey = config.passkey
    this.callbackUrl = config.callbackUrl
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.paymentMethod.mpesa) {
        throw new Error('M-Pesa payment details required')
      }

      const { phoneNumber, accountReference } = request.paymentMethod.mpesa
      
      // Validate phone number
      if (!PaymentSecurity.validateMpesaNumber(phoneNumber)) {
        throw new Error('Invalid M-Pesa phone number')
      }

      // Generate transaction reference
      const transactionRef = PaymentSecurity.generateTransactionReference('MP')
      
      // In a real implementation, this would call the M-Pesa API
      // For now, we'll simulate the response
      const mockResponse = {
        success: true,
        transactionId: transactionRef,
        status: 'pending' as PaymentStatus,
        amount: request.amount,
        currency: request.currency,
        message: 'Payment request sent to customer phone',
        timestamp: new Date()
      }

      return mockResponse
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed' as PaymentStatus,
        amount: request.amount,
        currency: request.currency,
        message: error instanceof Error ? error.message : 'Payment failed',
        timestamp: new Date()
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    // Mock implementation - would call M-Pesa query API
    return {
      success: true,
      transactionId,
      status: 'completed' as PaymentStatus,
      amount: 1000,
      currency: 'KES',
      message: 'Payment completed successfully',
      timestamp: new Date()
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    // Mock implementation - would call M-Pesa reversal API
    return {
      success: true,
      transactionId: PaymentSecurity.generateTransactionReference('RF'),
      status: 'refunded' as PaymentStatus,
      amount: amount || 0,
      currency: 'KES',
      message: 'Refund processed successfully',
      timestamp: new Date()
    }
  }
}

// Card payment processor (mock implementation)
export class CardProcessor implements PaymentProcessor {
  name = 'Card Payment'

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!request.paymentMethod.card) {
        throw new Error('Card payment details required')
      }

      const { number, cvv } = request.paymentMethod.card
      
      // Validate card
      const cardValidation = PaymentSecurity.validateCardNumber(number)
      if (!cardValidation.isValid) {
        throw new Error('Invalid card number')
      }

      if (!PaymentSecurity.validateCVV(cvv, number)) {
        throw new Error('Invalid CVV')
      }

      // Generate transaction reference
      const transactionRef = PaymentSecurity.generateTransactionReference('CD')
      
      // Mock successful payment
      return {
        success: true,
        transactionId: transactionRef,
        status: 'completed' as PaymentStatus,
        amount: request.amount,
        currency: request.currency,
        fees: request.amount * 0.025, // 2.5% processing fee
        message: 'Payment processed successfully',
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed' as PaymentStatus,
        amount: request.amount,
        currency: request.currency,
        message: error instanceof Error ? error.message : 'Payment failed',
        timestamp: new Date()
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      status: 'completed' as PaymentStatus,
      amount: 1000,
      currency: 'KES',
      message: 'Payment verified successfully',
      timestamp: new Date()
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: PaymentSecurity.generateTransactionReference('RF'),
      status: 'refunded' as PaymentStatus,
      amount: amount || 0,
      currency: 'KES',
      message: 'Refund processed successfully',
      timestamp: new Date()
    }
  }
}

export default PaymentSecurity