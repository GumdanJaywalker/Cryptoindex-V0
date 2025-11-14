import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'
import {
  MemeIndex,
  TopTrader,
  Trade,
  IndexFilter,
  SortOption,
  TraderFilter,
  TraderSort,
  MarketStats
} from '@/lib/types/index-trading'
import {
  OrderBookRow,
  Orderbook,
  Position,
  Order,
  OrderHistory,
  MarketData,
  RecentTrade
} from '@/lib/types/trading'
import type { OHLCVData } from '@/lib/types/trading-chart'
import {
  updateMarketDataWithVolatility,
  generateOrderbook,
  generateRecentTrades,
  getIndexBasePrice,
  generateInitialMarketData
} from '@/lib/utils/market-data-generator'

// 상태 인터페이스 정의
interface TradingState {
  // 인덱스 데이터
  indices: MemeIndex[]
  selectedIndexSymbol: string
  indexFilter: IndexFilter
  indexSort: SortOption
  indexSortDirection: 'asc' | 'desc'
  indexSearchQuery: string

  // 트레이더 데이터  
  traders: TopTrader[]
  selectedTrader: TopTrader | null
  traderFilter: TraderFilter
  traderSort: TraderSort
  traderSortDirection: 'asc' | 'desc'
  traderTimeframe: '24h' | '7d' | '30d'

  // 거래 데이터
  trades: Trade[]
  activeTrades: Trade[]

  // 마켓 통계
  marketStats: MarketStats | null

  // UI 상태
  isLoading: boolean
  isRefreshing: boolean
  lastUpdated: Date | null

  // 모달/사이드바 상태
  isTradePanelOpen: boolean
  isPositionsPanelOpen: boolean
  selectedTradeId: string | null

  // 차트 상태
  selectedTimeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

  // 🆕 SSOT 시장 데이터
  currentPrice: number
  price24hAgo: number // ✅ Track price from 24h ago for accurate 24h change
  priceChange24h: number
  priceChange24hAbsolute: number
  high24h: number
  low24h: number
  volume24h: number
  marketCap: number
  openInterest: number
  premium: number

  // 🆕 Orderbook 데이터
  orderbook: Orderbook

  // 🆕 최근 거래
  recentTrades: RecentTrade[]

  // 🆕 주문 관리
  positions: Position[]
  openOrders: Order[]
  orderHistory: OrderHistory[]

  // 🆕 차트 데이터 캐시 (Key: "SYMBOL-TIMEFRAME")
  chartDataCache: Record<string, OHLCVData[]>

  // 즐겨찾기한 인덱스 ID 목록
  favorites: string[]
}

// 액션 인터페이스 정의
interface TradingActions {
  // 인덱스 액션
  setIndices: (indices: MemeIndex[]) => void
  setSelectedIndexSymbol: (symbol: string) => void
  setIndexFilter: (filter: IndexFilter) => void
  setIndexSort: (sort: SortOption) => void
  setIndexSortDirection: (direction: 'asc' | 'desc') => void
  setIndexSearchQuery: (query: string) => void
  updateIndexPrice: (id: string, price: number, change: number) => void
  
  // 트레이더 액션
  setTraders: (traders: TopTrader[]) => void
  setSelectedTrader: (trader: TopTrader | null) => void
  setTraderFilter: (filter: TraderFilter) => void
  setTraderSort: (sort: TraderSort) => void
  setTraderSortDirection: (direction: 'asc' | 'desc') => void
  setTraderTimeframe: (timeframe: '24h' | '7d' | '30d') => void
  updateTraderPnL: (id: string, pnl24h: number, pnl7d: number, pnl30d: number) => void

  // 거래 액션
  setTrades: (trades: Trade[]) => void
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, updates: Partial<Trade>) => void
  closeTrade: (id: string, exitPrice: number) => void
  removeTrade: (id: string) => void

  // 마켓 통계 액션
  setMarketStats: (stats: MarketStats) => void

  // UI 액션
  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
  setLastUpdated: (date: Date) => void
  
  // 모달/사이드바 액션
  setTradePanelOpen: (open: boolean) => void
  setPositionsPanelOpen: (open: boolean) => void
  setSelectedTradeId: (id: string | null) => void

  // 차트 액션
  setSelectedTimeframe: (timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w') => void

  // 🆕 시장 데이터 액션
  updateMarketPrice: (price: number) => void
  updateMarketData: (data: Partial<MarketData>) => void
  updateOrderbook: (orderbook: Orderbook) => void
  addRecentTrade: (trade: RecentTrade) => void

  // 🆕 주문 관리 액션
  addPosition: (position: Position) => void
  closePosition: (id: string, exitPrice: number) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
  addOrder: (order: Order) => void
  fillOrder: (id: string) => void
  cancelOrder: (id: string) => void

  // 🆕 차트 캐시 액션
  getCachedChartData: (symbol: string, timeframe: string) => OHLCVData[] | null
  setCachedChartData: (symbol: string, timeframe: string, data: OHLCVData[]) => void
  clearChartCache: () => void

  // 유틸리티 액션
  refreshData: () => Promise<void>
  resetFilters: () => void
  clearCache: () => void

  // 즐겨찾기 액션
  toggleFavorite: (indexId: string) => void
}

// ✅ Generate initial market data for default index
const DEFAULT_INDEX = 'DOG_INDEX'
const initialMarketData = generateInitialMarketData(DEFAULT_INDEX)

// 초기 상태
const initialState: TradingState = {
  // 인덱스 데이터
  indices: [],
  selectedIndexSymbol: DEFAULT_INDEX,
  indexFilter: 'all',
  indexSort: 'volume',
  indexSortDirection: 'desc',
  indexSearchQuery: '',

  // 트레이더 데이터
  traders: [],
  selectedTrader: null,
  traderFilter: 'all',
  traderSort: 'rank',
  traderSortDirection: 'asc',
  traderTimeframe: '24h',

  // 거래 데이터
  trades: [],
  activeTrades: [],

  // 마켓 통계
  marketStats: null,

  // UI 상태
  isLoading: false,
  isRefreshing: false,
  lastUpdated: null,

  // 모달/사이드바 상태
  isTradePanelOpen: false,
  isPositionsPanelOpen: false,
  selectedTradeId: null,

  // 차트 상태
  selectedTimeframe: '1h',

  // ✅ SSOT 시장 데이터 초기값 (from generateInitialMarketData)
  currentPrice: initialMarketData.currentPrice,
  price24hAgo: initialMarketData.currentPrice, // ✅ Initialize to current price
  priceChange24h: initialMarketData.priceChange24h,
  priceChange24hAbsolute: initialMarketData.priceChange24hAbsolute,
  high24h: initialMarketData.high24h,
  low24h: initialMarketData.low24h,
  volume24h: initialMarketData.volume24h,
  marketCap: initialMarketData.marketCap,
  openInterest: initialMarketData.openInterest,
  premium: initialMarketData.premium,

  // 🆕 Orderbook 초기값
  orderbook: {
    asks: [],
    bids: [],
    spread: 0,
    spreadPercent: 0,
  },

  // 🆕 최근 거래 초기값
  recentTrades: [],

  // 🆕 주문 관리 초기값 (Empty - positions created from actual trades)
  positions: [],
  openOrders: [],
  orderHistory: [],

  // 🆕 차트 캐시 초기값
  chartDataCache: {},

  // 즐겨찾기 초기값
  favorites: [],
}

// Zustand 스토어 생성
export const useTradingStore = create<TradingState & TradingActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 인덱스 액션 구현
        setIndices: (indices) => set({ indices }),

        setSelectedIndexSymbol: (symbol) => {
          // ✅ When changing index, reinitialize market data with new base price
          const newMarketData = generateInitialMarketData(symbol)
          const newOrderbook = generateOrderbook(newMarketData.currentPrice, 15)
          const newRecentTrades = generateRecentTrades(newMarketData.currentPrice, 30)

          // ✅ Clear chart cache to force regeneration with new price
          set({
            selectedIndexSymbol: symbol,
            ...newMarketData,
            price24hAgo: newMarketData.currentPrice, // ✅ Initialize price24hAgo
            orderbook: newOrderbook,
            recentTrades: newRecentTrades,
            chartDataCache: {} // Clear cache on index change
          })
        },

        setIndexFilter: (filter) => set({ indexFilter: filter }),
        
        setIndexSort: (sort) => set({ indexSort: sort }),
        
        setIndexSortDirection: (direction) => set({ indexSortDirection: direction }),
        
        setIndexSearchQuery: (query) => set({ indexSearchQuery: query }),
        
        updateIndexPrice: (id, price, change) => set((state) => ({
          indices: state.indices.map(index => 
            index.id === id 
              ? { ...index, currentPrice: price, change24h: change }
              : index
          )
        })),

        // 트레이더 액션 구현
        setTraders: (traders) => set({ traders }),
        
        setSelectedTrader: (trader) => set({ selectedTrader: trader }),
        
        setTraderFilter: (filter) => set({ traderFilter: filter }),
        
        setTraderSort: (sort) => set({ traderSort: sort }),
        
        setTraderSortDirection: (direction) => set({ traderSortDirection: direction }),
        
        setTraderTimeframe: (timeframe) => set({ traderTimeframe: timeframe }),
        
        updateTraderPnL: (id, pnl24h, pnl7d, pnl30d) => set((state) => ({
          traders: state.traders.map(trader => 
            trader.id === id 
              ? { ...trader, pnl24h, pnl7d, pnl30d }
              : trader
          )
        })),

        // 거래 액션 구현
        setTrades: (trades) => set({ 
          trades,
          activeTrades: trades.filter(trade => trade.status === 'open')
        }),
        
        addTrade: (trade) => set((state) => {
          const newTrades = [...state.trades, trade]
          return {
            trades: newTrades,
            activeTrades: newTrades.filter(t => t.status === 'open')
          }
        }),
        
        updateTrade: (id, updates) => set((state) => {
          const updatedTrades = state.trades.map(trade => 
            trade.id === id ? { ...trade, ...updates } : trade
          )
          return {
            trades: updatedTrades,
            activeTrades: updatedTrades.filter(t => t.status === 'open')
          }
        }),
        
        closeTrade: (id, exitPrice) => set((state) => {
          const updatedTrades = state.trades.map(trade => {
            if (trade.id === id) {
              const pnl = trade.type === 'long' 
                ? (exitPrice - trade.entryPrice) / trade.entryPrice * trade.amount * trade.leverage
                : (trade.entryPrice - exitPrice) / trade.entryPrice * trade.amount * trade.leverage
              
              return {
                ...trade,
                exitPrice,
                pnl,
                pnlPercentage: (pnl / trade.amount) * 100,
                status: 'closed' as const,
                closeTimestamp: new Date()
              }
            }
            return trade
          })
          
          return {
            trades: updatedTrades,
            activeTrades: updatedTrades.filter(t => t.status === 'open')
          }
        }),
        
        removeTrade: (id) => set((state) => {
          const filteredTrades = state.trades.filter(trade => trade.id !== id)
          return {
            trades: filteredTrades,
            activeTrades: filteredTrades.filter(t => t.status === 'open')
          }
        }),

        // 마켓 통계 액션
        setMarketStats: (stats) => set({ marketStats: stats }),

        // UI 액션 구현
        setLoading: (loading) => set({ isLoading: loading }),
        
        setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
        
        setLastUpdated: (date) => set({ lastUpdated: date }),

        // 모달/사이드바 액션
        setTradePanelOpen: (open) => set({ isTradePanelOpen: open }),

        setPositionsPanelOpen: (open) => set({ isPositionsPanelOpen: open }),

        setSelectedTradeId: (id) => set({ selectedTradeId: id }),

        // 차트 액션
        setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),

        // 🆕 시장 데이터 액션 구현
        updateMarketPrice: (price) => set({ currentPrice: price }),

        updateMarketData: (data) => set((state) => ({
          ...state,
          ...data
        })),

        updateOrderbook: (orderbook) => set({ orderbook }),

        addRecentTrade: (trade) => set((state) => ({
          recentTrades: [trade, ...state.recentTrades].slice(0, 50) // Keep last 50 trades
        })),

        // 🆕 주문 관리 액션 구현
        addPosition: (position) => set((state) => {
          console.log('STORE addPosition called', { position, currentPositions: state.positions.length })
          return {
            positions: [...state.positions, position]
          }
        }),

        closePosition: (id, exitPrice) => set((state) => {
          const position = state.positions.find(p => p.id === id)
          if (!position) return state

          const pnl = position.side === 'Buy'
            ? (exitPrice - position.entryPrice) * position.size
            : (position.entryPrice - exitPrice) * position.size

          const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100

          const historyEntry: OrderHistory = {
            id: `hist-${Date.now()}`,
            symbol: position.symbol,
            side: position.side,
            type: 'Market',
            size: position.size,
            price: exitPrice,
            filled: position.size,
            status: 'Filled',
            time: new Date().toLocaleTimeString(),
            timestamp: new Date(),
            pnl,
            pnlPercent
          }

          return {
            positions: state.positions.filter(p => p.id !== id),
            orderHistory: [historyEntry, ...state.orderHistory]
          }
        }),

        updatePosition: (id, updates) => set((state) => ({
          positions: state.positions.map(p =>
            p.id === id ? { ...p, ...updates } : p
          )
        })),

        addOrder: (order) => set((state) => {
          console.log('STORE addOrder called', { orderType: order.type, order })

          // Market orders are filled immediately
          if (order.type === 'Market') {
            const filledOrder = {
              ...order,
              filled: order.size,
              status: 'Filled' as const,
            }
            console.log('Adding to orderHistory', { filledOrder, currentHistory: state.orderHistory.length })
            return {
              orderHistory: [filledOrder, ...state.orderHistory]
            }
          } else {
            // Limit/Stop orders go to openOrders
            console.log('Adding to openOrders', { order, currentOpenOrders: state.openOrders.length })
            return {
              openOrders: [...state.openOrders, order]
            }
          }
        }),

        fillOrder: (id) => set((state) => {
          const order = state.openOrders.find(o => o.id === id)
          if (!order) return state

          // Convert Order to Position
          const position: Position = {
            id: `pos-${Date.now()}`,
            symbol: order.symbol,
            side: order.side,
            size: order.size,
            entryPrice: order.price,
            currentPrice: order.price,
            pnl: 0,
            pnlPercent: 0,
            margin: order.price * order.size,
            leverage: '10x',
            liquidationPrice: order.price * (order.side === 'Buy' ? 0.9 : 1.1),
            timestamp: new Date()
          }

          const historyEntry: OrderHistory = {
            id: `hist-${Date.now()}`,
            symbol: order.symbol,
            side: order.side,
            type: order.type,
            size: order.size,
            price: order.price,
            filled: order.size,
            status: 'Filled',
            time: new Date().toLocaleTimeString(),
            timestamp: new Date()
          }

          return {
            openOrders: state.openOrders.filter(o => o.id !== id),
            positions: [...state.positions, position],
            orderHistory: [historyEntry, ...state.orderHistory]
          }
        }),

        cancelOrder: (id) => set((state) => {
          const order = state.openOrders.find(o => o.id === id)
          if (!order) return state

          const historyEntry: OrderHistory = {
            id: `hist-${Date.now()}`,
            symbol: order.symbol,
            side: order.side,
            type: order.type,
            size: order.size,
            price: order.price,
            filled: 0,
            status: 'Cancelled',
            time: new Date().toLocaleTimeString(),
            timestamp: new Date()
          }

          return {
            openOrders: state.openOrders.filter(o => o.id !== id),
            orderHistory: [historyEntry, ...state.orderHistory]
          }
        }),

        // 🆕 차트 캐시 액션 구현
        getCachedChartData: (symbol, timeframe) => {
          const key = `${symbol}-${timeframe}`
          return get().chartDataCache[key] || null
        },

        setCachedChartData: (symbol, timeframe, data) => set((state) => ({
          chartDataCache: {
            ...state.chartDataCache,
            [`${symbol}-${timeframe}`]: data
          }
        })),

        clearChartCache: () => set({ chartDataCache: {} }),

        // 즐겨찾기 토글
        toggleFavorite: (indexId) => set((state) => {
          const exists = state.favorites.includes(indexId)
          return {
            favorites: exists
              ? state.favorites.filter(id => id !== indexId)
              : [...state.favorites, indexId]
          }
        }),

        // 유틸리티 액션
        refreshData: async () => {
          const state = get()
          set({ isRefreshing: true })
          
          try {
            // 실제 API 호출은 여기서 구현
            // 현재는 mock 데이터 업데이트만 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Mock price updates
            const updatedIndices = state.indices.map(index => ({
              ...index,
              currentPrice: index.currentPrice * (1 + (Math.random() - 0.5) * 0.1),
              change24h: index.change24h + (Math.random() - 0.5) * 5
            }))
            
            set({ 
              indices: updatedIndices,
              lastUpdated: new Date(),
              isRefreshing: false 
            })
          } catch (error) {
            console.error('Failed to refresh data:', error)
            set({ isRefreshing: false })
          }
        },
        
        resetFilters: () => set({
          indexFilter: 'all',
          indexSort: 'volume',
          indexSortDirection: 'desc',
          indexSearchQuery: '',
          traderFilter: 'all',
          traderSort: 'rank',
          traderSortDirection: 'asc',
          traderTimeframe: '24h'
        }),
        
        clearCache: () => set(initialState),
      }),
      {
        name: 'trading-store',
        // 민감하지 않은 UI 상태만 persist
        partialize: (state) => ({
          selectedIndexSymbol: state.selectedIndexSymbol,
          indexFilter: state.indexFilter,
          indexSort: state.indexSort,
          indexSortDirection: state.indexSortDirection,
          traderFilter: state.traderFilter,
          traderSort: state.traderSort,
          traderSortDirection: state.traderSortDirection,
          traderTimeframe: state.traderTimeframe,
          favorites: state.favorites,
        }),
      }
    ),
    {
      name: 'trading-store',
    }
  )
)

// 셀렉터 훅들 (성능 최적화)
export const useIndicesData = () => useTradingStore((state) => ({
  indices: state.indices,
  selectedIndexSymbol: state.selectedIndexSymbol,
  indexFilter: state.indexFilter,
  indexSort: state.indexSort,
  indexSortDirection: state.indexSortDirection,
  indexSearchQuery: state.indexSearchQuery,
}), shallow)

export const useTradersData = () => useTradingStore((state) => ({
  traders: state.traders,
  selectedTrader: state.selectedTrader,
  traderFilter: state.traderFilter,
  traderSort: state.traderSort,
  traderSortDirection: state.traderSortDirection,
  traderTimeframe: state.traderTimeframe,
}), shallow)

export const useTradesData = () => useTradingStore((state) => ({
  trades: state.trades,
  activeTrades: state.activeTrades,
  selectedTradeId: state.selectedTradeId,
}), shallow)

export const useUIState = () => useTradingStore((state) => ({
  isLoading: state.isLoading,
  isRefreshing: state.isRefreshing,
  lastUpdated: state.lastUpdated,
  isTradePanelOpen: state.isTradePanelOpen,
  isPositionsPanelOpen: state.isPositionsPanelOpen,
}), shallow)

export const useMarketData = () => useTradingStore((state) => ({
  marketStats: state.marketStats,
  indices: state.indices,
  traders: state.traders,
}), shallow)

// 액션만 가져오는 훅
export const useTradingActions = () => useTradingStore((state) => ({
  // 인덱스 액션
  setIndices: state.setIndices,
  setSelectedIndexSymbol: state.setSelectedIndexSymbol,
  setIndexFilter: state.setIndexFilter,
  setIndexSort: state.setIndexSort,
  setIndexSortDirection: state.setIndexSortDirection,
  setIndexSearchQuery: state.setIndexSearchQuery,
  updateIndexPrice: state.updateIndexPrice,

  // 트레이더 액션
  setTraders: state.setTraders,
  setSelectedTrader: state.setSelectedTrader,
  setTraderFilter: state.setTraderFilter,
  setTraderSort: state.setTraderSort,
  setTraderSortDirection: state.setTraderSortDirection,
  setTraderTimeframe: state.setTraderTimeframe,
  updateTraderPnL: state.updateTraderPnL,

  // 거래 액션
  setTrades: state.setTrades,
  addTrade: state.addTrade,
  updateTrade: state.updateTrade,
  closeTrade: state.closeTrade,
  removeTrade: state.removeTrade,

  // 마켓 통계 액션
  setMarketStats: state.setMarketStats,

  // UI 액션
  setLoading: state.setLoading,
  setRefreshing: state.setRefreshing,
  setLastUpdated: state.setLastUpdated,
  setTradePanelOpen: state.setTradePanelOpen,
  setPositionsPanelOpen: state.setPositionsPanelOpen,
  setSelectedTradeId: state.setSelectedTradeId,
  toggleFavorite: state.toggleFavorite,

  // 🆕 시장 데이터 액션
  updateMarketPrice: state.updateMarketPrice,
  updateMarketData: state.updateMarketData,
  updateOrderbook: state.updateOrderbook,
  addRecentTrade: state.addRecentTrade,

  // 🆕 주문 관리 액션
  addPosition: state.addPosition,
  closePosition: state.closePosition,
  updatePosition: state.updatePosition,
  addOrder: state.addOrder,
  fillOrder: state.fillOrder,
  cancelOrder: state.cancelOrder,

  // 🆕 차트 캐시 액션
  getCachedChartData: state.getCachedChartData,
  setCachedChartData: state.setCachedChartData,
  clearChartCache: state.clearChartCache,

  // 유틸리티 액션
  refreshData: state.refreshData,
  resetFilters: state.resetFilters,
  clearCache: state.clearCache,
}), shallow)

// 🆕 SSOT 주기적 업데이트 로직 (1초 주기, ±0.5% 변동성)
if (typeof window !== 'undefined') {
  let updateCount = 0 // Track update count for hourly price24hAgo refresh

  setInterval(() => {
    const state = useTradingStore.getState()
    updateCount++

    // ✅ Update price24hAgo every hour (3600 seconds)
    let newPrice24hAgo = state.price24hAgo
    if (updateCount % 3600 === 0) {
      newPrice24hAgo = state.currentPrice
    }

    // Update market data with volatility
    const updatedData = updateMarketDataWithVolatility({
      currentPrice: state.currentPrice,
      price24hAgo: state.price24hAgo,
      priceChange24h: state.priceChange24h,
      priceChange24hAbsolute: state.priceChange24hAbsolute,
      high24h: state.high24h,
      low24h: state.low24h,
      volume24h: state.volume24h,
      marketCap: state.marketCap,
      openInterest: state.openInterest,
      premium: state.premium
    }, 0.0015, state.price24hAgo) // ±0.15% volatility (reduced to 30% of original), pass price24hAgo

    // Update orderbook
    const updatedOrderbook = generateOrderbook(updatedData.currentPrice, 15)

    // Update store
    useTradingStore.setState({
      ...updatedData,
      price24hAgo: newPrice24hAgo, // ✅ Update price24hAgo hourly
      orderbook: updatedOrderbook
    })

    // Update positions with current price
    const updatedPositions = state.positions.map(position => {
      const pnl = position.side === 'Buy'
        ? (updatedData.currentPrice - position.entryPrice) * position.size
        : (position.entryPrice - updatedData.currentPrice) * position.size

      const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100

      return {
        ...position,
        currentPrice: updatedData.currentPrice,
        pnl,
        pnlPercent
      }
    })

    if (updatedPositions.length > 0) {
      useTradingStore.setState({ positions: updatedPositions })
    }
  }, 1000) // 1 second interval
}

export default useTradingStore
