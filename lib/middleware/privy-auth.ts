// lib/middleware/privy-auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyPrivyJWT, extractPrivyUserId, PrivyJWTPayload } from '@/lib/auth/privy-jwt'

/**
 * List of routes requiring authentication
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
 * List of public routes (no authentication required)
 */
const PUBLIC_ROUTES = [
  '/',
  '/privy-login',
  '/test-wallets',
  '/api/health'
]

/**
 * Admin-only routes
 */
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin'
]

/**
 * Check if the request is for a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if the request is for a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))
}

/**
 * Check if the request is for an admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Extract authentication info from Privy JWT token
 */
export async function extractPrivyAuthFromRequest(request: NextRequest) {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = request.headers.get('authorization')
    let token = authHeader?.replace('Bearer ', '')

    // If not in header, extract from cookie
    if (!token) {
      token = request.cookies.get('privy-token')?.value
    }

    if (!token) {
      return { authenticated: false, error: 'No Privy token provided' }
    }

    // Simple validation in development environment
    if (process.env.NODE_ENV === 'development') {
      const privyUserId = extractPrivyUserId(token)
      if (!privyUserId) {
        return { authenticated: false, error: 'Invalid Privy token' }
      }

      // Return development user info
      return {
        authenticated: true,
        user: {
          id: privyUserId,
          privyUserId: privyUserId,
          authType: 'email' as const,
          email: 'dev@cryptoindex.com',
          walletAddress: undefined,
          emailVerified: true,
          isActive: true
        },
        privyToken: token
      }
    }

    // Verify actual Privy JWT in production environment
    const verificationResult = await verifyPrivyJWT(token)
    if (!verificationResult.valid || !verificationResult.payload) {
      return {
        authenticated: false,
        error: verificationResult.error || 'Invalid Privy token'
      }
    }

    const payload = verificationResult.payload

    return {
      authenticated: true,
      user: {
        id: payload.sub,
        privyUserId: payload.sub,
        authType: payload.wallet ? 'wallet' as const : 'email' as const,
        email: payload.email?.address,
        walletAddress: payload.wallet?.address,
        emailVerified: payload.email?.verified || false,
        isActive: true
      },
      privyToken: token
    }
  } catch (error) {
    console.error('Error extracting Privy auth from request:', error)
    return { authenticated: false, error: 'Authentication failed' }
  }
}

/**
 * Privy authentication middleware for API routes
 */
export async function requirePrivyAuth(request: NextRequest) {
  const authResult = await extractPrivyAuthFromRequest(request)

  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error, authenticated: false },
      { status: 401 }
    )
  }

  return {
    user: authResult.user,
    privyToken: authResult.privyToken
  }
}

/**
 * Check admin permissions (Privy based)
 */
export async function requirePrivyAdminAuth(request: NextRequest) {
  const authResult = await extractPrivyAuthFromRequest(request)

  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error, authenticated: false },
      { status: 401 }
    )
  }

  // Check admin permissions
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',')
  const isAdmin = authResult.user?.email && adminEmails.includes(authResult.user.email)

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin access required', authenticated: true, authorized: false },
      { status: 403 }
    )
  }

  return {
    user: authResult.user,
    privyToken: authResult.privyToken
  }
}

/**
 * Rate Limiting Middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // Start new window
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }

  if (record.count >= maxRequests) {
    // Limit exceeded
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  // Increment count
  record.count++
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
}

/**
 * IP-based Rate Limiting
 */
export function rateLimitByIP(request: NextRequest, maxRequests: number = 1000, windowMs: number = 15 * 60 * 1000) {
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown'
  return rateLimit(`ip:${ip}`, maxRequests, windowMs)
}

/**
 * User-based Rate Limiting
 */
export function rateLimitByUser(userId: string, maxRequests: number = 1000, windowMs: number = 60 * 60 * 1000) {
  return rateLimit(`user:${userId}`, maxRequests, windowMs)
}
