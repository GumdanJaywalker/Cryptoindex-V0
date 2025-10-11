'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/lib/hooks/useCurrency'

type Timeframe = '24h' | '7d' | '30d' | 'all'

interface CreatorIndexEarning {
  index: string
  tvl: number
  volume24h: number
  creatorFeeRate: number // 0.005 = 0.5%
  earnings24h: number
  earnings7d: number
  earnings30d: number
  earningsTotal: number
}

interface PayoutRow {
  id: string
  date: string
  index: string
  amount: number
  status: 'Pending' | 'Paid'
}

// simple mock for UI scaffolding
const mockPerIndex: CreatorIndexEarning[] = [
  { index: 'MEME_INDEX', tvl: 120_000_000, volume24h: 8_200_000, creatorFeeRate: 0.0025, earnings24h: 4200, earnings7d: 28700, earnings30d: 112_400, earningsTotal: 392_800 },
  { index: 'AI_INDEX', tvl: 64_000_000, volume24h: 4_100_000, creatorFeeRate: 0.0025, earnings24h: 2050, earnings7d: 13_400, earnings30d: 50_900, earningsTotal: 166_200 },
  { index: 'DOG_INDEX', tvl: 38_000_000, volume24h: 2_600_000, creatorFeeRate: 0.0025, earnings24h: 1300, earnings7d: 9_100, earnings30d: 34_000, earningsTotal: 98_500 },
]

const mockPayouts: PayoutRow[] = [
  { id: 'p_001', date: '2025-09-01', index: 'MEME_INDEX', amount: 25000, status: 'Paid' },
  { id: 'p_002', date: '2025-09-05', index: 'AI_INDEX', amount: 10200, status: 'Pending' },
]

export function CreatorEarnings() {
  const [tf, setTf] = useState<Timeframe>('7d')
  const { formatBalance } = useCurrency()

  const summary = useMemo(() => {
    const sum = (k: keyof CreatorIndexEarning) => mockPerIndex.reduce((a, b) => a + (b[k] as number), 0)
    return {
      total: sum('earningsTotal'),
      d24: sum('earnings24h'),
      d7: sum('earnings7d'),
      d30: sum('earnings30d'),
      pending: mockPayouts.filter(p => p.status === 'Pending').reduce((a,b)=>a+b.amount,0),
      paid: mockPayouts.filter(p => p.status === 'Paid').reduce((a,b)=>a+b.amount,0)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Creator Earnings</h2>
        <div className="flex items-center gap-2">
          {(['24h','7d','30d','all'] as Timeframe[]).map(x=> (
            <Button key={x} size="sm" variant={tf===x?'default':'ghost'} className={cn('h-8 text-xs', tf===x?'bg-brand text-black hover:bg-brand-hover':'hover:bg-slate-800')} onClick={()=>setTf(x)}>{x.toUpperCase()}</Button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Total Creator Fees</div>
          <div className="text-lg font-semibold">{formatBalance(summary.total)}</div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">{tf==='24h'?'24H': tf==='7d'?'7D': tf==='30d'?'30D':'Pending'}</div>
          <div className="text-lg font-semibold">{tf==='all'? formatBalance(summary.pending): tf==='24h'? formatBalance(summary.d24): tf==='7d'? formatBalance(summary.d7): formatBalance(summary.d30)}</div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Paid to Date</div>
          <div className="text-lg font-semibold">{formatBalance(summary.paid)}</div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Pending Payouts</div>
          <div className="text-lg font-semibold">{formatBalance(summary.pending)}</div>
        </CardContent></Card>
      </div>

      {/* Breakdown (Creator vs LP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Creator Fee (index token fees share)</div>
          <div className="text-lg font-semibold">{formatBalance(Math.round(summary.total * 0.6))}</div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">LP Fee (liquidity pool trading fees)</div>
          <div className="text-lg font-semibold">{formatBalance(Math.round(summary.total * 0.4))}</div>
        </CardContent></Card>
      </div>

      {/* Per-index table */}
      <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-8 px-4 py-2 text-xs text-slate-400">
          <div>Index</div>
          <div className="text-right">TVL</div>
          <div className="text-right">24H Vol</div>
          <div className="text-right">Fee Rate</div>
          <div className="text-right">24H</div>
          <div className="text-right">7D</div>
          <div className="text-right">30D</div>
          <div className="text-right">Total</div>
        </div>
        <div className="divide-y divide-slate-800">
          {mockPerIndex.map((r) => (
            <div key={r.index} className="grid grid-cols-8 px-4 py-2 items-center text-sm">
              <div className="text-white">{r.index}</div>
              <div className="text-right text-slate-300">{formatBalance(r.tvl)}</div>
              <div className="text-right text-slate-300">{formatBalance(r.volume24h)}</div>
              <div className="text-right text-slate-300">{(r.creatorFeeRate*100).toFixed(2)}%</div>
              <div className="text-right text-slate-300">{formatBalance(r.earnings24h)}</div>
              <div className="text-right text-slate-300">{formatBalance(r.earnings7d)}</div>
              <div className="text-right text-slate-300">{formatBalance(r.earnings30d)}</div>
              <div className="text-right text-slate-300">{formatBalance(r.earningsTotal)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payouts */}
      <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-4 py-2 text-xs text-slate-400">Payouts</div>
        <div className="divide-y divide-slate-800">
          {mockPayouts.map(p => (
            <div key={p.id} className="grid grid-cols-5 px-4 py-2 items-center text-sm">
              <div className="text-slate-300">{p.date}</div>
              <div className="text-slate-300">{p.index}</div>
              <div className="text-slate-300">{formatBalance(p.amount)}</div>
              <div className=""><Badge variant="outline" className={cn('text-xs', p.status==='Paid'?'text-green-400 border-green-400/30':'text-yellow-400 border-yellow-400/30')}>{p.status}</Badge></div>
              <div className="text-right text-slate-500">—</div>
            </div>
          ))}
        </div>
        {/* Policy note removed to align with open referrals */}
      </div>
    </div>
  )
}
