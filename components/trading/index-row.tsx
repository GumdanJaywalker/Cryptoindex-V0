'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

// 썸네일 생성 함수
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

// Layer badge component
function LayerBadge({ layerInfo }: { layerInfo?: any }) {
  if (!layerInfo) return null
  
  const layerConfig = {
    'layer-1': { 
      icon: Building2, 
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      label: 'L1'
    },
    'layer-2': { 
      icon: Crown, 
      color: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
      label: 'L2'
    },
    'layer-3': { 
      icon: Zap, 
      color: 'text-red-400 bg-red-400/10 border-red-400/30',
      label: 'L3'
    }
  }
  
  const config = layerConfig[layerInfo.layer as keyof typeof layerConfig]
  if (!config) return null
  
  const Icon = config.icon
  
  const display = getLayerDisplayInfo(layerInfo.layer)

  return (
    <div 
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${config.color}`}
      title={display?.description || `${layerInfo.category} - ${layerInfo.riskLevel} risk`}
    >
      <Icon className="w-3 h-3" />
      <span className="font-medium">{config.label}</span>
      {layerInfo.riskLevel === 'high' && <Shield className="w-2 h-2" />}
    </div>
  )
}

// Row badges - more compact
function RowBadges({ index }: { index: MemeIndex }) {
  return (
    <div className="flex items-center gap-1">
      {/* Layer Badge */}
      <LayerBadge layerInfo={index.layerInfo} />
      {/* Only show dynamic performance hint; HOT/NEW already shown as text badges near name */}
      <AnimatePresence>
        {index.isMooning && (
          <motion.div
            key={`${index.id}-mooning`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05, type: "spring" }}
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
        "group h-14 border-b border-border/50 hover:bg-muted/30 focus-within:bg-muted/30 transition-colors duration-200 cursor-pointer",
        // Removed ring to avoid thin lines on click
        isHovered && "bg-muted/40",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRowClick}
    >
      {/* Name & Thumbnail */}
      <TableCell className="w-[300px]">
        <div className="flex items-center gap-3">
          {/* 썸네일 이미지 */}
          <div className={cn("w-10 h-10 rounded-lg overflow-hidden flex-shrink-0", thumbnail.gradient)}>
            <Image
              src={thumbnail.url}
              alt={index.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate text-white flex items-center gap-2">
              <span className="truncate">{index.name}</span>
              {index.isHot && (
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-orange-400 border-orange-400/30">HOT</Badge>
              )}
              {index.isNew && (
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-blue-400 border-blue-400/30">NEW</Badge>
              )}
              {index.graduation && (
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] text-violet-400 border-violet-400/30"
                  title={`Graduation — Liquidity ${index.graduation.liquidityProgress}% · Sales ${index.graduation.salesProgress}% · Status: ${index.graduation.status}`}
                >
                  {`Graduation ${Math.round((index.graduation.liquidityProgress + index.graduation.salesProgress) / 2)}%`}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{index.symbol}</span>
              <RowBadges index={index} />
            </div>
          </div>
        </div>
      </TableCell>

      {/* Chart */}
      <TableCell className="w-[120px]">
        <div className="w-20 h-8">
          <CompactSparkline 
            data={index.sparklineData || []} 
            className="w-full h-full"
            id={`sparkline-${index.id}`}
          />
        </div>
      </TableCell>

      {/* Price */}
      <TableCell className="w-[100px] text-right">
        <RowAnimatedPrice 
          price={index.currentPrice} 
          change={index.change24h}
        />
      </TableCell>

      {/* 24h Change */}
      <TableCell className="w-[100px] text-right">
        <div className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-500" : "text-red-500"
        )}>
          {isPositive ? '+' : ''}{index.change24h.toFixed(2)}%
        </div>
      </TableCell>

      {/* Volume */}
      <TableCell className="w-[120px] text-right">
        <div className="text-sm font-mono">
          ${(index.volume24h / 1000000).toFixed(1)}M
        </div>
      </TableCell>

      {/* Market Cap */}
      <TableCell className="w-[120px] text-right">
        <div className="text-sm font-mono">
          ${(index.marketCap / 1000000).toFixed(1)}M
        </div>
      </TableCell>

      {/* Actions: Favorites + Trade */}
      <TableCell className="w-[160px] text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "h-7 w-7 border-slate-700 hover:bg-slate-800",
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
                "w-4 h-4",
                isFavorite ? "text-brand fill-current" : "text-slate-400"
              )}
            />
          </Button>
          {showQuickTrade && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs font-medium border-brand text-brand hover:bg-brand hover:text-black transition-all duration-200 ease-out shadow-sm hover:shadow-lg motion-reduce:transition-none"
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
