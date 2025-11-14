'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopTrader } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { allMockIndexes } from '@/lib/data/mock-indexes'

interface CompactTraderCardProps {
  trader: TopTrader
}

function formatAddress(addr: string, ens?: string) {
  if (ens) return ens
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function CompactTraderCard({ trader }: CompactTraderCardProps) {
  const totalPnl = trader.totalPnl || 0

  return (
    <Card className="bg-teal-card border-teal hover:border-white/10 transition-all group h-full flex flex-col min-h-[200px]">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header with Rank and Address */}
        <Link href={`/leaderboard/${trader.id}`} className="block mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  'text-sm font-bold',
                  trader.rank === 1 && 'border-yellow-400 text-yellow-400',
                  trader.rank === 2 && 'border-gray-400 text-gray-400',
                  trader.rank === 3 && 'border-orange-400 text-orange-400',
                  trader.rank > 3 && 'border-teal text-slate-400'
                )}
              >
                #{trader.rank}
              </Badge>
              <h3 className="text-sm font-bold text-white group-hover:text-brand transition-colors truncate">
                {formatAddress(trader.address, trader.ens)}
              </h3>
            </div>
          </div>
        </Link>

        {/* Total PnL */}
        <div className="text-center py-3 px-3 bg-teal-card/30 rounded-lg border border-teal mb-3">
          <div className="text-xs text-slate-400 mb-1">Total P&L</div>
          <div
            className={cn(
              'text-2xl font-bold',
              totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
            )}
          >
            {totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toLocaleString()}
          </div>
        </div>

        {/* Main Positions */}
        <div className="text-xs text-slate-400 mb-2">Main Positions</div>
        <div className="grid grid-cols-3 gap-1.5 flex-1 items-start">
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
                <div className="p-1.5 bg-teal-card/40 rounded border border-teal/50 hover:border-white/10 transition-all cursor-pointer">
                  <div className="text-xs font-semibold text-white truncate">
                    {index.symbol}
                  </div>
                  <div className={cn(
                    'text-xs font-medium',
                    isPositive ? 'text-green-400' : 'text-red-400'
                  )}>
                    {isPositive ? '+' : ''}{index.change24h.toFixed(1)}%
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
