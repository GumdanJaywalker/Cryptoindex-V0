'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AnimatedNumber, 
  AnimatedPercentage, 
  usePriceFlash, 
  scaleHover, 
  fadeInScale 
} from '@/lib/animations/micro-interactions'
import { Enhanced3DCard, GlitchEffect } from '@/components/ui/3d-effects'
import { useSoundManager } from '@/lib/sound/effects'

// Simple Meteors effect - removed for cleaner UX
import { 
  TrendingUp, 
  TrendingDown, 
  Flame,
  Star,
  Zap,
  Users,
  BarChart3,
  Clock,
  ExternalLink
} from 'lucide-react'
import { MemeIndex } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { QuickTradeButton } from './quick-trade-button'

interface IndexCardProps {
  index: MemeIndex
  onSelect: (index: MemeIndex) => void
  showQuickTrade?: boolean
  compact?: boolean
  className?: string
}

// 향상된 스파크라인 컴포넌트
function EnhancedSparkline({ 
  data, 
  className, 
  animated = true,
  id = 'sparkline'
}: { 
  data: number[], 
  className?: string,
  animated?: boolean,
  id?: string
}) {
  const [animatedData, setAnimatedData] = useState<number[]>(data.map(() => data[0]))

  useEffect(() => {
    if (!animated) return
    
    const timer = setTimeout(() => {
      setAnimatedData(data)
    }, Math.random() * 500 + 100)

    return () => clearTimeout(timer)
  }, [data, animated])

  if (!data || data.length === 0) return null
  
  const displayData = animated ? animatedData : data
  const max = Math.max(...displayData)
  const min = Math.min(...displayData)
  const range = max - min
  
  const points = displayData.map((value, index) => {
    const x = (index / (displayData.length - 1)) * 100
    const y = range === 0 ? 50 : 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  const isPositive = displayData[displayData.length - 1] > displayData[0]
  const strokeColor = isPositive ? "#10b981" : "#ef4444"
  const glowColor = isPositive ? "#10b981" : "#ef4444"
  
  return (
    <div className={cn("relative", className)}>
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* 글로우 효과 */}
        <defs>
          <filter id={`glow-${id}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 배경 그라디언트 */}
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* 배경 영역 */}
        <polygon
          fill={`url(#gradient-${id})`}
          points={`0,100 ${points} 100,100`}
          className="transition-all duration-1000"
        />
        
        {/* 메인 라인 */}
        <motion.polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
          filter={`url(#glow-${id})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* 끝점 도트 */}
        {displayData.length > 0 && (
          <motion.circle
            cx={100}
            cy={range === 0 ? 50 : 100 - ((displayData[displayData.length - 1] - min) / range) * 100}
            r="2"
            fill={strokeColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          />
        )}
      </svg>
    </div>
  )
}

// 가격 애니메이션 컴포넌트
function AnimatedPrice({ price, change }: { price: number, change: number }) {
  const priceFlash = usePriceFlash(price, 800)
  const isVolatile = Math.abs(change) > 15 // 15% 이상 변동시 글리치 효과
  
  return (
    <div className="text-right">
      <GlitchEffect trigger={isVolatile && priceFlash.isFlashing}>
        <div 
          className="text-lg font-bold text-white transition-all duration-300 rounded px-2 py-1"
          style={priceFlash.flashStyles}
        >
        $<AnimatedNumber 
          value={price} 
          decimals={4} 
          duration={800}
          enableFlash={false}
        />
        </div>
      </GlitchEffect>
      <AnimatedPercentage 
        value={change}
        className="text-sm transition-all duration-300"
      />
    </div>
  )
}

// 배지 컴포넌트
function IndexBadges({ index }: { index: MemeIndex }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <AnimatePresence>
        {index.isHot && (
          <motion.div
            key={`${index.id}-hot`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Badge className="bg-orange-600 text-white px-1.5 py-0.5 text-xs relative overflow-hidden">
              <Flame className="w-3 h-3 mr-1" />
              HOT
            </Badge>
          </motion.div>
        )}
        
        {index.isNew && (
          <motion.div
            key={`${index.id}-new`}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs relative">
              <Star className="w-3 h-3 mr-1" />
              NEW
              {/* Border beam은 별도 구현 필요 */}
            </Badge>
          </motion.div>
        )}
        
        {index.isMooning && (
          <motion.div
            key={`${index.id}-mooning`}
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Badge className="bg-green-600 text-white px-1.5 py-0.5 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              MOONING
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 레거시 QuickTradeButtons는 새로운 QuickTradeButton 컴포넌트로 교체됨

// 메인 인덱스 카드 컴포넌트
const IndexCard = memo(function IndexCard({ 
  index, 
  onSelect, 
  showQuickTrade = true, 
  compact = false,
  className 
}: IndexCardProps) {
  const soundManager = useSoundManager()
  const [isHovered, setIsHovered] = useState(false)
  const [lastPrice, setLastPrice] = useState(index.currentPrice)
  const isPositive = index.change24h >= 0

  // Price change sound effects
  useEffect(() => {
    if (lastPrice !== index.currentPrice) {
      const priceChange = ((index.currentPrice - lastPrice) / lastPrice) * 100
      const changeDirection = index.currentPrice > lastPrice
      
      // Play sound for significant price changes (> 1%)
      if (Math.abs(priceChange) > 1) {
        soundManager.playPriceChange(changeDirection, Math.abs(priceChange))
      }
      
      setLastPrice(index.currentPrice)
    }
  }, [index.currentPrice, lastPrice, soundManager])

  // Memoized calculations
  const cardStyles = useMemo(() => ({
    background: `linear-gradient(135deg, 
      ${isPositive ? 'rgba(34, 197, 94, 0.02)' : 'rgba(239, 68, 68, 0.02)'} 0%, 
      rgba(30, 41, 59, 0.8) 100%
    )`,
    borderColor: isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
  }), [isPositive])

  const handleTrade = useCallback((type: 'buy' | 'sell', amount: number, leverage: number) => {
    // 거래 로직 구현
    console.log(`${type} ${index.symbol} - Amount: $${amount}, Leverage: ${leverage}x`)
    onSelect(index) // 인덱스 선택하여 거래 페이지로 이동
  }, [index.symbol, onSelect, index])

  const handleCardClick = useCallback(() => {
    onSelect(index)
  }, [onSelect, index])

  const cardVariants = {
    ...fadeInScale,
    rest: { 
      scale: 1, 
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
    },
    hover: { 
      scale: 1.05, 
      y: -8,
      rotateX: 2,
      rotateY: isHovered ? 1 : -1,
      transition: { type: 'spring' as const, stiffness: 400, damping: 20 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  return (
    <div className={cn(className, "relative", isHovered && "z-[9999]")}>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="perspective-1000"
      >
      <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600/50 transition-all duration-500 cursor-pointer hover:bg-slate-900/80 relative overflow-visible group backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-brand/5">
        {/* Border Beam 효과는 카드 전체에 적용됨 */}

        <CardContent className="p-4 relative">
          {/* 헤더 - 배지와 가격 */}
          <div className="flex items-start justify-between mb-3">
            <IndexBadges index={index} />
            <AnimatedPrice price={index.currentPrice} change={index.change24h} />
          </div>
          
          {/* 인덱스 정보 */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-sm">{index.name}</h3>
              <Badge variant="outline" className="text-xs px-1 py-0">
                {index.symbol}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">{index.description}</p>
          </div>
          
          {/* 스파크라인 */}
          <div className="mb-3">
            <EnhancedSparkline 
              data={index.sparklineData} 
              className="opacity-80" 
              animated={isHovered}
              id={index.id}
            />
          </div>
          
          {/* 통계 그리드 */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <div className="text-slate-400 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Volume 24h
              </div>
              <div className="text-white font-medium">
                $<AnimatedNumber 
                  value={index.volume24h / 1000000} 
                  decimals={1}
                  suffix="M"
                  duration={1200}
                />
              </div>
            </div>
            <div>
              <div className="text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Holders
              </div>
              <div className="text-white font-medium">
                <AnimatedNumber 
                  value={index.holders}
                  duration={1000}
                />
              </div>
            </div>
          </div>

          {/* 추가 정보 (컴팩트하지 않을 때만) */}
          {!compact && (
            <motion.div 
              className="grid grid-cols-2 gap-3 text-xs mb-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <div className="text-slate-400">Market Cap</div>
                <div className="text-white font-medium">
                  $<AnimatedNumber value={index.marketCap / 1000000} decimals={1} />M
                </div>
              </div>
              <div>
                <div className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last Update
                </div>
                <div className="text-white font-medium">2m ago</div>
              </div>
            </motion.div>
          )}
          
          {/* 퀵 트레이드 버튼 */}
          {showQuickTrade && (
            <motion.div
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <QuickTradeButton 
                index={index} 
                onTrade={handleTrade}
                variant={compact ? "compact" : "default"}
                showExpectedReturn={!compact}
              />
            </motion.div>
          )}

          {/* 상세보기 링크 */}
          <motion.div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`/trading?index=${index.id}`, '_blank')
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
})

export { IndexCard }
export default IndexCard
