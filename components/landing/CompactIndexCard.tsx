'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MemeIndex } from '@/lib/types/index-trading'
import { useCurrency } from '@/lib/hooks/useCurrency'

interface CompactIndexCardProps {
  index: MemeIndex
  onClick?: () => void
}

export function CompactIndexCard({ index, onClick }: CompactIndexCardProps) {
  const { formatPrice, formatVolume } = useCurrency()

  return (
    <Card className="bg-teal-card border-teal hover:border-white/10 transition-all group h-full flex flex-col min-h-[200px]">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate group-hover:text-brand transition-colors">
              {index.name}
            </h3>
            <p className="text-xs text-slate-400">{index.symbol}</p>
          </div>
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

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3 flex-1">
          <div>
            <span className="text-slate-500">24h Vol</span>
            <p className="text-white font-medium">{formatVolume(index.volume24h)}</p>
          </div>
          <div>
            <span className="text-slate-500">TVL</span>
            <p className="text-white font-medium">{formatVolume(index.tvl)}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/10 text-brand hover:bg-brand/10 text-xs"
            onClick={(e) => e.stopPropagation()}
            asChild
          >
            <Link href={`/trading?index=${index.id}`}>
              Trade
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-teal text-slate-300 hover:bg-teal-card/50 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
