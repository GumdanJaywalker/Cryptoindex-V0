'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast, createSuccessToast } from '@/components/notifications/toast-system'

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

export function WeightTable({
  value,
  onChange,
  capPercent,
}: {
  value: string
  onChange: (raw: string) => void
  capPercent?: number
}) {
  const weights = useMemo(() => parseRaw(value), [value])
  const symbols = Object.keys(weights)
  const total = Object.values(weights).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  const totalOk = Math.abs(total - 100) < 0.01
  const overCap = capPercent ? symbols.filter((s) => weights[s] > capPercent) : []
  const [okHint, setOkHint] = useState<null | string>(null)
  const okHintTimeoutRef = useRef<number | null>(null)
  const { addToast } = useToast()

  const updateOne = (sym: string, w: number) => {
    const next = { ...weights, [sym]: Math.max(0, w) }
    onChange(formatRaw(next))
  }

  const removeOne = (sym: string) => {
    const next = { ...weights }
    delete next[sym]
    onChange(formatRaw(next))
  }

  const normalize = () => {
    const sum = Object.values(weights).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
    if (sum <= 0) return
    const next: Record<string, number> = {}
    let acc = 0
    symbols.forEach((k, i) => {
      if (i === symbols.length - 1) next[k] = Number((100 - acc).toFixed(4))
      else {
        const v = (weights[k] / sum) * 100
        const rounded = Number(v.toFixed(4))
        next[k] = rounded
        acc += rounded
      }
    })
    onChange(formatRaw(next))
    setOkHint('All set ✓')
    addToast(createSuccessToast('All set ✓', undefined, { duration: 1500 }))
    if (okHintTimeoutRef.current !== null) {
      clearTimeout(okHintTimeoutRef.current)
      okHintTimeoutRef.current = null
    }
    okHintTimeoutRef.current = window.setTimeout(() => {
      setOkHint(null)
      okHintTimeoutRef.current = null
    }, 1500)
  }

  const distributeEqual = () => {
    if (symbols.length === 0) return
    const even = Number((100 / symbols.length).toFixed(4))
    const next: Record<string, number> = {}
    let acc = 0
    symbols.forEach((k, i) => {
      if (i === symbols.length - 1) next[k] = Number((100 - acc).toFixed(4))
      else {
        next[k] = even
        acc += even
      }
    })
    onChange(formatRaw(next))
    setOkHint('All set ✓')
    addToast(createSuccessToast('All set ✓', undefined, { duration: 1500 }))
    if (okHintTimeoutRef.current !== null) {
      clearTimeout(okHintTimeoutRef.current)
      okHintTimeoutRef.current = null
    }
    okHintTimeoutRef.current = window.setTimeout(() => {
      setOkHint(null)
      okHintTimeoutRef.current = null
    }, 1500)
  }

  // Cleanup any pending hint timeout on unmount
  useEffect(() => {
    return () => {
      if (okHintTimeoutRef.current !== null) {
        clearTimeout(okHintTimeoutRef.current)
        okHintTimeoutRef.current = null
      }
    }
  }, [])

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                totalOk ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
              )}
            >
              Total {total.toFixed(2)}%
            </Badge>
            {capPercent ? (
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  overCap.length === 0 ? 'text-slate-300 border-slate-600' : 'text-yellow-400 border-yellow-400/30'
                )}
                title={overCap.length ? `Over cap: ${overCap.join(', ')}` : undefined}
              >
                Cap {capPercent}% {overCap.length ? `(over: ${overCap.length})` : ''}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {okHint && (
              <span className="text-xs text-green-400">{okHint}</span>
            )}
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={distributeEqual}
              disabled={symbols.length === 0}
            >
              Distribute equally
            </Button>
            <Button
              className="bg-brand text-black hover:bg-brand-hover"
              onClick={normalize}
              disabled={symbols.length === 0}
            >
              Normalize to 100%
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {symbols.length === 0 && (
            <div className="text-sm text-slate-400">No assets selected.</div>
          )}
          {symbols.map((sym) => (
            <div key={sym} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 relative">
              <div className="text-xs text-slate-400 mb-1 pr-6">{sym}</div>
              <button
                type="button"
                onClick={() => removeOne(sym)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
                aria-label={`Remove ${sym}`}
                title={`Remove ${sym}`}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                {(() => {
                  const others = symbols.filter((s) => s !== sym)
                  const sumOthers = others.reduce((s, k) => s + (Number.isFinite(weights[k]) ? weights[k] : 0), 0)
                  const remaining = Math.max(0, 100 - sumOthers)
                  const current = Number.isFinite(weights[sym]) ? weights[sym] : 0
                  const cap = typeof capPercent === 'number' ? capPercent : 100
                  const maxAllowed = Math.min(cap, remaining) // remaining already includes current row implicitly by excluding it
                  const maxOption = Math.floor(maxAllowed)
                  const valueStr = String(Math.min(Math.floor(current), maxOption))
                  return (
                    <Select value={valueStr} onValueChange={(v) => updateOne(sym, Number(v))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {Array.from({ length: maxOption + 1 }, (_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {i}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                })()}
              </div>
              {capPercent && weights[sym] > capPercent && (
                <div className="text-xs text-yellow-400 mt-1">Over cap {capPercent}%</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
