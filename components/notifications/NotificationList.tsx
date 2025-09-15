"use client"

import { useEffect, useMemo, useState } from 'react'
import { useNotificationsStore } from '@/lib/store/notifications-store'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui/button'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-cryptoindex-medium/30">
      <p className="text-cryptoindex-cream">No notifications found</p>
      <p className="text-sm text-cryptoindex-warm/80 mt-1">You’re all caught up.</p>
    </div>
  )
}

export function NotificationList() {
  const items = useNotificationsStore((s) => s.items)
  const filter = useNotificationsStore((s) => s.filter)
  const markAllRead = useNotificationsStore((s) => s.markAllRead)
  const clearAll = useNotificationsStore((s) => s.clearAll)
  const seedIfEmpty = useNotificationsStore((s) => s.seedIfEmpty)

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    // Seed demo data on client only, and only if nothing exists (first visit)
    seedIfEmpty()
  }, [seedIfEmpty])

  const filtered = useMemo(() => {
    return items
      .filter((x) => (filter.category === 'all' ? true : x.category === filter.category))
      .filter((x) => (filter.unreadOnly ? !x.read : true))
      .filter((x) => {
        const q = filter.query.trim().toLowerCase()
        if (!q) return true
        return (
          x.title.toLowerCase().includes(q) ||
          (x.body?.toLowerCase().includes(q) ?? false) ||
          (x.meta?.symbol?.toLowerCase().includes(q) ?? false)
        )
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [items, filter])

  const unreadCount = items.reduce((acc, cur) => acc + (cur.read ? 0 : 1), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-cryptoindex-warm/90">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-cryptoindex-medium/40" onClick={markAllRead}>
            Mark all read
          </Button>
          <Button variant="outline" size="sm" className="border-cryptoindex-medium/40" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      </div>

      {!hydrated || filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationList
