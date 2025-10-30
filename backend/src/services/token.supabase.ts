// Token Service - Supabase version
// Native token (HI) management with PostgreSQL

import Decimal from 'decimal.js';
import { supabase, type Database } from '../lib/supabase.js';

// System account IDs (fixed UUIDs)
export const SYSTEM_ACCOUNTS = {
  TREASURY: '00000000-0000-0000-0000-000000000001',
  BUYBACK_POOL: '00000000-0000-0000-0000-000000000002',
  STAKING_REWARDS: '00000000-0000-0000-0000-000000000003',
} as const;
import { AppError } from '../utils/httpError.js';
import type {
  TokenHolder,
  TokenTransaction,
  TokenMetrics,
} from '../types/token.js';

/**
 * Get or create token holder
 */
export async function getTokenHolder(userId: string): Promise<TokenHolder> {
  // Try to get existing holder
  const { data: holder, error } = await supabase
    .from('token_holders')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to fetch token holder: ${error.message}`
    });
  }
  
  // If not found, create new holder
  if (!holder) {
    // First ensure user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (!user) {
      // Create a placeholder user for system accounts (treasury, etc.)
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          privy_user_id: `system-${userId}`,
          wallet_address: `system-${userId}`,
        } as any);
      
      if (userError && userError.code !== '23505') { // Ignore duplicate
        throw new AppError(500, {
          code: 'BAD_REQUEST',
          message: `Failed to create system user: ${userError.message}`
        });
      }
    }
    
    // Create token holder
    const { data: newHolder, error: createError } = await supabase
      .from('token_holders')
      .insert({
        user_id: userId,
        balance: '0',
        locked: '0',
        staked: '0',
        rewards: '0',
      } as any)
      .select()
      .single();
    
    if (createError) {
      throw new AppError(500, {
        code: 'BAD_REQUEST',
        message: `Failed to create token holder: ${createError.message}`
      });
    }
    
    return {
    userId: (newHolder as any).user_id,
    balance: (newHolder as any).balance.toString(),
    locked: (newHolder as any).locked.toString(),
    staked: (newHolder as any).staked.toString(),
    rewards: (newHolder as any).rewards.toString(),
    investments: [],
    };
  }
  
  // Return existing holder
  return {
    userId: (holder as any).user_id,
    balance: (holder as any).balance.toString(),
    locked: (holder as any).locked.toString(),
    staked: (holder as any).staked.toString(),
    rewards: (holder as any).rewards.toString(),
    investments: [],
  };
}

/**
 * Get token balance
 */
export async function getBalance(userId: string): Promise<{
  available: string;
  locked: string;
  staked: string;
  rewards: string;
  total: string;
}> {
  const holder = await getTokenHolder(userId);
  
  const balanceDec = new Decimal(holder.balance);
  const lockedDec = new Decimal(holder.locked);
  const stakedDec = new Decimal(holder.staked);

  return {
    available: holder.balance,
    locked: holder.locked,
    staked: holder.staked,
    rewards: holder.rewards,
    total: balanceDec.plus(lockedDec).plus(stakedDec).toString(),
  };
}

/**
 * Mint tokens (admin only)
 */
export async function mintTokens(
  userId: string,
  amount: string,
  reason: string
): Promise<TokenTransaction> {
  const amountDec = new Decimal(amount);
  if (amountDec.lessThanOrEqualTo(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Amount must be greater than 0'
    });
  }
  
  // Get or create holder
  const holder = await getTokenHolder(userId);
  
  // Update balance (read-modify-write)
  const newBalance = new Decimal(holder.balance).plus(amountDec).toString();
  
  const { error: updateError } = await supabase
    .from('token_holders')
    // @ts-ignore - Supabase type inference limitation
    .update({
      balance: newBalance
    })
    .eq('user_id', userId);
  
  if (updateError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to mint tokens: ${updateError.message}`
    });
  }
  
  // Record transaction
  const { data: tx, error: txError } = await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      type: 'mint',
      amount: amount,
      to_user: userId,
      reason: reason,
    } as any)
    .select()
    .single();
  
  if (txError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to record transaction: ${txError.message}`
    });
  }
  
  return {
    id: (tx as any).id,
    userId: (tx as any).user_id,
    type: 'mint',
    amount: (tx as any).amount,
    to: (tx as any).to_user,
    reason: (tx as any).reason,
    timestamp: new Date((tx as any).created_at).getTime(),
  };
}

/**
 * Burn tokens
 */
export async function burnTokens(
  userId: string,
  amount: string,
  reason: string
): Promise<TokenTransaction> {
  const amountDec = new Decimal(amount);
  if (amountDec.lessThanOrEqualTo(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Amount must be greater than 0'
    });
  }
  
  const holder = await getTokenHolder(userId);
  const balanceDec = new Decimal(holder.balance);

  if (balanceDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: `Insufficient balance. Have: ${holder.balance}, Need: ${amount}`
    });
  }
  
  // Update balance (subtract)
  const newBalance = new Decimal(holder.balance).minus(amountDec).toString();
  const { data, error: updateError } = await supabase
    .from('token_holders')
    // @ts-ignore - Supabase type inference limitation
    .update({
      balance: newBalance
    })
    .eq('user_id', userId)
    .select();
  
  if (updateError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to burn tokens: ${updateError.message}`
    });
  }
  
  // Record transaction
  const { data: tx, error: txError } = await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      type: 'burn',
      amount: amount,
      from_user: userId,
      reason: reason,
    } as any)
    .select()
    .single();
  
  if (txError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to record transaction: ${txError.message}`
    });
  }
  
  return {
    id: (tx as any).id,
    userId: (tx as any).user_id,
    type: 'burn',
    amount: (tx as any).amount,
    from: (tx as any).from_user,
    reason: (tx as any).reason,
    timestamp: new Date((tx as any).created_at).getTime(),
  };
}

/**
 * Transfer tokens
 */
export async function transferTokens(
  fromUserId: string,
  toUserId: string,
  amount: string,
  reason: string = 'Transfer'
): Promise<TokenTransaction> {
  const amountDec = new Decimal(amount);
  if (amountDec.lessThanOrEqualTo(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Amount must be greater than 0'
    });
  }
  
  const fromHolder = await getTokenHolder(fromUserId);
  const fromBalanceDec = new Decimal(fromHolder.balance);

  if (fromBalanceDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: `Insufficient balance. Have: ${fromHolder.balance}, Need: ${amount}`
    });
  }
  
  // Ensure recipient exists
  const toHolder = await getTokenHolder(toUserId);
  
  // Subtract from sender
  const newFromBalance = new Decimal(fromHolder.balance).minus(amountDec).toString();
  const { error: fromError } = await supabase
    .from('token_holders')
    // @ts-ignore - Supabase type inference limitation
    .update({
      balance: newFromBalance
    })
    .eq('user_id', fromUserId);
  
  if (fromError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to deduct tokens: ${fromError.message}`
    });
  }
  
  // Add to recipient
  const newToBalance = new Decimal(toHolder.balance).plus(amountDec).toString();
  const { error: toError } = await supabase
    .from('token_holders')
    // @ts-ignore - Supabase type inference limitation
    .update({
      balance: newToBalance
    })
    .eq('user_id', toUserId);
  
  if (toError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to add tokens: ${toError.message}`
    });
  }
  
  // Record transaction
  const { data: tx, error: txError } = await supabase
    .from('token_transactions')
    .insert({
      user_id: fromUserId,
      type: 'transfer',
      amount: amount,
      from_user: fromUserId,
      to_user: toUserId,
      reason: reason,
    } as any)
    .select()
    .single();
  
  if (txError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to record transaction: ${txError.message}`
    });
  }
  
  return {
    id: (tx as any).id,
    userId: (tx as any).user_id,
    type: 'transfer',
    amount: (tx as any).amount,
    from: (tx as any).from_user,
    to: (tx as any).to_user,
    reason: (tx as any).reason,
    timestamp: new Date((tx as any).created_at).getTime(),
  };
}

/**
 * Lock tokens (for vesting)
 */
export async function lockTokens(userId: string, amount: string): Promise<void> {
  const amountDec = new Decimal(amount);
  const holder = await getTokenHolder(userId);
  const balanceDec = new Decimal(holder.balance);

  if (balanceDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: 'Insufficient available balance to lock'
    });
  }
  
  const newBalance = new Decimal(holder.balance).minus(amountDec).toString();
  const newLocked = new Decimal(holder.locked).plus(amountDec).toString();

  const { error } = await supabase
    .from('token_holders')
    // @ts-ignore - Supabase type inference limitation
    .update({
      balance: newBalance,
      locked: newLocked,
    })
    .eq('user_id', userId);
  
  if (error) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to lock tokens: ${error.message}`
    });
  }
}

/**
 * Unlock tokens (from vesting)
 */
export async function unlockTokens(userId: string, amount: string): Promise<void> {
  const amountDec = new Decimal(amount);
  const holder = await getTokenHolder(userId);
  const lockedDec = new Decimal(holder.locked);

  if (lockedDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: 'Insufficient locked balance to unlock'
    });
  }
  
  const newLocked = new Decimal(holder.locked).minus(amountDec).toString();
  const newBalance = new Decimal(holder.balance).plus(amountDec).toString();

  const { error } = await supabase
    .from('token_holders')
    // @ts-ignore - Supabase type inference limitation
    .update({
      locked: newLocked,
      balance: newBalance,
    })
    .eq('user_id', userId);
  
  if (error) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to unlock tokens: ${error.message}`
    });
  }
}

/**
 * Claim tokens (from vesting schedule)
 */
export async function claimTokens(
  userId: string,
  amount: string,
  source: string
): Promise<TokenTransaction> {
  await unlockTokens(userId, amount);
  
  const { data: tx, error: txError } = await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      type: 'claim',
      amount: amount,
      to_user: userId,
      reason: `Claimed from ${source}`,
    } as any)
    .select()
    .single();
  
  if (txError) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to record claim: ${txError.message}`
    });
  }
  
  return {
    id: (tx as any).id,
    userId: (tx as any).user_id,
    type: 'claim',
    amount: (tx as any).amount,
    to: (tx as any).to_user,
    reason: (tx as any).reason,
    timestamp: new Date((tx as any).created_at).getTime(),
  };
}

/**
 * Get token metrics
 */
export async function getTokenMetrics(): Promise<TokenMetrics> {
  // Calculate totals from all holders
  const { data: holders, error } = await supabase
    .from('token_holders')
    .select('balance, locked, staked');
  
  if (error) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to fetch metrics: ${error.message}`
    });
  }
  
  let circulatingSupply = new Decimal(0);
  let stakedAmount = new Decimal(0);

  (holders as any[])?.forEach((holder: any) => {
    circulatingSupply = circulatingSupply.plus(holder.balance).plus(holder.locked);
    stakedAmount = stakedAmount.plus(holder.staked);
  });
  
  // Get burned amount from burn transactions
  const { data: burnTxs } = await supabase
    .from('token_transactions')
    .select('amount')
    .eq('type', 'burn');
  
  const burnedAmount = (burnTxs as any[])?.reduce((sum: string, tx: any) => new Decimal(sum).plus(tx.amount).toString(), '0') || '0';
  
  // Constants
  const totalSupply = '1000000000'; // 1 billion HI
  const priceUsd = '0.05'; // Mock price
  
  // Get treasury balance
  const treasuryBalance = await getBalance(SYSTEM_ACCOUNTS.TREASURY);
  
  // Count unique holders
  const { count } = await supabase
    .from('token_holders')
    .select('user_id', { count: 'exact', head: true })
    .gt('balance', 0);
  
  return {
    totalSupply,
    circulatingSupply: circulatingSupply.toString(),
    burnedAmount,
    stakedAmount: stakedAmount.toString(),
    treasuryBalance: treasuryBalance.total,
    priceUsd,
    marketCap: circulatingSupply.times(priceUsd).toString(),
    holders: count || 0,
  };
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(
  userId?: string,
  limit: number = 50
): Promise<TokenTransaction[]> {
  let query = supabase
    .from('token_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},from_user.eq.${userId},to_user.eq.${userId}`);
  }
  
  const { data: txs, error } = await query;
  
  if (error) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to fetch transactions: ${error.message}`
    });
  }
  
  return (txs as any[]).map((tx: any) => ({
    id: tx.id,
    userId: tx.user_id,
    type: tx.type as any,
    amount: tx.amount,
    from: tx.from_user || undefined,
    to: tx.to_user || undefined,
    reason: tx.reason,
    timestamp: new Date(tx.created_at).getTime(),
  }));
}

/**
 * Get all token holders (for analytics)
 */
export async function getAllHolders(): Promise<TokenHolder[]> {
  const { data: holders, error } = await supabase
    .from('token_holders')
    .select('*')
    .gt('balance', 0);
  
  if (error) {
    throw new AppError(500, {
      code: 'BAD_REQUEST',
      message: `Failed to fetch holders: ${error.message}`
    });
  }
  
  return (holders as any[]).map((h: any) => ({
    userId: h.user_id,
    balance: h.balance,
    locked: h.locked,
    staked: h.staked,
    rewards: h.rewards,
    investments: [],
  }));
}

/**
 * Initialize treasury
 */
export async function initializeTreasury(amount: string): Promise<void> {
  const amountDec = new Decimal(amount);
  const treasuryBalance = await getBalance(SYSTEM_ACCOUNTS.TREASURY);
  
  const availableDec = new Decimal(treasuryBalance.available);
  if (availableDec.equals(0)) {
    await mintTokens(SYSTEM_ACCOUNTS.TREASURY, amount, 'Treasury initialization');
    console.log(`💰 Treasury initialized with ${amount.toLocaleString()} HI tokens`);
  }
}

/**
 * Get treasury balance
 */
export async function getTreasuryBalance(): Promise<string> {
  const balance = await getBalance(SYSTEM_ACCOUNTS.TREASURY);
  return balance.available;
}
