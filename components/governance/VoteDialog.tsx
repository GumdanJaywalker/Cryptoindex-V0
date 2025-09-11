'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { Proposal } from '@/lib/types/governance'
import { submitVote, type VoteChoice } from '@/lib/api/governance'
import { useGovernanceStore } from '@/lib/store/governance-store'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

export function VoteDialog({ open, onOpenChange, proposal }: { open: boolean; onOpenChange: (v: boolean) => void; proposal: Proposal }) {
  const [choice, setChoice] = useState<VoteChoice>('for')
  const [submitting, setSubmitting] = useState(false)
  const applyVote = useGovernanceStore((s) => s.applyVote)
  const { addToast } = useToast()

  const power = proposal.user?.votingPowerAtSnapshot || 0

  const onSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await submitVote(proposal.id, choice, power)
      applyVote(proposal.id, choice, power)
      addToast(createSuccessToast('Vote submitted', `${choice.toUpperCase()} with power ${power.toLocaleString()}`))
      onOpenChange(false)
    } catch (e: any) {
      addToast(createErrorToast('Vote failed', e?.message || 'Please try again'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Cast your vote</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-xs text-slate-400">Voting power at snapshot: {power.toLocaleString()}</div>
          <RadioGroup value={choice} onValueChange={(v) => setChoice(v as VoteChoice)} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="for" id="vote-for" />
              <Label htmlFor="vote-for">For</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="against" id="vote-against" />
              <Label htmlFor="vote-against">Against</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abstain" id="vote-abstain" />
              <Label htmlFor="vote-abstain">Abstain</Label>
            </div>
          </RadioGroup>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-brand text-black hover:bg-brand-hover" onClick={onSubmit} disabled={submitting || power <= 0}>
              {submitting ? 'Submitting…' : 'Submit vote'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VoteDialog

