// Token Service - Native token management

import Decimal from 'decimal.js';
import { AppError } from '../utils/httpError.js';
import type {
  TokenHolder,
  TokenTransaction,
  TokenMetrics,
  NATIVE_TOKEN,
} from '../types/token.js';

// Mock database (in production, use Supabase)
const tokenHolders = new Map<string, TokenHolder>();
const tokenTransactions: TokenTransaction[] = [];

let totalSupply = '1000000000'; // 1 billion HI
let burnedAmount = '0';
let circulatingSupply = '0';

/**
 * Get or create token holder
 */
export function getTokenHolder(userId: string): TokenHolder {
  let holder = tokenHolders.get(userId);

  if (!holder) {
    holder = {
      userId,
      balance: '0',
      locked: '0',
      staked: '0',
      rewards: '0',
      investments: [],
    };
    tokenHolders.set(userId, holder);
  }

  return holder;
}

/**
 * Get token balance
 */
export function getBalance(userId: string): {
  available: string;
  locked: string;
  staked: string;
  rewards: string;
  total: string;
} {
  const holder = getTokenHolder(userId);
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
export function mintTokens(
  userId: string,
  amount: string,
  reason: string
): TokenTransaction {
  const amountDec = new Decimal(amount);
  if (amountDec.lessThanOrEqualTo(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Amount must be greater than 0'
    });
  }

  const holder = getTokenHolder(userId);
  holder.balance = new Decimal(holder.balance).plus(amountDec).toString();
  circulatingSupply = new Decimal(circulatingSupply).plus(amountDec).toString();

  const tx: TokenTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'mint',
    amount,
    to: userId,
    reason,
    timestamp: Date.now(),
  };

  tokenTransactions.push(tx);

  return tx;
}

/**
 * Burn tokens
 */
export function burnTokens(
  userId: string,
  amount: string,
  reason: string
): TokenTransaction {
  const amountDec = new Decimal(amount);
  if (amountDec.lessThanOrEqualTo(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Amount must be greater than 0'
    });
  }

  const holder = getTokenHolder(userId);
  const balanceDec = new Decimal(holder.balance);

  if (balanceDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: `Insufficient balance. Have: ${holder.balance}, Need: ${amount}`
    });
  }

  holder.balance = balanceDec.minus(amountDec).toString();
  burnedAmount = new Decimal(burnedAmount).plus(amountDec).toString();
  circulatingSupply = new Decimal(circulatingSupply).minus(amountDec).toString();

  const tx: TokenTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'burn',
    amount,
    from: userId,
    reason,
    timestamp: Date.now(),
  };

  tokenTransactions.push(tx);

  return tx;
}

/**
 * Transfer tokens
 */
export function transferTokens(
  fromUserId: string,
  toUserId: string,
  amount: string,
  reason: string = 'Transfer'
): TokenTransaction {
  const amountDec = new Decimal(amount);
  if (amountDec.lessThanOrEqualTo(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Amount must be greater than 0'
    });
  }

  const fromHolder = getTokenHolder(fromUserId);
  const fromBalanceDec = new Decimal(fromHolder.balance);

  if (fromBalanceDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: `Insufficient balance. Have: ${fromHolder.balance}, Need: ${amount}`
    });
  }

  const toHolder = getTokenHolder(toUserId);

  fromHolder.balance = fromBalanceDec.minus(amountDec).toString();
  toHolder.balance = new Decimal(toHolder.balance).plus(amountDec).toString();

  const tx: TokenTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: fromUserId,
    type: 'transfer',
    amount,
    from: fromUserId,
    to: toUserId,
    reason,
    timestamp: Date.now(),
  };

  tokenTransactions.push(tx);

  return tx;
}

/**
 * Lock tokens (for vesting)
 */
export function lockTokens(userId: string, amount: string): void {
  const holder = getTokenHolder(userId);
  const amountDec = new Decimal(amount);
  const balanceDec = new Decimal(holder.balance);

  if (balanceDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: 'Insufficient available balance to lock'
    });
  }

  holder.balance = balanceDec.minus(amountDec).toString();
  holder.locked = new Decimal(holder.locked).plus(amountDec).toString();
}

/**
 * Unlock tokens (from vesting)
 */
export function unlockTokens(userId: string, amount: string): void {
  const holder = getTokenHolder(userId);
  const amountDec = new Decimal(amount);
  const lockedDec = new Decimal(holder.locked);

  if (lockedDec.lessThan(amountDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_FUNDS',
      message: 'Insufficient locked balance to unlock'
    });
  }

  holder.locked = lockedDec.minus(amountDec).toString();
  holder.balance = new Decimal(holder.balance).plus(amountDec).toString();
}

/**
 * Claim tokens (from vesting schedule)
 */
export function claimTokens(
  userId: string,
  amount: string,
  source: string
): TokenTransaction {
  unlockTokens(userId, amount);

  const tx: TokenTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'claim',
    amount,
    to: userId,
    reason: `Claimed from ${source}`,
    timestamp: Date.now(),
  };

  tokenTransactions.push(tx);

  return tx;
}

/**
 * Get token metrics
 */
export function getTokenMetrics(): TokenMetrics {
  const stakedAmount = Array.from(tokenHolders.values()).reduce(
    (sum, holder) => new Decimal(sum).plus(holder.staked).toString(),
    '0'
  );

  // Mock price - in production, get from oracle
  const priceUsd = '0.05';
  const circulatingSupplyDec = new Decimal(circulatingSupply);
  const priceUsdDec = new Decimal(priceUsd);

  return {
    totalSupply,
    circulatingSupply,
    burnedAmount,
    stakedAmount,
    treasuryBalance: getBalance('treasury').total,
    priceUsd,
    marketCap: circulatingSupplyDec.times(priceUsdDec).toString(),
    holders: tokenHolders.size,
  };
}

/**
 * Get transaction history
 */
export function getTransactionHistory(
  userId?: string,
  limit: number = 50
): TokenTransaction[] {
  let txs = tokenTransactions;

  if (userId) {
    txs = txs.filter(
      tx => tx.userId === userId || tx.from === userId || tx.to === userId
    );
  }

  return txs
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Get all token holders (for analytics)
 */
export function getAllHolders(): TokenHolder[] {
  return Array.from(tokenHolders.values());
}

/**
 * Initialize treasury
 */
export function initializeTreasury(amount: string): void {
  const treasury = getTokenHolder('treasury');
  const amountDec = new Decimal(amount);

  if (new Decimal(treasury.balance).equals(0)) {
    treasury.balance = amount;
    circulatingSupply = new Decimal(circulatingSupply).plus(amountDec).toString();

    console.log(`💰 Treasury initialized with ${amountDec.toNumber().toLocaleString()} HI tokens`);
  }
}

/**
 * Get treasury balance
 */
export function getTreasuryBalance(): string {
  return getBalance('treasury').available;
}