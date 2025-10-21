// Trading Chart Types for TradingView Lightweight Charts Integration

/**
 * OHLCV Data Structure
 * ⚠️ IMPORTANT: time is in SECONDS (not milliseconds!) for TradingView compatibility
 */
export interface OHLCVData {
  time: number // Unix timestamp in SECONDS
  open: number
  high: number
  low: number
  close: number
  volume: number
}

/**
 * Simplified price data for line charts
 */
export interface PriceData {
  time: number // Unix timestamp in SECONDS
  value: number
}

/**
 * Volume data structure
 */
export interface VolumeData {
  time: number // Unix timestamp in SECONDS
  value: number
  color?: string // Optional color based on price movement
}

/**
 * Chart display types
 */
export type ChartType = 'Candlestick' | 'Line' | 'Area' | 'Histogram'

/**
 * Available timeframes
 */
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

/**
 * Technical indicator types
 */
export type IndicatorType = 'MA' | 'EMA' | 'RSI' | 'MACD' | 'BollingerBands' | 'Volume'

/**
 * Technical indicator configuration
 */
export interface TechnicalIndicator {
  id: string
  type: IndicatorType
  name: string
  params: Record<string, number> // e.g., { period: 20 }
  visible: boolean
  color?: string
}

/**
 * Moving Average indicator data
 */
export interface MAData {
  time: number
  value: number
}

/**
 * RSI indicator data
 */
export interface RSIData {
  time: number
  value: number // 0-100
}

/**
 * MACD indicator data
 */
export interface MACDData {
  time: number
  macd: number
  signal: number
  histogram: number
}

/**
 * Bollinger Bands data
 */
export interface BollingerBandsData {
  time: number
  upper: number
  middle: number
  lower: number
}

/**
 * Chart settings that can be saved
 */
export interface ChartSettings {
  chartType: ChartType
  timeframe: Timeframe
  indicators: TechnicalIndicator[]
  showVolume: boolean
  showGrid: boolean
  showCrosshair: boolean
}

/**
 * Real-time price update from WebSocket
 */
export interface RealtimePriceUpdate {
  indexId: string
  time: number // Unix timestamp in SECONDS
  price: number
  volume?: number
}

/**
 * Chart API response from backend
 */
export interface ChartAPIResponse {
  success: boolean
  data: OHLCVData[]
  meta?: {
    indexId: string
    timeframe: Timeframe
    from: number
    to: number
    count: number
  }
  timestamp: number
}

/**
 * Drawing tool types (for future implementation)
 */
export type DrawingTool = 'trendline' | 'horizontal' | 'fibonacci' | 'rectangle' | 'text'

/**
 * Drawing object on chart
 */
export interface ChartDrawing {
  id: string
  tool: DrawingTool
  points: Array<{ time: number; price: number }>
  color: string
  lineWidth: number
  text?: string
}
