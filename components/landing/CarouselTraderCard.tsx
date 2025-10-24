'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TopTrader } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/lib/utils/avatar'
import { allMockIndexes } from '@/lib/data/mock-indexes'
import {
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Trophy,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react'

interface CarouselTraderCardProps {
  trader: TopTrader
}

function formatAddress(addr: string, ens?: string) {
  if (ens) return ens
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function CarouselTraderCard({ trader }: CarouselTraderCardProps) {
  const totalPnl = trader.totalPnl || 0
  const winRate = trader.winRate || 0
  const pnl7d = trader.pnl7d || 0
  const pnlPercentage7d = trader.pnlPercentage7d || 0

  // Generate simple sparkline data from 7d PnL (mock data)
  // In production, this would come from the API
  // Using deterministic seed to avoid hydration errors
  const generateSparklineData = () => {
    const points = 7
    const data = []
    const hashCode = trader.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const seed = (index: number) => {
      const x = Math.sin((hashCode + index) * 12345.6789) * 10000
      return x - Math.floor(x)
    }

    for (let i = 0; i < points; i++) {
      const random = Math.sin(i * 0.5) * 20 + seed(i) * 10
      data.push(50 + random + (pnl7d / 1000) * i)
    }
    return data
  }

  const sparklineData = generateSparklineData()
  const maxValue = Math.max(...sparklineData)
  const minValue = Math.min(...sparklineData)

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-brand/50 transition-all group overflow-hidden h-full">
      <CardContent className="p-6">
        {/* Header with Avatar and Rank */}
        <Link href={`/traders/${trader.id}`} className="block mb-6">
          <div className="flex items-start justify-between cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-brand/20 group-hover:ring-brand/50 transition-all">
                  <AvatarImage
                    src={trader.avatar || getAvatarUrl(trader.ens || trader.address || trader.id)}
                    alt="avatar"
                  />
                  <AvatarFallback className="bg-slate-800 text-white">
                    {(trader.ens || trader.address).slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {trader.rank <= 3 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                    {formatAddress(trader.address, trader.ens)}
                  </h3>
                  {trader.isNewTrader && (
                    <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs">
                      NEW
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      trader.rank === 1 && 'border-yellow-400 text-yellow-400',
                      trader.rank === 2 && 'border-gray-400 text-gray-400',
                      trader.rank === 3 && 'border-orange-400 text-orange-400',
                      trader.rank > 3 && 'border-slate-700 text-slate-400'
                    )}
                  >
                    Rank #{trader.rank}
                  </Badge>
                  <div className="flex gap-1">
                    {trader.badges?.slice(0, 3).map((badge, i) => (
                      <span key={i} className="text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Total PnL - Large Display */}
          <div className="text-center py-6 px-4 bg-slate-800/30 rounded-lg border border-slate-700 mb-6">
            <div className="text-sm text-slate-400 mb-2">Total P&L</div>
            <div
              className={cn(
                'text-4xl font-bold mb-1',
                totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
              )}
            >
              {totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toLocaleString()}
            </div>
            <div
              className={cn(
                'text-sm',
                totalPnl >= 0 ? 'text-green-400/70' : 'text-red-400/70'
              )}
            >
              {totalPnl >= 0 ? '+' : ''}
              {(trader.totalPnlPercentage || 0).toFixed(2)}% all time
            </div>
          </div>

          {/* Top Trading Indices */}
          <div className="mb-6">
            <div className="text-sm text-slate-400 mb-3">Main Positions</div>
            <div className="grid grid-cols-3 gap-2">
              {trader.tradingIndexes.slice(0, 3).map((indexId) => {
                const index = allMockIndexes.find(idx => idx.id === indexId)
                if (!index) return null

                const isPositive = index.change24h >= 0

                return (
                  <Link
                    key={indexId}
                    href={`/trading?index=${index.id}`}
                    className="block"
                  >
                    <div
                      className="p-2 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-brand/50 hover:bg-slate-800/60 transition-all cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-white mb-1 truncate">
                        {index.symbol}
                      </div>
                      <div className={cn(
                        'text-xs font-medium flex items-center gap-0.5',
                        isPositive ? 'text-green-400' : 'text-red-400'
                      )}>
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}{index.change24h.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 7d Performance Chart */}
          <div className="mb-6 p-4 bg-slate-800/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">7-Day Performance</span>
              <div className="flex items-center gap-2">
                <TrendingUp className={cn(
                  'w-4 h-4',
                  pnl7d >= 0 ? 'text-green-400' : 'text-red-400'
                )} />
                <span
                  className={cn(
                    'text-sm font-semibold',
                    pnl7d >= 0 ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {pnl7d >= 0 ? '+' : ''}
                  {pnlPercentage7d.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Simple Sparkline */}
            <div className="h-20 flex items-end gap-0.5">
              {sparklineData.map((value, idx) => {
                const height = ((value - minValue) / (maxValue - minValue)) * 100
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-brand/40 to-brand rounded-t transition-all"
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">Win Rate</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {winRate.toFixed(1)}%
              </p>
            </div>

            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">Total Trades</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {trader.totalTrades.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">Followers</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {trader.followersCount.toLocaleString()}
              </p>
            </div>
          </div>

        {/* View Profile Link */}
        <Link href={`/traders/${trader.id}`} className="block">
          <div className="flex items-center justify-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors cursor-pointer">
            <span>View Full Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
