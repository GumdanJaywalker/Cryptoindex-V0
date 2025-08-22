'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { useTradingActions, useTradingStore } from '@/lib/store/trading-store'
import { MemeIndex, TopTrader, Trade } from '@/lib/types/index-trading'

// WebSocket 연결 상태 타입
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// 실시간 데이터 메시지 타입
interface RealtimeMessage {
  type: 'price_update' | 'trade_executed' | 'trader_update' | 'market_stats' | 'whale_alert'
  data: any
  timestamp: number
}

// 가격 업데이트 메시지
interface PriceUpdateMessage extends RealtimeMessage {
  type: 'price_update'
  data: {
    indexId: string
    price: number
    change24h: number
    volume24h: number
    timestamp: number
  }
}

// 거래 실행 메시지
interface TradeExecutedMessage extends RealtimeMessage {
  type: 'trade_executed'
  data: {
    tradeId: string
    indexId: string
    type: 'buy' | 'sell'
    amount: number
    price: number
    userId: string
    timestamp: number
  }
}

// 트레이더 업데이트 메시지
interface TraderUpdateMessage extends RealtimeMessage {
  type: 'trader_update'
  data: {
    traderId: string
    pnl24h: number
    pnl7d: number
    pnl30d: number
    rank: number
    totalVolume: number
    timestamp: number
  }
}

// Whale Alert 메시지
interface WhaleAlertMessage extends RealtimeMessage {
  type: 'whale_alert'
  data: {
    indexId: string
    type: 'large_buy' | 'large_sell'
    amount: number
    price: number
    impact: number
    timestamp: number
  }
}

// WebSocket 훅 인터페이스
interface UseRealtimeOptions {
  enabled?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

// Mock WebSocket 시뮬레이션 클래스
class MockRealtimeConnection {
  private callbacks: Map<string, Function[]> = new Map()
  private intervalId: NodeJS.Timeout | null = null
  private isConnected = false
  
  constructor() {
    this.callbacks.set('open', [])
    this.callbacks.set('close', [])
    this.callbacks.set('error', [])
    this.callbacks.set('message', [])
  }

  connect() {
    // 연결 시뮬레이션
    setTimeout(() => {
      this.isConnected = true
      this.emit('open', {})
      this.startMockDataStream()
    }, 1000)
  }

  disconnect() {
    this.isConnected = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.emit('close', {})
  }

  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, [])
    }
    this.callbacks.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.callbacks.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.callbacks.get(event) || []
    callbacks.forEach(callback => callback(data))
  }

  private startMockDataStream() {
    // 가격 업데이트 시뮬레이션 (3초마다)
    this.intervalId = setInterval(() => {
      if (!this.isConnected) return

      // 랜덤하게 다른 타입의 메시지 전송
      const messageType = Math.random()
      
      if (messageType < 0.6) {
        // 60% 확률로 가격 업데이트
        this.emitPriceUpdate()
      } else if (messageType < 0.8) {
        // 20% 확률로 거래 실행
        this.emitTradeExecuted()
      } else if (messageType < 0.95) {
        // 15% 확률로 트레이더 업데이트
        this.emitTraderUpdate()
      } else {
        // 5% 확률로 Whale Alert
        this.emitWhaleAlert()
      }
    }, 3000)
  }

  private emitPriceUpdate() {
    const indexIds = ['PEPE_ECOSYSTEM', 'DOGE_FAMILY', 'SHIB_PACK', 'BONK_VERSE', 'WIF_REALM']
    const randomIndex = indexIds[Math.floor(Math.random() * indexIds.length)]
    
    const message: PriceUpdateMessage = {
      type: 'price_update',
      data: {
        indexId: randomIndex,
        price: 100 + Math.random() * 500,
        change24h: (Math.random() - 0.5) * 20,
        volume24h: 1000000 + Math.random() * 5000000,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }
    
    this.emit('message', { data: JSON.stringify(message) })
  }

  private emitTradeExecuted() {
    const indexIds = ['PEPE_ECOSYSTEM', 'DOGE_FAMILY', 'SHIB_PACK']
    const randomIndex = indexIds[Math.floor(Math.random() * indexIds.length)]
    
    const message: TradeExecutedMessage = {
      type: 'trade_executed',
      data: {
        tradeId: `trade_${Date.now()}`,
        indexId: randomIndex,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: Math.random() * 10000 + 1000,
        price: 100 + Math.random() * 500,
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }
    
    this.emit('message', { data: JSON.stringify(message) })
  }

  private emitTraderUpdate() {
    const message: TraderUpdateMessage = {
      type: 'trader_update',
      data: {
        traderId: `trader_${Math.floor(Math.random() * 30) + 1}`,
        pnl24h: (Math.random() - 0.5) * 20000,
        pnl7d: (Math.random() - 0.5) * 50000,
        pnl30d: (Math.random() - 0.5) * 100000,
        rank: Math.floor(Math.random() * 30) + 1,
        totalVolume: Math.random() * 1000000 + 100000,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }
    
    this.emit('message', { data: JSON.stringify(message) })
  }

  private emitWhaleAlert() {
    const indexIds = ['PEPE_ECOSYSTEM', 'DOGE_FAMILY', 'SHIB_PACK']
    const randomIndex = indexIds[Math.floor(Math.random() * indexIds.length)]
    
    const message: WhaleAlertMessage = {
      type: 'whale_alert',
      data: {
        indexId: randomIndex,
        type: Math.random() > 0.5 ? 'large_buy' : 'large_sell',
        amount: Math.random() * 100000 + 50000,
        price: 100 + Math.random() * 500,
        impact: Math.random() * 10 + 2,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }
    
    this.emit('message', { data: JSON.stringify(message) })
  }
}

// 실시간 연결 상태 관리 훅
export function useRealtimeConnection(options: UseRealtimeOptions = {}) {
  const {
    enabled = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 10,
    onConnect,
    onDisconnect,
    onError
  } = options

  const [connectionStatus, setConnectionStatus] = React.useState<ConnectionStatus>('disconnected')
  const [reconnectAttempts, setReconnectAttempts] = React.useState(0)
  const connectionRef = useRef<MockRealtimeConnection | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const {
    updateIndexPrice,
    updateTraderPnL,
    addTrade,
    setLastUpdated
  } = useTradingActions()

  // 메시지 핸들러
  const handleMessage = useCallback((event: any) => {
    try {
      const message: RealtimeMessage = JSON.parse(event.data)
      
      switch (message.type) {
        case 'price_update':
          const priceData = message.data
          updateIndexPrice(priceData.indexId, priceData.price, priceData.change24h)
          setLastUpdated(new Date())
          break

        case 'trade_executed':
          const tradeData = message.data
          // 새로운 거래 추가 (실제로는 더 복잡한 로직 필요)
          console.log('Trade executed:', tradeData)
          break

        case 'trader_update':
          const traderData = message.data
          updateTraderPnL(
            traderData.traderId,
            traderData.pnl24h,
            traderData.pnl7d,
            traderData.pnl30d
          )
          break

        case 'whale_alert':
          const whaleData = message.data
          console.log('🐋 Whale Alert:', whaleData)
          // 여기서 알림 시스템에 전달 가능
          break

        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error parsing realtime message:', error)
    }
  }, [updateIndexPrice, updateTraderPnL, addTrade, setLastUpdated])

  // 연결 핸들러
  const handleOpen = useCallback(() => {
    setConnectionStatus('connected')
    setReconnectAttempts(0)
    onConnect?.()
    console.log('✅ Realtime connection established')
  }, [onConnect])

  const handleClose = useCallback(() => {
    setConnectionStatus('disconnected')
    onDisconnect?.()
    console.log('❌ Realtime connection closed')

    // 자동 재연결
    if (enabled && reconnectAttempts < maxReconnectAttempts) {
      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectAttempts(prev => prev + 1)
        connect()
      }, reconnectInterval)
    }
  }, [enabled, reconnectAttempts, maxReconnectAttempts, reconnectInterval, onDisconnect])

  const handleError = useCallback((error: any) => {
    setConnectionStatus('error')
    onError?.(error)
    console.error('❌ Realtime connection error:', error)
  }, [onError])

  // 연결 함수
  const connect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.disconnect()
    }

    setConnectionStatus('connecting')
    connectionRef.current = new MockRealtimeConnection()
    
    connectionRef.current.on('open', handleOpen)
    connectionRef.current.on('close', handleClose)
    connectionRef.current.on('error', handleError)
    connectionRef.current.on('message', handleMessage)
    
    connectionRef.current.connect()
  }, [handleOpen, handleClose, handleError, handleMessage])

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (connectionRef.current) {
      connectionRef.current.disconnect()
      connectionRef.current = null
    }
    
    setConnectionStatus('disconnected')
  }, [])

  // 수동 재연결 함수
  const reconnect = useCallback(() => {
    setReconnectAttempts(0)
    connect()
  }, [connect])

  // Effect: 자동 연결 및 정리
  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    connectionStatus,
    reconnectAttempts,
    maxReconnectAttempts,
    connect,
    disconnect,
    reconnect,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    hasError: connectionStatus === 'error'
  }
}

// 특정 인덱스 실시간 가격 추적 훅
export function useRealtimeIndexPrice(indexId: string, options: UseRealtimeOptions = {}) {
  const connection = useRealtimeConnection(options)
  const currentPrice = useTradingStore((state) => {
    const index = state.indices.find(idx => idx.id === indexId)
    return index ? {
      price: index.currentPrice,
      change: index.change24h,
      volume: index.volume24h,
      lastUpdated: state.lastUpdated
    } : null
  })

  return {
    ...connection,
    currentPrice,
    indexId
  }
}

// 실시간 알림 훅
export function useRealtimeAlerts(options: UseRealtimeOptions = {}) {
  const [alerts, setAlerts] = React.useState<WhaleAlertMessage[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)

  const connection = useRealtimeConnection({
    ...options,
    onConnect: () => {
      console.log('🔔 Alert system connected')
      options.onConnect?.()
    }
  })

  // 알림 추가 (실제로는 WebSocket 메시지에서 처리)
  const addAlert = useCallback((alert: WhaleAlertMessage) => {
    setAlerts(prev => [alert, ...prev.slice(0, 49)]) // 최대 50개까지만 저장
    setUnreadCount(prev => prev + 1)
  }, [])

  // 알림 읽음 처리
  const markAsRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  // 알림 삭제
  const clearAlerts = useCallback(() => {
    setAlerts([])
    setUnreadCount(0)
  }, [])

  return {
    ...connection,
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    clearAlerts
  }
}

// 실시간 거래 피드 훅
export function useRealtimeTradeFeed(options: UseRealtimeOptions = {}) {
  const [recentTrades, setRecentTrades] = React.useState<TradeExecutedMessage[]>([])
  
  const connection = useRealtimeConnection({
    ...options,
    onConnect: () => {
      console.log('📊 Trade feed connected')
      options.onConnect?.()
    }
  })

  // 거래 추가 (실제로는 WebSocket 메시지에서 처리)
  const addTrade = useCallback((trade: TradeExecutedMessage) => {
    setRecentTrades(prev => [trade, ...prev.slice(0, 99)]) // 최대 100개까지만 저장
  }, [])

  // 거래 피드 정리
  const clearTrades = useCallback(() => {
    setRecentTrades([])
  }, [])

  return {
    ...connection,
    recentTrades,
    addTrade,
    clearTrades
  }
}

// 전체 실시간 데이터 통합 훅
export function useRealtimeData(options: UseRealtimeOptions = {}) {
  const indices = useTradingStore((state) => state.indices)
  const indexIds = indices.map(index => index.id)
  
  const connection = useRealtimeConnection(options)
  const alerts = useRealtimeAlerts({ enabled: connection.isConnected })
  const tradeFeed = useRealtimeTradeFeed({ enabled: connection.isConnected })

  // 실시간 데이터 통계
  const stats = React.useMemo(() => {
    const lastUpdate = useTradingStore.getState().lastUpdated
    const timeSinceUpdate = lastUpdate ? Date.now() - lastUpdate.getTime() : null
    
    return {
      connectedIndices: indexIds.length,
      lastUpdateTime: lastUpdate,
      timeSinceUpdate,
      alertCount: alerts.unreadCount,
      recentTradeCount: tradeFeed.recentTrades.length,
      isStale: timeSinceUpdate ? timeSinceUpdate > 30000 : false // 30초 이상 업데이트 없으면 stale
    }
  }, [indexIds.length, alerts.unreadCount, tradeFeed.recentTrades.length])

  return {
    connection,
    alerts,
    tradeFeed,
    stats
  }
}

export default useRealtimeConnection