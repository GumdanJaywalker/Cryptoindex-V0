'use client'

import { useEffect, useMemo, useState } from 'react'
import { useGovernance } from '@/hooks/use-governance'
import { ProposalCard } from './ProposalCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function ProposalsSection() {
  const { proposals, loading, error, load } = useGovernance()
  const [filter, setFilter] = useState<'all' | 'active' | 'ending-soon' | 'queued' | 'awaiting-multisig' | 'executed'>('all')

  useEffect(() => {
    if (proposals.length === 0 && !loading) load()
  }, [proposals.length, loading, load])

  const items = useMemo(() => {
    let list = proposals.filter(p => p.type === 'rebalancing')
    if (filter === 'active') list = list.filter(p => p.phase === 'active')
    if (filter === 'queued') list = list.filter(p => p.phase === 'queued' || p.phase === 'timelocked')
    if (filter === 'awaiting-multisig') list = list.filter(p => p.phase === 'awaiting-multisig')
    if (filter === 'executed') list = list.filter(p => p.phase === 'executed')
    if (filter === 'ending-soon') {
      const within = 8 * 3600_000
      const now = Date.now()
      list = list.filter(p => p.phase === 'active' && p.endsAt && (p.endsAt - now) <= within)
    }
    return list
  }, [proposals, filter])

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
          >
            {label}
          </Button>
        ))}
        <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
          {items.length} proposals
        </Badge>
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
