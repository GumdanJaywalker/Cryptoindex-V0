// Trading Chart API Functions
// ⚠️ Currently using Mock data - Backend API integration pending

import type {
  OHLCVData,
  ChartAPIResponse,
  Timeframe,
  MAData,
  RSIData
} from '@/lib/types/trading-chart'
import { useTradingStore } from '@/lib/store/trading-store'
import { getIndexBasePrice } from '@/lib/utils/market-data-generator'

/**
 * Generate mock OHLCV data for testing
 * ✅ NEW: Generates BACKWARDS from current price for stability
 * @param indexSymbol - Index symbol to determine base price
 * @param timeframe - Chart timeframe
 * @param count - Number of candles to generate
 * @param currentPrice - Current price from Store (optional, uses base price if not provided)
 * @returns Array of OHLCV data
 */
function generateMockOHLCVData(
  indexSymbol: string,
  timeframe: Timeframe,
  count: number = 500,
  currentPrice?: number
): OHLCVData[] {
  const data: OHLCVData[] = []
  const now = Math.floor(Date.now() / 1000) // Current time in SECONDS

  // ✅ Use currentPrice from Store if provided, otherwise use base price
  const endPrice = currentPrice ?? getIndexBasePrice(indexSymbol)

  // Timeframe in seconds
  const timeframeSeconds: Record<Timeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
    '1w': 604800
  }

  const intervalSeconds = timeframeSeconds[timeframe]

  // Improved candle generation with realistic volatility, wicks, and trends
  let trendStrength = 0
  let trendDirection = Math.random() > 0.5 ? 1 : -1

  // ✅ Generate BACKWARDS: Start from current price, work backwards to past
  // This ensures the LAST candle matches the current Store price
  let runningPrice = endPrice

  // Build array backwards first
  const backwardsData: OHLCVData[] = []

  for (let i = 0; i <= count; i++) {
    // Determine if trend changes (10% chance per candle)
    if (Math.random() < 0.1) {
      trendDirection = Math.random() > 0.5 ? 1 : -1
      trendStrength = Math.random() * 0.3 // 0-30% trend bias
    }

    // Base volatility: ±0.15% (reduced to 30% of original)
    const baseVolatility = 0.0015

    // REVERSE the price movement (going backwards in time)
    const trendBias = -trendDirection * trendStrength * baseVolatility
    const randomMove = (Math.random() - 0.5) * baseVolatility * 2
    const priceChange = randomMove + trendBias

    // Open is current running price, close is reversed move
    const close = runningPrice
    const open = close / (1 + priceChange)

    // Generate realistic wicks (high/low extend beyond open/close)
    const wickVolatility = baseVolatility * 0.5 // Wicks add extra 0.25% range
    const upperWick = Math.random() * wickVolatility * close
    const lowerWick = Math.random() * wickVolatility * close

    const high = Math.max(open, close) + upperWick
    const low = Math.min(open, close) - lowerWick

    // Realistic volume with trend correlation (higher volume during trends)
    const volumeMultiplier = 1 + Math.abs(trendStrength) * 2
    const volume = (50000 + Math.random() * 200000) * volumeMultiplier

    backwardsData.push({
      time: 0, // Will set timestamp later
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume: Math.floor(volume)
    })

    // Move price backwards for next iteration
    runningPrice = open
  }

  // ✅ Reverse array and assign timestamps (oldest → newest)
  backwardsData.reverse()

  for (let i = 0; i < backwardsData.length; i++) {
    const timestamp = now - ((count - i) * intervalSeconds)
    data.push({
      ...backwardsData[i],
      time: timestamp
    })
  }

  return data
}

/**
 * Fetch OHLCV chart data from backend
 * ✅ NEW: Uses cache and Store's currentPrice for stability
 * @param indexId - Index ID
 * @param timeframe - Chart timeframe
 * @param limit - Maximum number of candles (default: 500)
 * @param forceRefresh - Force regeneration ignoring cache (default: false)
 * @returns Promise<ChartAPIResponse>
 *
 * TODO: Replace with actual backend API call when ready
 * Backend endpoint: GET /api/indices/:id/ohlcv?timeframe={timeframe}&limit={limit}
 */
export async function fetchOHLCVData(
  indexId: string,
  timeframe: Timeframe,
  limit: number = 500,
  forceRefresh: boolean = false
): Promise<ChartAPIResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // ✅ Check cache first (unless forceRefresh)
  const store = useTradingStore.getState()
  const cachedData = store.getCachedChartData(indexId, timeframe)

  if (cachedData && cachedData.length > 0 && !forceRefresh) {
    // Return cached data
    return {
      success: true,
      data: cachedData,
      meta: {
        indexId,
        timeframe,
        from: cachedData[0]?.time || 0,
        to: cachedData[cachedData.length - 1]?.time || 0,
        count: cachedData.length
      },
      timestamp: Date.now(),
      cached: true
    }
  }

  // TODO: Uncomment when backend is ready
  /*
  try {
    const response = await fetch(
      `/api/indices/${indexId}/ohlcv?timeframe={timeframe}&limit=${limit}`
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: ChartAPIResponse = await response.json()
    // Cache the data
    store.setCachedChartData(indexId, timeframe, data.data)
    return data
  } catch (error) {
    console.error('Failed to fetch OHLCV data:', error)
    throw error
  }
  */

  // ✅ Generate new data using Store's currentPrice
  const currentPrice = store.currentPrice
  const mockData = generateMockOHLCVData(indexId, timeframe, limit, currentPrice)

  // ✅ Cache the generated data
  store.setCachedChartData(indexId, timeframe, mockData)

  return {
    success: true,
    data: mockData,
    meta: {
      indexId,
      timeframe,
      from: mockData[0]?.time || 0,
      to: mockData[mockData.length - 1]?.time || 0,
      count: mockData.length
    },
    timestamp: Date.now(),
    cached: false
  }
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param data - OHLCV data array
 * @param period - MA period (e.g., 7, 25, 99)
 * @returns Array of MA data
 */
export function calculateMA(data: OHLCVData[], period: number): MAData[] {
  const maData: MAData[] = []

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close
    }
    const average = sum / period

    maData.push({
      time: data[i].time,
      value: Number(average.toFixed(4))
    })
  }

  return maData
}

/**
 * Calculate Relative Strength Index (RSI)
 * @param data - OHLCV data array
 * @param period - RSI period (default: 14)
 * @returns Array of RSI data (0-100)
 */
export function calculateRSI(data: OHLCVData[], period: number = 14): RSIData[] {
  const rsiData: RSIData[] = []

  if (data.length < period + 1) {
    return rsiData
  }

  // Calculate price changes
  const changes: number[] = []
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close)
  }

  // Calculate initial average gain/loss
  let avgGain = 0
  let avgLoss = 0

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i]
    } else {
      avgLoss += Math.abs(changes[i])
    }
  }

  avgGain /= period
  avgLoss /= period

  // Calculate RSI
  for (let i = period; i < changes.length; i++) {
    const change = changes[i]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? Math.abs(change) : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))

    rsiData.push({
      time: data[i + 1].time,
      value: Number(rsi.toFixed(2))
    })
  }

  return rsiData
}

/**
 * Subscribe to real-time price updates via WebSocket
 * ✅ NEW: Uses Store's currentPrice instead of hardcoded value
 * @param indexId - Index ID to subscribe to
 * @param callback - Callback function for price updates
 * @returns Unsubscribe function
 *
 * TODO: Implement WebSocket connection when backend is ready
 * WebSocket endpoint: wss://api.example.com/ws/prices
 */
export function subscribeToRealTimePrice(
  indexId: string,
  callback: (price: number, volume: number, time: number) => void
): () => void {
  // TODO: Uncomment when WebSocket is ready
  /*
  const ws = new WebSocket('wss://api.example.com/ws/prices')

  ws.onopen = () => {
    ws.send(JSON.stringify({
      action: 'subscribe',
      channel: 'price_updates',
      indexId
    }))
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.channel === '/ws/prices' && data.event === 'price_update') {
      const { time, price, volume } = data.data
      callback(price, volume || 0, time)
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  // Return cleanup function
  return () => {
    ws.close()
  }
  */

  // ✅ Mock real-time updates using Store's currentPrice (1 second interval)
  const interval = setInterval(() => {
    const now = Math.floor(Date.now() / 1000)
    // Get current price from Store (synced with 1-second updates)
    const store = useTradingStore.getState()
    const mockPrice = store.currentPrice
    const mockVolume = Math.floor(Math.random() * 5000)
    callback(mockPrice, mockVolume, now)
  }, 1000) // Sync with Store's 1-second update interval

  // Return cleanup function
  return () => {
    clearInterval(interval)
  }
}

/**
 * Save chart settings to backend
 * @param settings - Chart settings object
 *
 * TODO: Implement when backend is ready
 * Backend endpoint: PUT /api/user/chart-settings
 */
export async function saveChartSettings(settings: any): Promise<void> {
  // TODO: Uncomment when backend is ready
  /*
  try {
    const response = await fetch('/api/user/chart-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settings)
    })

    if (!response.ok) {
      throw new Error('Failed to save chart settings')
    }
  } catch (error) {
    console.error('Error saving chart settings:', error)
    throw error
  }
  */

  // Mock: Save to localStorage
  localStorage.setItem('chart-settings', JSON.stringify(settings))
}

/**
 * Load chart settings from backend
 * @returns Promise<any>
 *
 * TODO: Implement when backend is ready
 * Backend endpoint: GET /api/user/chart-settings
 */
export async function loadChartSettings(): Promise<any> {
  // TODO: Uncomment when backend is ready
  /*
  try {
    const response = await fetch('/api/user/chart-settings', {
      credentials: 'include'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.settings
  } catch (error) {
    console.error('Error loading chart settings:', error)
    return null
  }
  */

  // Mock: Load from localStorage
  const saved = localStorage.getItem('chart-settings')
  return saved ? JSON.parse(saved) : null
}
