'use client'

import { mockMarketData, formatMarketValue, formatNumber } from '@/lib/mock/market-data'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PriceAlertsPopover } from './PriceAlertsPopover'

export function Footer() {
  const data = mockMarketData

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#0A1215] border-t border-[#1A2428] px-6 py-1.5 z-50">
      <div className="flex items-center justify-between gap-4 text-sm">
        {/* Left: Network Status */}
        <div className="flex items-center gap-2">
          <span className="text-brand font-medium">Network</span>
          <span className="text-slate-400">{data.networkLatency}ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{formatNumber(data.blockHeight)}</span>
        </div>

        {/* Center: Market Overview with Tooltips */}
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-4">
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
              <TooltipContent side="top" className="bg-slate-800 border-slate-700">
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
              <TooltipContent side="top" className="bg-slate-800 border-slate-700">
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
              <TooltipContent side="top" className="bg-slate-800 border-slate-700">
                <p className="text-xs">Total Value Locked across all indexes</p>
                <p className="text-brand text-xs mt-1">
                  ${formatNumber(data.tvl24h)} HYPE
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Right: Price Alerts */}
        <div className="flex items-center">
          <PriceAlertsPopover />
        </div>
      </div>
    </footer>
  )
}

export default Footer
