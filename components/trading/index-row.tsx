'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AnimatedNumber, 
  AnimatedPercentage, 
  usePriceFlash, 
  fadeInUp 
} from '@/lib/animations/micro-interactions'
import { GlitchEffect } from '@/components/ui/3d-effects'
import { useSoundManager } from '@/lib/sound/effects'
import { 
  TrendingUp, 
  TrendingDown, 
  Flame,
  Star,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { MemeIndex } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'

interface IndexRowProps {
  index: MemeIndex
  onSelect: (index: MemeIndex) => void
  rank?: number
  showQuickTrade?: boolean
  className?: string
}

// Compact Sparkline for row layout
function CompactSparkline({ 
  data, 
  className,
  id = 'sparkline'
}: { 
  data: number[], 
  className?: string,
  id?: string
}) {
  if (!data || data.length === 0) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = range === 0 ? 50 : 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  const isPositive = data[data.length - 1] > data[0]
  const strokeColor = isPositive ? "#10b981" : "#ef4444"
  
  return (
    <div className={cn("w-20 h-8", className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
          className="opacity-80"
        />
      </svg>
    </div>
  )
}

// Animated Price for row layout
function RowAnimatedPrice({ price, change }: { price: number, change: number }) {
  const priceFlash = usePriceFlash(price, 500)
  const isVolatile = Math.abs(change) > 15
  
  return (
    <div className="text-right">
      <GlitchEffect trigger={isVolatile && priceFlash.isFlashing}>
        <div 
          className="font-bold text-white transition-all duration-300"
          style={priceFlash.flashStyles}
        >
          $<AnimatedNumber 
            value={price} 
            decimals={4} 
            duration={500}
            enableFlash={false}
          />
        </div>
      </GlitchEffect>
    </div>
  )
}

// Row badges - more compact
function RowBadges({ index }: { index: MemeIndex }) {
  return (
    <div className="flex items-center gap-1">
      <AnimatePresence>
        {index.isHot && (
          <motion.div
            key={`${index.id}-hot`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <Flame className="w-3 h-3 text-orange-500" />
          </motion.div>
        )}
        
        {index.isNew && (
          <motion.div
            key={`${index.id}-new`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05, type: "spring" }}
          >
            <Star className="w-3 h-3 text-blue-500" />
          </motion.div>
        )}
        
        {index.isMooning && (
          <motion.div
            key={`${index.id}-mooning`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <TrendingUp className="w-3 h-3 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Index Row Component
const IndexRow = memo(function IndexRow({ 
  index, 
  onSelect, 
  rank,
  showQuickTrade = true,
  className 
}: IndexRowProps) {
  const soundManager = useSoundManager()
  const [isHovered, setIsHovered] = useState(false)
  const [lastPrice, setLastPrice] = useState(index.currentPrice)
  const isPositive = index.change24h >= 0

  // Price change sound effects
  useEffect(() => {
    if (lastPrice !== index.currentPrice) {
      const priceChange = ((index.currentPrice - lastPrice) / lastPrice) * 100
      const changeDirection = index.currentPrice > lastPrice
      
      if (Math.abs(priceChange) > 1) {
        soundManager.playPriceChange(changeDirection, Math.abs(priceChange))
      }
      
      setLastPrice(index.currentPrice)
    }
  }, [index.currentPrice, lastPrice, soundManager])

  const handleRowClick = useCallback(() => {
    onSelect(index)
  }, [onSelect, index])

  const handleQuickTrade = useCallback((type: 'buy' | 'sell') => {
    console.log(`Quick ${type} trade for ${index.symbol}`)
    onSelect(index)
  }, [index, onSelect])

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "group relative border-b border-slate-800/50 last:border-b-0 transition-all duration-300",
        "hover:bg-slate-900/30 hover:border-slate-700/50",
        isHovered && "bg-slate-900/40 border-slate-700/60",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRowClick}
    >
      <div className="flex items-center px-4 py-3 cursor-pointer">
        
        {/* Rank */}
        {rank && (
          <div className="w-8 text-center">
            <span className="text-sm font-medium text-slate-400">
              {rank}
            </span>
          </div>
        )}

        {/* Index Info */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {/* Name & Symbol */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-sm truncate">
                {index.name}
              </h3>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                {index.symbol}
              </Badge>
              <RowBadges index={index} />
            </div>
            <p className="text-xs text-slate-400 truncate">
              {index.description}
            </p>
          </div>

          {/* Sparkline */}
          <div className="flex-shrink-0">
            <CompactSparkline 
              data={index.sparklineData} 
              id={index.id}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-right">
          
          {/* Price */}
          <div className="w-24">
            <RowAnimatedPrice 
              price={index.currentPrice} 
              change={index.change24h} 
            />
          </div>

          {/* 24h Change */}
          <div className="w-20">
            <AnimatedPercentage 
              value={index.change24h}
              className="text-sm font-medium"
            />
          </div>

          {/* Volume */}
          <div className="w-20 text-sm">
            <div className="text-slate-400 text-xs mb-1">Volume</div>
            <div className="text-white font-medium">
              $<AnimatedNumber 
                value={index.volume24h / 1000000} 
                decimals={1}
                suffix="M"
                duration={800}
              />
            </div>
          </div>

          {/* Market Cap */}
          <div className="w-20 text-sm">
            <div className="text-slate-400 text-xs mb-1">MCap</div>
            <div className="text-white font-medium">
              $<AnimatedNumber 
                value={index.marketCap / 1000000} 
                decimals={1}
                suffix="M"
                duration={800}
              />
            </div>
          </div>

          {/* Quick Trade Buttons */}
          {showQuickTrade && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs border-green-600/30 text-green-400 hover:bg-green-600/20 hover:border-green-500/50"
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuickTrade('buy')
                }}
              >
                Buy
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs border-red-600/30 text-red-400 hover:bg-red-600/20 hover:border-red-500/50"
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuickTrade('sell')
                }}
              >
                Sell
              </Button>
            </div>
          )}

          {/* External Link */}
          <div className="w-8 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <motion.div
        className="absolute left-0 top-0 w-1 h-full bg-brand origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
})

export { IndexRow }
export default IndexRow