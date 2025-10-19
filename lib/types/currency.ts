/**
 * Currency types and interfaces for the global currency system
 */

export type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC' | 'HIIN' | 'HIDE'

export interface ExchangeRates {
  HYPE_USD: number
  HYPE_USDC: number
  HYPE_USDT: number
  HYPE_BTC: number
  HYPE_HIIN: number  // HyperIndex Index Token
  HYPE_HIDE: number  // HyperIndex DEX Token
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
