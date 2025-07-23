export class EncryptionService {
  private static readonly ALGORITHM = 'AES-GCM'
  private static readonly KEY_LENGTH = 32
  private static readonly IV_LENGTH = 16
  private static readonly TAG_LENGTH = 16

  // Generate a secure encryption key
  static generateKey(): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(this.KEY_LENGTH)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback for environments without crypto
      let result = ''
      for (let i = 0; i < this.KEY_LENGTH * 2; i++) {
        result += Math.floor(Math.random() * 16).toString(16)
      }
      return result
    }
  }

  // Encrypt sensitive data (Web Crypto API compatible)
  static async encrypt(text: string, key: string): Promise<{
    encrypted: string
    iv: string
    tag: string
  }> {
    try {
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        // Use Web Crypto API
        const keyBuffer = new Uint8Array(key.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))
        const encoder = new TextEncoder()
        const data = encoder.encode(text)

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: this.ALGORITHM },
          false,
          ['encrypt']
        )

        const encrypted = await crypto.subtle.encrypt(
          {
            name: this.ALGORITHM,
            iv: iv,
            additionalData: encoder.encode('panda-mart-security')
          },
          cryptoKey,
          data
        )

        const encryptedArray = new Uint8Array(encrypted)
        const encryptedData = encryptedArray.slice(0, -16)
        const tag = encryptedArray.slice(-16)

        return {
          encrypted: Array.from(encryptedData, byte => byte.toString(16).padStart(2, '0')).join(''),
          iv: Array.from(iv, byte => byte.toString(16).padStart(2, '0')).join(''),
          tag: Array.from(tag, byte => byte.toString(16).padStart(2, '0')).join('')
        }
      } else {
        // Fallback - simple base64 encoding (not secure, for demo only)
        const encoded = btoa(text)
        return {
          encrypted: encoded,
          iv: this.generateKey().substring(0, 32),
          tag: this.generateKey().substring(0, 32)
        }
      }
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Decrypt sensitive data (Web Crypto API compatible)
  static async decrypt(encryptedData: {
    encrypted: string
    iv: string
    tag: string
  }, key: string): Promise<string> {
    try {
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        // Use Web Crypto API
        const keyBuffer = new Uint8Array(key.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        const iv = new Uint8Array(encryptedData.iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        const tag = new Uint8Array(encryptedData.tag.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        const encrypted = new Uint8Array(encryptedData.encrypted.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: this.ALGORITHM },
          false,
          ['decrypt']
        )

        // Combine encrypted data and tag
        const combinedData = new Uint8Array(encrypted.length + tag.length)
        combinedData.set(encrypted)
        combinedData.set(tag, encrypted.length)

        const decrypted = await crypto.subtle.decrypt(
          {
            name: this.ALGORITHM,
            iv: iv,
            additionalData: encoder.encode('panda-mart-security')
          },
          cryptoKey,
          combinedData
        )

        return decoder.decode(decrypted)
      } else {
        // Fallback - simple base64 decoding (not secure, for demo only)
        return atob(encryptedData.encrypted)
      }
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Hash sensitive data (one-way) using Web Crypto API
  static async hash(data: string, salt?: string): Promise<{
    hash: string
    salt: string
  }> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder()
      const saltBuffer = salt ? 
        new Uint8Array(salt.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))) :
        crypto.getRandomValues(new Uint8Array(16))
      
      // Use PBKDF2 with Web Crypto API
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(data),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      )

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: 100000,
          hash: 'SHA-512'
        },
        keyMaterial,
        512 // 64 bytes * 8 bits
      )

      const hashArray = new Uint8Array(derivedBits)
      
      return {
        hash: Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join(''),
        salt: Array.from(saltBuffer, byte => byte.toString(16).padStart(2, '0')).join('')
      }
    } else {
      // Fallback - simple hash using available methods
      const saltStr = salt || Math.random().toString(36).substring(2, 18)
      const combined = data + saltStr
      let hash = 0
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return {
        hash: Math.abs(hash).toString(16).padStart(8, '0'),
        salt: saltStr
      }
    }
  }

  // Verify hashed data
  static async verifyHash(data: string, hash: string, salt: string): Promise<boolean> {
    const hashedData = await this.hash(data, salt)
    return hashedData.hash === hash
  }

  // Generate secure random tokens
  static generateToken(length: number = 32): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback
      let result = ''
      for (let i = 0; i < length * 2; i++) {
        result += Math.floor(Math.random() * 16).toString(16)
      }
      return result
    }
  }

  // Generate cryptographically secure random numbers
  static generateSecureRandom(min: number, max: number): number {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const range = max - min + 1
      const array = new Uint32Array(1)
      crypto.getRandomValues(array)
      return min + (array[0] % range)
    } else {
      // Fallback
      return min + Math.floor(Math.random() * (max - min + 1))
    }
  }

  // Create HMAC signature using Web Crypto API
  static async createHMAC(data: string, secret: string, algorithm: string = 'SHA-256'): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(secret)
      const messageData = encoder.encode(data)

      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      )

      const signature = await crypto.subtle.sign('HMAC', key, messageData)
      const hashArray = new Uint8Array(signature)
      return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback - simple hash (not secure, for demo only)
      const combined = data + secret
      let hash = 0
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash).toString(16)
    }
  }

  // Verify HMAC signature
  static async verifyHMAC(data: string, signature: string, secret: string, algorithm: string = 'SHA-256'): Promise<boolean> {
    const expectedSignature = await this.createHMAC(data, secret, algorithm)
    return expectedSignature === signature
  }

  // Encrypt files (server-side only)
  static async encryptFile(filePath: string, key: string, outputPath: string): Promise<void> {
    if (typeof window !== 'undefined') {
      throw new Error('File encryption is only available on the server side')
    }
    
    // This would be implemented server-side with Node.js crypto
    // For now, we'll throw an error to indicate it's not implemented
    throw new Error('File encryption not implemented in Edge Runtime compatible version')
  }

  // Decrypt files (server-side only)
  static async decryptFile(filePath: string, key: string, outputPath: string): Promise<void> {
    if (typeof window !== 'undefined') {
      throw new Error('File decryption is only available on the server side')
    }
    
    // This would be implemented server-side with Node.js crypto
    // For now, we'll throw an error to indicate it's not implemented
    throw new Error('File decryption not implemented in Edge Runtime compatible version')
  }
}

// Field-level encryption for database
export class FieldEncryption {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  // Encrypt specific fields in an object
  async encryptFields<T extends Record<string, any>>(
    obj: T, 
    fieldsToEncrypt: (keyof T)[]
  ): Promise<T> {
    const encrypted = { ...obj }
    
    for (const field of fieldsToEncrypt) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        const encryptedData = await EncryptionService.encrypt(encrypted[field] as string, this.key)
        encrypted[field] = JSON.stringify(encryptedData) as T[keyof T]
      }
    }
    
    return encrypted
  }

  // Decrypt specific fields in an object
  async decryptFields<T extends Record<string, any>>(
    obj: T, 
    fieldsToDecrypt: (keyof T)[]
  ): Promise<T> {
    const decrypted = { ...obj }
    
    for (const field of fieldsToDecrypt) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          const encryptedData = JSON.parse(decrypted[field] as string)
          decrypted[field] = await EncryptionService.decrypt(encryptedData, this.key) as T[keyof T]
        } catch (error) {
          console.error(`Failed to decrypt field ${String(field)}:`, error)
        }
      }
    }
    
    return decrypted
  }
}

// Secure session management
export class SessionSecurity {
  private static readonly SESSION_KEY_LENGTH = 32
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

  // Generate secure session ID
  static generateSessionId(): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(this.SESSION_KEY_LENGTH)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback
      let result = ''
      for (let i = 0; i < this.SESSION_KEY_LENGTH * 2; i++) {
        result += Math.floor(Math.random() * 16).toString(16)
      }
      return result
    }
  }

  // Create session token with expiration
  static createSessionToken(sessionId: string, userId: string): {
    token: string
    expiresAt: Date
  } {
    const expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT)
    const payload = {
      sessionId,
      userId,
      expiresAt: expiresAt.toISOString(),
      timestamp: Date.now()
    }
    
    const token = btoa(JSON.stringify(payload))
    
    return { token, expiresAt }
  }

  // Validate session token
  static validateSessionToken(token: string): {
    isValid: boolean
    sessionId?: string
    userId?: string
    expiresAt?: Date
  } {
    try {
      const payload = JSON.parse(atob(token))
      const expiresAt = new Date(payload.expiresAt)
      
      if (expiresAt < new Date()) {
        return { isValid: false }
      }
      
      return {
        isValid: true,
        sessionId: payload.sessionId,
        userId: payload.userId,
        expiresAt
      }
    } catch (error) {
      return { isValid: false }
    }
  }

  // Refresh session token
  static refreshSessionToken(oldToken: string): {
    token: string
    expiresAt: Date
  } | null {
    const validation = this.validateSessionToken(oldToken)
    
    if (!validation.isValid || !validation.sessionId || !validation.userId) {
      return null
    }
    
    return this.createSessionToken(validation.sessionId, validation.userId)
  }
}

export default EncryptionService