import { NextRequest, NextResponse } from 'next/server'
import { requirePrivyAuth } from '@/lib/middleware/privy-auth'
import { supabaseAdmin } from '@/lib/supabase/client'

// Chain ID to network name mapping
const CHAIN_ID_TO_NETWORK: { [key: number]: string } = {
  1: 'ethereum',
  42161: 'arbitrum',
  137: 'polygon',
  8453: 'base',
  10: 'optimism',
  // Solana has no chain ID, so handle separately
}

// Helper function to get network name from chain info
function getNetworkName(chainType: string, chainId?: number): string {
  // For Solana
  if (chainType === 'solana') {
    return 'solana';
  }

  // Map to chain ID for EVM chains
  if (chainId && CHAIN_ID_TO_NETWORK[chainId]) {
    return CHAIN_ID_TO_NETWORK[chainId];
  }

  // Use chainType as is if available
  if (chainType) {
    return chainType.toLowerCase();
  }

  // Default value
  return 'ethereum';
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 sync-user API called');

    // Verify authentication
    const authResult = await requirePrivyAuth(request)
    if (authResult instanceof NextResponse) {
      console.log('❌ Authentication failed');
      return authResult
    }

    const { user } = authResult
    console.log('✅ Authentication successful for user:', user?.id);

    // Get Privy user data from request body
    const body = await request.json()
    const { privyUser } = body
    console.log('📥 Received privyUser:', privyUser?.id);

    if (!privyUser || !privyUser.id) {
      return NextResponse.json(
        { success: false, error: 'Missing Privy user data' },
        { status: 400 }
      )
    }

    // Improve auth_type determination logic
    // Email user if email exists, otherwise wallet user
    const isEmailUser = !!(privyUser.email?.address);
    const authType = isEmailUser ? 'email' : 'wallet';

    console.log('🔍 Auth type detection:', {
      hasEmail: !!privyUser.email?.address,
      hasPrimaryWallet: !!privyUser.wallet?.address,
      linkedAccountsCount: privyUser.linkedAccounts?.length || 0,
      detectedAuthType: authType
    });

    // Convert Privy user data to Supabase format (cleaned fields)
    const userData = {
      privy_user_id: privyUser.id,
      auth_type: authType,
      email: privyUser.email?.address || null,
      // Remove email_verified, wallet_address, wallet_type fields
      last_login: new Date().toISOString(),
      is_active: true,
    }


    // Create/Update user with Admin privileges (Bypass RLS)
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

    // Sync all wallet info to user_wallets table
    const walletSyncResults = []

    // Collect all wallet info from linkedAccounts (Safe method)
    interface WalletData {
      address: string
      chainType: string
      chainId: string | number
      networkName: string
      walletClientType: string
      walletType: string
      source: string
      privyWalletId: string | null
    }
    const allUserWallets: WalletData[] = []

    console.log(`🔍 DEBUGGING linkedAccounts for user ${privyUser.id}:`);
    console.log(`linkedAccounts exists: ${!!privyUser.linkedAccounts}`);
    console.log(`linkedAccounts length: ${privyUser.linkedAccounts?.length || 0}`);
    console.log(`linkedAccounts raw data:`, JSON.stringify(privyUser.linkedAccounts, null, 2));

    if (privyUser.linkedAccounts && privyUser.linkedAccounts.length > 0) {
      privyUser.linkedAccounts.forEach((account: any, index: number) => {
        console.log(`Account ${index}:`, {
          type: account.type,
          address: account.address,
          chainType: account.chainType,
          chainId: account.chainId,
          walletClientType: account.walletClientType,
          connectorType: account.connectorType,
          id: account.id,
          hasAllRequiredFields: !!(account.address && account.chainType && account.walletClientType)
        });

        if (account.type === 'wallet') {
          // Check required fields
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

          // Use accurate network detection
          const networkName = getNetworkName(account.chainType, account.chainId);

          allUserWallets.push({
            address: account.address,
            chainType: account.chainType,
            chainId: account.chainId,
            networkName: networkName,
            walletClientType: account.walletClientType,
            walletType: account.connectorType === 'embedded' ? 'embedded' : 'external',
            source: 'linkedAccounts',
            privyWalletId: account.id || null // ID exists for embedded wallets
          })
        }
      })

      console.log(`✅ Found ${allUserWallets.length} valid wallets for user ${privyUser.id}:`);
      allUserWallets.forEach((wallet, index) => {
        console.log(`  ${index + 1}. ${wallet.walletType} ${wallet.networkName} ${wallet.walletClientType}: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`);
        console.log(`     - Chain Type: ${wallet.chainType}`);
        console.log(`     - Chain ID: ${wallet.chainId || 'N/A'}`);
        console.log(`     - Network: ${wallet.networkName}`);
        console.log(`     - Type: ${wallet.walletType}`);
        console.log(`     - Provider: ${wallet.walletClientType}`);
        console.log(`     - Privy ID: ${wallet.privyWalletId || 'N/A'}`);
      });
    } else {
      console.log(`⚠️ No linkedAccounts found for user ${privyUser.id}`);
    }

    if (allUserWallets.length > 0) {
      // Delete existing wallets (Completely replace with new wallet info)
      await supabaseAdmin
        .from('user_wallets')
        .delete()
        .eq('user_id', createdUser.id)

      // Insert all wallet info
      for (let i = 0; i < allUserWallets.length; i++) {
        const wallet = allUserWallets[i]

        const walletData = {
          user_id: createdUser.id,
          wallet_address: wallet.address,
          wallet_provider: wallet.walletClientType || 'unknown',
          network: wallet.networkName || 'ethereum', // Use improved network detection
          wallet_type: wallet.walletType || 'external', // external or embedded
          privy_wallet_id: wallet.privyWalletId || null, // Privy ID for embedded wallets
          is_primary: i === 0, // Set first wallet as primary
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
        allUserWallets: allUserWallets, // For debugging
        message: `User synced successfully with ${walletSyncResults.length} wallets`
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('❌ Unexpected error in sync-user:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}