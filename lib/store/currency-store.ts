import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, ExchangeRates, CurrencyStore } from '@/lib/types/currency'

// Mock exchange rates (will be replaced with real API calls later)
const MOCK_EXCHANGE_RATES: ExchangeRates = {
  HYPE_USD: 1.25, // 1 HYPE = 1.25 USD
  HYPE_USDC: 1.24, // 1 HYPE = 1.24 USDC
  HYPE_USDT: 1.24, // 1 HYPE = 1.24 USDT
  HYPE_BTC: 0.000021, // 1 HYPE = 0.000021 BTC
  HYPE_HIIN: 0.01, // Mock value
  HYPE_HIDE: 0.01, // Mock value
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'HYPE', // Default currency
      exchangeRates: MOCK_EXCHANGE_RATES,

      setCurrency: (currency: Currency) => {
        set({ currency })
        // TODO: When backend is ready, save to API
        // await api.saveUserPreferences({ currency })
      },

      getExchangeRate: (from: Currency, to: Currency): number => {
        if (from === to) return 1

        const rates = get().exchangeRates

        // Convert from HYPE to target currency
        if (from === 'HYPE') {
          switch (to) {
            case 'USD':
              return rates.HYPE_USD
            case 'USDC':
              return rates.HYPE_USDC
            case 'USDT':
              return rates.HYPE_USDT
            case 'BTC':
              return rates.HYPE_BTC
            default:
              return 1
          }
        }

        // Convert from target currency to HYPE (inverse)
        if (to === 'HYPE') {
          switch (from) {
            case 'USD':
              return 1 / rates.HYPE_USD
            case 'USDC':
              return 1 / rates.HYPE_USDC
            case 'USDT':
              return 1 / rates.HYPE_USDT
            case 'BTC':
              return 1 / rates.HYPE_BTC
            default:
              return 1
          }
        }

        // For non-HYPE pairs, convert through HYPE
        const fromToHype = get().getExchangeRate(from, 'HYPE')
        const hypeToTarget = get().getExchangeRate('HYPE', to)
        return fromToHype * hypeToTarget
      },

      fetchExchangeRates: async () => {
        try {
          // TODO: Replace with real API call when backend is ready
          // const response = await fetch('/api/exchange-rates')
          // const rates = await response.json()
          // set({ exchangeRates: rates })

          // For now, use mock rates with slight random variation to simulate updates
          const variation = () => 1 + (Math.random() - 0.5) * 0.02 // ±1% variation
          set({
            exchangeRates: {
              HYPE_USD: MOCK_EXCHANGE_RATES.HYPE_USD * variation(),
              HYPE_USDC: MOCK_EXCHANGE_RATES.HYPE_USDC * variation(),
              HYPE_USDT: MOCK_EXCHANGE_RATES.HYPE_USDT * variation(),
              HYPE_BTC: MOCK_EXCHANGE_RATES.HYPE_BTC * variation(),
              HYPE_HIIN: MOCK_EXCHANGE_RATES.HYPE_HIIN * variation(),
              HYPE_HIDE: MOCK_EXCHANGE_RATES.HYPE_HIDE * variation(),
            },
          })
        } catch (error) {
          console.error('Failed to fetch exchange rates:', error)
        }
      },
    }),
    {
      name: 'currency-storage', // LocalStorage key
      partialize: (state) => ({ currency: state.currency }), // Only persist currency preference
    }
  )
)

// Utility to initialize periodic exchange rate updates
export const initializeExchangeRateUpdates = () => {
  const store = useCurrencyStore.getState()

  // Fetch rates immediately
  store.fetchExchangeRates()

  // Update rates every 30 seconds
  const intervalId = setInterval(() => {
    store.fetchExchangeRates()
  }, 30000)

  // Return cleanup function
  return () => clearInterval(intervalId)
}
