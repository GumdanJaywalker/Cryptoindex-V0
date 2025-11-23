// components/auth/EmailOTPLogin.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Loader2, Mail, Shield, CheckCircle } from 'lucide-react'

type LoginStep = 'email' | 'otp' | 'success'

export function EmailOTPLogin() {
  const { sendOTP, login, loading } = useAuth()

  const [step, setStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  // Validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Handle OTP sending
  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await sendOTP(email)

      if (result.success) {
        setStep('otp')
        startCountdown()
      } else {
        setError(result.error || 'OTP 전송에 실패했습니다.')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // OTP resend countdown
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Verify OTP and login
  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await login({ email, code: otpCode })

      if (result.success) {
        setStep('success')
        // Redirect or refresh page after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setError(result.error || '인증 코드가 올바르지 않습니다.')
        setOtpCode('')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // Return to email step
  const handleBackToEmail = () => {
    setStep('email')
    setOtpCode('')
    setError('')
  }

  if (step === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">로그인 성공!</h2>
            <p className="text-gray-600">잠시 후 대시보드로 이동합니다...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {step === 'email' ? (
            <Mail className="w-6 h-6 text-blue-600" />
          ) : (
            <Shield className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold">
          {step === 'email' ? '이메일로 로그인' : '인증 코드 입력'}
        </CardTitle>
        <CardDescription>
          {step === 'email'
            ? '이메일 주소를 입력하면 인증 코드를 전송해드립니다.'
            : `${email}로 전송된 6자리 인증 코드를 입력해주세요.`
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'email' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">인증 코드</Label>
              <div className="flex justify-center">
                <InputOTP
                  value={otpCode}
                  onChange={setOtpCode}
                  maxLength={6}
                  onComplete={handleVerifyOTP}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              인증 코드가 오지 않나요?{' '}
              {countdown > 0 ? (
                <span>({countdown}초 후 재전송 가능)</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isLoading}
                >
                  재전송
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        {step === 'email' ? (
          <Button
            onClick={handleSendOTP}
            disabled={isLoading || !email.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                인증 코드 전송 중...
              </>
            ) : (
              '인증 코드 전송'
            )}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  인증 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToEmail}
              disabled={isLoading}
              className="w-full"
            >
              이메일 변경
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
