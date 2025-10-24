'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Drawer } from 'vaul'
import { X, TrendingUp, TrendingDown, Zap, Settings, Info, AlertTriangle } from 'lucide-react'
import { MemeIndex } from '@/lib/types/index-trading'
import { useTradingActions } from '@/lib/store/trading-store'
import { useWallet } from '@/hooks/use-wallet'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { FEES } from '@/lib/constants/fees'

interface TradePanelProps {
  index: MemeIndex | null
  isOpen: boolean
  onClose: () => void
  defaultTradeType?: 'buy' | 'sell'
  defaultAmount?: number
  defaultLeverage?: number
}

type TradeType = 'buy' | 'sell'
type OrderType = 'market' | 'limit' | 'stop'

const LEVERAGE_OPTIONS = [1, 2, 5, 10, 20, 50, 100]
const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000]

export function TradePanel({
  index,
  isOpen,
  onClose,
  defaultTradeType = 'buy',
  defaultAmount = 1000,
  defaultLeverage = 1
}: TradePanelProps) {
  const [tradeType, setTradeType] = useState<TradeType>(defaultTradeType)
  const [orderType, setOrderType] = useState<OrderType>('market')
  const [amount, setAmount] = useState(defaultAmount)
  const [leverage, setLeverage] = useState(defaultLeverage)
  const [limitPrice, setLimitPrice] = useState<number>(0)
  const [stopPrice, setStopPrice] = useState<number>(0)
  const [slippage, setSlippage] = useState(0.5) // 0.5%
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [showRiskWarning, setShowRiskWarning] = useState(false)
  
  const { canTrade, tradeExecution, balances } = useWallet()
  const { setTradePanelOpen } = useTradingActions()
  const { formatPrice, formatBalance, formatFee, currency } = useCurrency()

  // 계산된 값들
  const currentPrice = index?.currentPrice || 0
  const totalValue = amount * leverage
  const estimatedFees = amount * FEES.HIDE.TRADING_FEE * leverage // Phase 0: 0.30% trading fee in $HIDE
  const liquidationPrice = currentPrice * (1 - (1 / leverage) * 0.9) // 90% margin
  const maxLoss = amount * 0.9 // 90% of position
  
  // 잔액 체크
  const usdcBalance = balances.getTokenBalance('USDC')
  const availableBalance = usdcBalance?.usdValue || 0
  const hasInsufficientBalance = amount > availableBalance

  // 위험도 계산 (1-5)
  const riskLevel = Math.min(5, Math.floor(
    (leverage * (Math.abs(index?.change24h || 0) / 100) * (amount / 10000)) + 1
  ))

  const handleAmountChange = useCallback((newAmount: number) => {
    setAmount(Math.max(1, newAmount))
  }, [])

  const handleLeverageChange = useCallback((newLeverage: number) => {
    setLeverage(newLeverage)
    // 고레버리지 경고 표시
    if (newLeverage >= 10) {
      setShowRiskWarning(true)
    }
  }, [])

  const handleTrade = useCallback(async () => {
    if (!index || !canTrade) return

    try {
      const result = await tradeExecution.executeTrade({
        indexId: index.id,
        type: tradeType,
        amount,
        leverage,
        slippage
      })

      if (result.success) {
        onClose()
        // 성공 알림 표시 (react-hot-toast 등 사용)
      } else {
        console.error('Trade failed:', result.error)
      }
    } catch (error) {
      console.error('Trade execution error:', error)
    }
  }, [index, canTrade, tradeExecution, tradeType, amount, leverage, slippage, onClose])

  if (!index) return null

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl border-t border-slate-700 max-h-[90vh] overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center p-3">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold text-white">
                {tradeType === 'buy' ? '🚀' : '📉'} {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </div>
              <div className="text-brand font-semibold">
                {index.symbol}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Trade Type Toggle */}
            <div className="flex rounded-xl bg-slate-800 p-1">
              <button
                onClick={() => setTradeType('buy')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  tradeType === 'buy'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Buy
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  tradeType === 'sell'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-4 h-4 inline mr-2" />
                Sell
              </button>
            </div>

            {/* Order Type Selection */}
            {isAdvancedMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <label className="text-sm font-medium text-slate-300">Order Type</label>
                <div className="flex space-x-2">
                  {(['market', 'limit', 'stop'] as OrderType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderType === type
                          ? 'bg-brand text-slate-900'
                          : 'bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Amount ({currency})</label>
                <div className="text-xs text-slate-500">
                  Balance: {formatBalance(availableBalance)}
                </div>
              </div>
              
              {/* Amount Input */}
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-lg font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-brand transition-colors ${
                    hasInsufficientBalance ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="0.00"
                  min="1"
                  step="1"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                  {currency}
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex space-x-2">
                {QUICK_AMOUNTS.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => handleAmountChange(quickAmount)}
                    className="flex-1 py-2 px-3 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                  >
                    {formatBalance(quickAmount)}
                  </button>
                ))}
              </div>

              {/* Max Button */}
              <button
                onClick={() => handleAmountChange(Math.floor(availableBalance * 0.95))}
                className="w-full py-2 text-xs font-medium text-brand hover:text-brand/80 transition-colors"
              >
                Use 95% of balance ({formatBalance(Math.floor(availableBalance * 0.95))})
              </button>
            </div>

            {/* Leverage Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Leverage</label>
                <div className={`text-lg font-bold ${
                  leverage >= 10 ? 'text-red-400' : leverage >= 5 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {leverage}x
                </div>
              </div>
              
              {/* Leverage Options */}
              <div className="grid grid-cols-4 gap-2">
                {LEVERAGE_OPTIONS.map((lev) => (
                  <button
                    key={lev}
                    onClick={() => handleLeverageChange(lev)}
                    className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      leverage === lev
                        ? 'bg-brand text-slate-900'
                        : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                    }`}
                  >
                    {lev}x
                  </button>
                ))}
              </div>

              {/* Leverage Warning */}
              <AnimatePresence>
                {leverage >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div className="text-sm text-red-200">
                      High leverage increases both potential profits and losses. Trade carefully.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced Settings */}
            <AnimatePresence>
              {isAdvancedMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Limit Price */}
                  {orderType === 'limit' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Limit Price</label>
                      <input
                        type="number"
                        value={limitPrice || ''}
                        onChange={(e) => setLimitPrice(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand transition-colors"
                        placeholder={`Current: ${formatPrice(currentPrice)}`}
                        step="0.0001"
                      />
                    </div>
                  )}

                  {/* Slippage */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Slippage Tolerance</label>
                    <div className="flex space-x-2">
                      {[0.1, 0.5, 1.0, 2.0].map((slip) => (
                        <button
                          key={slip}
                          onClick={() => setSlippage(slip)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            slippage === slip
                              ? 'bg-brand text-slate-900'
                              : 'bg-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {slip}%
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trade Summary */}
            <div className="bg-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-sm font-medium text-slate-300 mb-3">Trade Summary</div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Position Size</span>
                    <span className="text-white font-medium">{formatBalance(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Value</span>
                    <span className="text-white font-medium">{formatBalance(totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Fees</span>
                    <span className="text-white font-medium">{formatFee(estimatedFees)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Price</span>
                    <span className="text-white font-medium">{formatPrice(currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Liquidation</span>
                    <span className="text-red-400 font-medium">{formatPrice(liquidationPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Loss</span>
                    <span className="text-red-400 font-medium">{formatBalance(maxLoss)}</span>
                  </div>
                </div>
              </div>

              {/* Risk Level Indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <span className="text-sm text-slate-400">Risk Level</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < riskLevel
                            ? riskLevel <= 2 ? 'bg-green-400' : riskLevel <= 4 ? 'bg-yellow-400' : 'bg-red-400'
                            : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    riskLevel <= 2 ? 'text-green-400' : riskLevel <= 4 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {riskLevel <= 2 ? 'Low' : riskLevel <= 4 ? 'Medium' : 'High'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="sticky bottom-0 p-6 bg-slate-900 border-t border-slate-700">
            {hasInsufficientBalance ? (
              <div className="text-center text-red-400 text-sm mb-4">
                Insufficient balance. You need {formatBalance(amount)}.
              </div>
            ) : null}
            
            <button
              onClick={handleTrade}
              disabled={!canTrade || hasInsufficientBalance || tradeExecution.isExecuting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } ${
                (!canTrade || hasInsufficientBalance || tradeExecution.isExecuting)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {tradeExecution.isExecuting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing...</span>
                </div>
              ) : (
                <>
                  {tradeType === 'buy' ? '🚀' : '📉'} {tradeType === 'buy' ? 'Buy' : 'Sell'} {index.symbol}
                </>
              )}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default TradePanel
