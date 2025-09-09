'use client'

import { useEffect, useMemo, useState } from 'react'
import { useGovernance } from '@/hooks/use-governance'
import { ProposalCard } from './ProposalCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export function ProposalsSection() {
  const { proposals, loading, error, load } = useGovernance()
  const [filter, setFilter] = useState<'all' | 'active' | 'ending-soon' | 'queued' | 'awaiting-multisig' | 'executed'>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (proposals.length === 0 && !loading) load()
  }, [proposals.length, loading, load])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = proposals.filter(p => p.type === 'rebalancing')
      .filter(p => q === '' || (p.title.toLowerCase().includes(q) || (p.indexSymbol || '').toLowerCase().includes(q)))
    if (filter === 'active') list = list.filter(p => p.phase === 'active')
    if (filter === 'queued') list = list.filter(p => p.phase === 'queued' || p.phase === 'timelocked')
    if (filter === 'awaiting-multisig') list = list.filter(p => p.phase === 'awaiting-multisig')
    if (filter === 'executed') list = list.filter(p => p.phase === 'executed')
    if (filter === 'ending-soon') {
      const within = 8 * 3600_000
      const now = Date.now()
      list = list.filter(p => p.phase === 'active' && p.endsAt && (p.endsAt - now) <= within)
    }
    // Sort: active by nearest end time asc, others by createdAt desc
    list = list.slice().sort((a, b) => {
      const phaseOrder = (ph: string) => (ph === 'active' ? 0 : ph === 'queued' || ph === 'timelocked' ? 1 : ph === 'awaiting-multisig' ? 2 : ph === 'executed' ? 3 : 4)
      const pa = phaseOrder(a.phase)
      const pb = phaseOrder(b.phase)
      if (pa !== pb) return pa - pb
      if (a.phase === 'active' && b.phase === 'active') {
        const ea = a.endsAt ?? Infinity
        const eb = b.endsAt ?? Infinity
        return ea - eb
      }
      return (b.createdAt || 0) - (a.createdAt || 0)
    })
    return list
  }, [proposals, filter, query])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            ['all', 'All'],
            ['active', 'Active'],
            ['ending-soon', 'Ending Soon'],
            ['queued', 'Queued'],
            ['awaiting-multisig', 'Awaiting Multisig'],
            ['executed', 'Executed'],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? 'default' : 'outline'}
            className={cn(
              'text-xs',
              filter === key ? 'bg-brand text-black hover:bg-brand-hover' : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            )}
            onClick={() => setFilter(key)}
            title={
              key === 'active' ? 'Open for voting' :
              key === 'ending-soon' ? 'Ends within 8 hours' :
              key === 'queued' ? 'Queued or in timelock' :
              key === 'awaiting-multisig' ? 'Operator signatures 4/4 required' :
              key === 'executed' ? 'Already executed' : 'All proposals'
            }
          >
            {label}
          </Button>
        ))}
        <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
          {items.length} proposals
        </Badge>
        <Input
          placeholder="Search title or index symbol"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 w-56 text-xs"
        />
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={() => load()}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {loading && <div className="text-slate-400 text-sm">Loading proposals…</div>}
      {error && (
        <div className="text-red-400 text-sm flex items-center gap-3">
          <span>{error}</span>
          <Button size="sm" variant="outline" className="text-xs border-red-400/40 text-red-300 hover:bg-red-500/10" onClick={() => load()}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-slate-400 p-4 bg-slate-900/50 border border-slate-800 rounded">
          <div className="mb-2">No proposals match the current filter.</div>
          <Button size="sm" variant="outline" className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setFilter('all')}>
            Clear filters
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {items.map(p => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
      </div>
    </div>
  )
}
