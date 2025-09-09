'use client'

import type { Proposal } from '@/lib/types/governance'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/notifications/toast-system'
import { useGovernance } from '@/hooks/use-governance'
import { getActionInfo } from '@/hooks/use-governance'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const router = useRouter()
  const { addToast } = useToast()
  const { quorumReached, supportPercent, passReached, timeLeft } = useGovernance()
  const participated = proposal.tally.forPower + proposal.tally.againstPower + proposal.tally.abstainPower
  const quorumPct = proposal.tally.totalSnapshotPower > 0 ? (participated / proposal.tally.totalSnapshotPower) * 100 : 0
  const support = supportPercent(proposal)
  const pass = passReached(proposal)
  const tl = timeLeft(proposal)
  const readyToQueue = proposal.phase === 'active' && pass && quorumReached(proposal)
  const votesCast = proposal.tally.forPower + proposal.tally.againstPower + proposal.tally.abstainPower
  const forPct = votesCast > 0 ? (proposal.tally.forPower / votesCast) * 100 : 0
  const againstPct = votesCast > 0 ? (proposal.tally.againstPower / votesCast) * 100 : 0
  const castPct = proposal.tally.totalSnapshotPower > 0 ? (votesCast / proposal.tally.totalSnapshotPower) * 100 : 0
  // Periodic tick to refresh countdown/severity on the card
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  const endsMs = proposal.endsAt ? proposal.endsAt - Date.now() : null
  const timeSeverity: 'none' | 'soon' | 'imminent' | 'critical' = proposal.phase === 'active' && endsMs !== null
    ? (endsMs <= 1 * 3_600_000 ? 'critical' : endsMs <= 6 * 3_600_000 ? 'imminent' : endsMs <= 24 * 3_600_000 ? 'soon' : 'none')
    : 'none'

  // Snapshot labeling removed (single method in MVP)

  const phaseBadge = (() => {
    const phase = proposal.phase
    const cmap: Record<string, string> = {
      active: 'text-green-400 border-green-400/30',
      'ending-soon': 'text-red-400 border-red-400/30',
      queued: 'text-yellow-400 border-yellow-400/30',
      timelocked: 'text-yellow-400 border-yellow-400/30',
      'awaiting-multisig': 'text-blue-400 border-blue-400/30',
      executed: 'text-slate-300 border-slate-600',
      pending: 'text-slate-300 border-slate-600',
      succeeded: 'text-green-400 border-green-400/30',
      defeated: 'text-red-400 border-red-400/30',
      canceled: 'text-slate-400 border-slate-600',
    }
    return cmap[phase] || 'text-slate-300 border-slate-600'
  })()

  const actionInfo = () => getActionInfo(proposal)

  return (
    <Card
      className="bg-slate-900/50 border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
      onClick={() => router.push(`/governance/${proposal.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`Open proposal ${proposal.title}`}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">{proposal.indexSymbol || '—'}</div>
            <div className="text-lg font-semibold text-white flex items-center gap-2">
              {proposal.title}
              <Badge variant="outline" className="text-[10px] text-slate-300 border-slate-600">Snapshot: Time‑Weighted</Badge>
            </div>
            {proposal.description && (
              <div className="text-sm text-slate-400 mt-1">{proposal.description}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('text-xs', phaseBadge)}>
              {proposal.phase}
            </Badge>
            {readyToQueue && (
              <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                Queued soon
              </Badge>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Quorum</div>
            <Progress value={Math.min(100, quorumPct)} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">
              {quorumPct.toFixed(1)}% / target {proposal.config.quorumPercent}%
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1">Support</div>
            <Progress value={Math.min(100, support)} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">
              {support.toFixed(1)}% / pass {proposal.config.passThresholdPercent}% {pass ? '✓' : ''}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1">Time</div>
            <div className={cn(
              'text-sm',
              timeSeverity === 'critical' ? 'text-red-500' : timeSeverity === 'imminent' ? 'text-red-400' : timeSeverity === 'soon' ? 'text-yellow-400' : 'text-white'
            )}>
              {proposal.phase === 'active' ? (tl || '—') : proposal.phase}
            </div>
          </div>
        </div>

        {/* Compact Vote Summary */}
        <div className="text-xs text-slate-300">
          {votesCast > 0 ? (
            <span>
              For {forPct.toFixed(1)}% · Against {againstPct.toFixed(1)}% ·
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1 underline-offset-2 hover:underline cursor-default">
                      Cast {castPct.toFixed(1)}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {votesCast.toLocaleString()} / {proposal.tally.totalSnapshotPower.toLocaleString()} snapshot power
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          ) : (
            <span>No votes cast yet</span>
          )}
        </div>

        {/* Changes */}
        {proposal.changes && proposal.changes.length > 0 && (
          <div>
            <div className="text-xs text-slate-400 mb-2">Proposed Changes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {proposal.changes.map((c, i) => (
                <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{c.type.toUpperCase()} {c.symbol}</div>
                    {(c.currentPct !== undefined || c.proposedPct !== undefined) && (
                      <div className="text-slate-300 text-sm">
                        {c.currentPct ?? '—'}% → {c.proposedPct ?? '—'}%
                      </div>
                    )}
                  </div>
                  {c.rationale && (
                    <div className="text-xs text-slate-400 mt-1">{c.rationale}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {(() => {
            const a = actionInfo()
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        // Standardized toast for disabled actions
                        addToast({
                          type: 'info',
                          title: a.label,
                          description: a.reason,
                          duration: 5000,
                        })
                      }}
                    >
                      <Button
                        className={cn(
                          a.label.startsWith('Vote') || a.label.startsWith('Sign') ? 'bg-brand text-black hover:bg-brand-hover' : '',
                          a.label === 'Execute' ? '' : ''
                        )}
                        variant={a.label === 'Execute' || a.label === 'View' ? 'outline' : 'default'}
                        disabled={a.disabled}
                      >
                        {a.label}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{a.reason}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })()}
          {proposal.config.multisig && (
            <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
              Operator signatures {proposal.multisig?.signed.length ?? 0}/4 required
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
