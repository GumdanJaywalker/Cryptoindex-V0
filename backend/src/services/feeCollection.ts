// Fee Collection and Buyback Service

import Decimal from 'decimal.js';
import { AppError } from '../utils/httpError.js';
import type {
  FeeCollectionConfig,
  BuybackConfig,
  DEFAULT_FEE_CONFIG,
  DEFAULT_BUYBACK_CONFIG,
} from '../types/token.js';
import {
  getTokenHolder,
  transferTokens,
  burnTokens,
  getTreasuryBalance,
  SYSTEM_ACCOUNTS,
} from './token.supabase.js';

// Configuration (in production, store in database)
let feeConfig: FeeCollectionConfig = {
  swapFeePercent: '0.003',
  rebalancingFeePercent: '0.005',
  l1ManagementFee: '0.007',
  l2ManagementFee: '0.01',
  l3ManagementFee: '0.02',
  l3PerformanceFee: '0.2',
  treasuryShare: '0.4',
  buybackShare: '0.3',
  stakingRewardShare: '0.3',
};

let buybackConfig: BuybackConfig = {
  enabled: true,
  minTreasuryBalance: '10000',
  buybackPercentPerWeek: '0.1',
  priceThreshold: '0.04',
  burnPercentage: '0.5',
};

// Fee collection stats
interface FeeStats {
  totalCollected: string;
  toTreasury: string;
  toBuyback: string;
  toStaking: string;
  lastCollection: number;
}

const feeStats: FeeStats = {
  totalCollected: '0',
  toTreasury: '0',
  toBuyback: '0',
  toStaking: '0',
  lastCollection: Date.now(),
};

// Buyback stats
interface BuybackStats {
  totalBuyback: string;
  totalBurned: string;
  totalLP: string;
  lastBuyback: number;
  buybackCount: number;
}

const buybackStats: BuybackStats = {
  totalBuyback: '0',
  totalBurned: '0',
  totalLP: '0',
  lastBuyback: Date.now(),
  buybackCount: 0,
};

/**
 * Collect fee in native token
 */
export async function collectFee(
  fromUserId: string,
  feeAmount: string,
  reason: string
): Promise<void> {
  const feeAmountDec = new Decimal(feeAmount);
  if (feeAmountDec.lessThanOrEqualTo(0)) return;

  // Transfer fee from user to treasury
  await transferTokens(fromUserId, SYSTEM_ACCOUNTS.TREASURY, feeAmount, reason);

  // Distribute fee using Decimal.js
  const toTreasury = feeAmountDec.times(feeConfig.treasuryShare);
  const toBuyback = feeAmountDec.times(feeConfig.buybackShare);
  const toStaking = feeAmountDec.times(feeConfig.stakingRewardShare);

  // Move buyback portion to buyback pool
  if (toBuyback.greaterThan(0)) {
    await transferTokens(SYSTEM_ACCOUNTS.TREASURY, SYSTEM_ACCOUNTS.BUYBACK_POOL, toBuyback.toString(), 'Fee allocation for buyback');
  }

  // Move staking portion to staking rewards pool
  if (toStaking.greaterThan(0)) {
    await transferTokens(SYSTEM_ACCOUNTS.TREASURY, SYSTEM_ACCOUNTS.STAKING_REWARDS, toStaking.toString(), 'Fee allocation for staking rewards');
  }

  // Update stats using Decimal.js
  feeStats.totalCollected = new Decimal(feeStats.totalCollected).plus(feeAmount).toString();
  feeStats.toTreasury = new Decimal(feeStats.toTreasury).plus(toTreasury).toString();
  feeStats.toBuyback = new Decimal(feeStats.toBuyback).plus(toBuyback).toString();
  feeStats.toStaking = new Decimal(feeStats.toStaking).plus(toStaking).toString();
  feeStats.lastCollection = Date.now();
}

/**
 * Calculate swap fee in native token
 */
export function calculateSwapFee(swapValueUsd: string): string {
  // Fee is calculated in native token
  // Mock: 1 HI = $0.05
  const tokenPrice = new Decimal('0.05');
  const swapValueDec = new Decimal(swapValueUsd);
  const feeUsd = swapValueDec.times(feeConfig.swapFeePercent);
  return feeUsd.dividedBy(tokenPrice).toString();
}

/**
 * Calculate rebalancing fee
 */
export function calculateRebalancingFee(rebalanceValueUsd: string): string {
  const tokenPrice = new Decimal('0.05');
  const rebalanceValueDec = new Decimal(rebalanceValueUsd);
  const feeUsd = rebalanceValueDec.times(feeConfig.rebalancingFeePercent);
  return feeUsd.dividedBy(tokenPrice).toString();
}

/**
 * Calculate annual management fee
 */
export function calculateManagementFee(
  indexLayer: 'L1' | 'L2' | 'L3',
  indexTvlUsd: string,
  durationDays: number
): string {
  let annualFeeRate: string;

  switch (indexLayer) {
    case 'L1':
      annualFeeRate = feeConfig.l1ManagementFee;
      break;
    case 'L2':
      annualFeeRate = feeConfig.l2ManagementFee;
      break;
    case 'L3':
      annualFeeRate = feeConfig.l3ManagementFee;
      break;
  }

  const tokenPrice = new Decimal('0.05');
  const indexTvlDec = new Decimal(indexTvlUsd);
  const dailyFeeRate = new Decimal(annualFeeRate).dividedBy(365);
  const feeUsd = indexTvlDec.times(dailyFeeRate).times(durationDays);

  return feeUsd.dividedBy(tokenPrice).toString();
}

/**
 * Calculate performance fee (L3 only)
 */
export function calculatePerformanceFee(profitUsd: string): string {
  const profitDec = new Decimal(profitUsd);
  if (profitDec.lessThanOrEqualTo(0)) return '0';

  const tokenPrice = new Decimal('0.05');
  const feeUsd = profitDec.times(feeConfig.l3PerformanceFee);

  return feeUsd.dividedBy(tokenPrice).toString();
}

/**
 * Execute buyback (called periodically)
 */
export async function executeBuyback(): Promise<{
  success: boolean;
  amountBuyback: string;
  amountBurned: string;
  amountLP: string;
  reason?: string;
}> {
  if (!buybackConfig.enabled) {
    return {
      success: false,
      amountBuyback: '0',
      amountBurned: '0',
      amountLP: '0',
      reason: 'Buyback is disabled',
    };
  }

  const buybackPool = await getTokenHolder(SYSTEM_ACCOUNTS.BUYBACK_POOL);
  const buybackBalance = new Decimal(buybackPool.balance);
  const minBalance = new Decimal(buybackConfig.minTreasuryBalance);

  // Check minimum balance
  if (buybackBalance.lessThan(minBalance)) {
    return {
      success: false,
      amountBuyback: '0',
      amountBurned: '0',
      amountLP: '0',
      reason: `Buyback pool balance (${buybackBalance.toString()}) below minimum (${buybackConfig.minTreasuryBalance})`,
    };
  }

  // Check price threshold (mock)
  const currentPrice = new Decimal('0.05'); // Mock price
  const priceThreshold = new Decimal(buybackConfig.priceThreshold);
  if (currentPrice.greaterThanOrEqualTo(priceThreshold)) {
    return {
      success: false,
      amountBuyback: '0',
      amountBurned: '0',
      amountLP: '0',
      reason: `Current price ($${currentPrice.toString()}) above threshold ($${buybackConfig.priceThreshold})`,
    };
  }

  // Calculate buyback amount using Decimal.js
  const buybackAmount = buybackBalance.times(buybackConfig.buybackPercentPerWeek);

  // Calculate burn vs LP allocation
  const burnAmount = buybackAmount.times(buybackConfig.burnPercentage);
  const lpAmount = buybackAmount.minus(burnAmount);

  // Execute burn
  if (burnAmount.greaterThan(0)) {
    await burnTokens(SYSTEM_ACCOUNTS.BUYBACK_POOL, burnAmount.toString(), 'Buyback burn');
  }

  // Add to LP (mock - in production, add to liquidity pool)
  if (lpAmount.greaterThan(0)) {
    // TODO: liquidity-pool needs a UUID too
    // transferTokens(SYSTEM_ACCOUNTS.BUYBACK_POOL, 'liquidity-pool', lpAmount.toString(), 'Buyback LP provision');
  }

  // Update stats using Decimal.js
  buybackStats.totalBuyback = new Decimal(buybackStats.totalBuyback).plus(buybackAmount).toString();
  buybackStats.totalBurned = new Decimal(buybackStats.totalBurned).plus(burnAmount).toString();
  buybackStats.totalLP = new Decimal(buybackStats.totalLP).plus(lpAmount).toString();
  buybackStats.lastBuyback = Date.now();
  buybackStats.buybackCount += 1;

  return {
    success: true,
    amountBuyback: buybackAmount.toString(),
    amountBurned: burnAmount.toString(),
    amountLP: lpAmount.toString(),
  };
}

/**
 * Get fee collection stats
 */
export function getFeeStats(): FeeStats {
  return { ...feeStats };
}

/**
 * Get buyback stats
 */
export function getBuybackStats(): BuybackStats {
  return { ...buybackStats };
}

/**
 * Get fee configuration
 */
export function getFeeConfig(): FeeCollectionConfig {
  return { ...feeConfig };
}

/**
 * Update fee configuration (admin only)
 */
export function updateFeeConfig(newConfig: Partial<FeeCollectionConfig>): void {
  feeConfig = { ...feeConfig, ...newConfig };
}

/**
 * Get buyback configuration
 */
export function getBuybackConfig(): BuybackConfig {
  return { ...buybackConfig };
}

/**
 * Update buyback configuration (admin only)
 */
export function updateBuybackConfig(newConfig: Partial<BuybackConfig>): void {
  buybackConfig = { ...buybackConfig, ...newConfig };
}

/**
 * Simulate buyback schedule
 */
export async function simulateBuybackSchedule(weeks: number = 12): Promise<Array<{
  week: number;
  buybackAmount: string;
  burnAmount: string;
  lpAmount: string;
  poolBalance: string;
}>> {
  const schedule: Array<{
    week: number;
    buybackAmount: string;
    burnAmount: string;
    lpAmount: string;
    poolBalance: string;
  }> = [];

  let poolBalance = new Decimal((await getTokenHolder(SYSTEM_ACCOUNTS.BUYBACK_POOL)).balance);
  const minBalance = new Decimal(buybackConfig.minTreasuryBalance);
  const weeklyPercent = new Decimal(buybackConfig.buybackPercentPerWeek);
  const burnPercent = new Decimal(buybackConfig.burnPercentage);

  for (let week = 1; week <= weeks; week++) {
    if (poolBalance.lessThan(minBalance)) break;

    const buybackAmount = poolBalance.times(weeklyPercent);
    const burnAmount = buybackAmount.times(burnPercent);
    const lpAmount = buybackAmount.minus(burnAmount);

    poolBalance = poolBalance.minus(buybackAmount);

    schedule.push({
      week,
      buybackAmount: buybackAmount.toString(),
      burnAmount: burnAmount.toString(),
      lpAmount: lpAmount.toString(),
      poolBalance: poolBalance.toString(),
    });
  }

  return schedule;
}