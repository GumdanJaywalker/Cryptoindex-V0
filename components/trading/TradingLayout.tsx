'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { IndexInfoBar } from './IndexInfoBar'
import { ChartArea } from './ChartArea'
import { TradingPanel } from './TradingPanelSimple'
import { OrderBookTrades } from './OrderBookTrades'
import { WhaleAlert } from './WhaleAlert'
import { useTradingStore } from '@/lib/store/trading-store'
import { getAllIndexes } from '@/lib/data/unified-indexes'

// Dynamic import to prevent hydration issues
const TradingBottomTabs = dynamic(
  () => import('./TradingBottomTabs').then(mod => ({ default: mod.TradingBottomTabs })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[50vh] bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }
)

export function TradingLayout() {
  const setIndices = useTradingStore(state => state.setIndices)

  // Initialize indices from unified data source on mount
  useEffect(() => {
    const unifiedIndexes = getAllIndexes()
    setIndices(unifiedIndexes)
  }, [setIndices])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* CSS Grid 3x3 Layout */}
      <div className="grid grid-cols-[60%_20%_20%] grid-rows-[auto_60vh_auto]">

        {/* Row 1 - Full width index info bar */}
        <div className="col-span-3 border-b border-teal">
          <IndexInfoBar />
        </div>

        {/* Row 2 - Main content area */}
        <div className="border-r border-teal overflow-hidden h-[60vh]">
          <ChartArea />
        </div>
        <div className="border-r border-teal h-[60vh]">
          <OrderBookTrades />
        </div>
        <div className="border-l border-teal overflow-y-auto h-[60vh]">
          <TradingPanel />
        </div>

        {/* Row 3 - Bottom section */}
        <div className="col-span-2 border-t border-teal">
          <TradingBottomTabs />
        </div>
        <div className="border-t border-l border-teal">
          <WhaleAlert />
        </div>
      </div>
    </div>
  )
}