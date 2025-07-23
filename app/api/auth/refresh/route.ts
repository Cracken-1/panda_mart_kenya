import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { TokenManager } from '@/lib/security/auth'

// POST /api/auth/refresh - Refresh access token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Verify refresh token
    const payload = TokenManager.verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Check if user still exists and is active
    const userQuery = `
      SELECT id, email, panda_id, is_active
      FROM users
      WHERE id = $1 AND is_active = true
    `
    const userResult = await db.query(userQuery, [payload.userId])

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    // Generate new tokens
    const newAccessToken = TokenManager.generateAccessToken({
      userId: user.id,
      email: user.email,
      pandaId: user.panda_id
    })

    const newRefreshToken = TokenManager.generateRefreshToken({
      userId: user.id,
      email: user.email
    })

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        pandaId: user.panda_id
      }
    })

  } catch (error) {
    console.error('Error refreshing token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}