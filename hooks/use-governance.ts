'use client'

import { useMemo } from 'react'
import { useGovernanceStore } from '@/lib/store/governance-store'
import type { Proposal } from '@/lib/types/governance'

export function useGovernance() {
  const { proposals, loading, error, load, getById } = useGovernanceStore()

  const helpers = useMemo(() => ({
    quorumReached: (p: Proposal) => {
      const { quorumPercent } = p.config
      const total = p.tally.totalSnapshotPower || 0
      const participated = p.tally.forPower + p.tally.againstPower + p.tally.abstainPower
      return total > 0 && (participated / total) * 100 >= quorumPercent
    },
    supportPercent: (p: Proposal) => {
      const votes = p.tally.forPower + p.tally.againstPower
      return votes > 0 ? (p.tally.forPower / votes) * 100 : 0
    },
    passReached: (p: Proposal) => {
      return helpers.supportPercent(p) >= p.config.passThresholdPercent
    },
    timeLeft: (p: Proposal) => {
      if (!p.endsAt) return ''
      const ms = Math.max(0, p.endsAt - Date.now())
      const h = Math.floor(ms / 3600_000)
      const m = Math.floor((ms % 3600_000) / 60_000)
      return h > 0 ? `${h}h ${m}m` : `${m}m`
    },
  }), [])

  return { proposals, loading, error, load, getById, ...helpers }
}

