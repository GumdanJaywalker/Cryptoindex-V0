// lib/auth/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendOTPEmailParams {
  email: string
  code: string
  name?: string
}

/**
 * OTP 코드를 이메일로 전송
 */
export async function sendOTPEmail({ email, code, name }: SendOTPEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CryptoPayback <noreply@cryptopayback.com>',
      to: [email],
      subject: '로그인 인증 코드',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>로그인 인증 코드</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7f7f7;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f7f7; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <h1 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">
                        CryptoPayback
                      </h1>
                      <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px; font-weight: normal;">
                        로그인 인증 코드
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                        ${name ? `안녕하세요 ${name}님,` : '안녕하세요,'}<br>
                        아래 인증 코드를 입력하여 로그인을 완료해주세요.
                      </p>
                      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                        <div style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${code}
                        </div>
                      </div>
                      <p style="color: #9ca3af; margin: 0; font-size: 14px; line-height: 1.5;">
                        이 코드는 15분 후에 만료됩니다.<br>
                        본인이 요청하지 않았다면 이 이메일을 무시해주세요.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #6b7280; margin: 0; font-size: 12px;">
                        © ${new Date().getFullYear()} CryptoPayback. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        CryptoPayback 로그인 인증 코드
        
        ${name ? `안녕하세요 ${name}님,` : '안녕하세요,'}
        
        아래 인증 코드를 입력하여 로그인을 완료해주세요.
        
        인증 코드: ${code}
        
        이 코드는 15분 후에 만료됩니다.
        본인이 요청하지 않았다면 이 이메일을 무시해주세요.
        
        © ${new Date().getFullYear()} CryptoPayback. All rights reserved.
      `
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: 'Failed to send verification email' }
    }

    console.log('Email sent successfully:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Supabase Edge Functions을 사용한 이메일 전송 (대안)
 */
export async function sendOTPEmailViaSupabase({ email, code, name }: SendOTPEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Supabase에서 이메일 전송 로직
    // 이는 Supabase Edge Functions 또는 다른 이메일 서비스와 연동하여 구현
    console.log(`Sending OTP ${code} to ${email}`)
    
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP Code for ${email}: ${code}`)
      return { success: true }
    }

    // 실제 구현에서는 Supabase의 이메일 서비스 또는 다른 이메일 제공업체 사용
    return { success: false, error: 'Email service not configured' }
  } catch (error) {
    console.error('Error sending email via Supabase:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
