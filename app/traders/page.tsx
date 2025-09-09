'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Crown, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { TopTrader, TraderFilter, TraderSort } from '@/lib/types/index-trading'
import { mockTopTraders, allMockIndices } from '@/lib/data/mock-indices'
import { cn } from '@/lib/utils'

type Timeframe = '24h' | '7d' | '30d'

const timeframeOptions: Timeframe[] = ['24h', '7d', '30d']
const filterOptions: { key: TraderFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'top-gainers', label: 'Top gainers' },
  { key: 'high-winrate', label: 'High win rate' },
  { key: 'new-traders', label: 'New' },
  { key: 'most-followed', label: 'Most followed' },
]
const sortOptions: { key: TraderSort; label: string }[] = [
  { key: 'pnl', label: 'ROI' },
  { key: 'winrate', label: 'Win rate' },
  { key: 'followers', label: 'Followers' },
  { key: 'trades', label: 'Trades' },
  { key: 'rank', label: 'Rank' },
]

export default function TradersPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('7d')
  const [filter, setFilter] = useState<TraderFilter>('all')
  const [sortBy, setSortBy] = useState<TraderSort>('pnl')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 30

  useEffect(() => { setPage(1) }, [timeframe, filter, q])

  const formatPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

  const data = useMemo(() => {
    let arr: TopTrader[] = [...mockTopTraders]
    // filter
    if (filter === 'top-gainers') {
      const field = timeframe === '24h' ? 'pnlPercentage24h' : timeframe === '7d' ? 'pnlPercentage7d' : 'pnlPercentage30d'
      arr = arr.filter((t) => (t as any)[field] > 0)
    } else if (filter === 'high-winrate') arr = arr.filter((t) => t.winRate > 70)
    else if (filter === 'new-traders') arr = arr.filter((t) => t.isNewTrader)
    // search
    if (q.trim()) {
      const qq = q.trim().toLowerCase()
      arr = arr.filter((t) => (t.ens?.toLowerCase().includes(qq) || t.address.toLowerCase().includes(qq)))
    }
    // sort
    arr.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'pnl') {
        const fa = timeframe === '24h' ? a.pnlPercentage24h : timeframe === '7d' ? a.pnlPercentage7d : a.pnlPercentage30d
        const fb = timeframe === '24h' ? b.pnlPercentage24h : timeframe === '7d' ? b.pnlPercentage7d : b.pnlPercentage30d
        cmp = (fa || 0) - (fb || 0)
      } else if (sortBy === 'winrate') cmp = a.winRate - b.winRate
      else if (sortBy === 'followers') cmp = a.followersCount - b.followersCount
      else if (sortBy === 'trades') cmp = a.totalTrades - b.totalTrades
      else cmp = a.rank - b.rank
      return sortDir === 'desc' ? -cmp : cmp
    })
    return arr
  }, [timeframe, filter, sortBy, sortDir, q])

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const pageData = data.slice((page - 1) * pageSize, page * pageSize)
  const podium = page === 1 ? pageData.slice(0, 3) : []
  const tableRows = page === 1 ? pageData.slice(3) : pageData

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500"/> Traders Leaderboard</h1>
            <p className="text-slate-400 text-sm mt-1">Scan top performers and discover creators worth following.</p>
          </div>
          <Link href="/" className="text-slate-300 hover:text-white text-sm">Back to Home</Link>
        </div>

        {/* Controls */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1 text-xs text-slate-400 mr-2"><Filter className="w-3 h-3"/>Timeframe:</div>
              {timeframeOptions.map(tf => (
                <Button key={tf} size="sm" variant={tf === timeframe ? 'default' : 'ghost'} className={cn('h-8 text-xs', tf===timeframe? 'bg-brand text-black hover:bg-brand-hover': 'hover:bg-slate-800')} onClick={()=>setTimeframe(tf)}>{tf.toUpperCase()}</Button>
              ))}
              <div className="mx-2 h-6 w-px bg-slate-800"/>
              {filterOptions.map(f => (
                <Button key={f.key} size="sm" variant={filter === f.key ? 'default' : 'outline'} className={cn('h-8 text-xs', filter===f.key? 'bg-brand text-black hover:bg-brand-hover': 'border-slate-700 text-slate-300 hover:bg-slate-800')} onClick={()=>setFilter(f.key)}>{f.label}</Button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <Input placeholder="Search trader…" value={q} onChange={(e)=>setQ(e.target.value)} className="h-8 bg-slate-900 border-slate-700 text-sm w-48"/>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Podium (Top 3 of current results, only on page 1) */}
        {page === 1 && podium.length > 0 && (
          <div className="space-y-3">
            {/* Top 1 centered */}
            {podium[0] && (
              <div className="flex justify-center">
                <div className="w-full xl:w-2/3 2xl:w-1/2 rounded-lg border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-colors">
                  <button className="w-full text-left" onClick={() => (window.location.href = `/portfolio?trader=${podium[0].id}`)} aria-label={`Open ${podium[0].ens || podium[0].address} portfolio`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-slate-300 ring-2 ring-brand/40">
                        {podium[0].avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={podium[0].avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{(podium[0].ens || podium[0].address).slice(2,4).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-white font-semibold">{podium[0].ens || `${podium[0].address.slice(0,6)}...${podium[0].address.slice(-4)}`}</span>
                          <Badge variant="outline" className="text-[10px] text-yellow-300 border-yellow-400/30">🥇</Badge>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className={cn('text-lg font-bold', (podium[0].pnl24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>${Math.abs(podium[0].pnl24h||0).toLocaleString()}</span>
                          <span className={cn('text-xs', (podium[0].pnlPercentage24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                            ({(podium[0].pnlPercentage24h||0) >= 0 ? '+' : ''}{(podium[0].pnlPercentage24h||0).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {podium[0].tradingIndices.slice(0,3).map(idxId => {
                            const m = allMockIndices.find(x => x.id === idxId)
                            const label = m?.symbol || idxId.toUpperCase()
                            return (
                              <Link key={idxId} href={`/trading?index=${idxId}`} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700 hover:border-slate-600 hover:text-white" onClick={(e)=>e.stopPropagation()}>
                                {label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {/* 2 and 3 side-by-side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {podium.slice(1,3).map((t, i) => (
                <div key={t.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 transition-colors">
                  <button className="w-full text-left" onClick={() => (window.location.href = `/portfolio?trader=${t.id}`)} aria-label={`Open ${t.ens || t.address} portfolio`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-slate-300">
                        {t.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{(t.ens || t.address).slice(2,4).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-white font-medium">{t.ens || `${t.address.slice(0,6)}...${t.address.slice(-4)}`}</span>
                          <Badge variant="outline" className="text-[10px] text-slate-300 border-slate-600">{i===0 ? '🥈' : '🥉'}</Badge>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className={cn('text-base font-semibold', (t.pnl24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>${Math.abs(t.pnl24h||0).toLocaleString()}</span>
                          <span className={cn('text-xs', (t.pnlPercentage24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                            ({(t.pnlPercentage24h||0) >= 0 ? '+' : ''}{(t.pnlPercentage24h||0).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.tradingIndices.slice(0,3).map(idxId => {
                            const m = allMockIndices.find(x => x.id === idxId)
                            const label = m?.symbol || idxId.toUpperCase()
                            return (
                              <Link key={idxId} href={`/trading?index=${idxId}`} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700 hover:border-slate-600 hover:text-white" onClick={(e)=>e.stopPropagation()}>
                                {label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rich rows list */}
        <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {tableRows.map((t, i) => {
              const displayRank = page === 1 ? (i + 4) : (i + 1)
              const roi = timeframe === '24h' ? (t.pnlPercentage24h||0) : timeframe === '7d' ? (t.pnlPercentage7d||0) : (t.pnlPercentage30d||0)
              const pnlUSD = timeframe === '24h' ? (t.pnl24h||0) : timeframe === '7d' ? (t.pnl7d||0) : (t.pnl30d||0)
              return (
                <div key={t.id} className="px-4 py-3">
                  {/* Line 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-slate-500">{displayRank}</div>
                    <button
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      onClick={()=> (window.location.href = `/portfolio?trader=${t.id}`)}
                      aria-label={`Open ${t.ens || t.address} portfolio`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-slate-300">
                        {t.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{(t.ens || t.address).slice(2,4).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="truncate text-white font-medium">{t.ens || `${t.address.slice(0,6)}...${t.address.slice(-4)}`}</span>
                    </button>
                    <div className="ml-auto flex items-baseline gap-2">
                      <span className={cn('text-sm font-semibold', pnlUSD >= 0 ? 'text-green-400' : 'text-red-400')}>${Math.abs(pnlUSD).toLocaleString()}</span>
                      <span className={cn('text-xs', roi >= 0 ? 'text-green-400' : 'text-red-400')}>
                        ({roi >= 0 ? '+' : ''}{roi.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  {/* Line 2 */}
                  <div className="mt-2 pl-9 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {t.tradingIndices.slice(0,2).map(idxId => {
                        const m = allMockIndices.find(x => x.id === idxId)
                        const label = m?.symbol || idxId.toUpperCase()
                        return (
                          <Link key={idxId} href={`/trading?index=${idxId}`} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700 hover:border-slate-600 hover:text-white" onClick={(e)=>e.stopPropagation()}>
                            {label}
                          </Link>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <span>Win {Math.round(t.winRate)}%</span>
                      <span>{t.followersCount.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {pageData.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-400">No traders found</div>
            )}
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-400">
            <div>Page {page} / {totalPages}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 border-slate-700" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft className="w-4 h-4"/></Button>
              <Button size="sm" variant="outline" className="h-8 border-slate-700" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}><ChevronRight className="w-4 h-4"/></Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500">Past performance is not indicative of future results.</p>
      </div>
    </div>
  )
}
