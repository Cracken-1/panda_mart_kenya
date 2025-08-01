// OAuth integration utilities
export interface OAuthUserData {
  id: string
  name: string
  email: string
  picture?: string
  given_name?: string
  family_name?: string
  phone?: string
}

// Simulate Google OAuth flow
export const initiateGoogleOAuth = async (): Promise<OAuthUserData> => {
  return new Promise((resolve) => {
    // Simulate OAuth popup and user consent
    setTimeout(() => {
      // Simulate realistic Google user data
      const mockGoogleUser: OAuthUserData = {
        id: 'google_' + Date.now(),
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        given_name: 'John',
        family_name: 'Doe'
      }
      resolve(mockGoogleUser)
    }, 1500) // Simulate network delay
  })
}

// Simulate Apple OAuth flow
export const initiateAppleOAuth = async (): Promise<OAuthUserData> => {
  return new Promise((resolve) => {
    // Simulate OAuth popup and user consent
    setTimeout(() => {
      // Simulate realistic Apple user data
      const mockAppleUser: OAuthUserData = {
        id: 'apple_' + Date.now(),
        name: 'Jane Smith',
        email: 'jane.smith@icloud.com',
        given_name: 'Jane',
        family_name: 'Smith'
      }
      resolve(mockAppleUser)
    }, 1500) // Simulate network delay
  })
}

// Generate user profile from OAuth data
export const createUserProfileFromOAuth = (oauthData: OAuthUserData, provider: 'google' | 'apple') => {
  const generatePandaId = () => {
    const prefix = 'PANDA'
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    return `${prefix}${randomNum}`
  }

  return {
    id: oauthData.id,
    pandaId: generatePandaId(),
    name: oauthData.name,
    email: oauthData.email,
    phone: oauthData.phone || '',
    picture: oauthData.picture || '',
    tier: 'Bronze',
    points: 0,
    joinDate: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
    favoriteStore: null,
    achievements: [],
    addresses: [],
    notifications: [],
    paymentMethods: [],
    rewards: [],
    authProvider: provider,
    oauthId: oauthData.id
  }
}