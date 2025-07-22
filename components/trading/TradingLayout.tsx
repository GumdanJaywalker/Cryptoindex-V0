'use client'

import { useState, useEffect } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { IndexInfoBar } from './IndexInfoBar'
import { ChartArea } from './ChartArea'
import { OrderBook } from './OrderBook'
import { TradingPanel } from './TradingPanel'
import { RecentTrades } from './RecentTrades'
import { CommunityFeed } from './CommunityFeed'
import { AccountPanel } from './AccountPanel'

const ResponsiveGridLayout = WidthProvider(Responsive)

// 고정 레이아웃 (차트 영역 최대화)
const defaultLayouts = {
  lg: [
    { i: 'favoriteCoins', x: 0, y: 0, w: 12, h: 1, static: true },
    { i: 'coinInfo', x: 0, y: 1, w: 12, h: 2, static: true },
    { i: 'chart', x: 0, y: 3, w: 8, h: 20, static: true },
    { i: 'orderBook', x: 8, y: 3, w: 4, h: 16, static: true },
    { i: 'tradingPanel', x: 8, y: 19, w: 4, h: 10, static: true },
    { i: 'accountTable', x: 0, y: 23, w: 4, h: 4, static: true }
  ],
  md: [
    { i: 'favoriteCoins', x: 0, y: 0, w: 10, h: 1, minH: 1, maxH: 1 },
    { i: 'coinInfo', x: 0, y: 1, w: 10, h: 2, minH: 2, maxH: 2 },
    { i: 'chart', x: 0, y: 3, w: 6, h: 12 },
    { i: 'orderBook', x: 6, y: 3, w: 4, h: 12 },
    { i: 'tradingPanel', x: 6, y: 15, w: 4, h: 10 },
    { i: 'accountTable', x: 0, y: 15, w: 6, h: 6, minH: 4, maxH: 12 },
    { i: 'accountInfo', x: 6, y: 25, w: 4, h: 6, minH: 4, maxH: 10 }
  ],
  sm: [
    { i: 'favoriteCoins', x: 0, y: 0, w: 6, h: 1, minH: 1, maxH: 1 },
    { i: 'coinInfo', x: 0, y: 1, w: 6, h: 2, minH: 2, maxH: 2 },
    { i: 'chart', x: 0, y: 3, w: 6, h: 10 },
    { i: 'orderBook', x: 0, y: 13, w: 6, h: 8 },
    { i: 'tradingPanel', x: 0, y: 21, w: 6, h: 10 },
    { i: 'accountTable', x: 0, y: 31, w: 6, h: 6, minH: 4, maxH: 12 },
    { i: 'accountInfo', x: 0, y: 39, w: 6, h: 5, minH: 4, maxH: 10 }
  ]
}

const components = {
  favoriteCoins: () => (
    <div className="h-full flex items-center px-4" style={{ background: 'var(--hl-bg-primary)', borderBottom: '1px solid var(--hl-border)' }}>
      <div className="text-yellow-400 mr-3">⭐</div>
      <div className="text-sm hl-text-secondary">Favorite Coins</div>
    </div>
  ),
  coinInfo: () => <IndexInfoBar />,
  chart: () => <ChartArea />,
  orderBook: () => <OrderBook />,
  tradingPanel: () => <TradingPanel />,
  accountTable: () => (
    <div className="h-full p-3 flex flex-col justify-center rounded" style={{ background: 'var(--hl-bg-primary)', border: '1px solid var(--hl-border)' }}>
      <div className="hl-text-primary font-medium mb-1.5 text-xs">Account Overview</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="hl-text-secondary">Total Balance:</span>
          <span className="hl-text-primary">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="hl-text-secondary">Available:</span>
          <span className="hl-accent-green">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="hl-text-secondary">In Orders:</span>
          <span className="hl-text-primary">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="hl-text-secondary">PNL (24h):</span>
          <span className="hl-accent-green">+$0.00</span>
        </div>
      </div>
    </div>
  )
}

export function TradingLayout() {
  const [layouts, setLayouts] = useState(defaultLayouts)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 레이아웃 초기화 (개발 중에만)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rgl-lg')
      localStorage.removeItem('rgl-md')
      localStorage.removeItem('rgl-sm')
    }
  }, [])

  const onLayoutChange = (layout: Layout[], allLayouts: any) => {
    console.log('Layout changed:', layout)
    console.log('All layouts:', allLayouts)
    setLayouts(allLayouts)
  }

  if (!mounted) {
    return <div className="h-screen bg-slate-950" />
  }

  return (
    <div style={{ background: 'var(--hl-bg-primary)' }} className="text-white">
      <div style={{ background: 'var(--hl-bg-secondary)', marginBottom: '30px' }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={30}
          margin={[3, 3]}
          containerPadding={[3, 3]}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          resizeHandles={['se']}
          isResizable={false}
          isDraggable={false}
          allowOverlap={false}
          preventCollision={true}
          compactType="vertical"
          useCSSTransforms={true}
          style={{ minHeight: '900px' }}
        >
          {Object.entries(components).map(([key, Component]) => (
            <div 
              key={key} 
              className={`rounded relative ${key === 'accountTable' ? '' : 'trading-component'}`}
              data-grid={layouts.lg?.find(item => item.i === key)}
              style={key === 'accountTable' ? { background: 'var(--hl-bg-primary)', border: '1px solid var(--hl-border)' } : {}}
            >
              {/* Drag handle - accountTable은 제외 */}
              {key !== 'accountTable' && <div className="drag-handle h-1 w-full cursor-move" />}
              <div className={key === 'accountTable' ? 'h-full' : 'h-[calc(100%-4px)] overflow-hidden'}>
                <Component />
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  )
}