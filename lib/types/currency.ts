/**
 * Currency types and interfaces for the global currency system
 */

export type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC'

export interface ExchangeRates {
  HYPE_USD: number
  HYPE_USDC: number
  HYPE_USDT: number
  HYPE_BTC: number
}

export interface CurrencyFormatOptions {
  decimals?: number
  showSymbol?: boolean
  compact?: boolean // For large numbers (e.g., 1.2M)
  forceSign?: boolean // Show + for positive numbers
}

export interface CurrencyStore {
  currency: Currency
  exchangeRates: ExchangeRates
  setCurrency: (currency: Currency) => void
  getExchangeRate: (from: Currency, to: Currency) => number
  fetchExchangeRates: () => Promise<void>
}
