// lib/auth/user.ts
import { supabaseAdmin } from '@/lib/supabase/client'
import { User, UserInsert, UserUpdate, AuthUser } from '@/lib/supabase/types'

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('auth_type', 'email')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('Error fetching user by email:', error)
      return { user: null, error: 'Failed to fetch user' }
    }

    return { user: data }
  } catch (error) {
    console.error('Error in getUserByEmail:', error)
    return { user: null, error: 'Internal server error' }
  }
}

/**
 * Get user by wallet address
 */
export async function getUserByWalletAddress(walletAddress: string): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('auth_type', 'wallet')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by wallet:', error)
      return { user: null, error: 'Failed to fetch user' }
    }

    return { user: data }
  } catch (error) {
    console.error('Error in getUserByWalletAddress:', error)
    return { user: null, error: 'Internal server error' }
  }
}

/**
 * Get user by Privy User ID
 */
export async function getUserByPrivyId(privyUserId: string): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('privy_user_id', privyUserId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by Privy ID:', error)
      return { user: null, error: 'Failed to fetch user' }
    }

    return { user: data }
  } catch (error) {
    console.error('Error in getUserByPrivyId:', error)
    return { user: null, error: 'Internal server error' }
  }
}

/**
 * Create new email user
 */
export async function createEmailUser(email: string, privyUserId?: string): Promise<{ user: User | null; error?: string }> {
  try {
    const newUser: UserInsert = {
      auth_type: 'email',
      email,
      email_verified: false,
      privy_user_id: privyUserId,
      is_active: true
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (error) {
      console.error('Error creating email user:', error)
      return { user: null, error: 'Failed to create user' }
    }

    return { user: data }
  } catch (error) {
    console.error('Error in createEmailUser:', error)
    return { user: null, error: 'Internal server error' }
  }
}

/**
 * Create new wallet user
 */
export async function createWalletUser(
  walletAddress: string,
  walletType: string,
  privyUserId?: string
): Promise<{ user: User | null; error?: string }> {
  try {
    const newUser: UserInsert = {
      auth_type: 'wallet',
      wallet_address: walletAddress,
      wallet_type: walletType,
      privy_user_id: privyUserId,
      is_active: true
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (error) {
      console.error('Error creating wallet user:', error)
      return { user: null, error: 'Failed to create user' }
    }

    return { user: data }
  } catch (error) {
    console.error('Error in createWalletUser:', error)
    return { user: null, error: 'Internal server error' }
  }
}

/**
 * Update user information
 */
export async function updateUser(userId: string, updates: UserUpdate): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return { user: null, error: 'Failed to update user' }
    }

    return { user: data }
  } catch (error) {
    console.error('Error in updateUser:', error)
    return { user: null, error: 'Internal server error' }
  }
}

/**
 * Mark email as verified
 */
export async function markEmailAsVerified(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        last_login: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error marking email as verified:', error)
      return { success: false, error: 'Failed to verify email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in markEmailAsVerified:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating last login:', error)
      return { success: false, error: 'Failed to update last login' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateLastLogin:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Convert User object to AuthUser
 */
export function userToAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    authType: user.auth_type,
    email: user.email || undefined,
    walletAddress: user.wallet_address || undefined,
    privyUserId: user.privy_user_id || undefined,
    emailVerified: user.email_verified,
    isActive: user.is_active
  }
}
