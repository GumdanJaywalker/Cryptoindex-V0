import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PriceAlert = {
  id: string
  symbol: string
  condition: 'above' | 'below'
  price: number
  createdAt: number
  active: boolean
}

type NewAlert = {
  symbol: string
  condition: 'above' | 'below'
  price: number
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
          condition: a.condition,
          price: a.price,
          createdAt: Date.now(),
          active: true,
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
    { name: 'price-alerts-v1' }
  )
)

