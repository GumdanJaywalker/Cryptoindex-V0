'use client'

import { create } from 'zustand'
import type { Proposal } from '@/lib/types/governance'
import { getProposals } from '@/lib/api/governance'

type GovernanceState = {
  proposals: Proposal[]
  loading: boolean
  error?: string
  load: () => Promise<void>
  getById: (id: string) => Proposal | undefined
  applyVote: (id: string, choice: 'for' | 'against' | 'abstain', power: number) => void
}

export const useGovernanceStore = create<GovernanceState>((set, get) => ({
  proposals: [],
  loading: false,
  error: undefined,
  load: async () => {
    try {
      set({ loading: true, error: undefined })
      const data = await getProposals()
      set({ proposals: data, loading: false })
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load proposals', loading: false })
    }
  },
  getById: (id) => get().proposals.find((p) => p.id === id),
  applyVote: (id, choice, power) => {
    set(({ proposals }) => ({
      proposals: proposals.map((p) => {
        if (p.id !== id) return p
        const t = { ...p.tally }
        if (choice === 'for') t.forPower += power
        else if (choice === 'against') t.againstPower += power
        else t.abstainPower += power
        return { ...p, tally: t }
      })
    }))
  },
}))
