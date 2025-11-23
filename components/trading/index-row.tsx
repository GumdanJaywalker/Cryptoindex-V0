'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  ArrowRight,
  Building2,
  Crown,
  Zap,
  Shield
} from 'lucide-react'
import { MemeIndex } from '@/lib/types/index-trading'
import { getLayerDisplayInfo } from '@/lib/utils/layer-utils'
// Quick View modal removed from row actions in favor of favorites
import { cn } from '@/lib/utils'
import Image from 'next/image'
import useTradingStore from '@/lib/store/trading-store'

interface IndexRowProps {
  index: MemeIndex
  onSelect: (index: MemeIndex) => void
  rank?: number
  showQuickTrade?: boolean
  className?: string
}

// Thumbnail generation function
const generateThumbnail = (indexName: string, symbol: string) => {
  const seed = encodeURIComponent(symbol || indexName)
  const url = `https://picsum.photos/seed/${seed}/80/80`
  const colors = ['8BD6FF', '6BBDFF', '5AABEF', '4A9ADF']
  const colorIndex = symbol.length % colors.length
  const selectedColor = colors[colorIndex]
  return {
    url,
    gradient: `bg-gradient-to-r from-[#${selectedColor}] to-brand-dark`,
  }
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
  const strokeColor = isPositive ? "#4ade80" : "#dd7789"

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

// Layer badge component (Updated: L1/Partner, L2/VS Battle)
function LayerBadge({ layerInfo, hasBattle }: { layerInfo?: any, hasBattle?: boolean }) {
  if (!layerInfo) return null

  // Simplified layer system: L1/Partner, L2/VS Battle
  const isL1 = layerInfo.layer === 'layer-1'
  const isL2 = layerInfo.layer === 'layer-2'

  // L1/Partner badge (mint color #98FCE4)
  if (isL1) {
    return (
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border text-[#98FCE4] bg-[#98FCE4]/10 border-[#98FCE4]/30"
        title="Layer 1 / Partner Index"
      >
        <Building2 className="w-3 h-3" />
        <span className="font-medium">L1/Partner</span>
      </div>
    )
  }

  // L2/VS Battle badge (teal color #7DD9C8)
  if (isL2) {
    return (
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border text-[#7DD9C8] bg-[#7DD9C8]/10 border-[#7DD9C8]/30"
        title="Layer 2 / VS Battle Index"
      >
        <Crown className="w-3 h-3" />
        <span className="font-medium">L2/VS Battle</span>
      </div>
    )
  }

  return null
}

// Row badges - more compact (Layer badges removed)
function RowBadges({ index }: { index: MemeIndex }) {
  return (
    <div className="flex items-center gap-1">
      {/* Layer Badge removed */}
      {/* Trend arrows removed - no isMooning indicator */}
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
  const favorites = useTradingStore((state) => state.favorites)
  const toggleFavorite = useTradingStore((state) => state.toggleFavorite)
  const isFavorite = favorites.includes(index.id)

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

  const thumbnail = generateThumbnail(index.name, index.symbol)

  return (
    <TableRow
      className={cn(
        "group h-12 border-b border-border/50 hover:bg-muted/30 focus-within:bg-muted/30 transition-colors duration-200 cursor-pointer",
        // Removed ring to avoid thin lines on click
        isHovered && "bg-muted/40",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRowClick}
    >
      {/* Name & Thumbnail */}
      <TableCell className="w-[280px]">
        <div className="flex items-center gap-3">
          {/* Thumbnail Image */}
          <div className={cn("w-9 h-9 rounded-lg overflow-hidden flex-shrink-0", thumbnail.gradient)}>
            <Image
              src={thumbnail.url}
              alt={index.name}
              width={36}
              height={36}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            {/* L3 Graduation tooltip wraps ticker and name */}
            {index.graduation ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      {/* Ticker on top (large) */}
                      <div className="font-bold text-[15px] text-white flex items-center gap-2">
                        <span>{index.symbol}</span>
                        {/* VS Badge on the right side for battles */}
                        {index.hasBattle && (
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-purple-400 border-purple-400/30">VS</Badge>
                        )}
                        {/* HOT/NEW badges on the right side */}
                        {index.isHot && (
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-orange-400 border-orange-400/30">HOT</Badge>
                        )}
                        {index.isNew && (
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-blue-400 border-blue-400/30">NEW</Badge>
                        )}
                      </div>
                      {/* Index name below (truncatable) */}
                      <div className="text-[11px] text-muted-foreground truncate">
                        {index.name}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-teal-card border-teal text-white p-2">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-400">Liquidity:</span>
                        <span className="font-medium text-violet-400">{index.graduation.liquidityProgress}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-400">Sales:</span>
                        <span className="font-medium text-violet-400">{index.graduation.salesProgress}%</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <>
                {/* Ticker on top (large) */}
                <div className="font-bold text-[15px] text-white flex items-center gap-2">
                  <span>{index.symbol}</span>
                  {/* VS Badge on the right side for battles */}
                  {index.hasBattle && (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-purple-400 border-purple-400/30">VS</Badge>
                  )}
                  {/* HOT/NEW badges on the right side */}
                  {index.isHot && (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-orange-400 border-orange-400/30">HOT</Badge>
                  )}
                  {index.isNew && (
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-blue-400 border-blue-400/30">NEW</Badge>
                  )}
                </div>
                {/* Index name below (truncatable) */}
                <div className="text-[11px] text-muted-foreground truncate">
                  {index.name}
                </div>
              </>
            )}
          </div>
        </div>
      </TableCell>

      {/* Chart */}
      <TableCell className="w-[110px]">
        <div className="w-18 h-7">
          <CompactSparkline
            data={index.sparklineData || []}
            className="w-full h-full"
            id={`sparkline-${index.id}`}
          />
        </div>
      </TableCell>

      {/* Price */}
      <TableCell className="w-[92px] text-right">
        <RowAnimatedPrice
          price={index.currentPrice}
          change={index.change24h}
        />
      </TableCell>

      {/* 24h Change */}
      <TableCell className="w-[92px] text-right">
        <div className={cn(
          "text-xs font-medium",
          isPositive ? "text-green-500" : "text-red-500"
        )}>
          {isPositive ? '+' : ''}{index.change24h.toFixed(2)}%
        </div>
      </TableCell>

      {/* Volume */}
      <TableCell className="w-[110px] text-right">
        <div className="text-xs font-mono">
          ${(index.volume24h / 1000000).toFixed(1)}M
        </div>
      </TableCell>

      {/* Market Cap */}
      <TableCell className="w-[110px] text-right">
        <div className="text-xs font-mono">
          ${(index.marketCap / 1000000).toFixed(1)}M
        </div>
      </TableCell>

      {/* Actions: Favorites + Trade */}
      <TableCell className="w-[150px] text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "h-6 w-6 border-teal hover:bg-teal-card/50",
              isFavorite && "border-brand/40 bg-brand/10"
            )}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(index.id)
            }}
            aria-label={isFavorite ? `Remove ${index.name} from favorites` : `Add ${index.name} to favorites`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={cn(
                "w-3.5 h-3.5",
                isFavorite ? "text-brand fill-current" : "text-slate-400"
              )}
            />
          </Button>
          {showQuickTrade && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2.5 text-[11px] font-medium border-brand text-brand hover:bg-brand hover:text-black transition-all duration-200 ease-out shadow-sm hover:shadow-lg motion-reduce:transition-none"
              onClick={(e) => {
                e.stopPropagation()
                handleQuickTrade('buy')
              }}
              aria-label={`Trade ${index.symbol}`}
            >
              Trade
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
})

export { IndexRow }
export default IndexRow
