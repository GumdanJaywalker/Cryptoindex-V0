// app/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EmailOTPLogin } from '@/components/auth/EmailOTPLogin'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LoginPage() {
  const { authenticated, loading } = useAuth()
  const router = useRouter()

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && authenticated) {
      router.push('/dashboard')
    }
  }, [authenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (authenticated) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CryptoPayback</h1>
          <p className="text-gray-600">안전한 P2P 거래 플랫폼</p>
        </div>
        
        <EmailOTPLogin />
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            계정이 없으시다면 이메일로 로그인하면 자동으로 계정이 생성됩니다.
          </p>
          <p className="mt-2">
            지갑으로 로그인하려면{' '}
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              여기를 클릭
            </button>
            하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
