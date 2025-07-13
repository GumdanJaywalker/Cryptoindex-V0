import { NextRequest, NextResponse } from 'next/server'
import { requirePrivyAuth } from '@/lib/middleware/privy-auth'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await requirePrivyAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // 요청 바디에서 Privy 사용자 데이터 받기
    const body = await request.json()
    const { privyUser } = body

    if (!privyUser || !privyUser.id) {
      return NextResponse.json(
        { success: false, error: 'Missing Privy user data' },
        { status: 400 }
      )
    }

    // Privy 사용자 데이터를 Supabase 형식으로 변환
    const userData = {
      privy_user_id: privyUser.id,
      auth_type: privyUser.wallet?.address ? 'wallet' as const : 'email' as const,
      email: privyUser.email?.address || null,
      email_verified: privyUser.email?.verified || false,
      wallet_address: privyUser.wallet?.address || null,
      wallet_type: privyUser.wallet?.walletClientType || 'privy',
      last_login: new Date().toISOString(),
      is_active: true,
    }


    // Admin 권한으로 사용자 생성/업데이트 (RLS 우회)
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(userData, { onConflict: 'privy_user_id' })
      .select()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to sync user data' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        user: data[0],
        message: 'User synced successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}