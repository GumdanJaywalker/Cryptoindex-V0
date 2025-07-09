// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth/session'
import { getSession } from '@/lib/auth/session'
import { getUserByPrivyId } from '@/lib/auth/user'

/**
 * 인증이 필요한 라우트 목록
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/wallet',
  '/trade',
  '/api/user',
  '/api/wallet',
  '/api/trade'
]

/**
 * 공개 라우트 목록 (인증 불필요)
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/send-otp',
  '/api/health'
]

/**
 * 관리자 전용 라우트
 */
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin'
]

/**
 * 요청이 보호된 라우트인지 확인
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * 요청이 공개 라우트인지 확인
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))
}

/**
 * 요청이 관리자 라우트인지 확인
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * JWT 토큰에서 인증 정보 추출
 */
export async function extractAuthFromRequest(request: NextRequest) {
  try {
    // Authorization 헤더에서 Bearer 토큰 추출
    const authHeader = request.headers.get('authorization')
    let token = authHeader?.replace('Bearer ', '')

    // 헤더에 없으면 쿠키에서 추출
    if (!token) {
      token = request.cookies.get('auth-token')?.value
    }

    if (!token) {
      return { authenticated: false, error: 'No token provided' }
    }

    // JWT 토큰 검증
    const { payload, error } = verifyJWT(token)
    if (error || !payload) {
      return { authenticated: false, error: error || 'Invalid token' }
    }

    // 세션 유효성 확인
    const { session, error: sessionError } = await getSession(payload.sessionId)
    if (sessionError || !session) {
      return { authenticated: false, error: 'Invalid or expired session' }
    }

    return {
      authenticated: true,
      user: {
        id: payload.userId,
        authType: payload.authType,
        email: payload.email,
        walletAddress: payload.walletAddress,
        privyUserId: payload.privyUserId,
        sessionId: payload.sessionId
      },
      session
    }
  } catch (error) {
    console.error('Error extracting auth from request:', error)
    return { authenticated: false, error: 'Authentication failed' }
  }
}

/**
 * API 라우트용 인증 미들웨어
 */
export async function requireAuth(request: NextRequest) {
  const authResult = await extractAuthFromRequest(request)
  
  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error, authenticated: false },
      { status: 401 }
    )
  }

  return {
    user: authResult.user,
    session: authResult.session
  }
}

/**
 * 관리자 권한 확인
 */
export async function requireAdminAuth(request: NextRequest) {
  const authResult = await extractAuthFromRequest(request)
  
  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error, authenticated: false },
      { status: 401 }
    )
  }

  // 관리자 권한 확인 로직 (추후 구현)
  // 현재는 특정 이메일이나 역할 기반으로 확인할 수 있음
  const isAdmin = await checkAdminPermissions(authResult.user)
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin access required', authenticated: true, authorized: false },
      { status: 403 }
    )
  }

  return {
    user: authResult.user,
    session: authResult.session
  }
}

/**
 * 관리자 권한 확인 (추후 확장)
 */
async function checkAdminPermissions(user: any): Promise<boolean> {
  // 현재는 간단한 이메일 기반 확인
  // 추후 roles 테이블이나 permissions 시스템으로 확장 가능
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',')
  return user.email && adminEmails.includes(user.email)
}

/**
 * Rate Limiting 미들웨어
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string, 
  maxRequests: number = 100, 
  windowMs: number = 15 * 60 * 1000 // 15분
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // 새로운 윈도우 시작
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }

  if (record.count >= maxRequests) {
    // 제한 초과
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  // 카운트 증가
  record.count++
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
}

/**
 * IP 기반 Rate Limiting
 */
export function rateLimitByIP(request: NextRequest, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  return rateLimit(`ip:${ip}`, maxRequests, windowMs)
}

/**
 * 사용자 기반 Rate Limiting
 */
export function rateLimitByUser(userId: string, maxRequests: number = 1000, windowMs: number = 60 * 60 * 1000) {
  return rateLimit(`user:${userId}`, maxRequests, windowMs)
}
