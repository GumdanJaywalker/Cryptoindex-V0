// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requirePrivyAuth } from '@/lib/middleware/privy-auth'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult // Return error response if authentication fails
    }

    const { user, privyToken } = authResult

    // Delete current session only (default)
    let logoutAll = false

    try {
      const body = await request.json()
      logoutAll = body.logoutAll === true
    } catch {
      // Ignore if body is missing or parsing fails
    }

    // Privy session is handled on the client side
    // Only delete cookies on the server

    // Success response
    const response = NextResponse.json(
      {
        success: true,
        message: logoutAll ? '모든 기기에서 로그아웃되었습니다.' : '로그아웃되었습니다.'
      },
      { status: 200 }
    )

    // Remove Privy token from cookies
    response.cookies.set('privy-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)

    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
