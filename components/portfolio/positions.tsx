'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  TrendingUp, 
  TrendingDown, 
  X, 
  AlertTriangle, 
  Target, 
  Shield, 
  Activity,
  MoreHorizontal,
  Plus,
  Minus,
  DollarSign,
  Clock,
  Zap
} from 'lucide-react'
import { Trade, MemeIndex } from '@/lib/types/index-trading'
import { usePositionManagement } from '@/hooks/use-wallet'
import { useTradingStore } from '@/lib/store/trading-store'
import { allMockIndices } from '@/lib/data/mock-indices'

interface PositionsProps {
  className?: string
  variant?: 'default' | 'minimal' | 'detailed'
  showHeader?: boolean
  maxPositions?: number
}

interface PositionCardProps {
  trade: Trade
  index: MemeIndex
  onClose: (tradeId: string) => void
  onPartialClose: (tradeId: string, percentage: number) => void
  onSetStopLoss: (tradeId: string, price: number) => void
  onSetTakeProfit: (tradeId: string, price: number) => void
  isClosing: boolean
}

// 개별 포지션 카드 컴포넌트
function PositionCard({ 
  trade, 
  index, 
  onClose, 
  onPartialClose,
  onSetStopLoss,
  onSetTakeProfit,
  isClosing 
}: PositionCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [stopLossPrice, setStopLossPrice] = useState<string>('')
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('')
  const [partialClosePercentage, setPartialClosePercentage] = useState(25)

  // 현재 가격과 PnL 계산
  const currentPrice = index.currentPrice
  const unrealizedPnL = trade.type === 'long' 
    ? (currentPrice - trade.entryPrice) * trade.amount * trade.leverage
    : (trade.entryPrice - currentPrice) * trade.amount * trade.leverage
  
  const unrealizedPnLPercentage = (unrealizedPnL / trade.amount) * 100
  const isProfit = unrealizedPnL > 0
  
  // 청산가 계산
  const liquidationPrice = trade.type === 'long'
    ? trade.entryPrice * (1 - (1 / trade.leverage) * 0.9)
    : trade.entryPrice * (1 + (1 / trade.leverage) * 0.9)
    
  // 청산까지의 거리
  const distanceToLiquidation = trade.type === 'long'
    ? ((currentPrice - liquidationPrice) / currentPrice) * 100
    : ((liquidationPrice - currentPrice) / currentPrice) * 100
    
  // 위험도 계산
  const riskLevel = distanceToLiquidation < 10 ? 'high' : distanceToLiquidation < 25 ? 'medium' : 'low'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${
            trade.type === 'long' ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold">{index.symbol}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                trade.type === 'long' 
                  ? 'bg-green-600/20 text-green-400' 
                  : 'bg-red-600/20 text-red-400'
              }`}>
                {trade.leverage}x {trade.type.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Opened {new Date(trade.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Risk Indicator */}
          <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
            riskLevel === 'high' 
              ? 'bg-red-600/20 text-red-400' 
              : riskLevel === 'medium' 
              ? 'bg-yellow-600/20 text-yellow-400' 
              : 'bg-green-600/20 text-green-400'
          }`}>
            <AlertTriangle className="w-3 h-3" />
            <span>{riskLevel === 'high' ? 'High Risk' : riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}</span>
          </div>
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Position Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-slate-400">Size</div>
          <div className="text-white font-semibold">${trade.amount.toLocaleString()}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-slate-400">Entry Price</div>
          <div className="text-white font-semibold">${trade.entryPrice.toFixed(4)}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-slate-400">Current Price</div>
          <div className="text-white font-semibold">${currentPrice.toFixed(4)}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-slate-400">Unrealized PnL</div>
          <div className={`font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}${unrealizedPnL.toFixed(2)}
            <div className="text-xs">
              ({isProfit ? '+' : ''}{unrealizedPnLPercentage.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Liquidation Warning */}
      {distanceToLiquidation < 25 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`flex items-center space-x-2 p-3 rounded-lg ${
            riskLevel === 'high' 
              ? 'bg-red-900/30 border border-red-500/30' 
              : 'bg-yellow-900/30 border border-yellow-500/30'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${
            riskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'
          }`} />
          <div className="text-sm">
            <div className={`font-semibold ${
              riskLevel === 'high' ? 'text-red-200' : 'text-yellow-200'
            }`}>
              {riskLevel === 'high' ? 'Liquidation Risk!' : 'Approaching Liquidation'}
            </div>
            <div className="text-xs text-slate-400">
              Liquidation at ${liquidationPrice.toFixed(4)} ({distanceToLiquidation.toFixed(1)}% away)
            </div>
          </div>
        </motion.div>
      )}

      {/* Stop Loss & Take Profit */}
      {(trade.stopLoss || trade.takeProfit) && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {trade.stopLoss && (
            <div className="flex items-center space-x-2 p-2 bg-red-600/10 rounded-lg border border-red-500/20">
              <Shield className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-red-400 text-xs">Stop Loss</div>
                <div className="text-white font-semibold">${trade.stopLoss.toFixed(4)}</div>
              </div>
            </div>
          )}
          
          {trade.takeProfit && (
            <div className="flex items-center space-x-2 p-2 bg-green-600/10 rounded-lg border border-green-500/20">
              <Target className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-green-400 text-xs">Take Profit</div>
                <div className="text-white font-semibold">${trade.takeProfit.toFixed(4)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Panel */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-700 pt-4 space-y-4"
          >
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onPartialClose(trade.id, 50)}
                disabled={isClosing}
                className="flex items-center justify-center space-x-2 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
                <span>Close 50%</span>
              </button>
              
              <button
                onClick={() => onClose(trade.id)}
                disabled={isClosing}
                className="flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isClosing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Closing...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Close All</span>
                  </>
                )}
              </button>
            </div>

            {/* Partial Close Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Partial Close</span>
                <span className="text-white">{partialClosePercentage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="5"
                value={partialClosePercentage}
                onChange={(e) => setPartialClosePercentage(Number(e.target.value))}
                className="w-full"
              />
              <button
                onClick={() => onPartialClose(trade.id, partialClosePercentage)}
                disabled={isClosing}
                className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Close {partialClosePercentage}%
              </button>
            </div>

            {/* Stop Loss & Take Profit Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-slate-400">Stop Loss Price</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder={`Current: ${currentPrice.toFixed(4)}`}
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                    step="0.0001"
                  />
                  <button
                    onClick={() => onSetStopLoss(trade.id, Number(stopLossPrice))}
                    disabled={!stopLossPrice || isClosing}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                  >
                    Set
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-slate-400">Take Profit Price</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder={`Current: ${currentPrice.toFixed(4)}`}
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                    step="0.0001"
                  />
                  <button
                    onClick={() => onSetTakeProfit(trade.id, Number(takeProfitPrice))}
                    disabled={!takeProfitPrice || isClosing}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 메인 포지션 컴포넌트
export function Positions({ 
  className = '', 
  variant = 'default',
  showHeader = true,
  maxPositions
}: PositionsProps) {
  const [filterType, setFilterType] = useState<'all' | 'long' | 'short'>('all')
  const [sortBy, setSortBy] = useState<'pnl' | 'size' | 'risk' | 'time'>('pnl')
  
  const { 
    activeTrades, 
    closePosition, 
    setStopLoss, 
    setTakeProfit, 
    partialClose,
    isClosing 
  } = usePositionManagement()

  // 필터링 및 정렬된 포지션
  const filteredAndSortedPositions = useMemo(() => {
    let filtered = activeTrades

    // 타입 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(trade => trade.type === filterType)
    }

    // 정렬
    filtered.sort((a, b) => {
      const indexA = allMockIndices.find(idx => idx.id === a.indexId)
      const indexB = allMockIndices.find(idx => idx.id === b.indexId)
      
      if (!indexA || !indexB) return 0
      
      switch (sortBy) {
        case 'pnl':
          const pnlA = a.type === 'long' 
            ? (indexA.currentPrice - a.entryPrice) * a.amount * a.leverage
            : (a.entryPrice - indexA.currentPrice) * a.amount * a.leverage
          const pnlB = b.type === 'long'
            ? (indexB.currentPrice - b.entryPrice) * b.amount * b.leverage  
            : (b.entryPrice - indexB.currentPrice) * b.amount * b.leverage
          return pnlB - pnlA
        case 'size':
          return (b.amount * b.leverage) - (a.amount * a.leverage)
        case 'time':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        default:
          return 0
      }
    })

    return maxPositions ? filtered.slice(0, maxPositions) : filtered
  }, [activeTrades, filterType, sortBy, maxPositions])

  // 총 PnL 계산
  const totalPnL = useMemo(() => {
    return filteredAndSortedPositions.reduce((total, trade) => {
      const index = allMockIndices.find(idx => idx.id === trade.indexId)
      if (!index) return total
      
      const pnl = trade.type === 'long'
        ? (index.currentPrice - trade.entryPrice) * trade.amount * trade.leverage
        : (trade.entryPrice - index.currentPrice) * trade.amount * trade.leverage
      
      return total + pnl
    }, 0)
  }, [filteredAndSortedPositions])

  const totalExposure = useMemo(() => {
    return filteredAndSortedPositions.reduce((total, trade) => {
      return total + (trade.amount * trade.leverage)
    }, 0)
  }, [filteredAndSortedPositions])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Active Positions</h2>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">{filteredAndSortedPositions.length} positions</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">
                  ${totalExposure.toLocaleString()} exposure
                </span>
              </div>
              <div className={`font-semibold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} PnL
              </div>
            </div>
          </div>
          
          {variant === 'detailed' && (
            <div className="flex items-center space-x-2">
              {/* Filters */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="all">All Positions</option>
                <option value="long">Buy Only</option>
                <option value="short">Sell Only</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="pnl">Sort by PnL</option>
                <option value="size">Sort by Size</option>
                <option value="time">Sort by Time</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Positions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedPositions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No Active Positions</h3>
              <p className="text-slate-500">Open your first position to get started</p>
            </motion.div>
          ) : (
            filteredAndSortedPositions.map((trade) => {
              const index = allMockIndices.find(idx => idx.id === trade.indexId)
              if (!index) return null
              
              return (
                <PositionCard
                  key={trade.id}
                  trade={trade}
                  index={index}
                  onClose={closePosition}
                  onPartialClose={partialClose}
                  onSetStopLoss={setStopLoss}
                  onSetTakeProfit={setTakeProfit}
                  isClosing={isClosing.includes(trade.id)}
                />
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {maxPositions && activeTrades.length > maxPositions && (
        <div className="text-center">
          <button className="text-brand hover:text-brand/80 text-sm font-medium transition-colors">
            View All {activeTrades.length} Positions
          </button>
        </div>
      )}
    </div>
  )
}

export default Positions
