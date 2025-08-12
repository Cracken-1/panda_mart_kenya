// Authentication and User Types
export interface User {
  id: string
  pandaId?: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  marketingConsent?: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  tokens?: AuthTokens
  error?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Account Management Types
export interface UserProfile extends User {
  bio?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  address?: Address
  preferences: UserPreferences
  stats: UserStats
}

export interface Address {
  id: string
  title: string
  firstName: string
  lastName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  county: string
  postalCode: string
  isDefault: boolean
}

export interface UserPreferences {
  language: string
  currency: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    marketing: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showEmail: boolean
    showPhone: boolean
  }
}

export interface UserStats {
  totalOrders: number
  totalSpent: number
  favoriteCategories: string[]
  joinDate: string
  lastLoginAt: string
}

// Gamification Types
export interface PandaPoints {
  current: number
  lifetime: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  nextTierPoints: number
  tierBenefits: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt?: string
  progress?: number
  maxProgress?: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  badge: Badge
  pointsAwarded: number
  unlockedAt: string
}