// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createEmailOTP, checkOTPRateLimit } from '@/lib/auth/otp'
import { sendOTPEmail, sendOTPEmailViaSupabase } from '@/lib/auth/email'
import { rateLimitByIP } from '@/lib/middleware/privy-auth'

// 요청 검증 스키마
const sendOTPSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.')
})

export async function POST(request: NextRequest) {
  try {
    // IP 기반 Rate Limiting (이메일 전송은 더 엄격하게)
    const rateLimitResult = rateLimitByIP(request, 5, 5 * 60 * 1000) // 5분간 5회
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // 요청 바디 파싱 및 검증
    const body = await request.json()
    const validatedData = sendOTPSchema.parse(body)
    const { email } = validatedData

    // 이메일별 OTP 전송 제한 확인
    const rateLimitCheck = await checkOTPRateLimit(email)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitCheck.error
        },
        { status: 429 }
      )
    }

    // OTP 코드 생성 및 저장
    const otpResult = await createEmailOTP(email)
    if (!otpResult.success || !otpResult.code) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.error || 'OTP 생성에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    // 이메일 전송
    const emailResult = process.env.NODE_ENV === 'development'
      ? await sendOTPEmailViaSupabase({ email, code: otpResult.code })
      : await sendOTPEmail({ email, code: otpResult.code })

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || '이메일 전송에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    // 성공 응답 (개발 환경에서는 코드도 함께 반환)
    const response: any = {
      success: true,
      message: '인증 코드가 이메일로 전송되었습니다.',
      email
    }

    if (process.env.NODE_ENV === 'development') {
      response.code = otpResult.code // 개발 환경에서만 코드 노출
      console.log(`🔐 OTP sent to ${email}: ${otpResult.code}`)
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Send OTP error:', error)

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
