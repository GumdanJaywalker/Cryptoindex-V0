'use client'

import { IndexInfoBar } from './IndexInfoBar'
import { ChartArea } from './ChartArea'
import { TradingPanel } from './TradingPanelSimple'
import { TradingBottomTabs } from './TradingBottomTabs'
import { OrderBookTrades } from './OrderBookTrades'
import { WhaleAlert } from './WhaleAlert'

export function TradingLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 최상단 바 (Full Width) - 인덱스 정보 헤더 */}
      <div className="w-full border-b border-slate-800 sticky top-0 z-10 bg-slate-950">
        <IndexInfoBar />
      </div>

      {/* 메인 거래 영역 */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* 좌측+중간 영역 (80%) */}
        <div className="w-[80%] flex flex-col bg-slate-950">
          {/* 상단: 차트 + 오더북 */}
          <div className="flex h-[75vh]">
            {/* 차트 영역 (68.75% of 80%) */}
            <div className="w-[68.75%] border-r border-slate-800 bg-slate-950">
              <ChartArea />
            </div>

            {/* 오더북 영역 (31.25% of 80%) */}
            <div className="w-[31.25%] bg-slate-950">
              <OrderBookTrades />
            </div>
          </div>

          {/* 하단: Bottom Tabs - 페이지 스크롤로 아래까지 볼 수 있도록 */}
          <div className="min-h-[50vh] border-t border-slate-800 bg-slate-950">
            <TradingBottomTabs />
          </div>
        </div>

        {/* 우측 거래창 영역 (20%) */}
        <div className="w-[20%] h-[125vh] flex flex-col border-l border-slate-800 bg-slate-950">
          {/* Trading Panel - 자연스러운 크기 */}
          <div>
            <TradingPanel />
          </div>

          {/* Whale Alert - BottomTabs와 맞춰서 내부 스크롤 */}
          <div className="flex-1 border-t border-slate-700">
            <WhaleAlert />
          </div>
        </div>
      </div>
    </div>
  )
}