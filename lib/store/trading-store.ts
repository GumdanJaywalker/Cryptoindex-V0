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

// State Interface Definition
interface TradingState {
  // Index Data
  indices: MemeIndex[]
  selectedIndexSymbol: string
  indexFilter: IndexFilter
  indexSort: SortOption
  indexSortDirection: 'asc' | 'desc'
  indexSearchQuery: string

  // Trader Data  
  traders: TopTrader[]
  selectedTrader: TopTrader | null
  traderFilter: TraderFilter
  traderSort: TraderSort
  traderSortDirection: 'asc' | 'desc'
  traderTimeframe: '24h' | '7d' | '30d'

  // Trade Data
  trades: Trade[]
  activeTrades: Trade[]

  // Market Statistics
  marketStats: MarketStats | null

  // UI State
  isLoading: boolean
  isRefreshing: boolean
  lastUpdated: Date | null

  // Modal/Sidebar State
  isTradePanelOpen: boolean
  isPositionsPanelOpen: boolean
  selectedTradeId: string | null

  // Chart State
  selectedTimeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

  // 🆕 SSOT Market Data
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

  // 🆕 Orderbook Data
  orderbook: Orderbook

  // 🆕 Recent Trades
  recentTrades: RecentTrade[]

  // 🆕 Order Management
  positions: Position[]
  openOrders: Order[]
  orderHistory: OrderHistory[]

  // 🆕 Chart Data Cache (Key: "SYMBOL-TIMEFRAME")
  chartDataCache: Record<string, OHLCVData[]>

  // Favorite Index IDs
  favorites: string[]
}

// Actions Interface Definition
interface TradingActions {
  // Index Actions
  setIndices: (indices: MemeIndex[]) => void
  setSelectedIndexSymbol: (symbol: string) => void
  setIndexFilter: (filter: IndexFilter) => void
  setIndexSort: (sort: SortOption) => void
  setIndexSortDirection: (direction: 'asc' | 'desc') => void
  setIndexSearchQuery: (query: string) => void
  updateIndexPrice: (id: string, price: number, change: number) => void

  // Trader Actions
  setTraders: (traders: TopTrader[]) => void
  setSelectedTrader: (trader: TopTrader | null) => void
  setTraderFilter: (filter: TraderFilter) => void
  setTraderSort: (sort: TraderSort) => void
  setTraderSortDirection: (direction: 'asc' | 'desc') => void
  setTraderTimeframe: (timeframe: '24h' | '7d' | '30d') => void
  updateTraderPnL: (id: string, pnl24h: number, pnl7d: number, pnl30d: number) => void

  // Trade Actions
  setTrades: (trades: Trade[]) => void
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, updates: Partial<Trade>) => void
  closeTrade: (id: string, exitPrice: number) => void
  removeTrade: (id: string) => void

  // Market Statistics Actions
  setMarketStats: (stats: MarketStats) => void

  // UI Actions
  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
  setLastUpdated: (date: Date) => void

  // Modal/Sidebar Actions
  setTradePanelOpen: (open: boolean) => void
  setPositionsPanelOpen: (open: boolean) => void
  setSelectedTradeId: (id: string | null) => void

  // Chart Actions
  setSelectedTimeframe: (timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w') => void

  // 🆕 Market Data Actions
  updateMarketPrice: (price: number) => void
  updateMarketData: (data: Partial<MarketData>) => void
  updateOrderbook: (orderbook: Orderbook) => void
  addRecentTrade: (trade: RecentTrade) => void

  // 🆕 Order Management Actions
  addPosition: (position: Position) => void
  closePosition: (id: string, exitPrice: number) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
  addOrder: (order: Order) => void
  fillOrder: (id: string) => void
  cancelOrder: (id: string) => void

  // 🆕 Chart Cache Actions
  getCachedChartData: (symbol: string, timeframe: string) => OHLCVData[] | null
  setCachedChartData: (symbol: string, timeframe: string, data: OHLCVData[]) => void
  clearChartCache: () => void

  // Utility Actions
  refreshData: () => Promise<void>
  resetFilters: () => void
  clearCache: () => void

  // Favorite Actions
  toggleFavorite: (indexId: string) => void
}

// ✅ Generate initial market data for default index
const DEFAULT_INDEX = 'DOG_INDEX'
const initialMarketData = generateInitialMarketData(DEFAULT_INDEX)

// Initial State
const initialState: TradingState = {
  // Index Data
  indices: [],
  selectedIndexSymbol: DEFAULT_INDEX,
  indexFilter: 'all',
  indexSort: 'volume',
  indexSortDirection: 'desc',
  indexSearchQuery: '',

  // Trader Data
  traders: [],
  selectedTrader: null,
  traderFilter: 'all',
  traderSort: 'rank',
  traderSortDirection: 'asc',
  traderTimeframe: '24h',

  // Trade Data
  trades: [],
  activeTrades: [],

  // Market Statistics
  marketStats: null,

  // UI State
  isLoading: false,
  isRefreshing: false,
  lastUpdated: null,

  // Modal/Sidebar State
  isTradePanelOpen: false,
  isPositionsPanelOpen: false,
  selectedTradeId: null,

  // Chart State
  selectedTimeframe: '1h',

  // ✅ SSOT Market Data Initial Value (from generateInitialMarketData)
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

  // 🆕 Orderbook Initial Value
  orderbook: {
    asks: [],
    bids: [],
    spread: 0,
    spreadPercent: 0,
  },

  // 🆕 Recent Trades Initial Value
  recentTrades: [],

  // 🆕 Order Management Initial Value (Empty - positions created from actual trades)
  positions: [],
  openOrders: [],
  orderHistory: [],

  // 🆕 Chart Cache Initial Value
  chartDataCache: {},

  // Favorites Initial Value
  favorites: [],
}

// Create Zustand Store
export const useTradingStore = create<TradingState & TradingActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Implement Index Actions
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

        // Implement Trader Actions
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

        // Implement Trade Actions
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

        // Market Statistics Actions
        setMarketStats: (stats) => set({ marketStats: stats }),

        // Implement UI Actions
        setLoading: (loading) => set({ isLoading: loading }),

        setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

        setLastUpdated: (date) => set({ lastUpdated: date }),

        // Modal/Sidebar Actions
        setTradePanelOpen: (open) => set({ isTradePanelOpen: open }),

        setPositionsPanelOpen: (open) => set({ isPositionsPanelOpen: open }),

        setSelectedTradeId: (id) => set({ selectedTradeId: id }),

        // Chart Actions
        setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),

        // 🆕 Implement Market Data Actions
        updateMarketPrice: (price) => set({ currentPrice: price }),

        updateMarketData: (data) => set((state) => ({
          ...state,
          ...data
        })),

        updateOrderbook: (orderbook) => set({ orderbook }),

        addRecentTrade: (trade) => set((state) => ({
          recentTrades: [trade, ...state.recentTrades].slice(0, 50) // Keep last 50 trades
        })),

        // 🆕 Implement Order Management Actions
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

        // 🆕 Implement Chart Cache Actions
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

        // Toggle Favorite
        toggleFavorite: (indexId) => set((state) => {
          const exists = state.favorites.includes(indexId)
          return {
            favorites: exists
              ? state.favorites.filter(id => id !== indexId)
              : [...state.favorites, indexId]
          }
        }),

        // Utility Actions
        refreshData: async () => {
          const state = get()
          set({ isRefreshing: true })

          try {
            // Real API call implementation here
            // Currently simulating mock data update only
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
        // Persist only non-sensitive UI state
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

// Selector Hooks (Performance Optimization)
export const useIndicesData = () => useTradingStore((state) => ({
  indices: state.indices,
  selectedIndexSymbol: state.selectedIndexSymbol,
  indexFilter: state.indexFilter,
  indexSort: state.indexSort,
  indexSortDirection: state.indexSortDirection,
  indexSearchQuery: state.indexSearchQuery,
}))

export const useTradersData = () => useTradingStore((state) => ({
  traders: state.traders,
  selectedTrader: state.selectedTrader,
  traderFilter: state.traderFilter,
  traderSort: state.traderSort,
  traderSortDirection: state.traderSortDirection,
  traderTimeframe: state.traderTimeframe,
}))

export const useTradesData = () => useTradingStore((state) => ({
  trades: state.trades,
  activeTrades: state.activeTrades,
  selectedTradeId: state.selectedTradeId,
}))

export const useUIState = () => useTradingStore((state) => ({
  isLoading: state.isLoading,
  isRefreshing: state.isRefreshing,
  lastUpdated: state.lastUpdated,
  isTradePanelOpen: state.isTradePanelOpen,
  isPositionsPanelOpen: state.isPositionsPanelOpen,
}))

export const useMarketData = () => useTradingStore((state) => ({
  marketStats: state.marketStats,
  indices: state.indices,
  traders: state.traders,
}))

// Hook to get actions only
export const useTradingActions = () => useTradingStore((state) => ({
  // Index Actions
  setIndices: state.setIndices,
  setSelectedIndexSymbol: state.setSelectedIndexSymbol,
  setIndexFilter: state.setIndexFilter,
  setIndexSort: state.setIndexSort,
  setIndexSortDirection: state.setIndexSortDirection,
  setIndexSearchQuery: state.setIndexSearchQuery,
  updateIndexPrice: state.updateIndexPrice,

  // Trader Actions
  setTraders: state.setTraders,
  setSelectedTrader: state.setSelectedTrader,
  setTraderFilter: state.setTraderFilter,
  setTraderSort: state.setTraderSort,
  setTraderSortDirection: state.setTraderSortDirection,
  setTraderTimeframe: state.setTraderTimeframe,
  updateTraderPnL: state.updateTraderPnL,

  // Trade Actions
  setTrades: state.setTrades,
  addTrade: state.addTrade,
  updateTrade: state.updateTrade,
  closeTrade: state.closeTrade,
  removeTrade: state.removeTrade,

  // Market Statistics Actions
  setMarketStats: state.setMarketStats,

  // UI Actions
  setLoading: state.setLoading,
  setRefreshing: state.setRefreshing,
  setLastUpdated: state.setLastUpdated,
  setTradePanelOpen: state.setTradePanelOpen,
  setPositionsPanelOpen: state.setPositionsPanelOpen,
  setSelectedTradeId: state.setSelectedTradeId,
  toggleFavorite: state.toggleFavorite,

  // 🆕 Market Data Actions
  updateMarketPrice: state.updateMarketPrice,
  updateMarketData: state.updateMarketData,
  updateOrderbook: state.updateOrderbook,
  addRecentTrade: state.addRecentTrade,

  // 🆕 Order Management Actions
  addPosition: state.addPosition,
  closePosition: state.closePosition,
  updatePosition: state.updatePosition,
  addOrder: state.addOrder,
  fillOrder: state.fillOrder,
  cancelOrder: state.cancelOrder,

  // 🆕 Chart Cache Actions
  getCachedChartData: state.getCachedChartData,
  setCachedChartData: state.setCachedChartData,
  clearChartCache: state.clearChartCache,

  // Utility Actions
  refreshData: state.refreshData,
  resetFilters: state.resetFilters,
  clearCache: state.clearCache,
}))

// 🆕 SSOT Periodic Update Logic (1s interval, ±0.5% volatility)
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
