import { NextRequest } from 'next/server'
import { TokenManager } from '../security/auth'
import { db } from '../database'

/**
 * Authenticates a user from the request's Authorization header
 * @param request The Next.js request object
 * @returns The authenticated user payload or null if authentication fails
 */
export async function authenticateUser(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    if (!token) {
      return null
    }

    // Verify the token
    const payload = TokenManager.verifyAccessToken(token)
    if (!payload) {
      return null
    }

    // Check if user exists and is active
    const userQuery = `
      SELECT is_active 
      FROM users 
      WHERE id = $1
    `
    const result = await db.query(userQuery, [payload.userId])

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return null
    }

    return payload
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

/**
 * Checks if the authenticated user has the required role
 * @param user The authenticated user payload
 * @param requiredRole The role required for access
 * @returns Boolean indicating if the user has the required role
 */
export function hasRole(user: any, requiredRole: string) {
  if (!user || !user.roles) {
    return false
  }
  
  return user.roles.includes(requiredRole)
}

/**
 * Checks if the authenticated user has the required permission
 * @param user The authenticated user payload
 * @param requiredPermission The permission required for access
 * @returns Boolean indicating if the user has the required permission
 */
export function hasPermission(user: any, requiredPermission: string) {
  if (!user || !user.permissions) {
    return false
  }
  
  return user.permissions.includes(requiredPermission)
}