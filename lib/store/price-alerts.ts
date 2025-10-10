import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AlertType = 'price' | 'percentage'
export type PriceCondition = 'above' | 'below'
export type TimeFrame = '5m' | '15m' | '1h' | '4h' | '24h'

export type PriceAlert = {
  id: string
  symbol: string
  type: AlertType
  // Price-based alert
  priceCondition?: PriceCondition
  targetPrice?: number
  // Percentage-based alert
  timeFrame?: TimeFrame
  percentageChange?: number // e.g., 5 for 5%, -10 for -10%
  changeDirection?: 'increase' | 'decrease' | 'both'
  // Common fields
  createdAt: number
  active: boolean
  lastTriggered?: number
  basePrice?: number // For percentage alerts, track the starting price
}

type NewAlert = {
  symbol: string
  type: AlertType
  // Price-based alert
  priceCondition?: PriceCondition
  targetPrice?: number
  // Percentage-based alert
  timeFrame?: TimeFrame
  percentageChange?: number
  changeDirection?: 'increase' | 'decrease' | 'both'
}

type PriceAlertsState = {
  alerts: PriceAlert[]
  addAlert: (a: NewAlert) => PriceAlert
  removeAlert: (id: string) => void
  toggleActive: (id: string, active?: boolean) => void
  clearAll: () => void
}

export const usePriceAlertsStore = create<PriceAlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      addAlert: (a: NewAlert) => {
        const alert: PriceAlert = {
          id: `pa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          symbol: a.symbol.toUpperCase(),
          type: a.type,
          priceCondition: a.priceCondition,
          targetPrice: a.targetPrice,
          timeFrame: a.timeFrame,
          percentageChange: a.percentageChange,
          changeDirection: a.changeDirection,
          createdAt: Date.now(),
          active: true,
          basePrice: undefined, // Will be set when monitoring starts
        }
        set({ alerts: [alert, ...get().alerts] })
        return alert
      },
      removeAlert: (id: string) => set({ alerts: get().alerts.filter((x) => x.id !== id) }),
      toggleActive: (id: string, active?: boolean) =>
        set({
          alerts: get().alerts.map((x) => (x.id === id ? { ...x, active: typeof active === 'boolean' ? active : !x.active } : x)),
        }),
      clearAll: () => set({ alerts: [] }),
    }),
    { name: 'price-alerts-v2' }
  )
)

