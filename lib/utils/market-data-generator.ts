// Market Data Generator for SSOT pattern

import { Orderbook, OrderBookRow, RecentTrade, MarketData } from '@/lib/types/trading'

/**
 * Fixed base prices for each index (used for stable chart generation)
 * These prices serve as the starting point for historical chart data
 */
export const INDEX_BASE_PRICES: Record<string, number> = {
  'DOG_INDEX': 1.25,
  'MEME_INDEX': 2.50,
  'AI_INDEX': 3.75,
  'DEFI_INDEX': 1.80,
  'GAMING_INDEX': 2.20,
  'NFT_INDEX': 1.95,
  'METAVERSE_INDEX': 3.10,
  'L2_INDEX': 2.85,
  'DEFAULT': 1.50,
}

/**
 * Get fixed base price for an index
 */
export function getIndexBasePrice(indexSymbol: string): number {
  return INDEX_BASE_PRICES[indexSymbol] || INDEX_BASE_PRICES['DEFAULT']
}

/**
 * Generate initial market data based on selected index
 * Uses realistic calculations for volume, market cap, etc.
 */
export function generateInitialMarketData(selectedIndex: string, basePrice?: number): MarketData {
  // Use fixed base price if not provided
  const price = basePrice ?? getIndexBasePrice(selectedIndex)
  const totalSupply = 1_000_000_000 // 1 billion tokens
  const marketCap = price * totalSupply
  const dailyVolume = marketCap * 0.15 // Daily volume = 15% of market cap

  return {
    currentPrice: price,
    priceChange24h: 5.67,
    priceChange24hAbsolute: price * 0.0567,
    high24h: price * 1.08,
    low24h: price * 0.92,
    volume24h: dailyVolume,
    marketCap: marketCap, // ✅ Fixed: Return actual market cap, not totalSupply
    openInterest: dailyVolume * 5,
    premium: 0.12
  }
}

/**
 * Generate realistic orderbook data
 * Creates asks and bids with realistic spread and depth
 */
export function generateOrderbook(basePrice: number, count: number = 15): Orderbook {
  const asks: OrderBookRow[] = []
  const bids: OrderBookRow[] = []
  const spreadBase = 0.002 + Math.random() * 0.001 // 0.2-0.3% spread

  // Generate asks (sell orders - higher prices)
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

  // Generate bids (buy orders - lower prices from basePrice)
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

  // Sort by total (volume) for cleaner depth visualization
  asks.sort((a, b) => b.total - a.total)
  bids.sort((a, b) => b.total - a.total)

  const spread = asks[0].price - bids[0].price
  const spreadPercent = (spread / bids[0].price) * 100

  return { asks, bids, spread, spreadPercent }
}

/**
 * Generate recent trades
 * Creates realistic buy/sell trades with timestamps
 */
export function generateRecentTrades(basePrice: number, count: number = 30): RecentTrade[] {
  const trades: RecentTrade[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - i * 2000) // 2 seconds apart
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
      type: isBuy ? 'buy' : 'sell',
      timestamp: time
    })
  }

  return trades
}

/**
 * Update market data with realistic volatility
 * ✅ FIXED: Proper 24h tracking and volume accumulation
 * Used in periodic updates (1s interval)
 */
export function updateMarketDataWithVolatility(
  currentData: MarketData,
  volatility: number = 0.0015, // ±0.15% (reduced to 30% of original)
  price24hAgo?: number // Price from 24h ago for proper 24h change calculation
): MarketData {
  const priceChange = (Math.random() - 0.5) * volatility * 2
  const newPrice = currentData.currentPrice * (1 + priceChange)

  // Update 24h high/low
  const high24h = Math.max(currentData.high24h, newPrice)
  const low24h = Math.min(currentData.low24h, newPrice)

  // ✅ Fixed: Accumulate volume instead of multiplying
  const tradeVolume = 10000 + Math.random() * 50000 // Random trade size (10k-60k)
  const volume24h = currentData.volume24h + tradeVolume

  // ✅ Fixed: Calculate market cap correctly (price × totalSupply)
  const totalSupply = 1_000_000_000 // 1 billion tokens
  const marketCap = newPrice * totalSupply

  // Calculate open interest
  const openInterest = volume24h * 5

  // ✅ Fixed: Calculate 24h change from 24h ago price if provided
  let priceChange24h: number
  let priceChange24hAbsolute: number

  if (price24hAgo && price24hAgo > 0) {
    priceChange24hAbsolute = newPrice - price24hAgo
    priceChange24h = (priceChange24hAbsolute / price24hAgo) * 100
  } else {
    // Fallback to current change (for initialization)
    priceChange24hAbsolute = currentData.priceChange24hAbsolute
    priceChange24h = currentData.priceChange24h
  }

  return {
    currentPrice: newPrice,
    priceChange24h,
    priceChange24hAbsolute,
    high24h,
    low24h,
    volume24h,
    marketCap,
    openInterest,
    premium: 0.12 + (Math.random() - 0.5) * 0.02
  }
}
