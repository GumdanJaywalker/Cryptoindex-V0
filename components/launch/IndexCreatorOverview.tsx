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

  // Mock earnings — placeholder until backend wires in creator & LP revenue
  const creatorFeeBps = 20 // 0.20% as placeholder
  const accruedCreatorUsd = 0
  const monthlyCreatorUsd = 0

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

          {data.basics.thumbnail && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-2">
              <div className="md:col-span-1">
                <div className="text-xs text-slate-400 mb-1">Thumbnail</div>
                <div className="w-full aspect-square rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.basics.thumbnail} alt="index thumbnail" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-2 text-xs text-slate-500">
                썸네일은 인덱스 카드/리스트에 사용됩니다. 저작권·상표에 유의해 주세요.
              </div>
            </div>
          )}

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
        <CardContent className="p-6 space-y-4">
          <div className="text-lg font-semibold text-white">Earnings</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded border border-slate-700 bg-slate-800/30">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-300 font-medium">Creator Fee</div>
                <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">{creatorFeeBps} bps</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Accrued</div>
                  <div className="text-xl font-bold text-white">${accruedCreatorUsd.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Projected (30d)</div>
                  <div className="text-xl font-bold text-white">${monthlyCreatorUsd.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Mock values — connect spreadsheet/API later. LP fee details are shown in Portfolio.</div>
        </CardContent>
      </Card>
    </div>
  )
}
