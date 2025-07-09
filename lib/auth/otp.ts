// lib/auth/otp.ts
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/client'
import { EmailVerificationCodeInsert } from '@/lib/supabase/types'

/**
 * 6자리 OTP 코드 생성
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * OTP 만료 시간 계산 (15분)
 */
export function getOTPExpiryTime(): Date {
  const expiryTime = new Date()
  expiryTime.setMinutes(expiryTime.getMinutes() + 15)
  return expiryTime
}

/**
 * 이메일로 OTP 코드 생성 및 저장
 */
export async function createEmailOTP(email: string): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    // 기존 미사용 코드들을 만료시킴
    await supabaseAdmin
      .from('email_verification_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('used', false)

    // 새 OTP 코드 생성
    const code = generateOTPCode()
    const expiresAt = getOTPExpiryTime()

    const newOTP: EmailVerificationCodeInsert = {
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false
    }

    const { error } = await supabaseAdmin
      .from('email_verification_codes')
      .insert(newOTP)

    if (error) {
      console.error('Failed to create OTP:', error)
      return { success: false, error: 'Failed to create verification code' }
    }

    return { success: true, code }
  } catch (error) {
    console.error('Error creating OTP:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * OTP 코드 검증
 */
export async function verifyEmailOTP(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 유효한 OTP 코드 조회
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !otpRecord) {
      return { success: false, error: 'Invalid or expired verification code' }
    }

    // OTP 코드를 사용됨으로 표시
    const { error: updateError } = await supabaseAdmin
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', otpRecord.id)

    if (updateError) {
      console.error('Failed to mark OTP as used:', updateError)
      return { success: false, error: 'Failed to verify code' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * 이메일 OTP 전송 제한 확인 (5분간 최대 3회)
 */
export async function checkOTPRateLimit(email: string): Promise<{ allowed: boolean; error?: string }> {
  try {
    const fiveMinutesAgo = new Date()
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)

    const { data: recentCodes, error } = await supabaseAdmin
      .from('email_verification_codes')
      .select('id')
      .eq('email', email)
      .gt('created_at', fiveMinutesAgo.toISOString())

    if (error) {
      console.error('Failed to check rate limit:', error)
      return { allowed: false, error: 'Failed to check rate limit' }
    }

    if (recentCodes && recentCodes.length >= 3) {
      return { allowed: false, error: 'Too many verification attempts. Please wait 5 minutes.' }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return { allowed: false, error: 'Internal server error' }
  }
}
