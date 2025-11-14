'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VsBattleVoteModal } from '@/components/governance/VsBattleVoteModal'
import { Users, Clock, Zap } from 'lucide-react'

interface BattleTheme {
  name: string
  emoji: string
  assets: string[]
  votes: number
  votingPower: number
}

interface BattleCardProps {
  indexSymbol: string
  indexName: string
  themeA: BattleTheme
  themeB: BattleTheme
  endsAt: string
  status: 'active' | 'upcoming' | 'completed'
  totalVotingPower: number
}

export function BattleCard({
  indexSymbol,
  indexName,
  themeA,
  themeB,
  endsAt,
  status,
  totalVotingPower,
}: BattleCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<{
    name: string
    emoji: string
    assets: string[]
  } | null>(null)

  const totalVotes = themeA.votes + themeB.votes
  const percentageA = totalVotes > 0 ? (themeA.votes / totalVotes) * 100 : 50
  const percentageB = totalVotes > 0 ? (themeB.votes / totalVotes) * 100 : 50

  const isWinningA = themeA.votes > themeB.votes
  const isWinningB = themeB.votes > themeA.votes

  const handleVote = (theme: BattleTheme) => {
    setSelectedTheme({
      name: theme.name,
      emoji: theme.emoji,
      assets: theme.assets,
    })
    setModalOpen(true)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-brand border-white/10 bg-brand/10'
      case 'upcoming':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      case 'completed':
        return 'text-slate-500 border-slate-500/30 bg-slate-500/10'
      default:
        return 'text-slate-500 border-slate-500/30'
    }
  }

  const getTimeRemaining = () => {
    const end = new Date(endsAt)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff < 0) return 'Ended'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="glass-card-dynamic hover:border-white/10 transition-all overflow-hidden group">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-white truncate">
                {indexName}
              </h3>
            </div>
            <p className="text-xs text-slate-400">{indexSymbol}</p>
          </div>

          <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
            {status === 'active' ? 'Live' : status === 'upcoming' ? 'Soon' : 'Ended'}
          </Badge>
        </div>

        {/* Battle Arena */}
        <div className="mb-4">
          {/* Combatants */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {/* Theme A */}
            <div
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                isWinningA
                  ? 'border-white/10 bg-brand/10'
                  : 'border-teal bg-teal-elevated/30'
              }`}
            >
              <div className="text-4xl mb-2">{themeA.emoji}</div>
              <p className="text-sm font-semibold text-white truncate">{themeA.name}</p>
              <p className="text-xs text-slate-400 truncate">({themeA.assets.length} assets)</p>
              <div className="mt-1">
                <p className="text-xs text-slate-500 truncate">
                  {themeA.assets.join(', ')}
                </p>
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">
                VS
              </span>
            </div>

            {/* Theme B */}
            <div
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                isWinningB
                  ? 'border-white/10 bg-brand/10'
                  : 'border-teal bg-teal-elevated/30'
              }`}
            >
              <div className="text-4xl mb-2">{themeB.emoji}</div>
              <p className="text-sm font-semibold text-white truncate">{themeB.name}</p>
              <p className="text-xs text-slate-400 truncate">({themeB.assets.length} assets)</p>
              <div className="mt-1">
                <p className="text-xs text-slate-500 truncate">
                  {themeB.assets.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Vote Progress Bar */}
          <div className="relative h-8 bg-teal-elevated rounded-lg overflow-hidden mb-2">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-brand transition-all duration-500 flex items-center justify-start px-3"
              style={{ width: `${percentageA}%` }}
            >
              {percentageA > 20 && (
                <span className="text-xs font-bold text-white">{percentageA.toFixed(1)}%</span>
              )}
            </div>
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-brand to-teal-300 transition-all duration-500 flex items-center justify-end px-3"
              style={{ width: `${percentageB}%` }}
            >
              {percentageB > 20 && (
                <span className="text-xs font-bold text-white">{percentageB.toFixed(1)}%</span>
              )}
            </div>
          </div>

          {/* Vote Counts */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-teal-400">
              <Users className="w-3 h-3" />
              <span className="font-medium">{themeA.votes.toLocaleString()} votes</span>
            </div>
            <div className="flex items-center gap-1 text-brand">
              <span className="font-medium">{themeB.votes.toLocaleString()} votes</span>
              <Users className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Battle Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="p-2 bg-teal-elevated/30 rounded">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <Clock className="w-3 h-3" />
              <span>Time Left</span>
            </div>
            <p className="text-white font-semibold">{getTimeRemaining()}</p>
          </div>
          <div className="p-2 bg-teal-elevated/30 rounded">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <Zap className="w-3 h-3" />
              <span>Total Power</span>
            </div>
            <p className="text-white font-semibold">
              {(totalVotingPower / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Vote Buttons */}
        {status === 'active' && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(themeA)}
              className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/50"
            >
              <span className="mr-1.5">{themeA.emoji}</span>
              {themeA.name}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(themeB)}
              className="border-white/10 text-brand hover:bg-brand/10 hover:border-white/10"
            >
              <span className="mr-1.5">{themeB.emoji}</span>
              {themeB.name}
            </Button>
          </div>
        )}

        {status === 'upcoming' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-teal text-slate-400 cursor-not-allowed"
            disabled
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Starts Soon
          </Button>
        )}

        {status === 'completed' && (
          <div className="text-center p-2 bg-teal-elevated/30 rounded">
            <p className="text-xs text-slate-500">Battle Ended</p>
            <p className="text-sm font-semibold text-white mt-1">
              {isWinningA ? themeA.name : themeB.name} Won
            </p>
          </div>
        )}

        {/* Vote Modal */}
        <VsBattleVoteModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          selectedTheme={selectedTheme}
          indexName={indexName}
          indexSymbol={indexSymbol}
        />
      </CardContent>
    </Card>
  )
}
