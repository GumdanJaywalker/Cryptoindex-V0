'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { assetsCatalog, type AssetMeta } from '@/lib/mock/assets'
import { globalBlacklist } from '@/lib/mock/blacklist'

type Asset = AssetMeta

function parseRaw(raw: string): Record<string, number> {
  const out: Record<string, number> = {}
  raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((p) => {
      const [s, w] = p.split(':').map((x) => x.trim())
      const weight = Number(w)
      if (s && Number.isFinite(weight)) out[s.toUpperCase()] = weight
    })
  return out
}

function formatRaw(map: Record<string, number>): string {
  return Object.entries(map)
    .map(([s, w]) => `${s}:${Number(w.toFixed(4))}`)
    .join(', ')
}

export function AssetPicker({
  value,
  onChange,
  minLiquidity = 0,
  blacklist = [],
  catalog = assetsCatalog,
}: {
  value: string
  onChange: (raw: string) => void
  minLiquidity?: number
  blacklist?: string[]
  catalog?: Asset[]
}) {
  const selected = useMemo(() => parseRaw(value), [value])
  const selectedCount = Object.keys(selected).length
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'liquidity' | 'symbol' | 'vol-1w' | 'vol-1m' | 'vol-1y' | 'ret-1w' | 'ret-1m' | 'ret-1y'>('vol-1m')
  const [hideLowLiquidity, setHideLowLiquidity] = useState(false)
  const [excludeBlacklisted, setExcludeBlacklisted] = useState(false)
  const [positiveReturnOnly, setPositiveReturnOnly] = useState(false)
  const [okHint, setOkHint] = useState<null | string>(null)
  const [selectedOnly, setSelectedOnly] = useState(false)
  const globalBL = useMemo(() => new Map(globalBlacklist.map((e) => [e.symbol.toUpperCase(), e.reason])), [])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  // Virtual grid windowing state
  const EST_ROW_HEIGHT = 140
  const [rowHeight] = useState(EST_ROW_HEIGHT)
  const [columns, setColumns] = useState(3)
  const [range, setRange] = useState({ start: 0, end: 30 })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = catalog.filter((a) =>
      a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    )
    let list = base
    if (hideLowLiquidity) {
      list = list.filter((a) => a.liquidityUsd >= minLiquidity)
    }
    if (excludeBlacklisted) {
      const set = new Set([
        ...blacklist.map((b) => b.toUpperCase()),
        ...globalBlacklist.map((e) => e.symbol.toUpperCase()),
      ])
      list = list.filter((a) => !set.has(a.symbol.toUpperCase()))
    }
    if (positiveReturnOnly) {
      list = list.filter((a) => {
        if (sort === 'ret-1w') return a.ret1wPct > 0
        if (sort === 'ret-1m') return a.ret1mPct > 0
        if (sort === 'ret-1y') return a.ret1yPct > 0
        // default to 1m return as heuristic
        return a.ret1mPct > 0
      })
    }
    if (selectedOnly) {
      const sel = new Set(Object.keys(selected).map((s) => s.toUpperCase()))
      list = list.filter((a) => sel.has(a.symbol.toUpperCase()))
    }
    const sorted = list.slice()
    switch (sort) {
      case 'liquidity':
        sorted.sort((a, b) => b.liquidityUsd - a.liquidityUsd); break
      case 'symbol':
        sorted.sort((a, b) => a.symbol.localeCompare(b.symbol)); break
      case 'vol-1w':
        sorted.sort((a, b) => b.vol1wUsd - a.vol1wUsd); break
      case 'vol-1m':
        sorted.sort((a, b) => b.vol1mUsd - a.vol1mUsd); break
      case 'vol-1y':
        sorted.sort((a, b) => b.vol1yUsd - a.vol1yUsd); break
      case 'ret-1w':
        sorted.sort((a, b) => b.ret1wPct - a.ret1wPct); break
      case 'ret-1m':
        sorted.sort((a, b) => b.ret1mPct - a.ret1mPct); break
      case 'ret-1y':
        sorted.sort((a, b) => b.ret1yPct - a.ret1yPct); break
    }
    return sorted
  }, [query, catalog, sort, hideLowLiquidity, excludeBlacklisted, positiveReturnOnly, selectedOnly, selected, minLiquidity, blacklist])

  // Approximate columns based on container width (Tailwind breakpoints)
  useEffect(() => {
    const calc = () => {
      const w = scrollRef.current?.clientWidth || window.innerWidth
      if (w >= 1024) setColumns(3)
      else if (w >= 768) setColumns(2)
      else setColumns(1)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

useEffect(() => {
  // Reset scroll and visible range when filters change
  if (scrollRef.current) scrollRef.current.scrollTop = 0
  setRange({ start: 0, end: 30 })
}, [query, sort, hideLowLiquidity, excludeBlacklisted, positiveReturnOnly, selectedOnly])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const overscan = 5
    const totalRows = Math.ceil(filtered.length / Math.max(columns, 1))
    const startRow = Math.max(0, Math.floor(el.scrollTop / rowHeight) - overscan)
    const endRow = Math.min(totalRows - 1, Math.ceil((el.scrollTop + el.clientHeight) / rowHeight) + overscan)
    setRange({ start: startRow, end: endRow })
  }

  const toggle = (sym: string) => {
    const key = sym.toUpperCase()
    const next = { ...selected }
    if (key in next) {
      delete next[key]
    } else {
      next[key] = 0
    }
    onChange(formatRaw(next))
  }

  const distributeEqual = () => {
    const keys = Object.keys(selected)
    if (keys.length === 0) return
    const even = Number((100 / keys.length).toFixed(4))
    const next: Record<string, number> = {}
    let acc = 0
    keys.forEach((k, i) => {
      if (i === keys.length - 1) next[k] = Number((100 - acc).toFixed(4))
      else {
        next[k] = even
        acc += even
      }
    })
    onChange(formatRaw(next))
    setOkHint('All set ✓')
    setTimeout(() => setOkHint(null), 1500)
  }

  const total = Object.values(selected).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  const totalOk = Math.abs(total - 100) < 0.01

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Search assets"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sort} onValueChange={(v) => setSort(v as any)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vol-1w">Sort: Volume 1w (desc)</SelectItem>
            <SelectItem value="vol-1m">Sort: Volume 1m (desc)</SelectItem>
            <SelectItem value="vol-1y">Sort: Volume 1y (desc)</SelectItem>
            <SelectItem value="ret-1w">Sort: Return 1w (desc)</SelectItem>
            <SelectItem value="ret-1m">Sort: Return 1m (desc)</SelectItem>
            <SelectItem value="ret-1y">Sort: Return 1y (desc)</SelectItem>
            <SelectItem value="liquidity">Sort: Liquidity (desc)</SelectItem>
            <SelectItem value="symbol">Sort: Symbol (A–Z)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 px-2 py-1 rounded border border-slate-700 bg-slate-900/50">
          <Switch checked={hideLowLiquidity} onCheckedChange={(v) => setHideLowLiquidity(!!v)} />
          <span className="text-xs text-slate-300">Hide low liq (&lt; ${minLiquidity.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded border border-slate-700 bg-slate-900/50">
          <Switch checked={excludeBlacklisted} onCheckedChange={(v) => setExcludeBlacklisted(!!v)} />
          <span className="text-xs text-slate-300">Exclude blacklisted</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded border border-slate-700 bg-slate-900/50">
          <Switch checked={positiveReturnOnly} onCheckedChange={(v) => setPositiveReturnOnly(!!v)} />
          <span className="text-xs text-slate-300">Positive return only</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded border border-slate-700 bg-slate-900/50">
          <Switch checked={selectedOnly} onCheckedChange={(v) => setSelectedOnly(!!v)} />
          <span className="text-xs text-slate-300">Selected only</span>
        </div>
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={distributeEqual}
          disabled={Object.keys(selected).length === 0}
        >
          Distribute equally
        </Button>
        <Badge
          variant="outline"
          className={cn(
            'text-xs',
            totalOk ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
          )}
        >
          Total {total.toFixed(2)}%
        </Badge>
        <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
          Selected {selectedCount}
        </Badge>
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={() => onChange('')}
          disabled={selectedCount === 0}
        >
          Clear all
        </Button>
        {okHint && (
          <span className="text-xs text-green-400">{okHint}</span>
        )}
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="max-h-96 overflow-y-auto pr-1">
        {(() => {
          const cols = Math.max(columns, 1)
          const totalRows = Math.ceil(filtered.length / cols)
          const start = Math.max(0, Math.min(range.start, totalRows - 1))
          const end = Math.max(start, Math.min(range.end, totalRows - 1))
          const topSpacer = start * rowHeight
          const bottomSpacer = Math.max(0, (totalRows - end - 1) * rowHeight)
          const rows: JSX.Element[] = []
          for (let r = start; r <= end; r++) {
            const rowItems: JSX.Element[] = []
            for (let c = 0; c < cols; c++) {
              const idx = r * cols + c
              if (idx >= filtered.length) break
              const asset = filtered[idx]
              const isSelected = asset.symbol in selected
              const localBL = new Set(blacklist.map((b) => b.toUpperCase()))
              const symU = asset.symbol.toUpperCase()
              const isGloballyBlocked = globalBL.has(symU)
              const isBlacklisted = localBL.has(symU) || isGloballyBlocked
              const lowLiq = asset.liquidityUsd < minLiquidity
              rowItems.push(
                <Card
                  key={`${asset.symbol}-${idx}`}
                  className={cn(
                    'bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors',
                    isSelected && 'border-brand/40',
                    isBlacklisted && 'opacity-70'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{asset.symbol}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>{asset.name}</span>
                          {isGloballyBlocked && (
                            <span className="text-red-400" title={globalBL.get(symU) || 'Blocked by platform'}>
                              • {globalBL.get(symU) || 'Blocked'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs text-blue-300 border-blue-400/30">
                          {asset.chain}
                        </Badge>
                        {isBlacklisted && (
                          <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
                            {isGloballyBlocked ? 'Blocked' : 'Blacklisted'}
                          </Badge>
                        )}
                        {lowLiq && !isBlacklisted && (
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                            Low Liquidity
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        {sort.startsWith('vol-') && (
                          <>
                            Vol {sort.endsWith('1w') ? '(1w)' : sort.endsWith('1m') ? '(1m)' : '(1y)'} $
                            {(
                              sort === 'vol-1w' ? asset.vol1wUsd : sort === 'vol-1m' ? asset.vol1mUsd : asset.vol1yUsd
                            / 1_000_000).toFixed(1)}M
                          </>
                        )}
                        {sort.startsWith('ret-') && (
                          <span className={cn(
                            (sort === 'ret-1w' ? asset.ret1wPct : sort === 'ret-1m' ? asset.ret1mPct : asset.ret1yPct) >= 0
                              ? 'text-green-400' : 'text-red-400'
                          )}>
                            Return {sort.endsWith('1w') ? '(1w)' : sort.endsWith('1m') ? '(1m)' : '(1y)'} {
                              (sort === 'ret-1w' ? asset.ret1wPct : sort === 'ret-1m' ? asset.ret1mPct : asset.ret1yPct).toFixed(1)
                            }%
                          </span>
                        )}
                        {sort === 'liquidity' && (
                          <>Liquidity {(asset.liquidityUsd/1_000_000).toFixed(1)}M</>
                        )}
                        {sort === 'symbol' && (
                          <>Liquidity {(asset.liquidityUsd/1_000_000).toFixed(1)}M</>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className={cn('h-8 px-3', isSelected ? 'bg-slate-800 hover:bg-slate-700' : 'bg-brand text-black hover:bg-brand-hover')}
                        variant={isSelected ? 'outline' : 'default'}
                        onClick={() => toggle(asset.symbol)}
                        disabled={!isSelected && isGloballyBlocked}
                        title={!isSelected && isGloballyBlocked ? (globalBL.get(symU) || 'Blocked by platform') : undefined}
                      >
                        {isSelected ? 'Remove' : (isGloballyBlocked ? 'Blocked' : 'Add')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            rows.push(
              <div key={`row-${r}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" style={{ height: rowHeight }}>
                {rowItems}
              </div>
            )
          }
          return (
            <div style={{ height: totalRows * rowHeight }} className="relative">
              <div style={{ height: topSpacer }} />
              {rows}
              <div style={{ height: bottomSpacer }} />
            </div>
          )
        })()}
      </div>
    </div>
  )
}
