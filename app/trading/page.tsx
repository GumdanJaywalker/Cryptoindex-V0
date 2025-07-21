'use client'

import { Header } from '@/components/layout/Header'
import { IndexInfoBar } from '@/components/trading/IndexInfoBar'
import { ChartArea } from '@/components/trading/ChartArea'
import { OrderBook } from '@/components/trading/OrderBook'
import { TradingPanel } from '@/components/trading/TradingPanel'
import { RecentTrades } from '@/components/trading/RecentTrades'
import { CommunityFeed } from '@/components/trading/CommunityFeed'

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      {/* Index Info Bar - Full Width */}
      <IndexInfoBar />
      
      {/* Main Trading Layout */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Side - Chart & Tabs (60%) */}
        <div className="flex-1 flex flex-col border-r border-slate-800">
          <ChartArea />
        </div>
        
        {/* Right Side - Order Book & Trading Panel (40%) */}
        <div className="w-2/5 flex flex-col">
          {/* Order Book (25%) */}
          <div className="h-1/4 border-b border-slate-800">
            <OrderBook />
          </div>
          
          {/* Trading Panel (35%) */}
          <div className="h-[35%] border-b border-slate-800">
            <TradingPanel />
          </div>
          
          {/* Recent Trades (20%) */}
          <div className="h-1/5 border-b border-slate-800">
            <RecentTrades />
          </div>
          
          {/* Community Feed (20%) */}
          <div className="h-1/5">
            <CommunityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}