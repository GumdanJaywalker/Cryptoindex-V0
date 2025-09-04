'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useIndexBuilder } from '@/hooks/use-index-builder'

function parseRaw(raw: string): Array<{ symbol: string; weight: number }> {
  return raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [s, w] = p.split(':').map((x) => x.trim())
      return { symbol: (s || '').toUpperCase(), weight: Number(w) || 0 }
    })
}

export function IndexCreatorOverview() {
  const { data } = useIndexBuilder()
  const items = useMemo(() => parseRaw(data.constituents.raw), [data.constituents.raw])
  const total = items.reduce((s, i) => s + (Number.isFinite(i.weight) ? i.weight : 0), 0)

  // Mock earnings — placeholder until backend wires in creator revenue
  const creatorFeeBps = 20 // 0.20% as placeholder
  const accruedUsd = 0 // until connected to API
  const monthlyEstUsd = 0

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-xl font-bold text-white">My Index Overview</h2>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Draft</div>
              <div className="text-lg font-semibold text-white">
                {data.basics.name || 'Untitled'} ({data.basics.symbol || '—'})
              </div>
            </div>
            <Badge variant="outline" className="text-blue-300 border-blue-400/30">L3-based</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Chain / Settlement</div>
              <div className="text-sm text-white">{data.chain.chain || '—'} / {data.chain.settlementToken || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Constituents (Total {total.toFixed(2)}%)</div>
              <div className="text-sm text-white truncate">
                {items.length > 0 ? items.map((i) => `${i.symbol} ${i.weight}%`).join(', ') : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Rules</div>
              <div className="text-sm text-white">Max per asset {data.rules.maxPerAsset || '—'}% · Min liq ${data.rules.minLiquidity || '—'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-white">Creator Earnings</div>
            <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
              Fee share {creatorFeeBps} bps
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Accrued</div>
              <div className="text-2xl font-bold text-white">${accruedUsd.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Projected (30d)</div>
              <div className="text-2xl font-bold text-white">${monthlyEstUsd.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Status</div>
              <div className="text-sm text-slate-300">Pending governance review</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Earnings data will appear after your index is approved and live.</div>
        </CardContent>
      </Card>
    </div>
  )
}

