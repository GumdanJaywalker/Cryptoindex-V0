'use client'

import { useState } from 'react'
import { Megaphone, TrendingUp, TrendingDown, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { mockPriceAlerts, PriceAlert } from '@/lib/mock/price-alerts'

export function PriceAlertsPopover({
  showAsText = false,
  hasActiveAlerts
}: {
  showAsText?: boolean
  hasActiveAlerts?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const activeAlerts = mockPriceAlerts.filter((alert) => alert.isActive)
  const showDot = hasActiveAlerts !== undefined ? hasActiveAlerts : activeAlerts.length > 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {showAsText ? (
          <button
            className="relative px-2 py-1 hover:text-brand transition-colors text-brand text-xs font-medium"
            aria-label="Price Alerts"
          >
            Price Alerts
            {showDot && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-brand rounded-full" />
            )}
          </button>
        ) : (
          <button
            className="relative p-2 hover:bg-teal-card/50 rounded-lg transition-colors"
            aria-label="Price Alerts"
          >
            <Megaphone className="w-5 h-5 text-slate-400 hover:text-brand transition-colors" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
            )}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 glass-card-dynamic border-teal p-0"
        align="end"
        side="top"
        sideOffset={8}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Price Alerts</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              No active price alerts
            </p>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full mt-4 glass-button-brand"
            onClick={() => setIsOpen(false)}
          >
            Manage Alerts
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AlertCard({ alert }: { alert: PriceAlert }) {
  const isClose =
    alert.condition === 'above'
      ? alert.currentPrice >= alert.targetPrice * 0.95
      : alert.currentPrice <= alert.targetPrice * 1.05

  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        isClose
          ? 'bg-yellow-500/10 border-yellow-500/30'
          : 'bg-teal-card/50 border-teal'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-white font-medium text-sm">
            {alert.indexSymbol}
          </div>
          <div className="text-slate-400 text-xs">{alert.indexName}</div>
        </div>
        {alert.condition === 'above' ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
      </div>

      <div className="flex items-baseline gap-2 text-sm">
        <span className="text-slate-400">
          {alert.condition === 'above' ? 'Above' : 'Below'}
        </span>
        <span className="text-white font-medium">
          ${alert.targetPrice.toFixed(2)}
        </span>
      </div>

      <div className="mt-2 text-xs text-slate-400">
        Current: <span className="text-white">${alert.currentPrice.toFixed(2)}</span>
      </div>

      {isClose && (
        <div className="mt-2 text-xs text-yellow-400 font-medium">
          Almost there!
        </div>
      )}
    </div>
  )
}
