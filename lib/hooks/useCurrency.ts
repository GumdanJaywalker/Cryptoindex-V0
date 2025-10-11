import { useCurrencyStore } from '@/lib/store/currency-store'
import type { Currency } from '@/lib/types/currency'
import {
  formatCurrency,
  formatPrice,
  formatPercentage,
  formatFee,
  formatGas,
  formatVolume,
  formatBalance,
  formatPnL,
  convertCurrency,
} from '@/lib/utils/currency'

/**
 * Hook to access currency state and formatting functions
 *
 * @returns Currency store state and formatting utilities
 *
 * Usage:
 * ```tsx
 * const { currency, formatPrice, formatBalance } = useCurrency()
 * <div>{formatPrice(1.2345)}</div> // Automatically uses selected currency
 * <div>{formatBalance(8492.50)}</div>
 * ```
 */
export function useCurrency() {
  const { currency, exchangeRates, setCurrency, getExchangeRate } = useCurrencyStore()

  return {
    // State
    currency,
    exchangeRates,

    // Actions
    setCurrency,
    getExchangeRate,

    // Formatting functions (automatically use selected currency and convert)
    formatPrice: (amount: number, targetCurrency?: Currency) =>
      formatPrice(amount, targetCurrency || currency, exchangeRates),

    formatBalance: (amount: number, targetCurrency?: Currency) =>
      formatBalance(amount, targetCurrency || currency, exchangeRates),

    formatVolume: (amount: number, targetCurrency?: Currency) =>
      formatVolume(amount, targetCurrency || currency, exchangeRates),

    formatPnL: (amount: number, targetCurrency?: Currency) =>
      formatPnL(amount, targetCurrency || currency, exchangeRates),

    formatCurrency: (amount: number, targetCurrency?: Currency, options?: any) =>
      formatCurrency(amount, targetCurrency || currency, options),

    // Always HYPE (regardless of selected currency)
    formatFee,
    formatGas,

    // Utility
    formatPercentage,
    convertCurrency: (amount: number, from: Currency, to: Currency) =>
      convertCurrency(amount, from, to, exchangeRates),
  }
}

/**
 * Hook to get formatting functions with explicit currency
 * Useful when you need to format in multiple currencies in the same component
 *
 * Usage:
 * ```tsx
 * const formatter = useCurrencyFormatter()
 * <div>{formatter.price(1.2345, 'USD')}</div>
 * <div>{formatter.price(1.2345, 'HYPE')}</div>
 * ```
 */
export function useCurrencyFormatter() {
  return {
    price: formatPrice,
    balance: formatBalance,
    volume: formatVolume,
    pnl: formatPnL,
    currency: formatCurrency,
    fee: formatFee,
    gas: formatGas,
    percentage: formatPercentage,
  }
}
