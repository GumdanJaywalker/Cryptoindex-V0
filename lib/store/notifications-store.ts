import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NewNotification, NotificationItem, NotificationCategory } from '@/lib/types/notifications'

type Filter = {
  query: string
  category: 'all' | NotificationCategory
  unreadOnly: boolean
}

type NotificationsState = {
  items: NotificationItem[]
  filter: Filter
  add: (n: NewNotification) => NotificationItem
  markRead: (id: string, read?: boolean) => void
  markAllRead: () => void
  clearAll: () => void
  setFilter: (f: Partial<Filter>) => void
  seedIfEmpty: () => void
}

const seed = (): NotificationItem[] => [
  {
    id: `ntf_${Date.now()}_1`,
    title: 'Limit filled',
    body: 'DOG_INDEX @ $1.2345',
    category: 'trade',
    read: false,
    createdAt: Date.now() - 1000 * 60 * 5,
    meta: { symbol: 'DOG_INDEX' },
  },
  {
    id: `ntf_${Date.now()}_2`,
    title: 'Rebalance queued',
    body: 'AIIDX proposal moved to queue',
    category: 'governance',
    read: false,
    createdAt: Date.now() - 1000 * 60 * 30,
    meta: { indexId: 'AIIDX' },
  },
  {
    id: `ntf_${Date.now()}_3`,
    title: 'Referral earnings',
    body: '+$12.30 in last 24h',
    category: 'referral',
    read: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
]

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],
      filter: { query: '', category: 'all', unreadOnly: false },
      add: (n: NewNotification) => {
        const item: NotificationItem = {
          id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,

          ...n,
          read: n.read ?? false,
          createdAt: n.createdAt ?? Date.now(),
        }
        set({ items: [item, ...get().items] })
        return item
      },
      markRead: (id: string, read = true) =>
        set({ items: get().items.map((x) => (x.id === id ? { ...x, read } : x)) }),
      markAllRead: () => set({ items: get().items.map((x) => ({ ...x, read: true })) }),
      clearAll: () => set({ items: [] }),
      setFilter: (f: Partial<Filter>) => set({ filter: { ...get().filter, ...f } }),
      seedIfEmpty: () => {
        if (get().items.length === 0) {
          set({ items: seed() })
        }
      },
    }),
    { name: 'notifications-v1' }
  )
)
