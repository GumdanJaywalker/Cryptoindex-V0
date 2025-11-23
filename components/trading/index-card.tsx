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

// Enhanced Sparkline Component
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
  const strokeColor = isPositive ? "#4ade80" : "#dd7789"
  const glowColor = isPositive ? "#4ade80" : "#dd7789"

  return (
    <div className={cn("relative", className)}>
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Glow effect */}
        <defs>
          <filter id={`glow-${id}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background gradient */}
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background area */}
        <polygon
          fill={`url(#gradient-${id})`}
          points={`0,100 ${points} 100,100`}
          className="transition-all duration-1000"
        />

        {/* Main line */}
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

        {/* End point dot */}
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

// Animated Price Component
function AnimatedPrice({ price, change }: { price: number, change: number }) {
  const priceFlash = usePriceFlash(price, 800)
  const isVolatile = Math.abs(change) > 15 // Glitch effect when change > 15%

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

// Badge Component
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
              {/* Border beam needs separate implementation */}
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

// Legacy QuickTradeButtons replaced with new QuickTradeButton component

// Main Index Card Component
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
    // Implement trade logic
    console.log(`${type} ${index.symbol} - Amount: $${amount}, Leverage: ${leverage}x`)
    onSelect(index) // Select index and navigate to trade page
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
        <Card className="glass-card-dynamic border-teal hover:border-teal/50 transition-all duration-500 cursor-pointer hover:bg-teal-card/80 relative overflow-visible group backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-brand/5">
          {/* Border Beam effect applies to the whole card */}

          <CardContent className="p-4 relative">
            {/* Header - Badges and Price */}
            <div className="flex items-start justify-between mb-3">
              <IndexBadges index={index} />
              <AnimatedPrice price={index.currentPrice} change={index.change24h} />
            </div>

            {/* Index Info */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white text-sm">{index.name}</h3>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {index.symbol}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{index.description}</p>
            </div>

            {/* Sparkline */}
            <div className="mb-3">
              <EnhancedSparkline
                data={index.sparklineData}
                className="opacity-80"
                animated={isHovered}
                id={index.id}
              />
            </div>

            {/* Stats Grid */}
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

            {/* Additional Info (Non-compact only) */}
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

            {/* Quick Trade Button */}
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

            {/* Detail View Link */}
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
