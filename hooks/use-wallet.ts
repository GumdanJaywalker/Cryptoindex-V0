'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useTradingActions, useTradingStore } from '@/lib/store/trading-store'
import { MemeIndex, Trade } from '@/lib/types/index-trading'

// Wallet Balance Type
interface TokenBalance {
  symbol: string
  name: string
  balance: string
  balanceFormatted: string
  decimals: number
  address: string
  logoUrl?: string
  usdValue?: number
}

// Trade Execution Parameters
interface TradeParams {
  indexId: string
  type: 'buy' | 'sell'
  amount: number
  leverage?: number
  slippage?: number
  deadline?: number
}

// Trade Result
interface TradeResult {
  success: boolean
  transactionHash?: string
  tradeId?: string
  executedPrice?: number
  gasUsed?: string
  error?: string
}

// Transaction Status
type TransactionStatus = 'idle' | 'preparing' | 'pending' | 'confirming' | 'confirmed' | 'failed'

interface PendingTransaction {
  id: string
  hash: string
  type: 'buy' | 'sell' | 'deposit' | 'withdraw'
  indexId?: string
  amount: number
  status: TransactionStatus
  timestamp: number
  gasPrice?: string
  gasUsed?: string
  blockNumber?: number
}

// Mock Data Generation Functions
const generateMockBalance = (): TokenBalance[] => [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '25000000000', // 25,000 USDC (6 decimals)
    balanceFormatted: '25,000.00',
    decimals: 6,
    address: '0xa0b86a33e6bde3cf59de8d3e3e5e7c2b1a1f2d3e',
    logoUrl: '/tokens/usdc.png',
    usdValue: 25000
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    balance: '5000000000000000000', // 5 WETH (18 decimals)
    balanceFormatted: '5.00',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    logoUrl: '/tokens/weth.png',
    usdValue: 15000
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    balance: '10000000000', // 10,000 USDT (6 decimals)
    balanceFormatted: '10,000.00',
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    logoUrl: '/tokens/usdt.png',
    usdValue: 10000
  }
]

const simulateTradeExecution = async (params: TradeParams): Promise<TradeResult> => {
  // Simulate trade execution
  await new Promise(resolve => setTimeout(resolve, 2000))

  const success = Math.random() > 0.1 // 90% success rate

  if (success) {
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      tradeId: `trade_${Date.now()}`,
      executedPrice: 100 + Math.random() * 500,
      gasUsed: (Math.random() * 50000 + 21000).toFixed(0)
    }
  } else {
    return {
      success: false,
      error: 'Transaction failed: Insufficient gas or slippage too high'
    }
  }
}

// Wallet Balance Hook
export function useWalletBalances() {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = useCallback(async () => {
    if (!authenticated || !ready || wallets.length === 0) {
      setBalances([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Actually fetch balances via RPC here
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockBalances = generateMockBalance()
      setBalances(mockBalances)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances')
      setBalances([])
    } finally {
      setIsLoading(false)
    }
  }, [authenticated, ready, wallets.length])

  // Auto fetch balances
  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  // Calculate total USD value
  const totalUsdValue = balances.reduce((total, token) => total + (token.usdValue || 0), 0)

  // Get specific token balance
  const getTokenBalance = useCallback((symbol: string) => {
    return balances.find(token => token.symbol === symbol)
  }, [balances])

  // Refresh balances
  const refreshBalances = useCallback(() => {
    fetchBalances()
  }, [fetchBalances])

  return {
    balances,
    totalUsdValue,
    isLoading,
    error,
    getTokenBalance,
    refreshBalances,
    hasBalances: balances.length > 0,
    isConnected: authenticated && ready && wallets.length > 0
  }
}

// Trade Execution Hook
export function useTradeExecution() {
  const { authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  const { addTrade, setLoading } = useTradingActions()
  const [pendingTrades, setPendingTrades] = useState<PendingTransaction[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  // Execute trade
  const executeTrade = useCallback(async (params: TradeParams): Promise<TradeResult> => {
    if (!authenticated || !ready || wallets.length === 0) {
      throw new Error('Wallet not connected')
    }

    setIsExecuting(true)
    setLoading(true)

    try {
      // Simulate trade
      const result = await simulateTradeExecution(params)

      if (result.success && result.transactionHash && result.tradeId) {
        // Add pending transaction
        const pendingTx: PendingTransaction = {
          id: result.tradeId,
          hash: result.transactionHash,
          type: params.type,
          indexId: params.indexId,
          amount: params.amount,
          status: 'pending',
          timestamp: Date.now()
        }

        setPendingTrades(prev => [pendingTx, ...prev])

        // Add trade to Zustand store
        const newTrade: Trade = {
          id: result.tradeId,
          indexId: params.indexId,
          type: params.type === 'buy' ? 'long' : 'short',
          amount: params.amount,
          entryPrice: result.executedPrice!,
          currentPrice: result.executedPrice!,
          leverage: params.leverage || 1,
          timestamp: new Date(),
          status: 'open',
          pnl: 0,
          pnlPercentage: 0,
          fees: 0,
          transactionHash: result.transactionHash
        }

        addTrade(newTrade)

        // Simulate transaction confirmation
        setTimeout(() => {
          setPendingTrades(prev =>
            prev.map(tx =>
              tx.id === result.tradeId
                ? { ...tx, status: 'confirmed', blockNumber: Math.floor(Math.random() * 1000000) + 18000000 }
                : tx
            )
          )
        }, 3000)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Trade execution failed'
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsExecuting(false)
      setLoading(false)
    }
  }, [authenticated, ready, wallets.length, addTrade, setLoading])

  // Quick trade execution (using preset values)
  const quickTrade = useCallback(async (
    indexId: string,
    type: 'buy' | 'sell',
    amount: number = 1000
  ): Promise<TradeResult> => {
    return executeTrade({
      indexId,
      type,
      amount,
      leverage: 1,
      slippage: 0.5, // 0.5%
      deadline: Date.now() + 20 * 60 * 1000 // 20 minutes
    })
  }, [executeTrade])

  // Clear pending trades
  const clearPendingTrades = useCallback(() => {
    setPendingTrades([])
  }, [])

  // Get specific transaction status
  const getTransactionStatus = useCallback((txId: string) => {
    return pendingTrades.find(tx => tx.id === txId)
  }, [pendingTrades])

  return {
    executeTrade,
    quickTrade,
    isExecuting,
    pendingTrades,
    clearPendingTrades,
    getTransactionStatus,
    canTrade: authenticated && ready && wallets.length > 0 && !isExecuting
  }
}

// Trade History Hook
export function useTradeHistory() {
  const { authenticated, ready } = usePrivy()
  const trades = useTradingStore((state) => state.trades)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter trade history
  const getTradesByStatus = useCallback((status: 'open' | 'closed' | 'all') => {
    if (status === 'all') return trades
    return trades.filter(trade => trade.status === status)
  }, [trades])

  const getTradesByIndex = useCallback((indexId: string) => {
    return trades.filter(trade => trade.indexId === indexId)
  }, [trades])

  const getTradesByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return trades.filter(trade =>
      trade.timestamp >= startDate && trade.timestamp <= endDate
    )
  }, [trades])

  // Calculate trade statistics
  const statistics = React.useMemo(() => {
    const openTrades = trades.filter(trade => trade.status === 'open')
    const closedTrades = trades.filter(trade => trade.status === 'closed')

    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0)
    const losingTrades = closedTrades.filter(trade => (trade.pnl || 0) < 0)

    return {
      totalTrades: trades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      totalPnL,
      winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
      averageWin: winningTrades.length > 0
        ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length
        : 0,
      averageLoss: losingTrades.length > 0
        ? losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length
        : 0,
      totalVolume: trades.reduce((sum, trade) => sum + trade.amount, 0)
    }
  }, [trades])

  return {
    trades,
    statistics,
    isLoading,
    error,
    getTradesByStatus,
    getTradesByIndex,
    getTradesByDateRange,
    hasHistory: trades.length > 0
  }
}

// Position Management Hook
export function usePositionManagement() {
  const { closeTrade, updateTrade } = useTradingActions()
  const activeTrades = useTradingStore((state) => state.activeTrades)
  const [isClosing, setIsClosing] = useState<string[]>([]) // Closing trade IDs

  // Close position
  const closePosition = useCallback(async (tradeId: string, exitPrice?: number) => {
    const trade = activeTrades.find(t => t.id === tradeId)
    if (!trade) throw new Error('Trade not found')

    setIsClosing(prev => [...prev, tradeId])

    try {
      // Simulate closing
      await new Promise(resolve => setTimeout(resolve, 1500))

      const currentExitPrice = exitPrice || (trade.entryPrice * (1 + (Math.random() - 0.5) * 0.1))
      closeTrade(tradeId, currentExitPrice)

      // Additional logic like close completion notification
      console.log(`Position ${tradeId} closed at ${currentExitPrice}`)

    } catch (error) {
      console.error('Failed to close position:', error)
      throw error
    } finally {
      setIsClosing(prev => prev.filter(id => id !== tradeId))
    }
  }, [activeTrades, closeTrade])

  // Set Stop Loss / Take Profit
  const setStopLoss = useCallback(async (tradeId: string, stopLossPrice: number) => {
    try {
      updateTrade(tradeId, { stopLoss: stopLossPrice })
      console.log(`Stop loss set for ${tradeId} at ${stopLossPrice}`)
    } catch (error) {
      console.error('Failed to set stop loss:', error)
      throw error
    }
  }, [updateTrade])

  const setTakeProfit = useCallback(async (tradeId: string, takeProfitPrice: number) => {
    try {
      updateTrade(tradeId, { takeProfit: takeProfitPrice })
      console.log(`Take profit set for ${tradeId} at ${takeProfitPrice}`)
    } catch (error) {
      console.error('Failed to set take profit:', error)
      throw error
    }
  }, [updateTrade])

  // Partial Close
  const partialClose = useCallback(async (tradeId: string, percentage: number) => {
    const trade = activeTrades.find(t => t.id === tradeId)
    if (!trade) throw new Error('Trade not found')

    if (percentage <= 0 || percentage >= 100) {
      throw new Error('Invalid percentage for partial close')
    }

    setIsClosing(prev => [...prev, tradeId])

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const remainingAmount = trade.amount * (1 - percentage / 100)
      updateTrade(tradeId, { amount: remainingAmount })

      console.log(`Partially closed ${percentage}% of position ${tradeId}`)

    } catch (error) {
      console.error('Failed to partially close position:', error)
      throw error
    } finally {
      setIsClosing(prev => prev.filter(id => id !== tradeId))
    }
  }, [activeTrades, updateTrade])

  return {
    activeTrades,
    closePosition,
    setStopLoss,
    setTakeProfit,
    partialClose,
    isClosing,
    activePositionCount: activeTrades.length,
    totalExposure: activeTrades.reduce((sum, trade) => sum + (trade.amount * trade.leverage), 0)
  }
}

// Integrated Wallet Hook
export function useWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const balances = useWalletBalances()
  const tradeExecution = useTradeExecution()
  const tradeHistory = useTradeHistory()
  const positionManagement = usePositionManagement()

  // Wallet Info
  const walletInfo = React.useMemo(() => {
    if (!authenticated || wallets.length === 0) return null

    const primaryWallet = wallets[0]
    return {
      address: primaryWallet.address,
      walletType: primaryWallet.walletClientType,
      chainId: primaryWallet.chainId?.split(':')[1] || 'unknown',
      isConnected: true
    }
  }, [authenticated, wallets])

  // Connection Status
  const connectionStatus = React.useMemo(() => {
    if (!ready) return 'loading'
    if (!authenticated) return 'disconnected'
    if (wallets.length === 0) return 'no-wallet'
    return 'connected'
  }, [ready, authenticated, wallets.length])

  return {
    // Connection Status
    ready,
    authenticated,
    connectionStatus,
    walletInfo,

    // Connect/Disconnect Functions
    login,
    logout,

    // Feature Hooks
    balances,
    tradeExecution,
    tradeHistory,
    positionManagement,

    // Convenience States
    isConnected: connectionStatus === 'connected',
    isLoading: !ready || balances.isLoading,
    canTrade: tradeExecution.canTrade && balances.hasBalances
  }
}

export default useWallet
