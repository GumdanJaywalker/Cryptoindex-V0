// Types for CryptoIndex Landing Page - Meme Coin Index Trading

// Layer system types
export type IndexLayer = 'layer-1' | 'layer-2' | 'layer-3'

export interface LayerInfo {
  layer: IndexLayer
  category: 'institutional' | 'mainstream-meme' | 'volatile-launchpad'
  tradingMechanism: 'hooats' | 'direct-creation-redemption'
  riskLevel: 'low' | 'medium' | 'high'
  creationAccess: 'institution-only' | 'verified-only' | 'permissionless'
}

export interface MemeIndex {
  id: string
  symbol: string
  name: string
  theme: 'dog' | 'ai' | 'political' | 'gaming' | 'frog' | 'space' | 'food' | 'diamond-hands' | 'moon' | 'ape'
  description: string
  layerInfo?: LayerInfo
  currentPrice: number
  change24h: number
  change7d: number
  volume24h: number
  tvl: number // Total Value Locked
  marketCap: number
  sparklineData: number[]
  holders: number
  topTraders: string[] // Array of trader IDs
  isHot?: boolean // 🔥 HOT badge
  isNew?: boolean // ✨ NEW badge (created within 24h)
  isMooning?: boolean // 🚀 MOONING badge (rapid price increase)
  assets: Array<{
    symbol: string
    name: string
    allocation: number // Percentage
    price: number
    change24h: number
  }>
  lastRebalanced: Date
  nextRebalancing?: Date
  governance: {
    proposalCount: number
    activeProposals: number
    totalVotes: number
  }
}

export interface TopTrader {
  id: string
  address: string
  ens?: string // ENS name if available
  rank: number
  pnl24h: number
  pnl7d: number
  pnl30d: number
  totalPnl: number
  pnlPercentage24h: number
  pnlPercentage7d: number
  pnlPercentage30d: number
  totalPnlPercentage: number
  winRate: number // Percentage
  totalTrades: number
  followersCount: number
  tradingIndices: string[] // Array of index IDs they trade
  isNewTrader?: boolean // Recently joined (within 7 days)
  avatar?: string // Profile image URL
  badges?: Array<'🥇' | '🥈' | '🥉' | '🔥' | '⭐' | '💎'>
  socialLinks?: {
    twitter?: string
    discord?: string
  }
  copyTradeData?: {
    minimumAmount: number
    maxFollowers: number
    currentFollowers: number
    fee: number // Percentage
  }
}

export interface Trade {
  id: string
  indexId: string
  traderId?: string
  type: 'long' | 'short'
  entryPrice: number
  exitPrice?: number
  currentPrice: number
  amount: number // USD value
  leverage: number
  pnl: number
  pnlPercentage: number
  status: 'open' | 'closed' | 'liquidated'
  timestamp: Date
  closeTimestamp?: Date
  orderType?: 'market' | 'limit' | 'stop-loss' | 'take-profit'
  fees: number
  fundingFees?: number
  // Optional fields used by mocks and UI helpers
  transactionHash?: string
  stopLoss?: number
  takeProfit?: number
}

export interface RealtimeUpdate {
  type: 'price' | 'trade' | 'trader_ranking' | 'index_stats'
  data: any
  timestamp: Date
}

export interface MarketStats {
  totalVolume24h: number
  totalTVL: number
  activeIndices: number
  activeTraders: number
  totalMarketCap: number
  topGainer: {
    symbol: string
    change: number
  }
  topLoser: {
    symbol: string
    change: number
  }
}

// Filter and sorting types
export type IndexFilter = 'all' | 'hot' | 'new' | 'gainers' | 'losers' | 'high-volume' | 'layer-1' | 'layer-2' | 'layer-3'
export type IndexSort = 'volume' | 'change' | 'market-cap' | 'name' | 'created'
export type SortOption = 'volume' | 'change' | 'price' | 'marketCap' | 'name'
export type TraderFilter = 'all' | 'top-gainers' | 'high-winrate' | 'new-traders' | 'most-followed'
export type TraderSort = 'pnl' | 'winrate' | 'followers' | 'trades' | 'rank'

export interface FilterState {
  indexFilter: IndexFilter
  indexSort: IndexSort
  traderFilter: TraderFilter
  traderSort: TraderSort
  timeframe: '24h' | '7d' | '30d' | 'all'
}

// UI State types
export interface UIState {
  selectedIndex?: string
  selectedTrader?: string
  isTradeModalOpen: boolean
  isCopyTradeModalOpen: boolean
  isIndexDetailModalOpen: boolean
  theme: 'dark' | 'light'
  isMobile: boolean
}

// Trading interface types
export interface QuickTradeData {
  indexId: string
  type: 'long' | 'short'
  amount: number
  leverage: number
  expectedPnl: number
  fees: number
  slippage: number
}

export interface CopyTradeData {
  traderId: string
  amount: number
  riskLevel: 'low' | 'medium' | 'high'
  maxDrawdown: number
  stopLoss?: number
  takeProfit?: number
}

// Animation and interaction types
export interface AnimationConfig {
  duration: number
  delay?: number
  ease: string
}

export interface SparklineDataPoint {
  timestamp: Date
  price: number
  volume?: number
}

// Error types
export interface APIError {
  code: string
  message: string
  details?: any
}

// Success responses
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: APIError
  timestamp: Date
}

// Websocket message types
export interface WSMessage {
  channel: string
  event: string
  data: any
  timestamp: Date
}

// Utility types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface IndexCardProps extends BaseComponentProps {
  index: MemeIndex
  onClick?: (index: MemeIndex) => void
  showQuickTrade?: boolean
  compact?: boolean
}

export interface TraderCardProps extends BaseComponentProps {
  trader: TopTrader
  onClick?: (trader: TopTrader) => void
  showCopyTrade?: boolean
  timeframe?: '24h' | '7d' | '30d'
}

export interface TrendingIndicesProps extends BaseComponentProps {
  indices: MemeIndex[]
  loading?: boolean
  filter: IndexFilter
  sort: IndexSort
  onFilterChange: (filter: IndexFilter) => void
  onSortChange: (sort: IndexSort) => void
  onIndexClick?: (index: MemeIndex) => void
}

export interface TopTradersProps extends BaseComponentProps {
  traders: TopTrader[]
  loading?: boolean
  filter: TraderFilter
  sort: TraderSort
  timeframe: '24h' | '7d' | '30d'
  onFilterChange: (filter: TraderFilter) => void
  onSortChange: (sort: TraderSort) => void
  onTimeframeChange: (timeframe: '24h' | '7d' | '30d') => void
  onTraderClick?: (trader: TopTrader) => void
}
