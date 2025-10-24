/**
 * Fee Calculation Utilities for HyperIndex Phase 0
 *
 * Provides helper functions for calculating fees with discount logic,
 * payment token selection, and fee breakdown generation.
 */

import type { Currency, ExchangeRates } from '@/lib/types/currency'
import { convertCurrency } from '@/lib/utils/currency'
import {
  FEES,
  FeeType,
  getNativeTokenForFee,
  getBaseFeeRate,
  getDiscountRate,
} from '@/lib/constants/fees'

/**
 * Fee Calculation Result
 */
export interface FeeCalculation {
  baseFee: number // Fee amount before discount (in HYPE)
  discount: number // Discount amount (in HYPE)
  finalFee: number // Final fee after discount (in HYPE)
  discountPercentage: number // Discount percentage applied
  paymentToken: Currency // Token used for payment
  nativeToken: Currency // Native token for this fee type
  feeType: FeeType
}

/**
 * Calculate trading/swap fee with discount logic
 *
 * @param amount - Trade amount in HYPE
 * @param paymentToken - Token used for payment ('HIDE', 'HYPE')
 * @returns Fee calculation result
 *
 * Examples:
 * - calculateTradingFee(1000, 'HIDE') => 3.0 $HIDE (with 10% discount)
 * - calculateTradingFee(1000, 'HYPE') => 3.0 HYPE (no discount)
 */
export function calculateTradingFee(
  amount: number,
  paymentToken: Currency = 'HYPE'
): FeeCalculation {
  const feeType = FeeType.TRADING
  const baseFeeRate = getBaseFeeRate(feeType)
  const baseFee = amount * baseFeeRate

  const nativeToken = getNativeTokenForFee(feeType)
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? getDiscountRate(feeType) : 0
  const discount = baseFee * discountRate
  const finalFee = baseFee - discount

  return {
    baseFee,
    discount,
    finalFee,
    discountPercentage: discountRate * 100,
    paymentToken,
    nativeToken,
    feeType,
  }
}

/**
 * Calculate index launch fee with discount logic
 *
 * @param paymentToken - Token used for payment ('HIIN', 'HYPE')
 * @returns Fee calculation result
 *
 * Examples:
 * - calculateLaunchFee('HIIN') => 0.09 $HIIN (with 10% discount)
 * - calculateLaunchFee('HYPE') => 0.1 HYPE (no discount)
 */
export function calculateLaunchFee(
  paymentToken: Currency = 'HYPE'
): FeeCalculation {
  const feeType = FeeType.INDEX_LAUNCH
  const baseFee = getBaseFeeRate(feeType)

  const nativeToken = getNativeTokenForFee(feeType)
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? getDiscountRate(feeType) : 0
  const discount = baseFee * discountRate
  const finalFee = baseFee - discount

  return {
    baseFee,
    discount,
    finalFee,
    discountPercentage: discountRate * 100,
    paymentToken,
    nativeToken,
    feeType,
  }
}

/**
 * Calculate index management fee (annual AUM fee)
 *
 * @param aum - Assets Under Management in HYPE
 * @param paymentToken - Token used for payment ('HIIN', 'HYPE')
 * @returns Fee calculation result
 *
 * Note: This returns the annual fee. Divide by 365 for daily fee,
 * or by 12 for monthly fee, etc.
 *
 * Examples:
 * - calculateManagementFee(1000000, 'HIIN') => 180 $HIIN annual (with 10% discount)
 * - calculateManagementFee(1000000, 'HYPE') => 200 HYPE annual (no discount)
 */
export function calculateManagementFee(
  aum: number,
  paymentToken: Currency = 'HYPE'
): FeeCalculation {
  const feeType = FeeType.INDEX_MANAGEMENT
  const baseFeeRate = getBaseFeeRate(feeType)
  const baseFee = aum * baseFeeRate

  const nativeToken = getNativeTokenForFee(feeType)
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? getDiscountRate(feeType) : 0
  const discount = baseFee * discountRate
  const finalFee = baseFee - discount

  return {
    baseFee,
    discount,
    finalFee,
    discountPercentage: discountRate * 100,
    paymentToken,
    nativeToken,
    feeType,
  }
}

/**
 * Calculate index rebalancing fee
 *
 * @param amount - Amount being rebalanced in HYPE
 * @param paymentToken - Token used for payment ('HIIN', 'HYPE')
 * @returns Fee calculation result
 *
 * Examples:
 * - calculateRebalancingFee(10000, 'HIIN') => 4.5 $HIIN (with 10% discount)
 * - calculateRebalancingFee(10000, 'HYPE') => 5.0 HYPE (no discount)
 */
export function calculateRebalancingFee(
  amount: number,
  paymentToken: Currency = 'HYPE'
): FeeCalculation {
  const feeType = FeeType.INDEX_REBALANCING
  const baseFeeRate = getBaseFeeRate(feeType)
  const baseFee = amount * baseFeeRate

  const nativeToken = getNativeTokenForFee(feeType)
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? getDiscountRate(feeType) : 0
  const discount = baseFee * discountRate
  const finalFee = baseFee - discount

  return {
    baseFee,
    discount,
    finalFee,
    discountPercentage: discountRate * 100,
    paymentToken,
    nativeToken,
    feeType,
  }
}

/**
 * Calculate LP fee (add/remove/claim)
 *
 * @param amount - Amount for LP operation in HYPE
 * @param type - Type of LP operation
 * @param paymentToken - Token used for payment ('HIDE', 'HYPE')
 * @returns Fee calculation result
 *
 * Examples:
 * - calculateLPFee(1000, 'add', 'HIDE') => 0.9 $HIDE (with 10% discount)
 * - calculateLPFee(1000, 'remove', 'HYPE') => 1.0 HYPE (no discount)
 */
export function calculateLPFee(
  amount: number,
  type: 'add' | 'remove' | 'claim',
  paymentToken: Currency = 'HYPE'
): FeeCalculation {
  const feeType =
    type === 'add'
      ? FeeType.LP_ADD
      : type === 'remove'
      ? FeeType.LP_REMOVE
      : FeeType.LP_CLAIM

  const baseFeeRate = getBaseFeeRate(feeType)
  const baseFee = amount * baseFeeRate

  const nativeToken = getNativeTokenForFee(feeType)
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? getDiscountRate(feeType) : 0
  const discount = baseFee * discountRate
  const finalFee = baseFee - discount

  return {
    baseFee,
    discount,
    finalFee,
    discountPercentage: discountRate * 100,
    paymentToken,
    nativeToken,
    feeType,
  }
}

/**
 * Get discounted fee amount
 * Generic helper for applying discount based on payment token
 *
 * @param baseFee - Base fee amount before discount
 * @param feeType - Type of fee
 * @param paymentToken - Token used for payment
 * @returns Discounted fee amount
 *
 * Examples:
 * - getDiscountedFee(100, FeeType.TRADING, 'HIDE') => 90 (10% discount)
 * - getDiscountedFee(100, FeeType.TRADING, 'HYPE') => 100 (no discount)
 */
export function getDiscountedFee(
  baseFee: number,
  feeType: FeeType,
  paymentToken: Currency
): number {
  const nativeToken = getNativeTokenForFee(feeType)
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? getDiscountRate(feeType) : 0
  return baseFee * (1 - discountRate)
}

/**
 * Calculate total cost including fee
 *
 * @param amount - Base amount
 * @param feeCalculation - Fee calculation result
 * @returns Total cost (amount + fee)
 */
export function calculateTotalCost(
  amount: number,
  feeCalculation: FeeCalculation
): number {
  return amount + feeCalculation.finalFee
}

/**
 * Format fee breakdown for display
 *
 * @param feeCalculation - Fee calculation result
 * @param exchangeRates - Exchange rates for currency conversion
 * @param displayCurrency - Currency to display (default: payment token)
 * @returns Formatted fee breakdown strings
 */
export function formatFeeBreakdown(
  feeCalculation: FeeCalculation,
  exchangeRates?: ExchangeRates,
  displayCurrency?: Currency
): {
  baseFee: string
  discount: string
  finalFee: string
  savings: string
} {
  const currency = displayCurrency || feeCalculation.paymentToken

  // Convert if needed
  const baseFeeConverted = exchangeRates
    ? convertCurrency(feeCalculation.baseFee, 'HYPE', currency, exchangeRates)
    : feeCalculation.baseFee

  const discountConverted = exchangeRates
    ? convertCurrency(feeCalculation.discount, 'HYPE', currency, exchangeRates)
    : feeCalculation.discount

  const finalFeeConverted = exchangeRates
    ? convertCurrency(feeCalculation.finalFee, 'HYPE', currency, exchangeRates)
    : feeCalculation.finalFee

  // Format with currency suffix
  const suffix = currency === 'USD' ? '' : ` ${currency}`
  const prefix = currency === 'USD' ? '$' : ''

  return {
    baseFee: `${prefix}${baseFeeConverted.toFixed(4)}${suffix}`,
    discount: `${prefix}${discountConverted.toFixed(4)}${suffix}`,
    finalFee: `${prefix}${finalFeeConverted.toFixed(4)}${suffix}`,
    savings: feeCalculation.discountPercentage > 0
      ? `Save ${feeCalculation.discountPercentage}% with ${feeCalculation.nativeToken}`
      : 'No discount available',
  }
}

/**
 * Check if discount is available for fee type with payment token
 *
 * @param feeType - Type of fee
 * @param paymentToken - Token used for payment
 * @returns True if discount is available
 */
export function isDiscountAvailable(
  feeType: FeeType,
  paymentToken: Currency
): boolean {
  const nativeToken = getNativeTokenForFee(feeType)
  return paymentToken === nativeToken
}

/**
 * Get recommended payment token for maximum discount
 *
 * @param feeType - Type of fee
 * @returns Recommended payment token (native token)
 */
export function getRecommendedPaymentToken(feeType: FeeType): Currency {
  return getNativeTokenForFee(feeType)
}

/**
 * Batch fee calculation for multiple operations
 *
 * @param operations - Array of fee calculations
 * @returns Aggregated fee calculation
 */
export function aggregateFees(operations: FeeCalculation[]): {
  totalBaseFee: number
  totalDiscount: number
  totalFinalFee: number
  averageDiscountPercentage: number
} {
  const totalBaseFee = operations.reduce((sum, op) => sum + op.baseFee, 0)
  const totalDiscount = operations.reduce((sum, op) => sum + op.discount, 0)
  const totalFinalFee = operations.reduce((sum, op) => sum + op.finalFee, 0)
  const averageDiscountPercentage =
    operations.reduce((sum, op) => sum + op.discountPercentage, 0) / operations.length

  return {
    totalBaseFee,
    totalDiscount,
    totalFinalFee,
    averageDiscountPercentage,
  }
}
