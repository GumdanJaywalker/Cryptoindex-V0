/**
 * Centralized Fee Configuration for HyperIndex Phase 0
 *
 * Phase 0: Closed Beta (Oct 2025 - Nov 2025)
 * - No TGE yet
 * - Labs-led mainnet
 * - Limited access (KOLs and invitees only)
 *
 * Fee Structure:
 * - 💙 $HIIN fees: Index-related operations (Index DAO revenue)
 * - 💜 $HIDE fees: DEX-related operations (DEX DAO revenue)
 * - All fees flow to Protocol Revenue Treasury
 * - Quarterly buy-backs & 60-month locking (Phase 1+)
 */

import type { Currency } from '@/lib/types/currency'

/**
 * $HIIN Fee Configuration (Index DAO)
 *
 * Used for:
 * - Index launching (Layer 3 creation)
 * - Index management and rebalancing
 * - On-chain gas for index operations
 */
export const HIIN_FEES = {
  /**
   * Index Launch Fee
   * Fixed fee charged when creating a new index
   * Payable in $HIIN (discounted) or HYPE
   */
  LAUNCH_FEE: 0.1, // 0.1 $HIIN

  /**
   * Index Management Fee
   * Annual fee based on AUM (Assets Under Management)
   * Charged proportionally per epoch
   */
  MANAGEMENT_FEE_ANNUAL: 0.0002, // 0.02% annual

  /**
   * Index Rebalancing Fee
   * Charged per rebalancing transaction
   * Percentage of rebalanced amount
   */
  REBALANCING_FEE: 0.0005, // 0.05%

  /**
   * Gas for Index Operations
   * Dynamic - actual gas cost at time of transaction
   * Payable in $HIIN (discounted) or HYPE
   */
  GAS_MULTIPLIER: 1.0, // 1x actual gas cost

  /**
   * Payment Token Options
   */
  ACCEPTED_TOKENS: ['HIIN', 'HYPE'] as Currency[],

  /**
   * Discount Rate
   * Applied when paying in $HIIN instead of HYPE
   */
  NATIVE_PAYMENT_DISCOUNT: 0.10, // 10% discount
} as const

/**
 * $HIDE Fee Configuration (DEX DAO)
 *
 * Used for:
 * - Trading/swap operations
 * - Liquidity provision (LP)
 * - DEX transaction gas
 */
export const HIDE_FEES = {
  /**
   * Trading/Swap Fee
   * Standard fee for all trading operations
   * Percentage of trade volume
   * Portion is burnable (tokenomics)
   */
  TRADING_FEE: 0.003, // 0.30%

  /**
   * Swap Gas Fee
   * Dynamic - actual gas cost for swap transaction
   * Payable in $HIDE (discounted) or HYPE
   */
  SWAP_GAS_MULTIPLIER: 1.0, // 1x actual gas cost

  /**
   * LP Add Fee
   * Charged when adding liquidity to pools
   * Percentage of liquidity added
   */
  LP_ADD_FEE: 0.001, // 0.10%

  /**
   * LP Remove Fee
   * Charged when removing liquidity from pools
   * Percentage of liquidity removed
   */
  LP_REMOVE_FEE: 0.001, // 0.10%

  /**
   * LP Claim Fee
   * Charged when claiming LP rewards
   * Percentage of rewards claimed
   */
  LP_CLAIM_FEE: 0.0005, // 0.05%

  /**
   * Payment Token Options
   */
  ACCEPTED_TOKENS: ['HIDE', 'HYPE'] as Currency[],

  /**
   * Discount Rate
   * Applied when paying in $HIDE instead of HYPE
   */
  NATIVE_PAYMENT_DISCOUNT: 0.10, // 10% discount
} as const

/**
 * Combined Fee Configuration
 * Convenience export for accessing all fees
 */
export const FEES = {
  HIIN: HIIN_FEES,
  HIDE: HIDE_FEES,
} as const

/**
 * Fee Type Enum for type safety
 */
export enum FeeType {
  // HIIN Fees
  INDEX_LAUNCH = 'INDEX_LAUNCH',
  INDEX_MANAGEMENT = 'INDEX_MANAGEMENT',
  INDEX_REBALANCING = 'INDEX_REBALANCING',
  INDEX_GAS = 'INDEX_GAS',

  // HIDE Fees
  TRADING = 'TRADING',
  SWAP_GAS = 'SWAP_GAS',
  LP_ADD = 'LP_ADD',
  LP_REMOVE = 'LP_REMOVE',
  LP_CLAIM = 'LP_CLAIM',
}

/**
 * Get the native token for a fee type
 * Returns the token that provides discount for this fee
 */
export function getNativeTokenForFee(feeType: FeeType): Currency {
  switch (feeType) {
    case FeeType.INDEX_LAUNCH:
    case FeeType.INDEX_MANAGEMENT:
    case FeeType.INDEX_REBALANCING:
    case FeeType.INDEX_GAS:
      return 'HIIN'

    case FeeType.TRADING:
    case FeeType.SWAP_GAS:
    case FeeType.LP_ADD:
    case FeeType.LP_REMOVE:
    case FeeType.LP_CLAIM:
      return 'HIDE'

    default:
      return 'HYPE'
  }
}

/**
 * Get the base fee rate for a fee type
 */
export function getBaseFeeRate(feeType: FeeType): number {
  switch (feeType) {
    case FeeType.INDEX_LAUNCH:
      return FEES.HIIN.LAUNCH_FEE
    case FeeType.INDEX_MANAGEMENT:
      return FEES.HIIN.MANAGEMENT_FEE_ANNUAL
    case FeeType.INDEX_REBALANCING:
      return FEES.HIIN.REBALANCING_FEE
    case FeeType.INDEX_GAS:
      return FEES.HIIN.GAS_MULTIPLIER

    case FeeType.TRADING:
      return FEES.HIDE.TRADING_FEE
    case FeeType.SWAP_GAS:
      return FEES.HIDE.SWAP_GAS_MULTIPLIER
    case FeeType.LP_ADD:
      return FEES.HIDE.LP_ADD_FEE
    case FeeType.LP_REMOVE:
      return FEES.HIDE.LP_REMOVE_FEE
    case FeeType.LP_CLAIM:
      return FEES.HIDE.LP_CLAIM_FEE

    default:
      return 0
  }
}

/**
 * Get the discount rate for paying in native token
 */
export function getDiscountRate(feeType: FeeType): number {
  const nativeToken = getNativeTokenForFee(feeType)
  return nativeToken === 'HIIN'
    ? FEES.HIIN.NATIVE_PAYMENT_DISCOUNT
    : FEES.HIDE.NATIVE_PAYMENT_DISCOUNT
}

/**
 * Revenue Treasury Configuration
 *
 * Phase 0: All fees flow to Protocol Revenue Treasury
 * Phase 1+: Quarterly buy-backs & 60-month locking
 */
export const REVENUE_CONFIG = {
  TREASURY_ADDRESS: '0x0000000000000000000000000000000000000000', // TBD
  BUYBACK_FREQUENCY_DAYS: 90, // Quarterly
  LOCK_DURATION_MONTHS: 60, // 60 months
  PHASE_0_ACTIVE: true, // Currently in Phase 0
} as const

/**
 * Fee Display Labels
 * For UI components
 */
export const FEE_LABELS = {
  [FeeType.INDEX_LAUNCH]: 'Index Launch Fee',
  [FeeType.INDEX_MANAGEMENT]: 'Index Management Fee',
  [FeeType.INDEX_REBALANCING]: 'Index Rebalancing Fee',
  [FeeType.INDEX_GAS]: 'Gas Fee',
  [FeeType.TRADING]: 'Trading Fee',
  [FeeType.SWAP_GAS]: 'Swap Gas Fee',
  [FeeType.LP_ADD]: 'LP Add Fee',
  [FeeType.LP_REMOVE]: 'LP Remove Fee',
  [FeeType.LP_CLAIM]: 'LP Claim Fee',
} as const

/**
 * Fee Display Descriptions
 * For tooltips and help text
 */
export const FEE_DESCRIPTIONS = {
  [FeeType.INDEX_LAUNCH]: 'One-time fee for creating a new index on Layer 3',
  [FeeType.INDEX_MANAGEMENT]: 'Annual fee based on Assets Under Management (AUM)',
  [FeeType.INDEX_REBALANCING]: 'Fee charged per index rebalancing transaction',
  [FeeType.INDEX_GAS]: 'On-chain gas cost for index operations',
  [FeeType.TRADING]: 'Fee applied to all trading and swap operations',
  [FeeType.SWAP_GAS]: 'On-chain gas cost for swap transactions',
  [FeeType.LP_ADD]: 'Fee for adding liquidity to pools',
  [FeeType.LP_REMOVE]: 'Fee for removing liquidity from pools',
  [FeeType.LP_CLAIM]: 'Fee for claiming LP rewards',
} as const
