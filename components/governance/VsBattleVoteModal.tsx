'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Flame, Zap, TrendingUp, TrendingDown } from 'lucide-react'

interface VsBattleVoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTheme: {
    name: string
    emoji: string
    assets: string[]
  } | null
  indexName: string
  indexSymbol: string
}

export function VsBattleVoteModal({
  open,
  onOpenChange,
  selectedTheme,
  indexName,
  indexSymbol,
}: VsBattleVoteModalProps) {
  const [votingPower, setVotingPower] = useState([1000])
  const maxVotingPower = 5000

  const handleConfirm = () => {
    if (!selectedTheme) return

    console.log(`VS Battle Vote Confirmed:`, {
      index: indexSymbol,
      theme: selectedTheme.name,
      votingPower: votingPower[0],
    })

    // Close modal
    onOpenChange(false)

    // Reset voting power for next time
    setVotingPower([1000])
  }

  const handleCancel = () => {
    onOpenChange(false)
    setVotingPower([1000])
  }

  if (!selectedTheme) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Flame className="w-6 h-6 text-orange-400" />
            <span>Confirm Your Vote</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            You are voting for <span className="text-white font-medium">{selectedTheme.name}</span> in the{' '}
            <span className="text-purple-400 font-medium">{indexName}</span> battle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Theme Info */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{selectedTheme.emoji}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{selectedTheme.name}</h3>
                <p className="text-sm text-slate-400 mt-1">Includes: {selectedTheme.assets.join(', ')}</p>
                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className="text-brand border-brand/30"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Winner Takes All
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Index Info */}
          <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Theme Battle</div>
            <div className="font-medium text-white">{indexSymbol}</div>
            <div className="text-xs text-slate-500 mt-1">
              If this theme wins, the index will consist of these assets
            </div>
          </div>

          {/* Voting Power Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <Zap className="w-4 h-4 text-brand" />
                Voting Power
              </label>
              <span className="text-sm text-brand font-semibold">
                {votingPower[0].toLocaleString()} / {maxVotingPower.toLocaleString()}
              </span>
            </div>

            <Slider
              value={votingPower}
              onValueChange={setVotingPower}
              max={maxVotingPower}
              min={100}
              step={100}
              className="w-full"
            />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Min: 100</span>
              <span>Max: {maxVotingPower.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Flame className="w-4 h-4 mr-2" />
              Confirm Vote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
