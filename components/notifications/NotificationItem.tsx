"use client"

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNotificationsStore } from '@/lib/store/notifications-store'
import type { NotificationItem as NItem } from '@/lib/types/notifications'
import { Bell, CheckCircle2, ArrowUpRight, Scale, DollarSign } from 'lucide-react'
import Link from 'next/link'

function formatUTC(when: number) {
  // Stable, SSR-safe formatting independent of server/client locale
  const fmt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC'
  })
  return fmt.format(new Date(when)) + ' UTC'
}

function CategoryBadge({ category }: { category: NItem['category'] }) {
  const map: Record<NItem['category'], { label: string; className: string }> = {
    system: { label: 'System', className: 'border-cryptoindex-medium/40 text-cryptoindex-cream' },
    trade: { label: 'Trade', className: 'border-cryptoindex-soft/40 text-cryptoindex-soft' },
    governance: { label: 'Gov', className: 'border-cryptoindex-highlight/40 text-cryptoindex-highlight' },
    referral: { label: 'Referral', className: 'border-cryptoindex-warm/40 text-cryptoindex-warm' },
    price_alert: { label: 'Alert', className: 'border-yellow-400/40 text-yellow-300' },
  }
  const { label, className } = map[category]
  return <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', className)}>{label}</Badge>
}

function CategoryIcon({ category }: { category: NItem['category'] }) {
  switch (category) {
    case 'trade':
      return <CheckCircle2 className="w-4 h-4 text-cryptoindex-soft" />
    case 'governance':
      return <Scale className="w-4 h-4 text-cryptoindex-highlight" />
    case 'referral':
      return <DollarSign className="w-4 h-4 text-cryptoindex-warm" />
    case 'price_alert':
      return <Bell className="w-4 h-4 text-yellow-300" />
    default:
      return <Bell className="w-4 h-4 text-cryptoindex-cream" />
  }
}

export function NotificationItem({ item }: { item: NItem }) {
  const markRead = useNotificationsStore((s) => s.markRead)
  const isUnread = !item.read

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3 transition-colors',
        'border-cryptoindex-medium/30 bg-cryptoindex-primary/20 hover:bg-cryptoindex-primary/30'
      )}
      role="article"
      aria-live="polite"
    >
      <div className="mt-0.5">
        <CategoryIcon category={item.category} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('text-sm font-medium', isUnread ? 'text-white' : 'text-cryptoindex-cream')}>{item.title}</p>
          <CategoryBadge category={item.category} />
        </div>
        {item.body && <p className="text-xs text-cryptoindex-cream/80 mt-1 line-clamp-2">{item.body}</p>}
        <div className="mt-2 flex items-center gap-2 text-[11px] text-cryptoindex-warm/90">
          <time dateTime={new Date(item.createdAt).toISOString()}>
            {formatUTC(item.createdAt)}
          </time>
          {item.meta?.url && (
            <Link href={item.meta.url} className="inline-flex items-center gap-1 hover:text-white">
              Open <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isUnread && (
          <Button variant="outline" size="sm" className="text-xs border-cryptoindex-medium/40" onClick={() => markRead(item.id, true)}>
            Mark read
          </Button>
        )}
      </div>
    </div>
  )
}

export default NotificationItem
