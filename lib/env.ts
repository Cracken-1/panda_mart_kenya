/**
 * Environment variables with validation
 */

// Define the shape of our environment variables
interface Env {
  // Database
  DATABASE_HOST: string
  DATABASE_PORT: string
  DATABASE_NAME: string
  DATABASE_USER: string
  DATABASE_PASSWORD: string
  DATABASE_SSL: string
  DATABASE_MAX_CONNECTIONS: string
  
  // Authentication
  NEXTAUTH_SECRET: string
  JWT_ACCESS_SECRET: string
  JWT_REFRESH_SECRET: string
  JWT_RESET_SECRET: string
  
  // Application
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
  
  // Email
  SMTP_HOST: string
  SMTP_PORT: string
  SMTP_USER: string
  SMTP_PASS: string
  EMAIL_FROM: string
  
  // Optional services
  MPESA_CONSUMER_KEY?: string
  MPESA_CONSUMER_SECRET?: string
  STRIPE_SECRET_KEY?: string
  CLOUDINARY_CLOUD_NAME?: string
  CLOUDINARY_API_KEY?: string
  CLOUDINARY_API_SECRET?: string
}

// Required environment variables
const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_NAME',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'NEXT_PUBLIC_APP_URL'
]

// Default values for optional environment variables
const defaultEnv = {
  DATABASE_PORT: '5432',
  DATABASE_SSL: 'false',
  DATABASE_MAX_CONNECTIONS: '20',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SMTP_PORT: '587',
  EMAIL_FROM: 'noreply@pandamart.co.ke'
}

// Check for missing required environment variables (only at runtime, not during build)
if (process.env.NODE_ENV === 'production' && 
    typeof window !== 'undefined' && 
    !process.env.VERCEL_ENV &&
    !process.env.SKIP_ENV_VALIDATION) {
  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key] && !process.env.DATABASE_URL)
  if (missingEnvVars.length > 0) {
    console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`)
  }
}

// Create the environment object with defaults and validation
export const env = {
  ...defaultEnv,
  ...process.env,
  // Ensure DATABASE_URL is used if available
  DATABASE_HOST: process.env.DATABASE_URL ? undefined : process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_URL ? undefined : process.env.DATABASE_PORT,
  DATABASE_NAME: process.env.DATABASE_URL ? undefined : process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_URL ? undefined : process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_URL ? undefined : process.env.DATABASE_PASSWORD,
} as unknown as Env

// Helper function to get an environment variable with a fallback
export function getEnv(key: keyof Env, fallback?: string): string {
  const value = env[key]
  if (!value && fallback !== undefined) {
    return fallback
  }
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value
}

// Helper function to check if we're in production
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

// Helper function to check if we're in development
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

// Helper function to check if we're in test
export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}