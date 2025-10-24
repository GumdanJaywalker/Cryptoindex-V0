import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTradingStore, useTradingActions } from '@/lib/store/trading-store'
import { MemeIndex, TopTrader, MarketStats, Trade } from '@/lib/types/index-trading'
import { generateMockIndices, generateMockTraders } from '@/lib/data/mock-indexes'

// API 시뮬레이션 함수들
const simulateApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms))

const fetchIndices = async (): Promise<MemeIndex[]> => {
  await simulateApiDelay(800)
  
  // Mock API response with price variations
  const baseIndices = generateMockIndices()
  return baseIndices.map(index => ({
    ...index,
    // 실시간 가격 변동 시뮬레이션
    currentPrice: index.currentPrice * (1 + (Math.random() - 0.5) * 0.05),
    change24h: index.change24h + (Math.random() - 0.5) * 2,
    volume24h: index.volume24h * (1 + (Math.random() - 0.5) * 0.3),
    lastUpdated: new Date()
  }))
}

const fetchTopTraders = async (timeframe: '24h' | '7d' | '30d' = '24h'): Promise<TopTrader[]> => {
  await simulateApiDelay(600)
  
  const baseTraders = generateMockTraders()
  return baseTraders.map((trader, index) => ({
    ...trader,
    // 타임프레임별 PnL 조정
    pnl24h: trader.pnl24h * (timeframe === '24h' ? 1 : timeframe === '7d' ? 0.8 : 0.6),
    pnl7d: trader.pnl7d * (timeframe === '7d' ? 1.2 : 1),
    pnl30d: trader.pnl30d * (timeframe === '30d' ? 1.1 : 1),
    rank: index + 1,
    lastActive: new Date()
  }))
}

const fetchIndexPrice = async (indexId: string): Promise<{ price: number; change: number }> => {
  await simulateApiDelay(200)
  
  // 개별 인덱스 가격 조회 시뮬레이션
  const basePrice = 100 + Math.random() * 500
  return {
    price: basePrice,
    change: (Math.random() - 0.5) * 20
  }
}

const fetchMarketStats = async (): Promise<MarketStats> => {
  await simulateApiDelay(500)
  
  return {
    totalMarketCap: 1250000000 + Math.random() * 500000000,
    totalVolume24h: 890000000 + Math.random() * 200000000,
    activeIndices: 15,
    topPerformerChange: 45.8 + (Math.random() - 0.5) * 10,
    avgChange24h: 2.4 + (Math.random() - 0.5) * 5,
    dominanceIndex: 'PEPE_ECOSYSTEM',
    dominancePercentage: 18.5 + (Math.random() - 0.5) * 5
  }
}

// Query Keys
export const marketQueryKeys = {
  all: ['market'] as const,
  indices: () => [...marketQueryKeys.all, 'indices'] as const,
  traders: (timeframe?: string) => [...marketQueryKeys.all, 'traders', timeframe] as const,
  indexPrice: (id: string) => [...marketQueryKeys.all, 'indexPrice', id] as const,
  marketStats: () => [...marketQueryKeys.all, 'stats'] as const,
} as const

// 인덱스 데이터 조회 훅
export function useIndices(options?: {
  refetchInterval?: number
  staleTime?: number
  enabled?: boolean
}) {
  const { setIndices, setLoading, setLastUpdated } = useTradingActions()

  const query = useQuery({
    queryKey: marketQueryKeys.indices(),
    queryFn: fetchIndices,
    refetchInterval: options?.refetchInterval ?? 30000, // 30초마다 자동 새로고침
    staleTime: options?.staleTime ?? 15000, // 15초간 fresh
    enabled: options?.enabled ?? true,
  })

  // React Query v5에서는 useEffect를 사용하여 side effects 처리
  React.useEffect(() => {
    if (query.data) {
      setIndices(query.data)
      setLastUpdated(new Date())
    }
    setLoading(query.isLoading)
  }, [query.data, query.isLoading, setIndices, setLastUpdated, setLoading])

  return query
}

// 탑 트레이더 데이터 조회 훅
export function useTopTraders(timeframe: '24h' | '7d' | '30d' = '24h', options?: {
  refetchInterval?: number
  staleTime?: number
  enabled?: boolean
}) {
  const { setTraders, setLoading } = useTradingActions()

  const query = useQuery({
    queryKey: marketQueryKeys.traders(timeframe),
    queryFn: () => fetchTopTraders(timeframe),
    refetchInterval: options?.refetchInterval ?? 60000, // 1분마다 자동 새로고침
    staleTime: options?.staleTime ?? 30000, // 30초간 fresh
    enabled: options?.enabled ?? true,
  })

  React.useEffect(() => {
    if (query.data) {
      setTraders(query.data)
    }
    setLoading(query.isLoading)
  }, [query.data, query.isLoading, setTraders, setLoading])

  return query
}

// 개별 인덱스 가격 조회 훅
export function useIndexPrice(indexId: string, options?: {
  refetchInterval?: number
  enabled?: boolean
}) {
  const { updateIndexPrice } = useTradingActions()

  const query = useQuery({
    queryKey: marketQueryKeys.indexPrice(indexId),
    queryFn: () => fetchIndexPrice(indexId),
    refetchInterval: options?.refetchInterval ?? 5000, // 5초마다 가격 업데이트
    enabled: options?.enabled ?? !!indexId,
  })

  React.useEffect(() => {
    if (query.data && indexId) {
      updateIndexPrice(indexId, query.data.price, query.data.change)
    }
  }, [query.data, indexId, updateIndexPrice])

  return query
}

// 마켓 통계 조회 훅
export function useMarketStats(options?: {
  refetchInterval?: number
  staleTime?: number
  enabled?: boolean
}) {
  const { setMarketStats } = useTradingActions()

  const query = useQuery({
    queryKey: marketQueryKeys.marketStats(),
    queryFn: fetchMarketStats,
    refetchInterval: options?.refetchInterval ?? 120000, // 2분마다 새로고침
    staleTime: options?.staleTime ?? 60000, // 1분간 fresh
    enabled: options?.enabled ?? true,
  })

  React.useEffect(() => {
    if (query.data) {
      setMarketStats(query.data)
    }
  }, [query.data, setMarketStats])

  return query
}

// 실시간 가격 업데이트 훅 (여러 인덱스)
export function useRealtimePrices(indexIds: string[], options?: {
  enabled?: boolean
  refetchInterval?: number
}) {
  const { updateIndexPrice } = useTradingActions()
  
  const query = useQuery({
    queryKey: ['realtimePrices', ...indexIds],
    queryFn: async () => {
      const promises = indexIds.map(id => fetchIndexPrice(id))
      const results = await Promise.all(promises)
      
      return results.map((result, index) => ({
        id: indexIds[index],
        ...result
      }))
    },
    refetchInterval: options?.refetchInterval ?? 3000, // 3초마다 업데이트
    enabled: options?.enabled ?? indexIds.length > 0,
  })

  React.useEffect(() => {
    if (query.data) {
      query.data.forEach(({ id, price, change }) => {
        updateIndexPrice(id, price, change)
      })
    }
  }, [query.data, updateIndexPrice])

  return query
}

// 데이터 새로고침 Mutation 훅
export function useRefreshMarketData() {
  const queryClient = useQueryClient()
  const { setRefreshing } = useTradingActions()

  return useMutation({
    mutationFn: async () => {
      setRefreshing(true)
      
      // 모든 관련 쿼리를 병렬로 새로고침
      await Promise.all([
        queryClient.refetchQueries({ queryKey: marketQueryKeys.indices() }),
        queryClient.refetchQueries({ queryKey: marketQueryKeys.traders() }),
        queryClient.refetchQueries({ queryKey: marketQueryKeys.marketStats() })
      ])
    },
    onSettled: () => {
      setRefreshing(false)
    }
  })
}

// 특정 인덱스 상세 데이터 조회 훅
export function useIndexDetails(indexId: string, options?: {
  enabled?: boolean
}) {
  const indexes = useTradingStore((state) => state.indices)
  const selectedIndex = indexes.find(index => index.id === indexId)

  return useQuery({
    queryKey: ['indexDetails', indexId],
    queryFn: async () => {
      await simulateApiDelay(300)
      
      // 상세 정보 시뮬레이션 (실제로는 API에서 가져옴)
      return {
        ...selectedIndex,
        // 추가 상세 정보
        description: `${selectedIndex?.name}은 관련 밈코인들의 시가총액 가중 평균 인덱스입니다.`,
        constituents: selectedIndex?.memeCoins || [],
        creationDate: new Date('2024-01-01'),
        totalSupply: 1000000,
        circulatingSupply: 850000,
        holders: Math.floor(Math.random() * 10000) + 5000,
        avgHoldingPeriod: Math.floor(Math.random() * 30) + 7,
        volatility24h: Math.random() * 0.5 + 0.1,
        sharpeRatio: Math.random() * 2 + 0.5,
        maxDrawdown: Math.random() * 0.3 + 0.1,
        beta: Math.random() * 1.5 + 0.5
      }
    },
    enabled: options?.enabled ?? (!!indexId && !!selectedIndex),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
  })
}

// 트레이더 상세 정보 조회 훅
export function useTraderDetails(traderId: string, options?: {
  enabled?: boolean
}) {
  const traders = useTradingStore((state) => state.traders)
  const selectedTrader = traders.find(trader => trader.id === traderId)

  return useQuery({
    queryKey: ['traderDetails', traderId],
    queryFn: async () => {
      await simulateApiDelay(400)
      
      return {
        ...selectedTrader,
        // 추가 상세 정보
        joinDate: new Date('2024-01-15'),
        totalTrades: Math.floor(Math.random() * 1000) + 100,
        winningTrades: Math.floor(Math.random() * 600) + 60,
        avgHoldTime: Math.floor(Math.random() * 168) + 2, // hours
        largestWin: Math.random() * 50000 + 5000,
        largestLoss: -(Math.random() * 20000 + 2000),
        consecutiveWins: Math.floor(Math.random() * 15) + 1,
        consecutiveLosses: Math.floor(Math.random() * 8) + 1,
        favoriteIndices: ['PEPE_ECOSYSTEM', 'DOGE_FAMILY', 'SHIB_PACK'],
        tradingStyle: ['Swing Trading', 'Day Trading', 'Scalping'][Math.floor(Math.random() * 3)],
        riskLevel: ['Conservative', 'Moderate', 'Aggressive'][Math.floor(Math.random() * 3)]
      }
    },
    enabled: options?.enabled ?? (!!traderId && !!selectedTrader),
    staleTime: 10 * 60 * 1000, // 10분간 fresh
  })
}

// 시장 트렌드 분석 훅
export function useMarketTrends(period: '1h' | '4h' | '24h' | '7d' = '24h') {
  return useQuery({
    queryKey: ['marketTrends', period],
    queryFn: async () => {
      await simulateApiDelay(600)
      
      const trends = {
        period,
        timestamp: new Date(),
        sentiment: {
          bullish: Math.random() * 100,
          bearish: Math.random() * 100,
          neutral: Math.random() * 100
        },
        topGainers: generateMockIndices().slice(0, 5).map(index => ({
          ...index,
          change24h: Math.random() * 30 + 10
        })),
        topLosers: generateMockIndices().slice(5, 10).map(index => ({
          ...index, 
          change24h: -(Math.random() * 20 + 5)
        })),
        volumeLeaders: generateMockIndices().slice(0, 5).sort((a, b) => b.volume24h - a.volume24h),
        marketPhase: ['Accumulation', 'Markup', 'Distribution', 'Markdown'][Math.floor(Math.random() * 4)],
        riskLevel: Math.random() * 10,
        correlationBTC: Math.random() * 2 - 1,
        correlationETH: Math.random() * 2 - 1
      }
      
      return trends
    },
    refetchInterval: period === '1h' ? 60000 : period === '4h' ? 240000 : 600000,
    staleTime: period === '1h' ? 30000 : period === '4h' ? 120000 : 300000
  })
}
