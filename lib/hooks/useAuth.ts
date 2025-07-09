// lib/hooks/useAuth.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthUser } from '@/lib/supabase/types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  authenticated: boolean
}

interface LoginData {
  email: string
  code: string
}

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: (logoutAll?: boolean) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

export function useAuth(): AuthContextType {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false
  })

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setState({
            user: data.user,
            loading: false,
            authenticated: true
          })
          return
        }
      }

      setState({
        user: null,
        loading: false,
        authenticated: false
      })
    } catch (error) {
      console.error('Auth check error:', error)
      setState({
        user: null,
        loading: false,
        authenticated: false
      })
    }
  }, [])

  const sendOTP = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        return { success: true }
      } else {
        return { success: false, error: data.error || 'OTP 전송에 실패했습니다.' }
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return { success: false, error: '네트워크 오류가 발생했습니다.' }
    }
  }, [])

  const login = useCallback(async (loginData: LoginData) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success && data.user) {
        setState({
          user: data.user,
          loading: false,
          authenticated: true
        })
        return { success: true }
      } else {
        return { success: false, error: data.error || '로그인에 실패했습니다.' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: '네트워크 오류가 발생했습니다.' }
    }
  }, [])

  const logout = useCallback(async (logoutAll: boolean = false) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logoutAll }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setState({
          user: null,
          loading: false,
          authenticated: false
        })
        return { success: true }
      } else {
        return { success: false, error: data.error || '로그아웃에 실패했습니다.' }
      }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: '네트워크 오류가 발생했습니다.' }
    }
  }, [])

  const refreshUser = useCallback(async () => {
    await checkAuthStatus()
  }, [checkAuthStatus])

  return {
    ...state,
    login,
    sendOTP,
    logout,
    refreshUser
  }
}
