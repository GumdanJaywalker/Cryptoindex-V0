/**
 * Fee Structure Configuration for HyperIndex
 *
 * Based on Business Documentation (Slides 26-28)
 * Date: 2025-10-28
 * Status: Production Implementation
 *
 * Fee Model:
 * - VIP-tiered protocol fees (0.3%-0.6%)
 * - Layer-specific fees (L1/L2/L3/VS/Partner/Graduated)
 * - Creator fees (0%-0.95%)
 * - LP fees (0%-0.4%)
 * - Rebalancing fees (0.1%-0.3% per event)
 * - Management fees (0.5%-1% yearly)
 */

/**
 * VIP Tier Levels
 * Determines protocol fee rate based on user activity
 */
export enum VIPTier {
  VIP0 = 'VIP0',
  VIP1 = 'VIP1',
  VIP2 = 'VIP2',
  VIP3 = 'VIP3',
  VIP4 = 'VIP4',
}

/**
 * Index Layer Types
 */
export type LayerType = 'L1' | 'L2' | 'L3' | 'VS' | 'PARTNER' | 'GRADUATED'

/**
 * VIP Protocol Fee Rates
 * Lower tier = higher fee
 */
export const VIP_PROTOCOL_FEES = {
  VIP0: 0.006,   // 0.60% - 20% distribution
  VIP1: 0.005,   // 0.50% - 25% distribution
  VIP2: 0.004,   // 0.40% - 30% distribution
  VIP3: 0.0035,  // 0.35% - 15% distribution
  VIP4: 0.003,   // 0.30% - 10% distribution
} as const

/**
 * Blended Protocol Fee Rate
 * Weighted average across all VIP tiers
 */
export const BLENDED_PROTOCOL_FEE = 0.0045 // 0.45%

/**
 * Special Fee Rates
 */
export const PARTNER_ROUTING_FEE = 0.005 // 0.50% (non-direct C-R)
export const PARTNER_DIRECT_CR_FEE = 0.005 // 0.50% (direct C-R)

/**
 * Invited User Discount
 * Applied to all trading fees for invited users
 */
export const INVITED_USER_DISCOUNT = 0.10 // 10% base discount

/**
 * Launcher Fee
 * Fixed fee for creating new index
 */
export const LAUNCHER_FEE_USD = 5 // $5 per launch

/**
 * Layer-Specific Fee Configuration
 */
export const LAYER_FEES = {
  /**
   * Layer 1 - Broad Market Indices
   * Examples: Top 10, DeFi Leaders, Gaming Index
   */
  L1: {
    CREATOR_FEE: 0,              // 0% - No creator fee
    PROTOCOL_FEE_MIN: 0.003,     // 0.3% (VIP4)
    PROTOCOL_FEE_MAX: 0.006,     // 0.6% (VIP0)
    LP_FEE: 0.004,               // 0.4% - Standard LP fee
    REBALANCING_RATE: 0.001,     // 0.1% per event
    REBALANCING_FREQUENCY: 12,   // Monthly (12 times/year)
    MANAGEMENT_YEARLY: 0.007,    // 0.7% annual
  },

  /**
   * Layer 2 - Sector Indices
   * Examples: AI Tokens, Meme Coins, RWA Index
   */
  L2: {
    CREATOR_FEE: 0,              // 0% - No creator fee
    PROTOCOL_FEE_MIN: 0.003,     // 0.3% (VIP4)
    PROTOCOL_FEE_MAX: 0.006,     // 0.6% (VIP0)
    LP_FEE: 0.004,               // 0.4% - Standard LP fee
    REBALANCING_RATE: 0.001,     // 0.1% per event
    REBALANCING_FREQUENCY: 26,   // Bi-weekly (26 times/year)
    MANAGEMENT_YEARLY: 0.0085,   // 0.85% annual
  },

  /**
   * Layer 3 - User-Created Indices (Bonding Curve)
   * Examples: Custom meme indices, personal strategies
   */
  L3: {
    CREATOR_FEE: 0.004,          // 0.4% - Creator gets fee
    PROTOCOL_FEE_MIN: 0.003,     // 0.3% (VIP4)
    PROTOCOL_FEE_MAX: 0.006,     // 0.6% (VIP0)
    LP_FEE: 0,                   // 0% - Bonding curve, no LP
    REBALANCING_RATE: 0,         // 0% - No rebalancing (bonding curve)
    REBALANCING_FREQUENCY: 0,    // N/A
    MANAGEMENT_YEARLY: 0.01,     // 1% annual
  },

  /**
   * VS Battles - Event-Driven Indices
   * Examples: Trump vs Biden, ETH vs SOL
   */
  VS: {
    CREATOR_FEE: 0,              // 0% - No creator fee
    PROTOCOL_FEE_MIN: 0.003,     // 0.3% (VIP4)
    PROTOCOL_FEE_MAX: 0.006,     // 0.6% (VIP0)
    LP_FEE: 0.004,               // 0.4% - Standard LP fee
    REBALANCING_RATE: 0.001,     // 0.1% per event
    REBALANCING_FREQUENCY: 26,   // Bi-weekly (26 times/year)
    MANAGEMENT_YEARLY: 0.01,     // 1% annual
  },

  /**
   * Partner Indices - External Partner Integration
   * Examples: Institutional partners, third-party indices
   */
  PARTNER: {
    PROTOCOL_FEE: 0.005,         // 0.5% - Reduced (Direct C-R)
    CREATOR_FEE: 0,              // 0% - No creator fee
    LP_FEE: 0,                   // 0% - Direct C-R, no LP
    REBALANCING_RATE: 0.003,     // 0.3% per event
    REBALANCING_FREQUENCY: 12,   // Monthly (12 times/year)
    MANAGEMENT_YEARLY: 0.005,    // 0.5% annual
  },

  /**
   * Graduated Indices - L3 indices that graduated to L1/L2
   * Variable fees based on performance and governance
   */
  GRADUATED: {
    CREATOR_FEE_MIN: 0.0008,     // 0.08% - Minimum creator fee
    CREATOR_FEE_MAX: 0.0095,     // 0.95% - Maximum creator fee
    PROTOCOL_FEE_MIN: 0.003,     // 0.3% (VIP4)
    PROTOCOL_FEE_MAX: 0.006,     // 0.6% (VIP0)
    LP_FEE_MIN: 0.0002,          // 0.02% - Minimum LP fee
    LP_FEE_MAX: 0.004,           // 0.4% - Maximum LP fee
    MANAGEMENT_YEARLY: 0.007,    // 0.7% annual (same as L1)
  },
} as const

/**
 * Fee Type Categories
 * For type-safe fee calculations
 */
export enum FeeCategory {
  TRADING = 'TRADING',
  REBALANCING = 'REBALANCING',
  MANAGEMENT = 'MANAGEMENT',
  LAUNCHER = 'LAUNCHER',
}

/**
 * Get protocol fee rate for a VIP tier
 */
export function getProtocolFeeRate(vipTier: VIPTier): number {
  return VIP_PROTOCOL_FEES[vipTier]
}

/**
 * Get VIP tier from index (for display purposes)
 * In production, this would come from user profile/backend
 */
export function getVIPTierDisplay(tier: VIPTier): {
  name: string
  rate: number
  discount: number
} {
  const rate = VIP_PROTOCOL_FEES[tier]
  const discount = (VIP_PROTOCOL_FEES.VIP0 - rate) / VIP_PROTOCOL_FEES.VIP0

  return {
    name: tier,
    rate,
    discount,
  }
}

/**
 * Calculate total trading fee range for a layer
 * Returns min/max based on VIP tier range
 */
export function getTradingFeeRange(layer: LayerType): {
  min: number
  max: number
  components: {
    protocolMin: number
    protocolMax: number
    creator: number
    lp: number
  }
} {
  if (layer === 'PARTNER') {
    return {
      min: LAYER_FEES.PARTNER.PROTOCOL_FEE,
      max: LAYER_FEES.PARTNER.PROTOCOL_FEE,
      components: {
        protocolMin: LAYER_FEES.PARTNER.PROTOCOL_FEE,
        protocolMax: LAYER_FEES.PARTNER.PROTOCOL_FEE,
        creator: 0,
        lp: 0,
      },
    }
  }

  if (layer === 'GRADUATED') {
    return {
      min: LAYER_FEES.GRADUATED.PROTOCOL_FEE_MIN + LAYER_FEES.GRADUATED.CREATOR_FEE_MIN + LAYER_FEES.GRADUATED.LP_FEE_MIN,
      max: LAYER_FEES.GRADUATED.PROTOCOL_FEE_MAX + LAYER_FEES.GRADUATED.CREATOR_FEE_MAX + LAYER_FEES.GRADUATED.LP_FEE_MAX,
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

  return {
    min: layerConfig.PROTOCOL_FEE_MIN + creatorFee + lpFee,
    max: layerConfig.PROTOCOL_FEE_MAX + creatorFee + lpFee,
    components: {
      protocolMin: layerConfig.PROTOCOL_FEE_MIN,
      protocolMax: layerConfig.PROTOCOL_FEE_MAX,
      creator: creatorFee,
      lp: lpFee,
    },
  }
}

/**
 * Fee Display Labels
 * For UI components
 */
export const FEE_LABELS = {
  TRADING: 'Trading Fee',
  PROTOCOL: 'Protocol Fee',
  CREATOR: 'Creator Fee',
  LP: 'LP Fee',
  REBALANCING: 'Rebalancing Fee',
  MANAGEMENT: 'Management Fee',
  LAUNCHER: 'Index Launch Fee',
} as const

/**
 * Fee Descriptions
 * For tooltips and help text
 */
export const FEE_DESCRIPTIONS = {
  TRADING: 'Total fee for trading index tokens',
  PROTOCOL: 'Fee collected by protocol (varies by VIP tier)',
  CREATOR: 'Fee paid to index creator',
  LP: 'Fee paid to liquidity providers',
  REBALANCING: 'Fee charged when index is rebalanced',
  MANAGEMENT: 'Annual fee based on Assets Under Management',
  LAUNCHER: 'One-time fee for creating a new index',
} as const

/**
 * Fee Comparison with Other Platforms
 * For marketing and transparency
 */
export const FEE_COMPARISON = {
  AXIOM: 0.022,      // 2.20%
  PHOTON: 0.0225,    // 2.25%
  BULLX: 0.0225,     // 2.25%
  PUMPFUN: 0.0125,   // 1.25%
  HYPERINDEX: 0.01,  // 1.00% (average)
} as const
