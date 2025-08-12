// Modern React Hook for Authentication
'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, AuthState, LoginCredentials, RegisterData } from '@/lib/auth/types'
import { authService } from '@/lib/auth/auth-service'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const isAuthenticated = authService.isAuthenticated()
        const user = authService.getUser()

        setAuthState({
          user: isAuthenticated ? user : null,
          isAuthenticated,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication',
        })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await authService.login(credentials)

      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return { success: true, message: response.message }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || response.message,
        }))
        return { success: false, error: response.error || response.message }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Mock login function for testing
  const mockLogin = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await authService.mockLogin()

      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return { success: true, message: response.message }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || response.message,
        }))
        return { success: false, error: response.error || response.message }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Mock login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Register function
  const register = useCallback(async (userData: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await authService.register(userData)

      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return { success: true, message: response.message }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || response.message,
        }))
        return { success: false, error: response.error || response.message }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }))

    try {
      await authService.logout()
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!authState.isAuthenticated) return

    try {
      const response = await authService.makeAuthenticatedRequest('/api/auth/me')
      const data = await response.json()

      if (data.success && data.user) {
        setAuthState(prev => ({
          ...prev,
          user: data.user,
        }))
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }, [authState.isAuthenticated])

  // Update profile function
  const updateProfile = useCallback(async (profileData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const updatedUser = await authService.updateProfile(profileData)
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }))
      return updatedUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,

    // Actions
    login,
    mockLogin, // Mock login for testing
    register,
    logout,
    updateProfile,
    refreshUser,
    clearError,

    // Utilities
    isTokenExpired: authService.isTokenExpired,
    validateEmail: authService.validateEmail,
    validatePassword: authService.validatePassword,
    validatePhone: authService.validatePhone,
  }
}