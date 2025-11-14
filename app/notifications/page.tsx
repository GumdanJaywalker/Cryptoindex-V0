'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle2 } from 'lucide-react'

type NotificationItem = {
  id: string
  title: string
  desc?: string
  createdAt: number
  read?: boolean
  type?: 'trade' | 'governance' | 'referral' | 'system'
}

const STORAGE_KEY = 'notifications:list'

function loadInitial(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const now = Date.now()
  return [
    { id: 'n1', title: 'Limit filled', desc: 'DOG_INDEX @ $1.2345', createdAt: now - 60 * 60 * 1000, type: 'trade' },
    { id: 'n2', title: 'Gov update', desc: 'Rebalance queued (AIIDX)', createdAt: now - 2 * 60 * 60 * 1000, type: 'governance' },
    { id: 'n3', title: 'Referral', desc: '+$12.30 earnings (24h)', createdAt: now - 6 * 60 * 60 * 1000, type: 'referral' },
  ]
}

function timeAgo(ts: number): string {
  const ms = Math.max(0, Date.now() - ts)
  const h = Math.floor(ms / 3_600_000)
  if (h >= 24) return `${Math.floor(h / 24)}d ago`
  if (h >= 1) return `${h}h ago`
  const m = Math.floor(ms / 60_000)
  return `${m}m ago`
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const unreadCount = useMemo(() => items.filter(i => !i.read).length, [items])

  useEffect(() => {
    setItems(loadInitial())
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })))
  const toggleRead = (id: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, read: !i.read }) : i))
  const clearAll = () => setItems([])

  return (
    <div className="min-h-screen bg-teal-base text-white">
      <div className="px-4 lg:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-300" />
            <h1 className="text-2xl font-bold">Notifications</h1>
            <Badge variant="outline" className="text-xs text-slate-300 border-teal">{unreadCount} unread</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-xs glass-button-brand" onClick={markAllRead}>
              Mark all as read
            </Button>
            <Button size="sm" variant="outline" className="text-xs glass-button-brand" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="glass-card border-teal">
            <CardContent className="p-8 text-center text-slate-400">
              No notifications yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items
              .slice()
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
              .map((n) => (
              <Card key={n.id} className="glass-card-dynamic border-teal">
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{n.title}</div>
                      {!n.read && <span className="inline-flex items-center text-[11px] px-1.5 py-0.5 rounded bg-brand text-black">NEW</span>}
                    </div>
                    {n.desc && <div className="text-sm text-slate-400">{n.desc}</div>}
                    <div className="text-xs text-slate-500 mt-1">{timeAgo(n.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs glass-button-brand" onClick={() => toggleRead(n.id)}>
                      {n.read ? 'Mark unread' : 'Mark read'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
