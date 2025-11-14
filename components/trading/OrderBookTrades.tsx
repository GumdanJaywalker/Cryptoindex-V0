'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTradingStore } from '@/lib/store/trading-store'
import GraduationProgress from './GraduationProgress'

// Types
interface OrderBookRow {
  id: string
  price: number
  size: number
  total: number
}

interface RealtimeOrderBook {
  asks: OrderBookRow[]
  bids: OrderBookRow[]
  spread: number
  spreadPercent: number
}

// Generate initial static orderbook data for SSR
function generateStaticOrderBook(
  basePrice: number,
  count: number
): RealtimeOrderBook {
  const asks: OrderBookRow[] = []
  const bids: OrderBookRow[] = []
  const spreadBase = 0.002

  for (let i = 0; i < count; i++) {
    const price = basePrice + spreadBase + i * 0.001
    asks.push({
      id: `ask-static-${i}`,
      price,
      size: 5,
      total: 100,
    })
  }

  for (let i = 0; i < count; i++) {
    const price = basePrice - i * 0.001
    bids.push({
      id: `bid-static-${i}`,
      price,
      size: 5,
      total: 100,
    })
  }

  const spread = asks[0].price - bids[0].price
  const spreadPercent = (spread / bids[0].price) * 100

  return { asks, bids, spread, spreadPercent }
}

// Trade data type
interface Trade {
  id: string
  price: number
  size: number
  time: string
  type: 'buy' | 'sell'
}

// Generate initial static trades for SSR
function generateStaticTrades(basePrice: number, count: number = 30): Trade[] {
  const trades: Trade[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - i * 2000)
    const hours = time.getHours().toString().padStart(2, '0')
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')

    trades.push({
      id: `trade-static-${i}`,
      price: basePrice,
      size: 5,
      time: `${hours}:${minutes}:${seconds}`,
      type: i % 2 === 0 ? 'buy' : 'sell'
    })
  }

  return trades
}

// Generate realtime trades
function generateRealtimeTrades(basePrice: number, count: number = 30): Trade[] {
  const trades: Trade[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - i * 2000)
    const hours = time.getHours().toString().padStart(2, '0')
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')

    const isBuy = Math.random() > 0.5
    const priceChange = (Math.random() - 0.5) * 0.01

    trades.push({
      id: `trade-${Date.now()}-${i}`,
      price: basePrice + priceChange,
      size: 0.5 + Math.random() * 10,
      time: `${hours}:${minutes}:${seconds}`,
      type: isBuy ? 'buy' : 'sell'
    })
  }

  return trades
}

// Generate realtime orderbook data
function generateRealtimeOrderBook(
  basePrice: number,
  count: number
): RealtimeOrderBook {
  const asks: OrderBookRow[] = []
  const bids: OrderBookRow[] = []
  const spreadBase = 0.002 + Math.random() * 0.001 // 0.2-0.3% spread

  // Generate asks (매도 - 높은 가격부터)
  for (let i = 0; i < count; i++) {
    const price = basePrice + spreadBase + i * 0.001
    const size = 0.5 + Math.random() * 15
    const total = 10 + Math.random() * 200
    asks.push({
      id: `ask-${Date.now()}-${i}`,
      price,
      size,
      total,
    })
  }

  // Generate bids (매수 - 높은 가격부터)
  for (let i = 0; i < count; i++) {
    const price = basePrice - i * 0.001
    const size = 0.5 + Math.random() * 15
    const total = 10 + Math.random() * 200
    bids.push({
      id: `bid-${Date.now()}-${i}`,
      price,
      size,
      total,
    })
  }

  // Sort by total (거래대금) descending for clean depth visualization
  asks.sort((a, b) => b.total - a.total)
  bids.sort((a, b) => b.total - a.total)

  const spread = asks[0].price - bids[0].price
  const spreadPercent = (spread / bids[0].price) * 100

  return { asks, bids, spread, spreadPercent }
}

// Shared state for tabs (using module-level state for simplicity)
let activeTab: 'orderbook' | 'trades' = 'orderbook'
let setActiveTabListeners: Array<(tab: 'orderbook' | 'trades') => void> = []

function useSharedTabState() {
  const [tab, setTab] = useState<'orderbook' | 'trades'>(activeTab)

  useEffect(() => {
    const listener = (newTab: 'orderbook' | 'trades') => setTab(newTab)
    setActiveTabListeners.push(listener)
    return () => {
      setActiveTabListeners = setActiveTabListeners.filter(l => l !== listener)
    }
  }, [])

  const updateTab = (newTab: 'orderbook' | 'trades') => {
    activeTab = newTab
    setActiveTabListeners.forEach(listener => listener(newTab))
  }

  return [tab, updateTab] as const
}

// Tabs component - can be used independently
export function OrderBookTradesTabs() {
  const [activeTab, setActiveTab] = useSharedTabState()
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)
  const indices = useTradingStore(state => state.indices)

  // Find current index and check if it's bonding curve
  const currentIndex = useMemo(() =>
    indices.find(idx => idx.symbol === selectedIndexSymbol),
    [indices, selectedIndexSymbol]
  )

  const isBondingCurve = useMemo(() => {
    if (!currentIndex) return false
    // Only bonding curve if graduation field exists AND status is not 'graduated'
    return currentIndex.graduation !== undefined && currentIndex.graduation.status !== 'graduated'
  }, [currentIndex])

  return (
    <div className="h-10 flex items-center border-b border-teal bg-teal-card font-[Arial,sans-serif] flex-shrink-0">
      {!isBondingCurve && (
        <button
          onClick={() => setActiveTab('orderbook')}
          className={`glass-tab flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'orderbook' ? 'active text-white' : 'text-slate-400'
          }`}
        >
          Order Book
        </button>
      )}
      <button
        onClick={() => setActiveTab('trades')}
        className={`glass-tab flex-1 px-4 py-2 text-sm font-medium ${
          activeTab === 'trades' ? 'active text-white' : 'text-slate-400'
        }`}
      >
        Trades
      </button>
    </div>
  )
}

// Body component - can be used independently
export function OrderBookTradesBody() {
  const [activeTab] = useSharedTabState()
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)
  const indices = useTradingStore(state => state.indices)

  // Find current index and check if it's bonding curve
  const currentIndex = useMemo(() =>
    indices.find(idx => idx.symbol === selectedIndexSymbol),
    [indices, selectedIndexSymbol]
  )

  const isBondingCurve = useMemo(() => {
    if (!currentIndex) return false
    // Only bonding curve if graduation field exists AND status is not 'graduated'
    return currentIndex.graduation !== undefined && currentIndex.graduation.status !== 'graduated'
  }, [currentIndex])

  return (
    <div className="bg-teal-base h-full font-[Arial,sans-serif] overflow-hidden">
      {activeTab === 'orderbook' && !isBondingCurve ? (
        <OrderBookContent />
      ) : (
        <TradesContent isBondingCurve={isBondingCurve} currentIndex={currentIndex} />
      )}
    </div>
  )
}

// Combined component - backward compatibility
export function OrderBookTrades() {
  return (
    <div className="bg-teal-base h-full flex flex-col">
      <OrderBookTradesTabs />
      <div className="flex-1 bg-teal-base min-h-0">
        <OrderBookTradesBody />
      </div>
    </div>
  )
}

function OrderBookContent() {
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)
  const cleanSymbol = selectedIndexSymbol.replace('_INDEX', '')

  // Calculate exact row count based on available space
  const [rowCount, setRowCount] = useState(12)

  useEffect(() => {
    const calculateRowCount = () => {
      // Available height: 60vh
      const viewportHeight = window.innerHeight
      const containerHeight = viewportHeight * 0.6 // 60vh

      // Fixed heights
      const headerHeight = 36 // py-2 = 8px top + 8px bottom + text height ~20px
      const spreadHeight = 32 // py-1.5 = 6px top + 6px bottom + text height ~20px
      const rowHeight = 23

      // Available space for asks + bids
      const availableHeight = containerHeight - headerHeight - spreadHeight

      // Each section gets half
      const sectionHeight = availableHeight / 2

      // Calculate max rows per section
      const maxRows = Math.floor(sectionHeight / rowHeight)

      setRowCount(maxRows)
    }

    calculateRowCount()
    window.addEventListener('resize', calculateRowCount)
    return () => window.removeEventListener('resize', calculateRowCount)
  }, [])

  // Realtime orderbook state - start with static data for SSR
  const [orderbook, setOrderbook] = useState<RealtimeOrderBook>(() =>
    generateStaticOrderBook(1.2567, rowCount)
  )

  // Update orderbook every 500ms with realtime data
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderbook(generateRealtimeOrderBook(1.2567, rowCount))
    }, 500)

    return () => clearInterval(interval)
  }, [rowCount])

  return (
    <div className="bg-teal-base h-full flex flex-col">
      {/* Headers */}
      <div className="px-2 py-2 grid grid-cols-[20%_40%_40%] text-xs text-slate-400 border-b border-teal bg-teal-base flex-shrink-0">
        <div className="text-left pl-2.5">Price</div>
        <div className="text-left pl-2.5">Size ({cleanSymbol})</div>
        <div className="text-left pl-2.5">Total ({cleanSymbol})</div>
      </div>

      {/* Asks (매도) - 중앙 정렬 */}
      <div className="bg-teal-base flex-1 overflow-hidden flex flex-col justify-center">
        {orderbook.asks.slice(0, rowCount).reverse().map((ask, index) => (
          <div
            key={index}
            className="grid grid-cols-[20%_40%_40%] h-[23px] cursor-pointer hover:bg-teal-elevated/50 transition-colors duration-100"
          >
            {/* Price */}
            <div className="pl-2.5 text-[14px] text-[#dd7789]">
              {ask.price.toFixed(3)}
            </div>

            {/* Size */}
            <div className="pl-2.5 text-[14px] text-white">
              {ask.size.toFixed(2)}
            </div>

            {/* Total */}
            <div className="pl-2.5 text-[14px] text-slate-300">
              {ask.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Spread - 가운데 고정 */}
      <div className="px-2 py-1.5 flex items-center justify-center border-y border-teal bg-teal-elevated/50 flex-shrink-0">
        <div className="text-xs text-slate-400">
          Spread:{' '}
          <span className="text-white font-medium">
            {orderbook.spread.toFixed(3)} ({orderbook.spreadPercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Bids (매수) - 중앙 정렬 */}
      <div className="bg-teal-base flex-1 overflow-hidden flex flex-col justify-center">
        {orderbook.bids.slice(0, rowCount).map((bid, index) => (
          <div
            key={index}
            className="grid grid-cols-[20%_40%_40%] h-[23px] cursor-pointer hover:bg-teal-elevated/50 transition-colors duration-100"
          >
            {/* Price */}
            <div className="pl-2.5 text-[14px] text-[#4fa480]">
              {bid.price.toFixed(3)}
            </div>

            {/* Size */}
            <div className="pl-2.5 text-[14px] text-white">
              {bid.size.toFixed(2)}
            </div>

            {/* Total */}
            <div className="pl-2.5 text-[14px] text-slate-300">
              {bid.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TradesContentProps {
  isBondingCurve: boolean
  currentIndex: any
}

function TradesContent({ isBondingCurve, currentIndex }: TradesContentProps) {
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)
  const cleanSymbol = selectedIndexSymbol.replace('_INDEX', '')

  // Realtime trades state - start with static data for SSR
  const [trades, setTrades] = useState<Trade[]>(() =>
    generateStaticTrades(1.2567, 50)
  )

  // Update trades every 500ms with realtime data
  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(generateRealtimeTrades(1.2567, 50))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-teal-base h-full flex flex-col">
      {/* Graduation Progress for Bonding Curve */}
      {isBondingCurve && currentIndex?.graduation && (
        <div className="px-3 pt-3 pb-2 border-b border-teal">
          <GraduationProgress
            data={{
              liquidityProgress: currentIndex.graduation.liquidityProgress,
              salesProgress: currentIndex.graduation.salesProgress,
              status: currentIndex.graduation.status
            }}
            variant="compact"
          />
        </div>
      )}

      {/* Headers */}
      <div className="px-2 py-2 grid grid-cols-3 text-sm text-slate-400 border-b border-teal bg-teal-base flex-shrink-0">
        <div className="text-left pl-2.5">Price</div>
        <div className="text-left pl-2.5">Size ({cleanSymbol})</div>
        <div className="text-left pl-2.5">Time</div>
      </div>

      {/* Trades List - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto bg-teal-base">
        {trades.map((trade, index) => (
          <div key={trade.id} className="grid grid-cols-3 text-[14px] h-[23px] hover:bg-teal-elevated/50 transition-colors duration-100 cursor-pointer px-2">
            <div className={`text-left pl-2.5 ${trade.type === 'buy' ? 'text-[#4fa480]' : 'text-[#dd7789]'}`}>
              {trade.price.toFixed(3)}
            </div>
            <div className="text-left pl-2.5 text-white">{trade.size.toFixed(2)}</div>
            <div className="text-left pl-2.5 text-slate-300 text-xs">{trade.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
