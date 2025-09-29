'use client'

import React from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TopTrader } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { ArrowUpRight, BarChart3, Percent, Target, Users } from 'lucide-react'
import { getAvatarUrl } from '@/lib/utils/avatar'
import { allMockIndices } from '@/lib/data/mock-indices'

interface TraderDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trader: TopTrader | null
}

function formatAddress(addr: string, ens?: string) {
  if (ens) return ens
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function TraderDetailsModal({ open, onOpenChange, trader }: TraderDetailsModalProps) {
  if (!trader) return null

  const roi24 = trader.pnlPercentage24h || 0
  const roi7 = trader.pnlPercentage7d || 0
  const roi30 = trader.pnlPercentage30d || 0

  const pnl24 = trader.pnl24h || 0
  const pnl7 = trader.pnl7d || 0
  const pnl30 = trader.pnl30d || 0

  const indices = trader.tradingIndices
    .map((id) => ({ id, meta: allMockIndices.find((x) => x.id === id) }))
    .filter(Boolean)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Trader Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={trader.avatar || getAvatarUrl(trader.ens || trader.address || trader.id)}
              alt="avatar"
            />
            <AvatarFallback>{(trader.ens || trader.address).slice(2, 4).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold text-white truncate">
                {formatAddress(trader.address, trader.ens)}
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
          <div className="flex gap-1">
            {trader.badges?.map((b, i) => (
              <span key={i} className="text-lg" aria-hidden>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 flex items-center gap-1"><Percent className="w-3 h-3" />ROI 24H</div>
              <div className={cn('text-sm font-semibold', roi24 >= 0 ? 'text-green-400' : 'text-red-400')}>
                {roi24 >= 0 ? '+' : ''}{roi24.toFixed(1)}%
              </div>
              <div className={cn('text-[11px]', pnl24 >= 0 ? 'text-green-400' : 'text-red-400')}>
                {pnl24 >= 0 ? '+$' : '-$'}{Math.abs(pnl24).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 flex items-center gap-1"><Percent className="w-3 h-3" />ROI 7D</div>
              <div className={cn('text-sm font-semibold', roi7 >= 0 ? 'text-green-400' : 'text-red-400')}>
                {roi7 >= 0 ? '+' : ''}{roi7.toFixed(1)}%
              </div>
              <div className={cn('text-[11px]', pnl7 >= 0 ? 'text-green-400' : 'text-red-400')}>
                {pnl7 >= 0 ? '+$' : '-$'}{Math.abs(pnl7).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 flex items-center gap-1"><Percent className="w-3 h-3" />ROI 30D</div>
              <div className={cn('text-sm font-semibold', roi30 >= 0 ? 'text-green-400' : 'text-red-400')}>
                {roi30 >= 0 ? '+' : ''}{roi30.toFixed(1)}%
              </div>
              <div className={cn('text-[11px]', pnl30 >= 0 ? 'text-green-400' : 'text-red-400')}>
                {pnl30 >= 0 ? '+$' : '-$'}{Math.abs(pnl30).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Win rate and totals */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 flex items-center gap-1"><Target className="w-3 h-3" />Win rate</div>
              <div className="text-sm font-semibold text-white">{trader.winRate.toFixed(1)}%</div>
              <div className="text-[11px] text-slate-400">{Math.round((trader.winRate/100) * trader.totalTrades)} wins</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400">Total PnL</div>
              <div className={cn('text-sm font-semibold', (trader.totalPnl||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                {(trader.totalPnl||0) >= 0 ? '+$' : '-$'}{Math.abs(trader.totalPnl||0).toLocaleString()}
              </div>
              <div className={cn('text-[11px]', (trader.totalPnlPercentage||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                {(trader.totalPnlPercentage||0) >= 0 ? '+' : ''}{(trader.totalPnlPercentage||0).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400">Followers</div>
              <div className="text-sm font-semibold text-white">{trader.followersCount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Indices traded */}
        <div className="mt-2">
          <div className="text-xs text-slate-400 mb-2">Active indices</div>
          <div className="flex flex-wrap gap-2">
            {indices.length === 0 && (
              <div className="text-xs text-slate-500">No recent indices</div>
            )}
            {indices.slice(0, 12).map(({ id, meta }) => (
              <Link
                key={id}
                href={`/trading?index=${id}`}
                className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs border border-slate-700 hover:border-slate-600 hover:text-white"
              >
                {meta?.symbol || id.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* Copy trading UI disabled for now */}

        {/* Footer actions */}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            className="bg-brand text-black hover:bg-brand-hover"
            onClick={() => {
              window.location.href = `/traders/${trader.id}`
            }}
          >
            View Portfolio
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TraderDetailsModal
