/**
 * Fee Calculation Utilities for HyperIndex
 *
 * Based on FEE_STRUCTURE_SPECIFICATION.md
 * Implements VIP-tiered fee system with layer-specific rates
 */

import {
  VIPTier,
  LayerType,
  VIP_PROTOCOL_FEES,
  BLENDED_PROTOCOL_FEE,
  LAYER_FEES,
  LAUNCHER_FEE_USD,
  INVITED_USER_DISCOUNT,
} from '@/lib/constants/fees'

/**
 * Fee Breakdown Interface
 */
export interface FeeBreakdown {
  protocolFee: number
  creatorFee: number
  lpFee: number
  totalFee: number
  totalFeeRate: number
}

/**
 * Trading Fee Range Interface
 */
export interface TradingFeeRange {
  min: number
  max: number
  minRate: number
  maxRate: number
  components: {
    protocolMin: number
    protocolMax: number
    creator: number
    lp: number
  }
}

/**
 * VIP Tier Display Info
 */
export interface VIPTierInfo {
  tier: VIPTier
  name: string
  protocolRate: number
  discount: number
  savings: number
}

/**
 * Get protocol fee rate for a specific VIP tier
 */
export function getProtocolFeeRate(vipTier: VIPTier): number {
  return VIP_PROTOCOL_FEES[vipTier]
}

/**
 * Get VIP tier display information
 */
export function getVIPTierDisplay(tier: VIPTier): VIPTierInfo {
  const rate = VIP_PROTOCOL_FEES[tier]
  const baseRate = VIP_PROTOCOL_FEES.VIP0
  const discount = (baseRate - rate) / baseRate
  const savings = baseRate - rate

  return {
    tier,
    name: tier,
    protocolRate: rate,
    discount,
    savings,
  }
}

/**
 * Get trading fee range for a layer (min = VIP4, max = VIP0)
 * Returns both absolute amounts and rates
 */
export function getTradingFeeRange(layer: LayerType, amount: number = 1000): TradingFeeRange {
  if (layer === 'PARTNER') {
    const protocolFee = amount * LAYER_FEES.PARTNER.PROTOCOL_FEE
    return {
      min: protocolFee,
      max: protocolFee,
      minRate: LAYER_FEES.PARTNER.PROTOCOL_FEE,
      maxRate: LAYER_FEES.PARTNER.PROTOCOL_FEE,
      components: {
        protocolMin: LAYER_FEES.PARTNER.PROTOCOL_FEE,
        protocolMax: LAYER_FEES.PARTNER.PROTOCOL_FEE,
        creator: 0,
        lp: 0,
      },
    }
  }

  if (layer === 'GRADUATED') {
    const minRate = LAYER_FEES.GRADUATED.PROTOCOL_FEE_MIN + LAYER_FEES.GRADUATED.CREATOR_FEE_MIN + LAYER_FEES.GRADUATED.LP_FEE_MIN
    const maxRate = LAYER_FEES.GRADUATED.PROTOCOL_FEE_MAX + LAYER_FEES.GRADUATED.CREATOR_FEE_MAX + LAYER_FEES.GRADUATED.LP_FEE_MAX

    return {
      min: amount * minRate,
      max: amount * maxRate,
      minRate,
      maxRate,
      components: {
        protocolMin: LAYER_FEES.GRADUATED.PROTOCOL_FEE_MIN,
        protocolMax: LAYER_FEES.GRADUATED.PROTOCOL_FEE_MAX,
        creator: LAYER_FEES.GRADUATED.CREATOR_FEE_MAX, // Show max for display
        lp: LAYER_FEES.GRADUATED.LP_FEE_MAX,
      },
    }
  }

  const layerConfig = LAYER_FEES[layer]
  const creatorFee = layerConfig.CREATOR_FEE || 0
  const lpFee = layerConfig.LP_FEE || 0

  const minRate = layerConfig.PROTOCOL_FEE_MIN + creatorFee + lpFee
  const maxRate = layerConfig.PROTOCOL_FEE_MAX + creatorFee + lpFee

  return {
    min: amount * minRate,
    max: amount * maxRate,
    minRate,
    maxRate,
    components: {
      protocolMin: layerConfig.PROTOCOL_FEE_MIN,
      protocolMax: layerConfig.PROTOCOL_FEE_MAX,
      creator: creatorFee,
      lp: lpFee,
    },
  }
}

/**
 * Calculate trading fee with detailed breakdown
 *
 * @param amount - Trade amount in USD
 * @param vipTier - User's VIP tier
 * @param layer - Index layer type
 * @param isInvited - Whether user was invited (gets 10% discount)
 */
export function calculateTradingFee(
  amount: number,
  vipTier: VIPTier,
  layer: LayerType,
  isInvited: boolean = false
): FeeBreakdown {
  // Special handling for PARTNER layer
  if (layer === 'PARTNER') {
    const protocolFee = amount * LAYER_FEES.PARTNER.PROTOCOL_FEE
    const totalFee = isInvited ? protocolFee * (1 - INVITED_USER_DISCOUNT) : protocolFee

    return {
      protocolFee: isInvited ? protocolFee * (1 - INVITED_USER_DISCOUNT) : protocolFee,
      creatorFee: 0,
      lpFee: 0,
      totalFee,
      totalFeeRate: totalFee / amount,
    }
  }

  // Get layer-specific fees
  const layerConfig = layer === 'GRADUATED'
    ? {
        PROTOCOL_FEE_MIN: LAYER_FEES.GRADUATED.PROTOCOL_FEE_MIN,
        PROTOCOL_FEE_MAX: LAYER_FEES.GRADUATED.PROTOCOL_FEE_MAX,
        CREATOR_FEE: LAYER_FEES.GRADUATED.CREATOR_FEE_MAX,
        LP_FEE: LAYER_FEES.GRADUATED.LP_FEE_MAX,
      }
    : LAYER_FEES[layer]

  // Calculate component fees
  const protocolFeeRate = getProtocolFeeRate(vipTier)
  const protocolFee = amount * protocolFeeRate
  const creatorFee = amount * (layerConfig.CREATOR_FEE || 0)
  const lpFee = amount * (layerConfig.LP_FEE || 0)

  // Calculate total with invited user discount if applicable
  let totalFee = protocolFee + creatorFee + lpFee
  if (isInvited) {
    totalFee = totalFee * (1 - INVITED_USER_DISCOUNT)
  }

  return {
    protocolFee: isInvited ? protocolFee * (1 - INVITED_USER_DISCOUNT) : protocolFee,
    creatorFee: isInvited ? creatorFee * (1 - INVITED_USER_DISCOUNT) : creatorFee,
    lpFee: isInvited ? lpFee * (1 - INVITED_USER_DISCOUNT) : lpFee,
    totalFee,
    totalFeeRate: totalFee / amount,
  }
}

/**
 * Calculate rebalancing fee for a layer
 *
 * @param aum - Assets Under Management
 * @param layer - Index layer type
 * @param frequency - Custom rebalancing frequency (optional)
 */
export function calculateRebalancingFee(
  aum: number,
  layer: 'L1' | 'L2' | 'VS' | 'PARTNER',
  frequency?: number
): number {
  const config = LAYER_FEES[layer]
  const rate = config.REBALANCING_RATE || 0
  const freq = frequency || config.REBALANCING_FREQUENCY || 0

  return aum * rate * freq
}

/**
 * Calculate annual management fee for a layer
 *
 * @param aum - Assets Under Management
 * @param layer - Index layer type
 */
export function calculateManagementFee(
  aum: number,
  layer: 'L1' | 'L2' | 'L3' | 'VS' | 'PARTNER'
): number {
  const config = LAYER_FEES[layer]
  return aum * config.MANAGEMENT_YEARLY
}

/**
 * Format fee rate as percentage string
 *
 * @param rate - Fee rate (e.g., 0.0045 for 0.45%)
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatFeeRate(rate: number, decimals: number = 2): string {
  return `${(rate * 100).toFixed(decimals)}%`
}

/**
 * Format fee range as string (e.g., "0.7%-1.0%")
 *
 * @param minRate - Minimum fee rate
 * @param maxRate - Maximum fee rate
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatFeeRangeString(minRate: number, maxRate: number, decimals: number = 1): string {
  return `${(minRate * 100).toFixed(decimals)}%-${(maxRate * 100).toFixed(decimals)}%`
}

/**
 * Get launcher fee (fixed $5)
 */
export function getLauncherFee(): number {
  return LAUNCHER_FEE_USD
}

/**
 * Get blended protocol fee rate (weighted average across VIP tiers)
 */
export function getBlendedProtocolFee(): number {
  return BLENDED_PROTOCOL_FEE
}
