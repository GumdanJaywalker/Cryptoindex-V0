'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Star, StarIcon } from 'lucide-react'
import { useState } from 'react'

interface IndexCardProps {
  index: {
    symbol: string
    name: string
    emoji: string
    price: number
    change24h: number
    volume24h: number
    marketCap: number
    rank: number
    description: string
    category: string
    isNew?: boolean
    trendingScore?: number
  }
}

export function IndexCard({ index }: IndexCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const isPositive = index.change24h > 0

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num.toFixed(2)}`
  }

  return (
    <Card className="group bg-slate-900/50 border-slate-800 hover:border-blue-500/30 transition-all duration-200 hover:bg-slate-900/70">
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg">
              {index.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{index.name}</h3>
                {index.isNew && (
                  <Badge className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 border-green-500/30">
                    NEW
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">{index.symbol}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500">#{index.rank}</div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Star 
                className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
              />
            </button>
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">
              ${index.price.toFixed(3)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-sm font-semibold">
                {isPositive ? '+' : ''}{index.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-400">
            <span>Vol: {formatNumber(index.volume24h)}</span>
            <span>Cap: {formatNumber(index.marketCap)}</span>
          </div>
        </div>

        {/* 트렌딩 스코어 */}
        {index.trendingScore && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Trending Score</span>
              <span className="text-orange-400 font-semibold">{index.trendingScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${index.trendingScore}%` }}
              />
            </div>
          </div>
        )}

        {/* 설명 */}
        <p className="text-xs text-slate-400 mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4'
        }}>
          {index.description}
        </p>

        {/* 액션 버튼들 */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
          >
            Trade
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}