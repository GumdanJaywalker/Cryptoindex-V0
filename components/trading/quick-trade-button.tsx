'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown,
  Zap,
  Calculator,
  AlertTriangle,
  Info,
  DollarSign,
  Percent
} from 'lucide-react'
import { MemeIndex } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { FEES } from '@/lib/constants/fees'

interface QuickTradeButtonProps {
  index: MemeIndex
  onTrade: (type: 'buy' | 'sell', amount: number, leverage: number) => void
  className?: string
  variant?: 'default' | 'compact'
  showExpectedReturn?: boolean
}

interface TradeCalculation {
  entryPrice: number
  exitPrice: number
  amount: number
  leverage: number
  expectedReturn: number
  expectedReturnPercentage: number
  liquidationPrice: number
  fees: number
  netReturn: number
}

// 현물 거래 계산 유틸리티
function calculateTrade(
  type: 'buy' | 'sell',
  currentPrice: number,
  amount: number,
  leverage: number, // 현물에서는 사용되지 않음 (호환성 유지)
  priceChange: number
): TradeCalculation {
  const entryPrice = currentPrice
  const exitPrice = type === 'buy' 
    ? currentPrice * (1 + priceChange) 
    : currentPrice * (1 - Math.abs(priceChange))
  
  // 현물 거래에서는 레버리지 없이 실제 투자금액만 사용
  const positionSize = amount
  const grossReturn = type === 'buy'
    ? (exitPrice - entryPrice) / entryPrice * positionSize
    : (entryPrice - exitPrice) / entryPrice * positionSize
  
  const fees = positionSize * FEES.HIDE.TRADING_FEE // Phase 0: 0.30% trading fee in $HIDE
  const netReturn = grossReturn - fees
  const returnPercentage = (netReturn / amount) * 100
  
  // 현물에서는 청산가격이 없으므로 0으로 설정
  const liquidationPrice = 0
  
  return {
    entryPrice,
    exitPrice,
    amount,
    leverage: 1, // 현물은 항상 1x
    expectedReturn: netReturn,
    expectedReturnPercentage: returnPercentage,
    liquidationPrice,
    fees,
    netReturn
  }
}

// Portal 기반 툴팁 컴포넌트
function PortalTooltip({
  calculation,
  type,
  show,
  targetRef
}: {
  calculation: TradeCalculation
  type: 'buy' | 'sell'
  show: boolean
  targetRef: React.RefObject<HTMLElement | null>
}) {
  const { formatBalance, formatPrice } = useCurrency()
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (show && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 10, // 10px 위쪽
        left: rect.left + rect.width / 2
      })
    }
  }, [show, targetRef])
  
  const isPositive = calculation.expectedReturn >= 0
  
  if (!mounted) return null
  
  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="fixed z-[99999] pointer-events-none"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            {/* 화살표 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-700"></div>
            </div>
            
            <div className="space-y-2 min-w-[200px]">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Calculator className="w-3 h-3" />
                <span className="font-semibold">Expected Return</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-slate-400">Position Size</div>
                  <div className="text-white font-medium">
                    {formatBalance(calculation.amount * calculation.leverage)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Leverage</div>
                  <div className="text-white font-medium">{calculation.leverage}x</div>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Est. Return</span>
                  <div className={cn(
                    "text-xs font-semibold",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {isPositive ? '+' : ''}{formatBalance(calculation.expectedReturn)}
                    <span className="ml-1 text-slate-500">
                      ({isPositive ? '+' : ''}{calculation.expectedReturnPercentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-400 text-xs">Fees</span>
                  <span className="text-red-400 text-xs">-{formatBalance(calculation.fees)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Liquidation: {calculation.liquidationPrice > 0 ? formatPrice(calculation.liquidationPrice) : 'N/A (Spot)'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// 메인 빠른 거래 버튼 컴포넌트
export function QuickTradeButton({
  index,
  onTrade,
  className,
  variant = 'default',
  showExpectedReturn = true
}: QuickTradeButtonProps) {
  const { formatBalance } = useCurrency()
  // sound effects disabled during core refactor
  const [hoveredButton, setHoveredButton] = useState<'buy' | 'sell' | null>(null)
  const [defaultAmount] = useState(100) // $100 기본값
  const [defaultLeverage] = useState(5) // 5x 레버리지 기본값
  
  // Portal 툴팁을 위한 ref들
  const buyButtonRef = useRef<HTMLButtonElement>(null)
  const sellButtonRef = useRef<HTMLButtonElement>(null)
  
  // 예상 수익 계산
  const buyCalculation = calculateTrade('buy', index.currentPrice, defaultAmount, defaultLeverage, 0.1) // 10% 상승 가정
  const sellCalculation = calculateTrade('sell', index.currentPrice, defaultAmount, defaultLeverage, 0.1) // 10% 하락 가정
  
  const handleTrade = (type: 'buy' | 'sell', e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Play sound (disabled)
    
    onTrade(type, defaultAmount, defaultLeverage)
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex gap-1", className)}>
        <Button 
          size="sm" 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-6 px-2 relative overflow-hidden group"
          onClick={(e) => handleTrade('buy', e)}
        >
          <motion.div
            className="absolute inset-0 bg-green-400"
            initial={{ x: '-100%' }}
            whileHover={{ x: '0%' }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" />
            Buy
          </span>
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xs h-6 px-2 relative overflow-hidden group"
          onClick={(e) => handleTrade('sell', e)}
        >
          <motion.div
            className="absolute inset-0 bg-red-600"
            initial={{ x: '100%' }}
            whileHover={{ x: '0%' }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-1">
            <TrendingDown className="w-2.5 h-2.5" />
            Sell
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* 거래 정보 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Zap className="w-3 h-3" />
          <span>Quick Trade</span>
        </div>
        <Badge variant="outline" className="text-xs px-1 py-0">
          {formatBalance(defaultAmount)} • {defaultLeverage}x
        </Badge>
      </div>
      
      {/* 거래 버튼 */}
      <div className="grid grid-cols-2 gap-2">
        {/* Buy 버튼 */}
        <div className="relative">
          <Button
            ref={buyButtonRef}
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8 relative overflow-hidden group"
            onClick={(e) => handleTrade('buy', e)}
            onMouseEnter={() => setHoveredButton('buy')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <motion.div
              className="absolute inset-0 bg-green-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            
            <span className="relative z-10 flex items-center gap-1.5 justify-center">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">Buy</span>
              {showExpectedReturn && (
                <div className="text-xs opacity-80">
                  +{formatBalance(buyCalculation.expectedReturn)}
                </div>
              )}
            </span>
          </Button>
          
          {/* Buy 툴팁 - Portal 기반 */}
          {showExpectedReturn && (
            <PortalTooltip
              calculation={buyCalculation}
              type="buy"
              show={hoveredButton === 'buy'}
              targetRef={buyButtonRef}
            />
          )}
        </div>

        {/* Sell 버튼 */}
        <div className="relative">
          <Button
            ref={sellButtonRef}
            size="sm"
            variant="outline"
            className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xs h-8 relative overflow-hidden group"
            onClick={(e) => handleTrade('sell', e)}
            onMouseEnter={() => setHoveredButton('sell')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <motion.div
              className="absolute inset-0 bg-red-600"
              initial={{ x: '100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            
            <span className="relative z-10 flex items-center gap-1.5 justify-center">
              <TrendingDown className="w-3 h-3" />
              <span className="font-semibold">Sell</span>
              {showExpectedReturn && (
                <div className="text-xs opacity-80">
                  +{formatBalance(sellCalculation.expectedReturn)}
                </div>
              )}
            </span>
          </Button>
          
          {/* Sell 툴팁 - Portal 기반 */}
          {showExpectedReturn && (
            <PortalTooltip
              calculation={sellCalculation}
              type="sell"
              show={hoveredButton === 'sell'}
              targetRef={sellButtonRef}
            />
          )}
        </div>
      </div>
      
      {/* 위험 경고 */}
      <div className="flex items-center gap-1 text-xs text-amber-400">
        <Info className="w-3 h-3" />
        <span>High leverage increases both profit and loss potential</span>
      </div>
    </div>
  )
}

export default QuickTradeButton
