"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopTrader, Trade } from '@/lib/types/index-trading'
import { mockRecentTrades, generateMockTraders } from '@/lib/data/mock-indices'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpRight, BarChart3, Percent, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatAddressShort(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function TraderPortfolioPublic({ traderId }: { traderId: string }) {
  const trader: TopTrader | undefined = generateMockTraders().find((t) => t.id === traderId)

  if (!trader) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
          <div className="text-white text-lg font-semibold">Trader not found</div>
          <div className="text-slate-400 text-sm mt-1">ID: {traderId}</div>
          <div className="mt-4">
            <Link href="/leaderboard" className="text-brand hover:underline">Back to Leaderboard</Link>
          </div>
        </div>
      </div>
    )
  }

  const recent = (mockRecentTrades as Trade[]).filter((t) => t.traderId === trader.id).slice(0, 12)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={trader.avatar} alt={trader.ens || trader.address} />
          <AvatarFallback>{trader.address.slice(2, 4).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold text-white">
              {trader.ens || formatAddressShort(trader.address)}
            </div>
            {trader.isNewTrader && (
              <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs">NEW</Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700 text-slate-300"># {trader.rank}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trader.followersCount.toLocaleString()} followers</span>
            <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{trader.totalTrades} trades</span>
          </div>
        </div>
        <div className="flex gap-1" aria-hidden>
          {trader.badges?.map((b, i) => (
            <span key={i} className="text-xl">{b}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="p-4">
            <div className="text-xs text-slate-400 flex items-center gap-1"><Percent className="w-3 h-3" />ROI 24H</div>
            <div className={cn('text-sm font-semibold', (trader.pnlPercentage24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
              {(trader.pnlPercentage24h||0) >= 0 ? '+' : ''}{(trader.pnlPercentage24h||0).toFixed(1)}%
            </div>
            <div className={cn('text-[11px]', (trader.pnl24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
              {(trader.pnl24h||0) >= 0 ? '+$' : '-$'}{Math.abs(trader.pnl24h||0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="p-4">
            <div className="text-xs text-slate-400">Total PnL</div>
            <div className={cn('text-sm font-semibold', (trader.totalPnl||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
              {(trader.totalPnl||0) >= 0 ? '+$' : '-$'}{Math.abs(trader.totalPnl||0).toLocaleString()}
            </div>
            <div className={cn('text-[11px]', (trader.totalPnlPercentage||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
              {(trader.totalPnlPercentage||0) >= 0 ? '+' : ''}{(trader.totalPnlPercentage||0).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="p-4">
            <div className="text-xs text-slate-400">Trading Indices</div>
            <div className="text-sm font-semibold text-white">{trader.tradingIndices.length}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {trader.tradingIndices.slice(0, 6).map((id) => (
                <Link key={id} href={`/trading?index=${id}`} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs border border-slate-700 hover:border-slate-600 hover:text-white">
                  {id.toUpperCase()}
                </Link>
              ))}
              {trader.tradingIndices.length > 6 && (
                <span className="text-xs text-slate-400">+{trader.tradingIndices.length - 6} more</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="bg-slate-900/40 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">Last 12</Badge>
          </div>
          {recent.length === 0 ? (
            <div className="text-sm text-slate-400 mt-4">No recent trades</div>
          ) : (
            <div className="mt-3 divide-y divide-slate-800">
              {recent.map((t) => (
                <div key={t.id} className="py-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn('px-1.5 py-0.5 rounded text-xs', t.type === 'long' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400')}>
                      {t.type.toUpperCase()}
                    </span>
                    <span className="text-slate-300">{t.indexId.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-xs">
                    <span className="text-slate-400">Entry ${t.entryPrice.toFixed(4)}</span>
                    <span className="text-slate-400">Size ${t.amount.toFixed(0)}</span>
                    <span className={cn(t.pnl >= 0 ? 'text-green-400' : 'text-red-400')}>{t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

