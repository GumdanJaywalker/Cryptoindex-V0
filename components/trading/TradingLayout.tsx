'use client'

import { IndexInfoBar } from './IndexInfoBar'
import { ChartArea } from './ChartArea'
import { OrderBook } from './OrderBook'
import { TradingPanel } from './TradingPanel'
import { RecentTrades } from './RecentTrades'
import { TradingBottomTabs } from './TradingBottomTabs'
import { BuySellAnalysis } from './BuySellAnalysis'

export function TradingLayout() {
  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* 최상단 바 (Full Width) - 인덱스 정보 헤더 */}
      <div className="w-full border-b border-slate-800">
        <IndexInfoBar />
      </div>

      {/* 상단 메인 컨텐츠 영역 - 차트와 사이드 패널들 */}
      <div className="flex-2 flex min-h-0" style={{ flex: '2 1 0%' }}>
        {/* 좌측 영역 (50% 너비) - 차트 */}
        <div className="w-[50%] flex flex-col border-r border-slate-800">
          {/* 차트 영역 (전체 높이) */}
          <div className="h-full">
            <ChartArea />
          </div>
        </div>

        {/* 중간 영역 (25% 너비) - Order Book, Recent Trades만 (CommunityFeed 제거) */}
        <div className="w-[25%] flex flex-col border-r border-slate-800 min-h-0">
          {/* Order Book - 50% */}
          <div className="flex-1 border-b border-slate-800 min-h-0">
            <OrderBook />
          </div>

          {/* Recent Trades - 50% */}
          <div className="flex-1 min-h-0">
            <RecentTrades />
          </div>
        </div>

        {/* 우측 영역 (25% 너비) - Trading Panel + Buy & Sell Analysis */}
        <div className="w-[25%] flex flex-col min-h-0">
          {/* Trading Panel - 60% */}
          <div className="flex-2 min-h-0" style={{ flex: '3 1 0%' }}>
            <TradingPanel />
          </div>

          {/* Buy & Sell Analysis - 40% */}
          <div className="flex-1 border-t border-slate-800 min-h-0" style={{ flex: '2 1 0%' }}>
            <BuySellAnalysis />
          </div>
        </div>
      </div>

      {/* 하단 탭 영역 - 좌측 75%만 사용 (우측 25% 침범 금지) */}
      <div className="flex min-h-0" style={{ flex: '1 1 0%', minHeight: '300px' }}>
        {/* 좌측 75% - TradingBottomTabs */}
        <div className="w-[75%] min-h-0">
          <TradingBottomTabs />
        </div>
        
        {/* 우측 25% - 빈 공간 (우측 열과 정렬) */}
        <div className="w-[25%] bg-slate-950 border-l border-slate-800">
          {/* 빈 공간 또는 추가 정보 영역 */}
        </div>
      </div>
    </div>
  )
}