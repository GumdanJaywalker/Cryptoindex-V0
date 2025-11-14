// Mock market data for Footer display

export interface MarketData {
  volume24h: number // in HYPE
  totalIndexes: number
  tvl24h: number // in HYPE
  networkLatency: number // in ms
  blockHeight: number
}

export const mockMarketData: MarketData = {
  volume24h: 847_532_000, // ~$847M HYPE
  totalIndexes: 18,
  tvl24h: 324_891_000, // ~$324M HYPE
  networkLatency: 146, // 146ms
  blockHeight: 21_000_001,
}

// Helper function to format large numbers
export function formatMarketValue(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toString()
}

// Helper function to format number with commas
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}
