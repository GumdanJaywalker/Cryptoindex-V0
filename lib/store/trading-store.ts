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

// 상태 인터페이스 정의
interface TradingState {
  // 인덱스 데이터
  indices: MemeIndex[]
  selectedIndex: MemeIndex | null
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

  // 즐겨찾기한 인덱스 ID 목록
  favorites: string[]
}

// 액션 인터페이스 정의
interface TradingActions {
  // 인덱스 액션
  setIndices: (indices: MemeIndex[]) => void
  setSelectedIndex: (index: MemeIndex | null) => void
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

  // 유틸리티 액션
  refreshData: () => Promise<void>
  resetFilters: () => void
  clearCache: () => void

  // 즐겨찾기 액션
  toggleFavorite: (indexId: string) => void
}

// 초기 상태
const initialState: TradingState = {
  // 인덱스 데이터
  indices: [],
  selectedIndex: null,
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
        setIndices: (indices) => set({ indexes }),
        
        setSelectedIndex: (index) => set({ selectedIndex: index }),
        
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
  selectedIndex: state.selectedIndex,
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
  setSelectedIndex: state.setSelectedIndex,
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

  // 유틸리티 액션
  refreshData: state.refreshData,
  resetFilters: state.resetFilters,
  clearCache: state.clearCache,
}), shallow)

export default useTradingStore
