// Modern Authentication Service
import { AuthTokens, User, LoginCredentials, RegisterData, AuthResponse } from './types'

class AuthService {
  private static instance: AuthService
  private baseUrl = '/api/auth'

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success) {
        this.storeTokens(data.tokens)
        this.storeUser(data.user)
      }

      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Mock login for testing purposes
  async mockLogin(): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create mock user data
      const mockUser: User = {
        id: 'mock-user-123',
        pandaId: 'PANDA-123456',
        email: 'test@pandamart.co.ke',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+254700123456',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Create mock tokens
      const mockTokens: AuthTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600 // 1 hour
      }

      // Store the mock data
      this.storeTokens(mockTokens)
      this.storeUser(mockUser)

      return {
        success: true,
        message: 'Mock login successful',
        user: mockUser,
        tokens: mockTokens
      }
    } catch (error) {
      return {
        success: false,
        message: 'Mock login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        this.storeTokens(data.tokens)
        this.storeUser(data.user)
      }

      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getAccessToken()
      if (token) {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearStorage()
    }
  }

  async updateProfile(profileData: any): Promise<User> {
    try {
      const response = await this.makeAuthenticatedRequest(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      if (data.success && data.user) {
        this.storeUser(data.user)
        return data.user
      }

      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) return false

      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (data.success) {
        this.storeTokens(data.tokens)
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  // Token Management
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('panda_access_token', tokens.accessToken)
    localStorage.setItem('panda_refresh_token', tokens.refreshToken)
    localStorage.setItem('panda_token_expires', (Date.now() + tokens.expiresIn * 1000).toString())
  }

  private storeUser(user: User): void {
    localStorage.setItem('panda_user', JSON.stringify(user))
  }

  getAccessToken(): string | null {
    return localStorage.getItem('panda_access_token')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('panda_refresh_token')
  }

  getUser(): User | null {
    const userData = localStorage.getItem('panda_user')
    return userData ? JSON.parse(userData) : null
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    const expires = localStorage.getItem('panda_token_expires')

    if (!token || !expires) return false

    return Date.now() < parseInt(expires)
  }

  isTokenExpired(): boolean {
    const expires = localStorage.getItem('panda_token_expires')
    return expires ? Date.now() >= parseInt(expires) : true
  }

  private clearStorage(): void {
    localStorage.removeItem('panda_access_token')
    localStorage.removeItem('panda_refresh_token')
    localStorage.removeItem('panda_token_expires')
    localStorage.removeItem('panda_user')
  }

  // Utility Methods
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let token = this.getAccessToken()

    // Check if token is expired and refresh if needed
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken()
      if (!refreshed) {
        throw new Error('Authentication required')
      }
      token = this.getAccessToken()
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Validation Methods
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validatePassword(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validatePhone(phone: string): boolean {
    // Kenyan phone number validation
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }
}

export const authService = AuthService.getInstance()
export default authService