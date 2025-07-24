'use client'

import { IndexInfoBar } from './IndexInfoBar'
import { ChartArea } from './ChartArea'
import { OrderBook } from './OrderBook'
import { TradingPanel } from './TradingPanel'
import { RecentTrades } from './RecentTrades'
import { CommunityFeed } from './CommunityFeed'
import { TradingBottomTabs } from './TradingBottomTabs'

export function TradingLayout() {
  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* 최상단 바 (Full Width) - 인덱스 정보 헤더 */}
      <div className="w-full border-b border-slate-800">
        <IndexInfoBar />
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex min-h-0">
        {/* 좌측 영역 (60% 너비) */}
        <div className="w-[60%] flex flex-col border-r border-slate-800">
          {/* 차트 영역 (70% 높이) */}
          <div className="h-[70%] border-b border-slate-800">
            <ChartArea />
          </div>
          
          {/* 하단 탭 영역 (30% 높이) */}
          <div className="h-[30%]">
            <TradingBottomTabs />
          </div>
        </div>

        {/* 우측 영역 (40% 너비) */}
        <div className="w-[40%] flex flex-col">
          {/* Order Book (25% 높이) */}
          <div className="h-[25%] border-b border-slate-800">
            <OrderBook />
          </div>

          {/* Trading Panel (35% 높이) */}
          <div className="h-[35%] border-b border-slate-800">
            <TradingPanel />
          </div>

          {/* Recent Trades (20% 높이) */}
          <div className="h-[20%] border-b border-slate-800">
            <RecentTrades />
          </div>

          {/* Community Feed (20% 높이) */}
          <div className="h-[20%]">
            <CommunityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}