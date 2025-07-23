/**
 * Google reCAPTCHA v3 Integration
 * Provides client-side and server-side reCAPTCHA verification
 */

// Client-side reCAPTCHA utilities
export class RecaptchaClient {
  private siteKey: string
  private isLoaded: boolean = false

  constructor(siteKey: string) {
    this.siteKey = siteKey
  }

  /**
   * Load reCAPTCHA script dynamically
   */
  async loadRecaptcha(): Promise<void> {
    if (this.isLoaded || typeof window === 'undefined') {
      return
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        this.isLoaded = true
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load reCAPTCHA script'))
      }
      
      document.head.appendChild(script)
    })
  }

  /**
   * Execute reCAPTCHA and get token
   */
  async executeRecaptcha(action: string): Promise<string> {
    if (!this.isLoaded) {
      await this.loadRecaptcha()
    }

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.grecaptcha) {
        reject(new Error('reCAPTCHA not available'))
        return
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(this.siteKey, { action })
          .then((token: string) => {
            resolve(token)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    })
  }
}

// Server-side reCAPTCHA verification
export interface RecaptchaVerificationResult {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

export class RecaptchaServer {
  private secretKey: string

  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  /**
   * Verify reCAPTCHA token on server
   */
  async verifyToken(token: string, remoteip?: string): Promise<RecaptchaVerificationResult> {
    const params = new URLSearchParams({
      secret: this.secretKey,
      response: token,
      ...(remoteip && { remoteip })
    })

    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })

      const result: RecaptchaVerificationResult = await response.json()
      return result
    } catch (error) {
      console.error('reCAPTCHA verification error:', error)
      return {
        success: false,
        'error-codes': ['network-error']
      }
    }
  }

  /**
   * Verify token with minimum score requirement
   */
  async verifyWithScore(
    token: string, 
    action: string, 
    minScore: number = 0.5,
    remoteip?: string
  ): Promise<{ success: boolean; score?: number; errors?: string[] }> {
    const result = await this.verifyToken(token, remoteip)

    if (!result.success) {
      return {
        success: false,
        errors: result['error-codes'] || ['verification-failed']
      }
    }

    // Check action matches
    if (result.action !== action) {
      return {
        success: false,
        errors: ['action-mismatch']
      }
    }

    // Check score meets minimum requirement
    if (result.score !== undefined && result.score < minScore) {
      return {
        success: false,
        score: result.score,
        errors: ['low-score']
      }
    }

    return {
      success: true,
      score: result.score
    }
  }
}

// React Hook for reCAPTCHA
import { useEffect, useState, useCallback } from 'react'

export function useRecaptcha(siteKey: string) {
  const [recaptcha, setRecaptcha] = useState<RecaptchaClient | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const client = new RecaptchaClient(siteKey)
    setRecaptcha(client)

    client.loadRecaptcha()
      .then(() => {
        setIsLoaded(true)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoaded(false)
      })
  }, [siteKey])

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!recaptcha || !isLoaded) {
      setError('reCAPTCHA not ready')
      return null
    }

    try {
      const token = await recaptcha.executeRecaptcha(action)
      setError(null)
      return token
    } catch (err) {
      setError(err instanceof Error ? err.message : 'reCAPTCHA execution failed')
      return null
    }
  }, [recaptcha, isLoaded])

  return {
    executeRecaptcha,
    isLoaded,
    error
  }
}

// Utility functions for common actions
export const RECAPTCHA_ACTIONS = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot_password',
  CONTACT_FORM: 'contact_form',
  NEWSLETTER: 'newsletter',
  REVIEW: 'review',
  ORDER: 'order',
  PROFILE_UPDATE: 'profile_update'
} as const

export type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS]

// Environment configuration
export const getRecaptchaConfig = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!siteKey) {
    throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is required')
  }

  if (!secretKey && typeof window === 'undefined') {
    throw new Error('RECAPTCHA_SECRET_KEY environment variable is required for server-side verification')
  }

  return {
    siteKey,
    secretKey: secretKey || ''
  }
}

// Global type declarations
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}