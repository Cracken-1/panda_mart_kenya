'use client'

import { useState, useEffect } from 'react'

interface UserData {
  id: string
  pandaId: string
  email: string
  firstName: string
  lastName: string
  isNewUser?: boolean
}

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userInfo, setUserInfo] = useState<{ firstName: string; pandaId: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = () => {
      try {
        // Check if user is logged in
        const authToken = localStorage.getItem('auth-token')
        if (!authToken) {
          setIsLoading(false)
          return
        }

        // Get user data
        const userDataStr = localStorage.getItem('user-data')
        if (!userDataStr) {
          setIsLoading(false)
          return
        }

        const userData: UserData = JSON.parse(userDataStr)
        
        // Check if onboarding was already completed
        const onboardingCompleted = localStorage.getItem('onboarding-completed')
        
        // Show onboarding if:
        // 1. User is new (isNewUser flag is true)
        // 2. Onboarding hasn't been completed yet
        // 3. User has firstName and pandaId
        if (
          userData.isNewUser && 
          !onboardingCompleted && 
          userData.firstName && 
          userData.pandaId
        ) {
          setUserInfo({
            firstName: userData.firstName,
            pandaId: userData.pandaId
          })
          setShowOnboarding(true)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        setIsLoading(false)
      }
    }

    // Check immediately
    checkOnboardingStatus()

    // Also check when localStorage changes (e.g., after login)
    const handleStorageChange = () => {
      checkOnboardingStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for when user data changes within the same tab
    const handleUserDataChange = () => {
      checkOnboardingStatus()
    }
    
    window.addEventListener('userDataChanged', handleUserDataChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userDataChanged', handleUserDataChange)
    }
  }, [])

  const closeOnboarding = () => {
    setShowOnboarding(false)
    setUserInfo(null)
  }

  const triggerOnboarding = (userData: UserData) => {
    if (userData.firstName && userData.pandaId) {
      setUserInfo({
        firstName: userData.firstName,
        pandaId: userData.pandaId
      })
      setShowOnboarding(true)
    }
  }

  return {
    showOnboarding,
    userInfo,
    isLoading,
    closeOnboarding,
    triggerOnboarding
  }
}

// Helper function to trigger onboarding manually
export const triggerOnboardingEvent = () => {
  window.dispatchEvent(new CustomEvent('userDataChanged'))
}