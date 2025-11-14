// Trading-specific types for SSOT pattern

// Orderbook types
export interface OrderBookRow {
  id: string
  price: number
  size: number
  total: number
}

export interface Orderbook {
  asks: OrderBookRow[]
  bids: OrderBookRow[]
  spread: number
  spreadPercent: number
}

// Position types
export interface Position {
  id: string
  symbol: string
  side: 'Buy' | 'Sell'
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  margin: number
  leverage: string
  liquidationPrice: number
  timestamp: Date
}

// Order types
export interface Order {
  id: string
  symbol: string
  side: 'Buy' | 'Sell'
  type: 'Market' | 'Limit' | 'Stop'
  size: number
  price: number
  filled: number
  status: 'Open' | 'Pending' | 'Filled' | 'Cancelled'
  time: string
  timestamp: Date
}

// Order History types
export interface OrderHistory {
  id: string
  symbol: string
  side: 'Buy' | 'Sell'
  type: 'Market' | 'Limit' | 'Stop'
  size: number
  price: number
  filled: number
  status: 'Filled' | 'Cancelled'
  time: string
  timestamp: Date
  pnl?: number
  pnlPercent?: number
}

// Market Data types (SSOT)
export interface MarketData {
  currentPrice: number
  priceChange24h: number
  priceChange24hAbsolute: number
  high24h: number
  low24h: number
  volume24h: number
  marketCap: number
  openInterest: number
  premium: number
}

// Recent Trade types
export interface RecentTrade {
  id: string
  price: number
  size: number
  time: string
  type: 'buy' | 'sell'
  timestamp: Date
}
