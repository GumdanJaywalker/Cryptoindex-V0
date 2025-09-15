export type NotificationCategory =
  | 'system'
  | 'trade'
  | 'governance'
  | 'referral'
  | 'price_alert'

export interface NotificationMeta {
  // Optional metadata for deep linking or context
  txHash?: string
  indexId?: string
  symbol?: string
  amount?: string
  url?: string
}

export interface NotificationItem {
  id: string
  title: string
  body?: string
  category: NotificationCategory
  read: boolean
  createdAt: number // epoch ms
  meta?: NotificationMeta
}

export type NewNotification = Omit<NotificationItem, 'id' | 'read' | 'createdAt'> & {
  read?: boolean
  createdAt?: number
}

