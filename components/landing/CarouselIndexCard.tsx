'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Flame,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Clock,
  Rocket,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import type { MemeIndex } from '@/lib/types/index-trading'
import Link from 'next/link'
import { useCurrency } from '@/lib/hooks/useCurrency'

interface CarouselIndexCardProps {
  index: MemeIndex
  onClick?: () => void
}

export function CarouselIndexCard({ index, onClick }: CarouselIndexCardProps) {
  const { formatPrice, formatVolume } = useCurrency()
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock NAV calculation (in production, would use real NAV data)
  // Use deterministic calculation based on index ID to avoid hydration mismatch
  const hashCode = index.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const mockNAV = index.currentPrice * (0.95 + (hashCode % 100) / 1000)
  const navPremium = ((index.currentPrice - mockNAV) / mockNAV) * 100

  // Mock rebalancing info
  const getRebalancingInfo = () => {
    const layer = index.layerInfo?.layer
    if (layer === 'layer-1') {
      return { frequency: 'Monthly', nextDays: 12 }
    } else if (layer === 'layer-2') {
      return { frequency: 'Bi-weekly', nextDays: 5 }
    } else {
      return { frequency: 'Dynamic', nextDays: 3 }
    }
  }

  const rebalancing = getRebalancingInfo()

  return (
    <Card
      className="bg-teal-card border-teal hover:border-white/10 transition-all cursor-pointer group overflow-hidden h-full"
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white truncate group-hover:text-brand transition-colors">
                {index.name}
              </h3>
              {index.isHot && (
                <Badge variant="outline" className="text-orange-400 border-orange-400/30 text-xs px-1.5 py-0.5">
                  <Flame className="w-3 h-3" />
                </Badge>
              )}
              {index.isNew && (
                <Badge variant="outline" className="text-brand border-white/10 text-xs px-1.5 py-0.5">
                  NEW
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-2">{index.symbol}</p>
            <p className="text-xs text-slate-500 line-clamp-2">{index.description}</p>
          </div>

          {/* Layer Badge */}
          {index.layerInfo && (
            <Badge
              variant="outline"
              className={`ml-2 text-xs ${
                index.layerInfo.layer === 'layer-1'
                  ? 'text-blue-400 border-blue-400/30'
                  : index.layerInfo.layer === 'layer-2'
                  ? 'text-purple-400 border-purple-400/30'
                  : 'text-brand border-white/10'
              }`}
            >
              L{index.layerInfo.layer.replace('layer-', '')}
            </Badge>
          )}
        </div>

        {/* Price & NAV Section */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-teal-elevated/50 rounded-lg border border-teal-light">
          <div>
            <p className="text-xs text-slate-500 mb-1">Market Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatPrice(index.currentPrice)}
              </span>
              <span
                className={`text-sm font-medium ${
                  index.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {index.change24h >= 0 ? '+' : ''}
                {index.change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">NAV (Net Asset Value)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-300">
                {formatPrice(mockNAV)}
              </span>
              <Badge
                variant="outline"
                className={`text-xs ${
                  navPremium >= 0
                    ? 'text-green-400 border-green-400/30'
                    : 'text-blue-400 border-blue-400/30'
                }`}
              >
                {navPremium >= 0 ? '+' : ''}
                {navPremium.toFixed(1)}%
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {navPremium >= 0 ? 'Premium' : 'Discount'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-teal-elevated/30 rounded border border-teal-light">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">24h Volume</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {formatVolume(index.volume24h)}
            </p>
          </div>

          <div className="text-center p-2 bg-teal-elevated/30 rounded border border-teal-light">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">TVL</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {formatVolume(index.tvl)}
            </p>
          </div>

          <div className="text-center p-2 bg-teal-elevated/30 rounded border border-teal-light">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">Rebalance</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {rebalancing.nextDays}d
            </p>
          </div>
        </div>

        {/* Composition Preview (Top 5 Assets) */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-slate-300">Composition</h4>
            <Badge variant="outline" className="text-xs text-slate-400 border-teal">
              {index.assets.length} Assets
            </Badge>
          </div>

          <div className="space-y-1.5">
            {index.assets.slice(0, isExpanded ? index.assets.length : 5).map((asset, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2 bg-teal-elevated/30 rounded hover:bg-teal-elevated/50 transition-colors border border-teal-light"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand/20 to-purple-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-brand">
                      {asset.symbol.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-white truncate">{asset.symbol}</span>
                  <span className="text-slate-500 truncate">{asset.name}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-medium ${
                      asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {asset.change24h >= 0 ? '+' : ''}
                    {asset.change24h.toFixed(1)}%
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs text-brand border-white/10 min-w-[3.5rem] justify-center"
                  >
                    {asset.allocation.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Expand/Collapse Button */}
          {index.assets.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="w-full mt-2 text-xs text-slate-400 hover:text-white hover:bg-teal-elevated/50"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 mr-1" />
                  Show {index.assets.length - 5} more
                </>
              )}
            </Button>
          )}
        </div>

        {/* Graduation Progress (Layer 3 only) */}
        {index.layerInfo?.layer === 'layer-3' && index.graduation && (
          <div className="mb-3 p-3 bg-brand/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-brand" />
                <span className="text-sm font-semibold text-white">Graduation Progress</span>
              </div>
              <Badge variant="outline" className="text-xs text-brand border-white/10">
                {index.graduation.status === 'graduated'
                  ? 'Graduated'
                  : index.graduation.status === 'near-graduation'
                  ? 'Near Graduation'
                  : index.graduation.status === 'recruiting-liquidity'
                  ? 'Funding Round'
                  : 'Bonding Curve'}
              </Badge>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Liquidity Progress</span>
                  <span className="text-white font-medium">
                    {index.graduation.liquidityProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-teal-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-purple-500 transition-all duration-500"
                    style={{ width: `${index.graduation.liquidityProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Sales Progress</span>
                  <span className="text-white font-medium">
                    {index.graduation.salesProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-teal-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-brand transition-all duration-500"
                    style={{ width: `${index.graduation.salesProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rebalancing Info */}
        <div className="mb-4 p-3 bg-teal-elevated/30 rounded-lg border border-teal">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-400">Next Rebalancing</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{rebalancing.nextDays} days</p>
              <p className="text-xs text-slate-500">{rebalancing.frequency}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/10 text-brand hover:bg-brand/10"
            onClick={(e) => {
              e.stopPropagation()
            }}
            asChild
          >
            <Link href={`/trading?index=${index.id}`}>
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Trade
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-teal text-slate-300 hover:bg-teal-card/50"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
