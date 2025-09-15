"use client"

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useNotificationsStore } from '@/lib/store/notifications-store'

export function NotificationsFilters() {
  const filter = useNotificationsStore((s) => s.filter)
  const setFilter = useNotificationsStore((s) => s.setFilter)

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      { value: 'trade', label: 'Trade' },
      { value: 'governance', label: 'Governance' },
      { value: 'referral', label: 'Referral' },
      { value: 'price_alert', label: 'Price Alerts' },
      { value: 'system', label: 'System' },
    ],
    []
  )

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="flex-1">
        <Input
          placeholder="Search notifications..."
          value={filter.query}
          onChange={(e) => setFilter({ query: e.target.value })}
          className="bg-transparent border-cryptoindex-medium/40"
          aria-label="Search notifications"
        />
      </div>

      <Select value={filter.category} onValueChange={(v) => setFilter({ category: v as any })}>
        <SelectTrigger className="w-[170px] bg-transparent border-cryptoindex-medium/40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-cryptoindex-medium/40">
          {categoryOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="inline-flex items-center gap-2 text-sm text-cryptoindex-cream/90">
        <Checkbox
          checked={filter.unreadOnly}
          onCheckedChange={(v) => setFilter({ unreadOnly: Boolean(v) })}
          aria-label="Unread only"
        />
        Unread only
      </label>
    </div>
  )
}

export default NotificationsFilters

