// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyEmailOTP } from '@/lib/auth/otp'
import { 
  getUserByEmail, 
  createEmailUser, 
  markEmailAsVerified, 
  updateLastLogin,
  userToAuthUser 
} from '@/lib/auth/user'
import { createSession, generateJWT } from '@/lib/auth/session'
import { rateLimitByIP } from '@/lib/middleware/privy-auth'

// 요청 검증 스키마
const verifyEmailSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  code: z.string().length(6, '인증 코드는 6자리여야 합니다.').regex(/^\d+$/, '인증 코드는 숫자만 포함해야 합니다.')
})

export async function POST(request: NextRequest) {
  try {
    // IP 기반 Rate Limiting
    const rateLimitResult = rateLimitByIP(request, 10, 5 * 60 * 1000) // 5분간 10회
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: '너무 많은 인증 시도가 발생했습니다. 잠시 후 다시 시도해주세요.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // 요청 바디 파싱 및 검증
    const body = await request.json()
    const validatedData = verifyEmailSchema.parse(body)
    const { email, code } = validatedData

    // OTP 코드 검증
    const otpVerification = await verifyEmailOTP(email, code)
    if (!otpVerification.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpVerification.error || '인증 코드가 올바르지 않습니다.'
        },
        { status: 400 }
      )
    }

    // 기존 사용자 조회 또는 새 사용자 생성
    let { user } = await getUserByEmail(email)
    
    if (!user) {
      // 새 사용자 생성
      const createResult = await createEmailUser(email)
      if (!createResult.user) {
        return NextResponse.json(
          {
            success: false,
            error: createResult.error || '사용자 생성에 실패했습니다.'
          },
          { status: 500 }
        )
      }
      user = createResult.user
    }

    // 이메일 인증 완료 표시
    await markEmailAsVerified(user.id)
    
    // 마지막 로그인 시간 업데이트
    await updateLastLogin(user.id)

    // 세션 생성
    const sessionResult = await createSession(user.id)
    if (!sessionResult.session) {
      return NextResponse.json(
        {
          success: false,
          error: sessionResult.error || '세션 생성에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    // JWT 토큰 생성
    const authUser = userToAuthUser({
      ...user,
      email_verified: true,
      last_login: new Date().toISOString()
    })
    
    const jwtToken = generateJWT(authUser, sessionResult.session.id)

    // 응답
    const response = NextResponse.json(
      {
        success: true,
        message: '로그인에 성공했습니다.',
        user: {
          id: authUser.id,
          email: authUser.email,
          authType: authUser.authType,
          emailVerified: authUser.emailVerified,
          isActive: authUser.isActive
        },
        sessionToken: jwtToken
      },
      { status: 200 }
    )

    // JWT 토큰을 쿠키에 설정 (HttpOnly, Secure)
    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Verify email error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || '잘못된 요청 형식입니다.',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      },
      { status: 500 }
    )
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
