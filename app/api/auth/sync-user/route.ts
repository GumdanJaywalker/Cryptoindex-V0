import { NextRequest, NextResponse } from 'next/server'
import { requirePrivyAuth } from '@/lib/middleware/privy-auth'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 sync-user API called');
    
    // 인증 확인
    const authResult = await requirePrivyAuth(request)
    if (authResult instanceof NextResponse) {
      console.log('❌ Authentication failed');
      return authResult
    }

    const { user } = authResult
    console.log('✅ Authentication successful for user:', user?.id);

    // 요청 바디에서 Privy 사용자 데이터 받기
    const body = await request.json()
    const { privyUser } = body
    console.log('📥 Received privyUser:', privyUser?.id);

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
    console.log('💾 Attempting to upsert user data:', userData);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(userData, { onConflict: 'privy_user_id' })
      .select()

    if (error) {
      console.error('❌ Supabase upsert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to sync user data', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('✅ User upserted successfully:', data?.[0]?.id);

    const createdUser = data[0]

    // 모든 지갑 정보를 user_wallets 테이블에 동기화
    const walletSyncResults = []
    
    // linkedAccounts에서 모든 지갑 정보 수집 (안전한 방법)
    const allUserWallets = []
    
    console.log(`🔍 DEBUGGING linkedAccounts for user ${privyUser.id}:`);
    console.log(`linkedAccounts exists: ${!!privyUser.linkedAccounts}`);
    console.log(`linkedAccounts length: ${privyUser.linkedAccounts?.length || 0}`);
    console.log(`linkedAccounts raw data:`, JSON.stringify(privyUser.linkedAccounts, null, 2));
    
    if (privyUser.linkedAccounts && privyUser.linkedAccounts.length > 0) {
      privyUser.linkedAccounts.forEach((account, index) => {
        console.log(`Account ${index}:`, {
          type: account.type,
          address: account.address,
          chainType: account.chainType,
          walletClientType: account.walletClientType,
          connectorType: account.connectorType,
          id: account.id,
          hasAllRequiredFields: !!(account.address && account.chainType && account.walletClientType)
        });
        
        if (account.type === 'wallet') {
          // 필수 필드 확인
          if (!account.address) {
            console.log(`⚠️ Skipping wallet ${index}: Missing address`);
            return;
          }
          if (!account.chainType) {
            console.log(`⚠️ Skipping wallet ${index}: Missing chainType`);
            return;
          }
          if (!account.walletClientType) {
            console.log(`⚠️ Skipping wallet ${index}: Missing walletClientType`);
            return;
          }
          
          allUserWallets.push({
            address: account.address,
            chainType: account.chainType,
            walletClientType: account.walletClientType,
            walletType: account.connectorType === 'embedded' ? 'embedded' : 'external',
            source: 'linkedAccounts',
            privyWalletId: account.id || null // embedded 지갑의 경우 ID 존재
          })
        }
      })
      
      console.log(`✅ Found ${allUserWallets.length} valid wallets for user ${privyUser.id}:`);
      allUserWallets.forEach(wallet => {
        console.log(`  - ${wallet.walletType} ${wallet.chainType} ${wallet.walletClientType}: ${wallet.address}`);
      });
    } else {
      console.log(`⚠️ No linkedAccounts found for user ${privyUser.id}`);
    }
    
    if (allUserWallets.length > 0) {
      // 기존 지갑들 삭제 (새로운 지갑 정보로 완전히 교체)
      await supabaseAdmin
        .from('user_wallets')
        .delete()
        .eq('user_id', createdUser.id)

      // 모든 지갑 정보 삽입
      for (let i = 0; i < allUserWallets.length; i++) {
        const wallet = allUserWallets[i]
        
        const walletData = {
          user_id: createdUser.id,
          wallet_address: wallet.address,
          wallet_provider: wallet.walletClientType || 'unknown',
          is_primary: i === 0, // 첫 번째 지갑을 primary로 설정
          created_at: new Date().toISOString()
        }

        const { data: walletResult, error: walletError } = await supabaseAdmin
          .from('user_wallets')
          .insert(walletData)
          .select()

        if (walletError) {
          console.error('Wallet sync error:', walletError)
        } else {
          walletSyncResults.push(walletResult[0])
        }
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        user: createdUser,
        syncedWallets: walletSyncResults,
        allUserWallets: allUserWallets, // 디버깅용
        message: `User synced successfully with ${walletSyncResults.length} wallets`
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Unexpected error in sync-user:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}