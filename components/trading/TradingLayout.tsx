'use client'

import dynamic from 'next/dynamic'
import { IndexInfoBar } from './IndexInfoBar'
import { ChartArea } from './ChartArea'
import { TradingPanel } from './TradingPanelSimple'
import { OrderBookTrades } from './OrderBookTrades'
import { PresetPanel } from './PresetPanel'
import { WhaleAlert } from './WhaleAlert'

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
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* 최상단 바 (Full Width) - 인덱스 정보 헤더 */}
      <div className="w-full border-b border-border sticky top-16 z-10 bg-background">
        <IndexInfoBar />
      </div>

      {/* 메인 거래 영역 */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* 좌측+중간 영역 (80%) */}
        <div className="w-[80%] flex flex-col bg-background overflow-hidden">
          {/* 상단: 차트 + 오더북 */}
          <div className="flex h-[calc(100vh-64px-50vh)] min-h-0">
            {/* 차트 영역 (68.75% of 80%) */}
            <div className="w-[68.75%] border-r border-border bg-background overflow-auto">
              <ChartArea />
            </div>

            {/* 오더북 영역 (31.25% of 80%) */}
            <div className="w-[31.25%] bg-background overflow-auto">
              <OrderBookTrades />
            </div>
          </div>

          {/* 하단: Bottom Tabs - 명확한 경계선과 함께 */}
          <div className="h-[50vh] border-t-2 border-slate-700 bg-background overflow-auto">
            <TradingBottomTabs />
          </div>
        </div>

        {/* 우측 거래창 영역 (20%) */}
        <div className="w-[20%] min-h-[calc(100vh-64px)] flex flex-col border-l border-border bg-background">
          {/* Trading Panel - 자연스러운 크기 */}
          <div className="flex-shrink-0">
            <TradingPanel />
          </div>

          {/* Preset Panel - 거래 프리셋 */}
          <div className="mt-3 pt-3 border-t border-muted-foreground/20 flex-shrink-0">
            <PresetPanel />
          </div>

          {/* Whale Alert - 고정 높이로 독립적인 섹션 */}
          <div className="mt-3 pt-3 px-3 border-t border-muted-foreground/20 flex-shrink-0">
            <WhaleAlert />
          </div>

          {/* 여백 공간 */}
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  )
}