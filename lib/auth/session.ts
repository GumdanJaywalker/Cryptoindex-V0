// lib/auth/session.ts
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/client'
import { UserSession, UserSessionInsert, AuthUser } from '@/lib/supabase/types'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

interface TokenPayload {
  userId: string
  authType: 'email' | 'wallet'
  email?: string
  walletAddress?: string
  privyUserId?: string
  sessionId: string
}

/**
 * JWT 토큰 생성
 */
export function generateJWT(user: AuthUser, sessionId: string): string {
  const payload: TokenPayload = {
    userId: user.id,
    authType: user.authType,
    email: user.email,
    walletAddress: user.walletAddress,
    privyUserId: user.privyUserId,
    sessionId
  }

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'cryptopayback',
    audience: 'cryptopayback-users'
  })
}

/**
 * JWT 토큰 검증
 */
export function verifyJWT(token: string): { payload: TokenPayload | null; error?: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'cryptopayback',
      audience: 'cryptopayback-users'
    }) as TokenPayload

    return { payload }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { payload: null, error: 'Token expired' }
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { payload: null, error: 'Invalid token' }
    }
    return { payload: null, error: 'Token verification failed' }
  }
}

/**
 * 안전한 세션 토큰 생성
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * 세션 만료 시간 계산
 */
export function getSessionExpiryTime(): Date {
  const expiryTime = new Date()
  expiryTime.setDate(expiryTime.getDate() + 7) // 7일 후 만료
  return expiryTime
}

/**
 * 새 세션 생성
 */
export async function createSession(
  userId: string, 
  privyAccessToken?: string
): Promise<{ session: UserSession | null; sessionToken: string; error?: string }> {
  try {
    const sessionToken = generateSessionToken()
    const expiresAt = getSessionExpiryTime()

    const newSession: UserSessionInsert = {
      user_id: userId,
      session_token: sessionToken,
      privy_access_token: privyAccessToken,
      expires_at: expiresAt.toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .insert(newSession)
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return { session: null, sessionToken: '', error: 'Failed to create session' }
    }

    return { session: data, sessionToken }
  } catch (error) {
    console.error('Error in createSession:', error)
    return { session: null, sessionToken: '', error: 'Internal server error' }
  }
}

/**
 * 세션 조회
 */
export async function getSession(sessionToken: string): Promise<{ session: UserSession | null; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching session:', error)
      return { session: null, error: 'Failed to fetch session' }
    }

    return { session: data }
  } catch (error) {
    console.error('Error in getSession:', error)
    return { session: null, error: 'Internal server error' }
  }
}

/**
 * 세션 갱신 (last_accessed 업데이트)
 */
export async function refreshSession(sessionToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .update({ last_accessed: new Date().toISOString() })
      .eq('session_token', sessionToken)

    if (error) {
      console.error('Error refreshing session:', error)
      return { success: false, error: 'Failed to refresh session' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in refreshSession:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * 세션 삭제 (로그아웃)
 */
export async function deleteSession(sessionToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .delete()
      .eq('session_token', sessionToken)

    if (error) {
      console.error('Error deleting session:', error)
      return { success: false, error: 'Failed to delete session' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteSession:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * 사용자의 모든 세션 삭제
 */
export async function deleteAllUserSessions(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting all user sessions:', error)
      return { success: false, error: 'Failed to delete sessions' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteAllUserSessions:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * 만료된 세션들 정리 (크론 작업용)
 */
export async function cleanupExpiredSessions(): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (error) {
      console.error('Error cleaning up expired sessions:', error)
      return { success: false, error: 'Failed to cleanup sessions' }
    }

    return { success: true, deletedCount: data?.length || 0 }
  } catch (error) {
    console.error('Error in cleanupExpiredSessions:', error)
    return { success: false, error: 'Internal server error' }
  }
}
