'use client'

import { useMemo } from 'react'
import { useGovernanceStore } from '@/lib/store/governance-store'
import type { Proposal } from '@/lib/types/governance'
import { quorumReached, supportPercent, passReached, timeLeft } from '@/lib/governance/helpers'

export function useGovernance() {
  const { proposals, loading, error, load, getById } = useGovernanceStore()

  const helpers = useMemo(() => ({
    quorumReached,
    supportPercent,
    passReached,
    timeLeft,
  }), [])

  return { proposals, loading, error, load, getById, ...helpers }
}

// Standardized action info (label/reason) per phase
export function getActionInfo(p: Proposal, opts?: { isSigner?: boolean }): { label: string; disabled: boolean; reason: string } {
  const isSigner = !!opts?.isSigner
  const u = p.user
  switch (p.phase) {
    case 'active': {
      if (u && !u.eligible) return { label: 'Vote', disabled: true, reason: 'Not eligible at time‑weighted snapshot' }
      return { label: 'Vote', disabled: false, reason: 'Cast your vote' }
    }
    case 'queued':
    case 'timelocked': {
      const eta = p.timelock?.eta
      const reason = eta ? `Timelock in effect (ETA ${new Date(eta).toLocaleString('en-US')})` : 'Timelock in effect'
      return { label: 'Execute', disabled: true, reason }
    }
    case 'awaiting-multisig':
      return { label: 'Sign (4/4)', disabled: true, reason: isSigner ? 'Signing is not wired in MVP' : 'Operator‑only action' }
    case 'executed':
      return { label: 'Executed', disabled: true, reason: 'Proposal already executed' }
    case 'succeeded':
      return { label: 'Succeeded', disabled: true, reason: 'Will be queued/executed per policy' }
    case 'defeated':
      return { label: 'Defeated', disabled: true, reason: 'Did not meet quorum or pass threshold' }
    case 'canceled':
      return { label: 'Canceled', disabled: true, reason: 'Proposal canceled' }
    default:
      return { label: 'View', disabled: true, reason: 'Read-only' }
  }
}
