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

  // Check initial authentication status
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
        return { success: false, error: data.error || 'Failed to send OTP.' }
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return { success: false, error: 'Network error occurred.' }
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
        return { success: false, error: data.error || 'Login failed.' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error occurred.' }
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
        return { success: false, error: data.error || 'Logout failed.' }
      }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Network error occurred.' }
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
