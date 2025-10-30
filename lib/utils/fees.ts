/**
 * Fee Calculation Utilities for HyperIndex
 *
 * Provides calculation functions for VIP-tiered and Layer-specific fees
 * Based on Business Documentation (Slides 26-28)
 */

import {
  VIPTier,
  LayerType,
  VIP_PROTOCOL_FEES,
  LAYER_FEES,
  LAUNCHER_FEE_USD,
  INVITED_USER_DISCOUNT,
  getProtocolFeeRate,
} from '@/lib/constants/fees'

/**
 * Fee Breakdown Interface
 * Detailed breakdown of all fee components
 */
export interface FeeBreakdown {
  protocolFee: number      // Protocol fee (VIP-tiered)
  creatorFee: number       // Creator fee (layer-specific)
  lpFee: number            // LP fee (layer-specific)
  totalFee: number         // Sum of all fees
  protocolFeeRate: number  // Protocol fee rate (percentage)
  creatorFeeRate: number   // Creator fee rate (percentage)
  lpFeeRate: number        // LP fee rate (percentage)
  totalFeeRate: number     // Total fee rate (percentage)
}

/**
 * Trading Fee Calculation Result
 */
export interface TradingFeeResult {
  baseFee: FeeBreakdown           // Base fee without discounts
  invitedDiscount: number          // Invited user discount (10%)
  finalFee: FeeBreakdown           // Final fee after discount
  savings: number                  // Total savings from discount
  vipTier: VIPTier                 // User's VIP tier
  layer: LayerType                 // Index layer
}

/**
 * Calculate trading fee with full breakdown
 *
 * @param amount - Trade amount in USD
 * @param vipTier - User's VIP tier
 * @param layer - Index layer type
 * @param isInvited - Whether user was invited (gets 10% discount)
 * @returns Detailed fee breakdown
 *
 * Examples:
 * - calculateTradingFee(1000, VIPTier.VIP2, 'L1', false)
 *   => Protocol: 0.4%, Creator: 0%, LP: 0.4%, Total: 0.8% = $8
 * - calculateTradingFee(1000, VIPTier.VIP2, 'L3', true)
 *   => Protocol: 0.4%, Creator: 0.4%, LP: 0%, Total: 0.8%, Discount: 10% = $7.2
 */
export function calculateTradingFee(
  amount: number,
  vipTier: VIPTier,
  layer: LayerType,
  isInvited: boolean = false
): TradingFeeResult {
  // Get protocol fee based on VIP tier
  const protocolFeeRate = getProtocolFeeRate(vipTier)

  // Get layer-specific fees
  let creatorFeeRate = 0
  let lpFeeRate = 0

  if (layer === 'PARTNER') {
    // Partner: Only protocol fee (0.5%), no creator/LP fees
    creatorFeeRate = 0
    lpFeeRate = 0
  } else if (layer === 'GRADUATED') {
    // Graduated: Use max rates for calculation (variable in practice)
    creatorFeeRate = LAYER_FEES.GRADUATED.CREATOR_FEE_MAX
    lpFeeRate = LAYER_FEES.GRADUATED.LP_FEE_MAX
  } else {
    // L1/L2/L3/VS: Use configured rates
    const layerConfig = LAYER_FEES[layer]
    creatorFeeRate = layerConfig.CREATOR_FEE || 0
    lpFeeRate = layerConfig.LP_FEE || 0
  }

  // Calculate base fees
  const protocolFee = amount * protocolFeeRate
  const creatorFee = amount * creatorFeeRate
  const lpFee = amount * lpFeeRate
  const totalFee = protocolFee + creatorFee + lpFee
  const totalFeeRate = protocolFeeRate + creatorFeeRate + lpFeeRate

  const baseFee: FeeBreakdown = {
    protocolFee,
    creatorFee,
    lpFee,
    totalFee,
    protocolFeeRate,
    creatorFeeRate,
    lpFeeRate,
    totalFeeRate,
  }

  // Apply invited user discount (10%)
  const discountRate = isInvited ? INVITED_USER_DISCOUNT : 0
  const invitedDiscount = totalFee * discountRate

  const finalFee: FeeBreakdown = {
    protocolFee: protocolFee * (1 - discountRate),
    creatorFee: creatorFee * (1 - discountRate),
    lpFee: lpFee * (1 - discountRate),
    totalFee: totalFee * (1 - discountRate),
    protocolFeeRate,
    creatorFeeRate,
    lpFeeRate,
    totalFeeRate,
  }

  return {
    baseFee,
    invitedDiscount,
    finalFee,
    savings: invitedDiscount,
    vipTier,
    layer,
  }
}

/**
 * Calculate rebalancing fee
 *
 * @param aum - Assets Under Management in USD
 * @param layer - Index layer type
 * @param customFrequency - Optional custom frequency (overrides default)
 * @returns Annual rebalancing fee
 *
 * Examples:
 * - calculateRebalancingFee(1000000, 'L1') => $12,000 annual (0.1% * 12 times)
 * - calculateRebalancingFee(1000000, 'L2') => $26,000 annual (0.1% * 26 times)
 * - calculateRebalancingFee(1000000, 'PARTNER') => $36,000 annual (0.3% * 12 times)
 */
export function calculateRebalancingFee(
  aum: number,
  layer: LayerType,
  customFrequency?: number
): {
  perEventFee: number
  perEventRate: number
  annualFee: number
  annualRate: number
  frequency: number
} {
  if (layer === 'L3') {
    // L3: No rebalancing (bonding curve)
    return {
      perEventFee: 0,
      perEventRate: 0,
      annualFee: 0,
      annualRate: 0,
      frequency: 0,
    }
  }

  if (layer === 'GRADUATED') {
    // Graduated: Use L1 rebalancing schedule as default
    const rate = LAYER_FEES.L1.REBALANCING_RATE
    const frequency = customFrequency || LAYER_FEES.L1.REBALANCING_FREQUENCY

    return {
      perEventFee: aum * rate,
      perEventRate: rate,
      annualFee: aum * rate * frequency,
      annualRate: rate * frequency,
      frequency,
    }
  }

  const layerConfig = LAYER_FEES[layer]
  const rate = layerConfig.REBALANCING_RATE
  const frequency = customFrequency || layerConfig.REBALANCING_FREQUENCY

  return {
    perEventFee: aum * rate,
    perEventRate: rate,
    annualFee: aum * rate * frequency,
    annualRate: rate * frequency,
    frequency,
  }
}

/**
 * Calculate management fee
 *
 * @param aum - Assets Under Management in USD
 * @param layer - Index layer type
 * @param days - Number of days to calculate (default: 365 for annual)
 * @returns Management fee for specified period
 *
 * Examples:
 * - calculateManagementFee(1000000, 'L1') => $7,000 annual (0.7%)
 * - calculateManagementFee(1000000, 'L1', 30) => $575 monthly (0.7% / 12)
 * - calculateManagementFee(1000000, 'PARTNER') => $5,000 annual (0.5%)
 */
export function calculateManagementFee(
  aum: number,
  layer: LayerType,
  days: number = 365
): {
  fee: number
  annualFee: number
  rate: number
  period: string
} {
  const annualRate = LAYER_FEES[layer].MANAGEMENT_YEARLY
  const annualFee = aum * annualRate
  const fee = (annualFee / 365) * days

  let period = 'annual'
  if (days === 30 || days === 31) period = 'monthly'
  else if (days === 7) period = 'weekly'
  else if (days === 1) period = 'daily'

  return {
    fee,
    annualFee,
    rate: annualRate,
    period,
  }
}

/**
 * Calculate launcher fee
 *
 * @returns Fixed launcher fee in USD
 */
export function calculateLauncherFee(): {
  fee: number
  feeUSD: number
} {
  return {
    fee: LAUNCHER_FEE_USD,
    feeUSD: LAUNCHER_FEE_USD,
  }
}

/**
 * Get total cost including all fees
 *
 * @param tradeAmount - Trade amount
 * @param vipTier - User's VIP tier
 * @param layer - Index layer
 * @param isInvited - Whether user was invited
 * @returns Total cost (amount + fees)
 */
export function calculateTotalCost(
  tradeAmount: number,
  vipTier: VIPTier,
  layer: LayerType,
  isInvited: boolean = false
): {
  tradeAmount: number
  fees: TradingFeeResult
  totalCost: number
} {
  const fees = calculateTradingFee(tradeAmount, vipTier, layer, isInvited)
  const totalCost = tradeAmount + fees.finalFee.totalFee

  return {
    tradeAmount,
    fees,
    totalCost,
  }
}

/**
 * Format fee breakdown for display
 *
 * @param breakdown - Fee breakdown
 * @returns Formatted strings for UI display
 */
export function formatFeeBreakdown(breakdown: FeeBreakdown): {
  protocolFee: string
  creatorFee: string
  lpFee: string
  totalFee: string
  protocolFeeRate: string
  creatorFeeRate: string
  lpFeeRate: string
  totalFeeRate: string
} {
  return {
    protocolFee: `$${breakdown.protocolFee.toFixed(2)}`,
    creatorFee: `$${breakdown.creatorFee.toFixed(2)}`,
    lpFee: `$${breakdown.lpFee.toFixed(2)}`,
    totalFee: `$${breakdown.totalFee.toFixed(2)}`,
    protocolFeeRate: `${(breakdown.protocolFeeRate * 100).toFixed(2)}%`,
    creatorFeeRate: `${(breakdown.creatorFeeRate * 100).toFixed(2)}%`,
    lpFeeRate: `${(breakdown.lpFeeRate * 100).toFixed(2)}%`,
    totalFeeRate: `${(breakdown.totalFeeRate * 100).toFixed(2)}%`,
  }
}

/**
 * Format fee for simple display
 *
 * @param fee - Fee amount
 * @returns Formatted fee string
 */
export function formatFee(fee: number): string {
  if (fee >= 1000000) {
    return `$${(fee / 1000000).toFixed(2)}M`
  } else if (fee >= 1000) {
    return `$${(fee / 1000).toFixed(2)}K`
  } else {
    return `$${fee.toFixed(2)}`
  }
}

/**
 * Get detailed fee breakdown for UI display
 * Combines trading, rebalancing, and management fees
 *
 * @param amount - Trade amount
 * @param aum - Assets Under Management (for rebalancing/management)
 * @param vipTier - User's VIP tier
 * @param layer - Index layer
 * @param isInvited - Whether user was invited
 * @param includeRebalancing - Include rebalancing fee
 * @param includeManagement - Include management fee
 * @returns Comprehensive fee breakdown
 */
export function getTotalFeeBreakdown(
  amount: number,
  aum: number,
  vipTier: VIPTier,
  layer: LayerType,
  isInvited: boolean = false,
  includeRebalancing: boolean = false,
  includeManagement: boolean = false
): {
  trading: TradingFeeResult
  rebalancing?: ReturnType<typeof calculateRebalancingFee>
  management?: ReturnType<typeof calculateManagementFee>
  totalFees: number
  totalFeesFormatted: string
} {
  const trading = calculateTradingFee(amount, vipTier, layer, isInvited)

  const rebalancing = includeRebalancing
    ? calculateRebalancingFee(aum, layer)
    : undefined

  const management = includeManagement
    ? calculateManagementFee(aum, layer)
    : undefined

  const totalFees =
    trading.finalFee.totalFee +
    (rebalancing?.annualFee || 0) +
    (management?.annualFee || 0)

  return {
    trading,
    rebalancing,
    management,
    totalFees,
    totalFeesFormatted: formatFee(totalFees),
  }
}

/**
 * Compare fees across different VIP tiers
 * Useful for showing potential savings
 *
 * @param amount - Trade amount
 * @param layer - Index layer
 * @param isInvited - Whether user was invited
 * @returns Fee comparison across all VIP tiers
 */
export function compareFeesByVIPTier(
  amount: number,
  layer: LayerType,
  isInvited: boolean = false
): {
  tier: VIPTier
  fee: number
  rate: number
  savings: number
  savingsVsVIP0: number
}[] {
  const results = Object.values(VIPTier).map((tier) => {
    const result = calculateTradingFee(amount, tier, layer, isInvited)
    return {
      tier,
      fee: result.finalFee.totalFee,
      rate: result.finalFee.totalFeeRate,
      savings: result.savings,
      savingsVsVIP0: 0, // Will calculate below
    }
  })

  // Calculate savings vs VIP0
  const vip0Fee = results[0].fee
  results.forEach((result) => {
    result.savingsVsVIP0 = vip0Fee - result.fee
  })

  return results
}

/**
 * Estimate annual fees for index holder
 * Includes trading, rebalancing, and management fees
 *
 * @param holdingValue - Current holding value
 * @param annualTradingVolume - Estimated annual trading volume
 * @param vipTier - User's VIP tier
 * @param layer - Index layer
 * @param isInvited - Whether user was invited
 * @returns Estimated annual fees
 */
export function estimateAnnualFees(
  holdingValue: number,
  annualTradingVolume: number,
  vipTier: VIPTier,
  layer: LayerType,
  isInvited: boolean = false
): {
  tradingFees: number
  rebalancingFees: number
  managementFees: number
  totalAnnualFees: number
  effectiveRate: number
} {
  const trading = calculateTradingFee(
    annualTradingVolume,
    vipTier,
    layer,
    isInvited
  )
  const rebalancing = calculateRebalancingFee(holdingValue, layer)
  const management = calculateManagementFee(holdingValue, layer)

  const totalAnnualFees =
    trading.finalFee.totalFee + rebalancing.annualFee + management.annualFee

  const effectiveRate = totalAnnualFees / (holdingValue + annualTradingVolume)

  return {
    tradingFees: trading.finalFee.totalFee,
    rebalancingFees: rebalancing.annualFee,
    managementFees: management.annualFee,
    totalAnnualFees,
    effectiveRate,
  }
}
