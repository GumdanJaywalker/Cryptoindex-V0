'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { use, useEffect, useMemo, useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { useGovernance } from '@/hooks/use-governance'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/notifications/toast-system'
import { getActionInfo } from '@/hooks/use-governance'
import { OPERATOR_ADDRESSES } from '@/lib/mock/operators'
import { cn } from '@/lib/utils'
import VoteDialog from '@/components/governance/VoteDialog'
import LeftSidebar from '@/components/sidebar/LeftSidebar'
import { Header } from '@/components/layout/Header'

export default function ProposalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { proposals, load, getById, quorumReached, supportPercent, passReached, timeLeft } = useGovernance()
  const { id } = use(params)
  const { wallets } = useWallets()
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => { if (proposals.length === 0) load() }, [proposals.length, load])
  const p = getById(id)

  // Snapshot labeling removed (single method in MVP)

  // Derive values with safe fallbacks to keep hooks order stable
  const participated = p ? (p.tally.forPower + p.tally.againstPower + p.tally.abstainPower) : 0
  const quorumPct = p && p.tally.totalSnapshotPower > 0 
    ? (participated / p.tally.totalSnapshotPower) * 100 
    : 0
  const support = p ? supportPercent(p) : 0
  const pass = p ? passReached(p) : false
  const tl = p ? timeLeft(p) : ''
  const readyToQueue = p ? (p.phase === 'active' && pass && quorumReached(p)) : false

  // Vote breakdown (of votes cast)
  const breakdown = useMemo(() => {
    if (!p) return { forPct: 0, againstPct: 0, abstainPct: 0 }
    const votes = p.tally.forPower + p.tally.againstPower + p.tally.abstainPower
    if (votes <= 0) return { forPct: 0, againstPct: 0, abstainPct: 0 }
    return {
      forPct: (p.tally.forPower / votes) * 100,
      againstPct: (p.tally.againstPower / votes) * 100,
      abstainPct: (p.tally.abstainPower / votes) * 100,
    }
  }, [p])
  const votesCast = p ? (p.tally.forPower + p.tally.againstPower + p.tally.abstainPower) : 0
  const totalSnapshot = p ? p.tally.totalSnapshotPower : 0
  const castPct = totalSnapshot > 0 ? (votesCast / totalSnapshot) * 100 : 0

  // Timelock countdown (live)
  const [countdown, setCountdown] = useState<string>(tl)
  const [severity, setSeverity] = useState<'none' | 'soon' | 'imminent' | 'critical'>('none')
  useEffect(() => {
    if (!p?.timelock?.eta) return
    const id = setInterval(() => {
      const remain = Math.max(0, (p?.timelock!.eta! ?? 0) - Date.now())
      const d = Math.floor(remain / 86_400_000)
      const h = Math.floor((remain % 86_400_000) / 3_600_000)
      const m = Math.floor((remain % 3_600_000) / 60_000)
      const s = Math.floor((remain % 60_000) / 1000)
      const text = d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`
      setCountdown(text)
      // urgency coloring
      if (remain <= 1 * 3_600_000) setSeverity('critical')
      else if (remain <= 6 * 3_600_000) setSeverity('imminent')
      else if (remain <= 24 * 3_600_000) setSeverity('soon')
      else setSeverity('none')
    }, 1000)
    return () => clearInterval(id)
  }, [p?.timelock?.eta])

  const phaseBadge = (() => {
    const cmap: Record<string, string> = {
      active: 'text-green-400 border-green-400/30',
      queued: 'text-yellow-400 border-yellow-400/30',
      timelocked: 'text-yellow-400 border-yellow-400/30',
      'awaiting-multisig': 'text-blue-400 border-blue-400/30',
      executed: 'text-slate-300 border-slate-600',
      pending: 'text-slate-300 border-slate-600',
      succeeded: 'text-green-400 border-green-400/30',
      defeated: 'text-red-400 border-red-400/30',
      canceled: 'text-slate-400 border-slate-600',
    }
    const phase = p?.phase ?? 'pending'
    return cmap[phase] || 'text-slate-300 border-slate-600'
  })()

  const myAddrs = wallets.map(w => (w.address || '').toLowerCase()).filter(Boolean)
  const opSet = new Set(OPERATOR_ADDRESSES.map(a => a.toLowerCase()))
  const isOperator = myAddrs.some(a => opSet.has(a))
  const action = p ? getActionInfo(p, { isSigner: isOperator }) : { label: 'View', disabled: true, reason: 'Loading…' }

  const loading = !p && proposals.length === 0
  const [voteOpen, setVoteOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-[4vw] lg:px-[3vw] lg:pr-[1.5vw] py-[1.5vw]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,26vw)_minmax(52vw,1fr)] gap-3 xl:gap-4 2xl:gap-6 items-start lg:items-stretch">
          <div className="order-2 lg:order-1 lg:self-stretch"><LeftSidebar /></div>
          <main className="order-1 lg:order-2 max-w-5xl mx-auto w-full px-2 lg:px-0 space-y-6">
        {!p ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="text-sm text-slate-300">
                {loading ? 'Loading proposal…' : 'Proposal not found'}
              </div>
              <div className="flex items-center gap-2">
                {!loading && (
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => router.push('/governance')}>
                    Back to list
                  </Button>
                )}
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => load()} disabled={loading}>
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
        <>
        {/* Breadcrumb */}
        <div className="text-sm">
          <Link href="/governance" className="text-slate-400 hover:text-white">Governance</Link>
          <span className="text-slate-600 mx-2">/</span>
          <span className="text-slate-300">{p.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">{p.indexSymbol}</div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {p.title}
              <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">Snapshot: Time‑Weighted</Badge>
            </h1>
            {p.description && <p className="text-slate-400 mt-1">{p.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('text-xs', phaseBadge)}>{p.phase}</Badge>
            {readyToQueue && (
              <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">Queued soon</Badge>
            )}
          </div>
        </div>

        {/* Pass state banner */}
        {readyToQueue && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-3 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300">
                Meets quorum and pass threshold. Proposal will be queued at the end of the voting window.
              </span>
            </CardContent>
          </Card>
        )}

        {/* Policy timeline (static skeleton) */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-xs">
              {['Snapshot', 'Voting', 'Timelock', 'Multisig', 'Execute'].map((s, i) => (
                <div key={s} className={cn('px-2 py-1 rounded border', 'border-slate-700',
                  i === 0 && 'bg-slate-800',
                )}>{s}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
            <div className="text-xs text-slate-400 mb-1">Quorum</div>
            <Progress value={Math.min(100, quorumPct)} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">{quorumPct.toFixed(1)}% / target {p.config.quorumPercent}% {quorumReached(p) ? '✓' : ''}</div>
          </CardContent></Card>

          <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
            <div className="text-xs text-slate-400 mb-1">Support</div>
            <Progress value={Math.min(100, support)} className="h-2" />
            <div className="text-xs text-slate-400 mt-1">{support.toFixed(1)}% / pass {p.config.passThresholdPercent}% {pass ? '✓' : ''}</div>
          </CardContent></Card>

          <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
            <div className="text-xs text-slate-400 mb-1">Time</div>
            <div className="text-sm text-white">{p.phase === 'active' ? (tl || '—') : p.phase}</div>
          </CardContent></Card>
        </div>

        {/* Vote Breakdown */}
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-2">
          <div className="text-xs text-slate-400">Vote Breakdown</div>
          <div className="w-full h-3 bg-slate-800 rounded overflow-hidden flex">
            <div className="h-full bg-green-500/70" style={{ width: `${breakdown.forPct}%` }} />
            <div className="h-full bg-red-500/70" style={{ width: `${breakdown.againstPct}%` }} />
            <div className="h-full bg-slate-500/70" style={{ width: `${breakdown.abstainPct}%` }} />
          </div>
          <TooltipProvider>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">For {breakdown.forPct.toFixed(1)}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    {p.tally.forPower.toLocaleString()} of {votesCast.toLocaleString()} cast
                    {' '}({breakdown.forPct.toFixed(1)}%)
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">Against {breakdown.againstPct.toFixed(1)}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    {p.tally.againstPower.toLocaleString()} of {votesCast.toLocaleString()} cast
                    {' '}({breakdown.againstPct.toFixed(1)}%)
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">Abstain {breakdown.abstainPct.toFixed(1)}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    {p.tally.abstainPower.toLocaleString()} of {votesCast.toLocaleString()} cast
                    {' '}({breakdown.abstainPct.toFixed(1)}%)
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-slate-400 mt-1">
            <div className="flex items-center justify-between md:justify-start md:gap-2">
              <span className="text-slate-500">For</span>
              <span className="text-slate-300">{p.tally.forPower.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-2">
              <span className="text-slate-500">Against</span>
              <span className="text-slate-300">{p.tally.againstPower.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-2">
              <span className="text-slate-500">Abstain</span>
              <span className="text-slate-300">{p.tally.abstainPower.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-2">
              <span className="text-slate-500">Cast / Snapshot</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-slate-300 cursor-default">
                      {votesCast.toLocaleString()} / {totalSnapshot.toLocaleString()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Participation: {castPct.toFixed(1)}% of snapshot power</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent></Card>

        {/* Proposed changes */}
        {p.changes && p.changes.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-2">
            <div className="text-xs text-slate-400">Proposed Changes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.changes.map((c, i) => (
                <div key={i} className="p-3 bg-slate-800/50 rounded border border-slate-700 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{c.type.toUpperCase()} {c.symbol}</div>
                    {(c.currentPct !== undefined || c.proposedPct !== undefined) && (
                      <div className="text-slate-300 text-sm">{c.currentPct ?? '—'}% → {c.proposedPct ?? '—'}%</div>
                    )}
                  </div>
                  {c.rationale && <div className="text-xs text-slate-400 mt-1">{c.rationale}</div>}
                </div>
              ))}
            </div>
          </CardContent></Card>
        )}

        {/* Timelock / Multisig */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-2">
            <div className="text-xs text-slate-400">Timelock</div>
            <div className="text-sm text-white">{p.config.timelockSeconds ? `${Math.round(p.config.timelockSeconds/3600)}h delay` : '—'}</div>
            {p.timelock?.eta && (
              <div className="text-xs">
                <span className="text-slate-400">ETA: {new Date(p.timelock.eta).toLocaleString('en-US')} </span>
                <span className={cn(
                  severity === 'critical' ? 'text-red-500' : severity === 'imminent' ? 'text-red-400' : severity === 'soon' ? 'text-yellow-400' : 'text-slate-400'
                )}>({countdown})</span>
              </div>
            )}
          </CardContent></Card>

          <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-2">
            <div className="text-xs text-slate-400">Operator signatures</div>
            {p.config.multisig ? (
              <div className="space-y-2 text-sm">
                <div className="text-white flex items-center gap-2">
                  <span>Required 4 of 4</span>
                  {isOperator && (
                    <span className="px-2 py-0.5 rounded bg-brand text-black text-xs">You are signer</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {OPERATOR_ADDRESSES.map((op) => {
                    const opLower = op.toLowerCase()
                    const signedSet = new Set((p.multisig?.signed || []).map(a => a.toLowerCase()))
                    const signed = signedSet.has(opLower)
                    const isYou = myAddrs.includes(opLower)
                    return (
                      <span
                        key={op}
                        className={cn(
                          'px-2 py-1 rounded border text-xs',
                          signed ? (isYou ? 'bg-brand text-black border-brand' : 'bg-slate-800 text-slate-200 border-slate-600') : 'bg-slate-900 text-slate-500 border-slate-700'
                        )}
                        title={isYou ? 'You' : signed ? 'Signed' : 'Pending'}
                      >
                        {op.slice(0, 6)}...{op.slice(-4)} {isYou ? '(You)' : signed ? '(Signed)' : '(Pending)'}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">—</div>
            )}
          </CardContent></Card>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span onClick={() => {
                  if (p?.phase === 'active' && p?.user?.eligible) setVoteOpen(true)
                  else addToast({ type: 'info', title: action.label, description: action.reason, duration: 5000 })
                }}>
                  <Button
                    className={cn(action.label.startsWith('Vote') || action.label.startsWith('Sign') ? 'bg-brand text-black hover:bg-brand-hover' : '')}
                    variant={action.label === 'Execute' || action.label === 'View' ? 'outline' : 'default'}
                    disabled={action.disabled && !(p?.phase === 'active' && p?.user?.eligible)}
                  >
                    {action.label}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>{action.reason}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {p && (
            <VoteDialog open={voteOpen} onOpenChange={setVoteOpen} proposal={p} />
          )}
          <Link href="/governance" className="text-slate-300 hover:text-white text-sm">Back to list</Link>
        </div>
        </>
        )}
          </main>
        </div>
      </div>
    </div>
  )
}
