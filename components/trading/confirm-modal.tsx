'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Drawer } from 'vaul'
import { 
  X, 
  AlertTriangle, 
  Shield, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign,
  Clock,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { MemeIndex } from '@/lib/types/index-trading'
import { useWallet } from '@/hooks/use-wallet'
import { useCurrency } from '@/lib/hooks/useCurrency'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  tradeData: {
    index: MemeIndex
    type: 'buy' | 'sell'
    amount: number
    leverage: number
    slippage: number
    orderType: 'market' | 'limit' | 'stop'
    limitPrice?: number
    stopPrice?: number
  } | null
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'extreme'
  score: number
  factors: string[]
  warnings: string[]
}

interface TradeImpact {
  positionSize: number
  totalValue: number
  estimatedFees: number
  slippageCost: number
  liquidationPrice: number
  maxLoss: number
  breakEvenPrice: number
  potentialGain24h: number
  potentialLoss24h: number
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  tradeData
}: ConfirmModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [hasReadWarning, setHasReadWarning] = useState(false)
  const [acceptedRisks, setAcceptedRisks] = useState(false)
  const { balances, tradeExecution } = useWallet()
  const { formatPrice, formatBalance, currency } = useCurrency()

  // 거래 영향도 계산
  const tradeImpact = useMemo((): TradeImpact | null => {
    if (!tradeData) return null

    const { index, amount, leverage, type } = tradeData
    const currentPrice = index.currentPrice
    const positionSize = amount
    const totalValue = amount * leverage
    const estimatedFees = amount * 0.001 * leverage // 0.1% fee
    const slippageCost = (amount * tradeData.slippage / 100) * leverage
    
    const liquidationPrice = type === 'buy'
      ? currentPrice * (1 - (1 / leverage) * 0.9)
      : currentPrice * (1 + (1 / leverage) * 0.9)
    
    const maxLoss = amount * 0.95 // 95% of position
    const breakEvenPrice = type === 'buy'
      ? currentPrice * (1 + (estimatedFees + slippageCost) / totalValue)
      : currentPrice * (1 - (estimatedFees + slippageCost) / totalValue)
    
    // 24시간 변동성을 기반으로 한 잠재적 손익
    const volatility24h = Math.abs(index.change24h) / 100
    const potentialGain24h = totalValue * volatility24h
    const potentialLoss24h = totalValue * volatility24h

    return {
      positionSize,
      totalValue,
      estimatedFees,
      slippageCost,
      liquidationPrice,
      maxLoss,
      breakEvenPrice,
      potentialGain24h,
      potentialLoss24h
    }
  }, [tradeData])

  // 리스크 평가 계산
  const riskAssessment = useMemo((): RiskAssessment | null => {
    if (!tradeData || !tradeImpact) return null

    const { leverage, amount, index } = tradeData
    const { totalValue } = tradeImpact
    const volatility = Math.abs(index.change24h) / 100
    const usdcBalance = balances.getTokenBalance('USDC')?.usdValue || 0
    const portfolioExposure = (totalValue / usdcBalance) * 100

    let score = 0
    const factors: string[] = []
    const warnings: string[] = []

    // 레버리지 리스크
    if (leverage >= 20) {
      score += 3
      factors.push(`극고배율 레버리지 (${leverage}x)`)
      warnings.push('20배 이상 레버리지는 매우 위험합니다. 작은 가격 변동으로도 전액 손실 가능합니다.')
    } else if (leverage >= 10) {
      score += 2
      factors.push(`고배율 레버리지 (${leverage}x)`)
      warnings.push('10배 이상 레버리지는 위험합니다.')
    } else if (leverage >= 5) {
      score += 1
      factors.push(`중간 레버리지 (${leverage}x)`)
    }

    // 변동성 리스크
    if (volatility > 0.15) {
      score += 2
      factors.push('높은 가격 변동성')
      warnings.push('이 자산은 높은 변동성을 보이고 있습니다.')
    } else if (volatility > 0.08) {
      score += 1
      factors.push('중간 가격 변동성')
    }

    // 포트폴리오 노출도
    if (portfolioExposure > 50) {
      score += 2
      factors.push(`높은 포트폴리오 노출 (${portfolioExposure.toFixed(1)}%)`)
      warnings.push('포트폴리오의 50% 이상을 단일 거래에 노출시키는 것은 위험합니다.')
    } else if (portfolioExposure > 25) {
      score += 1
      factors.push(`중간 포트폴리오 노출 (${portfolioExposure.toFixed(1)}%)`)
    }

    // 거래 규모
    if (amount > 10000) {
      score += 1
      factors.push('대규모 거래')
    }

    let level: 'low' | 'medium' | 'high' | 'extreme'
    if (score >= 6) level = 'extreme'
    else if (score >= 4) level = 'high'
    else if (score >= 2) level = 'medium'
    else level = 'low'

    return { level, score, factors, warnings }
  }, [tradeData, tradeImpact, balances])

  const handleConfirm = useCallback(async () => {
    if (!hasReadWarning || !acceptedRisks) return

    setIsConfirming(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Trade confirmation failed:', error)
    } finally {
      setIsConfirming(false)
    }
  }, [hasReadWarning, acceptedRisks, onConfirm, onClose])

  const resetModal = useCallback(() => {
    setHasReadWarning(false)
    setAcceptedRisks(false)
    setIsConfirming(false)
  }, [])

  if (!tradeData || !tradeImpact || !riskAssessment) return null

  const isHighRisk = riskAssessment.level === 'high' || riskAssessment.level === 'extreme'
  const canProceed = hasReadWarning && acceptedRisks && !isConfirming

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose} onAnimationEnd={resetModal}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl border-t border-slate-700 max-h-[90vh] overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center p-3">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                tradeData.type === 'buy' 
                  ? 'bg-green-600/20 text-green-400' 
                  : 'bg-red-600/20 text-red-400'
              }`}>
                {tradeData.type === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirm Trade</h2>
                <p className="text-sm text-slate-400">
                  {tradeData.type === 'buy' ? 'Buy' : 'Sell'} {tradeData.index.symbol}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Trade Summary */}
            <div className="bg-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">Trade Summary</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Index</span>
                    <span className="text-white font-medium">{tradeData.index.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className={`font-medium ${
                      tradeData.type === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tradeData.leverage}x {tradeData.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Position Size</span>
                    <span className="text-white font-medium">{formatBalance(tradeData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Value</span>
                    <span className="text-white font-medium">{formatBalance(tradeImpact.totalValue)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Price</span>
                    <span className="text-white font-medium">{formatPrice(tradeData.index.currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Break Even</span>
                    <span className="text-white font-medium">{formatPrice(tradeImpact.breakEvenPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Liquidation</span>
                    <span className="text-red-400 font-medium">{formatPrice(tradeImpact.liquidationPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Fees</span>
                    <span className="text-white font-medium">{formatBalance(tradeImpact.estimatedFees)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={`rounded-xl p-4 space-y-4 border ${
              riskAssessment.level === 'extreme' 
                ? 'bg-red-900/30 border-red-500/30'
                : riskAssessment.level === 'high'
                ? 'bg-red-900/20 border-red-500/20'
                : riskAssessment.level === 'medium'
                ? 'bg-yellow-900/20 border-yellow-500/20'
                : 'bg-green-900/20 border-green-500/20'
            }`}>
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`w-5 h-5 ${
                  riskAssessment.level === 'extreme' ? 'text-red-400' :
                  riskAssessment.level === 'high' ? 'text-red-400' :
                  riskAssessment.level === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`} />
                <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  riskAssessment.level === 'extreme' ? 'bg-red-500 text-white' :
                  riskAssessment.level === 'high' ? 'bg-red-500 text-white' :
                  riskAssessment.level === 'medium' ? 'bg-yellow-500 text-slate-900' :
                  'bg-green-500 text-slate-900'
                }`}>
                  {riskAssessment.level.toUpperCase()} RISK
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-white mb-2">Risk Factors:</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {riskAssessment.factors.map((factor, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-slate-400 rounded-full flex-shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {riskAssessment.warnings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-300 mb-2">⚠️ Warnings:</h4>
                    <ul className="space-y-2 text-sm">
                      {riskAssessment.warnings.map((warning, index) => (
                        <li key={index} className="text-red-200 bg-red-900/30 p-2 rounded">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Potential Outcomes */}
            <div className="bg-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">24h Potential Outcomes</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                  <div className="text-xs text-green-400 mb-1">Potential Gain</div>
                  <div className="text-lg font-bold text-green-400">
                    +{formatBalance(tradeImpact.potentialGain24h)}
                  </div>
                  <div className="text-xs text-green-300">
                    +{((tradeImpact.potentialGain24h / tradeData.amount) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                  <div className="text-xs text-red-400 mb-1">Potential Loss</div>
                  <div className="text-lg font-bold text-red-400">
                    -{formatBalance(tradeImpact.potentialLoss24h)}
                  </div>
                  <div className="text-xs text-red-300">
                    -{((tradeImpact.potentialLoss24h / tradeData.amount) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Acknowledgment */}
            {isHighRisk && (
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="read-warning"
                      checked={hasReadWarning}
                      onChange={(e) => setHasReadWarning(e.target.checked)}
                      className="mt-1 w-4 h-4 text-brand border-red-500 rounded focus:ring-brand"
                    />
                    <label htmlFor="read-warning" className="text-sm text-red-200 cursor-pointer">
                      <strong>I acknowledge that I have read and understand the risk warnings above.</strong>
                      <br />
                      This is a high-risk trade that could result in significant losses.
                    </label>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="accept-risks"
                      checked={acceptedRisks}
                      onChange={(e) => setAcceptedRisks(e.target.checked)}
                      className="mt-1 w-4 h-4 text-brand border-red-500 rounded focus:ring-brand"
                    />
                    <label htmlFor="accept-risks" className="text-sm text-red-200 cursor-pointer">
                      <strong>I accept all risks and understand that I may lose my entire investment.</strong>
                      <br />
                      I am trading with money I can afford to lose completely.
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="sticky bottom-0 p-6 bg-slate-900 border-t border-slate-700 space-y-3">
            {!isHighRisk && (
              <div className="flex items-center space-x-2 text-sm text-green-400 bg-green-900/20 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>This trade has been assessed as {riskAssessment.level} risk. You may proceed.</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isConfirming}
                className="flex-1 py-4 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={!canProceed}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                  tradeData.type === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } ${
                  !canProceed
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {isConfirming ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing...</span>
                  </div>
                ) : (
                  <>
                    {tradeData.type === 'buy' ? '🚀' : '📉'} Confirm {tradeData.type === 'buy' ? 'Buy' : 'Sell'}
                  </>
                )}
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default ConfirmModal
