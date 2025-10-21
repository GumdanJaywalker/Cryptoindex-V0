'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, TrendingUp, TrendingDown, Users, Clock, Zap } from 'lucide-react'

interface BattleAsset {
  symbol: string
  name: string
  votes: number
  votingPower: number
  proposedChange: number
  emoji: string
}

interface BattleCardProps {
  indexSymbol: string
  indexName: string
  assetA: BattleAsset
  assetB: BattleAsset
  endsAt: string
  status: 'active' | 'upcoming' | 'completed'
  totalVotingPower: number
}

export function BattleCard({
  indexSymbol,
  indexName,
  assetA,
  assetB,
  endsAt,
  status,
  totalVotingPower,
}: BattleCardProps) {
  const totalVotes = assetA.votes + assetB.votes
  const percentageA = totalVotes > 0 ? (assetA.votes / totalVotes) * 100 : 50
  const percentageB = totalVotes > 0 ? (assetB.votes / totalVotes) * 100 : 50

  const isWinningA = assetA.votes > assetB.votes
  const isWinningB = assetB.votes > assetA.votes

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-brand border-brand/30 bg-brand/10'
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
    <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden group">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
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
            {/* Asset A */}
            <div
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                isWinningA
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-slate-700 bg-slate-800/30'
              }`}
            >
              <div className="text-3xl mb-1">{assetA.emoji}</div>
              <p className="text-sm font-semibold text-white truncate">{assetA.symbol}</p>
              <p className="text-xs text-slate-400 truncate">{assetA.name}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    assetA.proposedChange >= 0
                      ? 'text-green-400 border-green-400/30'
                      : 'text-red-400 border-red-400/30'
                  }`}
                >
                  {assetA.proposedChange >= 0 ? '+' : ''}
                  {assetA.proposedChange}%
                </Badge>
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                <span className="text-xs font-bold text-slate-400 group-hover:text-purple-400 transition-colors">
                  VS
                </span>
              </div>
            </div>

            {/* Asset B */}
            <div
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                isWinningB
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-slate-700 bg-slate-800/30'
              }`}
            >
              <div className="text-3xl mb-1">{assetB.emoji}</div>
              <p className="text-sm font-semibold text-white truncate">{assetB.symbol}</p>
              <p className="text-xs text-slate-400 truncate">{assetB.name}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    assetB.proposedChange >= 0
                      ? 'text-green-400 border-green-400/30'
                      : 'text-red-400 border-red-400/30'
                  }`}
                >
                  {assetB.proposedChange >= 0 ? '+' : ''}
                  {assetB.proposedChange}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Vote Progress Bar */}
          <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden mb-2">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500 flex items-center justify-start px-3"
              style={{ width: `${percentageA}%` }}
            >
              {percentageA > 20 && (
                <span className="text-xs font-bold text-white">{percentageA.toFixed(1)}%</span>
              )}
            </div>
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-600 to-blue-400 transition-all duration-500 flex items-center justify-end px-3"
              style={{ width: `${percentageB}%` }}
            >
              {percentageB > 20 && (
                <span className="text-xs font-bold text-white">{percentageB.toFixed(1)}%</span>
              )}
            </div>
          </div>

          {/* Vote Counts */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-purple-400">
              <Users className="w-3 h-3" />
              <span className="font-medium">{assetA.votes.toLocaleString()} votes</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <span className="font-medium">{assetB.votes.toLocaleString()} votes</span>
              <Users className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Battle Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="p-2 bg-slate-800/30 rounded">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <Clock className="w-3 h-3" />
              <span>Time Left</span>
            </div>
            <p className="text-white font-semibold">{getTimeRemaining()}</p>
          </div>
          <div className="p-2 bg-slate-800/30 rounded">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <Zap className="w-3 h-3" />
              <span>Total Power</span>
            </div>
            <p className="text-white font-semibold">
              {(totalVotingPower / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Action Button */}
        {status === 'active' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
          >
            <Flame className="w-4 h-4 mr-1.5" />
            Vote Now
          </Button>
        )}

        {status === 'upcoming' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-slate-700 text-slate-400 cursor-not-allowed"
            disabled
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Starts Soon
          </Button>
        )}

        {status === 'completed' && (
          <div className="text-center p-2 bg-slate-800/30 rounded">
            <p className="text-xs text-slate-500">Battle Ended</p>
            <p className="text-sm font-semibold text-white mt-1">
              {isWinningA ? assetA.symbol : assetB.symbol} Won
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
