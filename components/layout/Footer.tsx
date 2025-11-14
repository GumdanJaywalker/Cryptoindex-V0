'use client'

import Link from 'next/link'
import { mockMarketData, formatMarketValue, formatNumber } from '@/lib/mock/market-data'
import { mockPriceAlerts } from '@/lib/mock/price-alerts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PriceAlertsPopover } from './PriceAlertsPopover'

export function Footer() {
  const data = mockMarketData
  const activeAlerts = mockPriceAlerts.filter((alert) => alert.isActive)
  const hasActiveAlerts = activeAlerts.length > 0

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-teal-darker border-t border-teal px-6 py-1 z-50">
      <div className="flex items-center text-xs">
        {/* Left: Network Status */}
        <div className="flex items-center gap-2">
          <span className="text-brand font-medium">Network</span>
          <span className="text-slate-400">{data.networkLatency}ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{formatNumber(data.blockHeight)}</span>
        </div>

        <span className="text-slate-600 mx-2">|</span>

        {/* Center-Left: Market Overview with Tooltips */}
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-3">
            <span className="text-brand font-medium">Market Overview</span>
            <span className="text-slate-600">|</span>

            {/* IDX Count */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <span className="text-slate-400">IDX</span>
                  <span className="text-white font-medium">{data.totalIndexes}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="glass-card-dynamic border-teal">
                <p className="text-xs">Total number of active indexes</p>
                <p className="text-brand text-xs mt-1">
                  {data.totalIndexes} indexes trading
                </p>
              </TooltipContent>
            </Tooltip>

            <span className="text-slate-600">|</span>

            {/* Vol 24h */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <span className="text-slate-400">Vol 24h</span>
                  <span className="text-white font-medium">
                    {formatMarketValue(data.volume24h)} HYPE
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="glass-card-dynamic border-teal">
                <p className="text-xs">
                  Total trading volume in the last 24 hours
                </p>
                <p className="text-brand text-xs mt-1">
                  ${formatNumber(data.volume24h)} HYPE
                </p>
              </TooltipContent>
            </Tooltip>

            <span className="text-slate-600">|</span>

            {/* 24h TVL */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <span className="text-slate-400">24h TVL</span>
                  <span className="text-white font-medium">
                    {formatMarketValue(data.tvl24h)} HYPE
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="glass-card-dynamic border-teal">
                <p className="text-xs">Total Value Locked across all indexes</p>
                <p className="text-brand text-xs mt-1">
                  ${formatNumber(data.tvl24h)} HYPE
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <span className="text-slate-600 mx-2">|</span>

        {/* Center-Right: Price Alerts (Text Button) */}
        <PriceAlertsPopover showAsText hasActiveAlerts={hasActiveAlerts} />

        {/* Right: Footer Links - push to far right */}
        <div className="flex items-center gap-2 text-slate-400 ml-auto">
          <Link href="/docs" className="hover:text-brand transition-colors">
            Docs
          </Link>
          <span className="text-slate-600">|</span>
          <Link href="/support" className="hover:text-brand transition-colors">
            Support
          </Link>
          <span className="text-slate-600">|</span>
          <Link href="/terms" className="hover:text-brand transition-colors">
            Terms
          </Link>
          <span className="text-slate-600">|</span>
          <Link href="/privacy" className="hover:text-brand transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
