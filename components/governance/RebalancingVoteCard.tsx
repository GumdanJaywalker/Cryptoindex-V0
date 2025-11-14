'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import {
  Clock,
  Users,
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  ChevronUp,
  ChevronDown,
  BarChart3
} from 'lucide-react'

interface RebalancingVoteCardProps {
  rebalancing: {
    id: string
    indexName: string
    indexSymbol: string
    emoji: string
    currentComposition: {
      symbol: string
      name: string
      percentage: number
      performance7d: number
    }[]
    proposedChanges: {
      type: 'remove' | 'add' | 'adjust'
      symbol: string
      name: string
      currentPercentage?: number
      proposedPercentage: number
      reason: string
      votes: number
      percentage: number
    }[]
    totalVotes: number
    totalPower: number
    timeLeft: string
    endDate: string
    status: 'active' | 'ending-soon' | 'ended'
    myVote?: {
      changes: string[]
      power: number
    }
    threshold: number // Percentage needed to pass
    description: string
    nextRebalanceDate: string
  }
}

export function RebalancingVoteCard({ rebalancing }: RebalancingVoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedChanges, setSelectedChanges] = useState<string[]>(rebalancing.myVote?.changes || [])
  const [votingPower, setVotingPower] = useState([rebalancing.myVote?.power || 1000])
  const [showVoteInterface, setShowVoteInterface] = useState(false)
  const [myVote, setMyVote] = useState<{ changes: string[]; power: number } | undefined>(
    rebalancing.myVote
  )

  const maxVotingPower = 5000

  const handleChangeToggle = (changeId: string) => {
    if (myVote) return // Already voted

    setSelectedChanges(prev =>
      prev.includes(changeId)
        ? prev.filter(id => id !== changeId)
        : [...prev, changeId]
    )
  }

  const handleVote = () => {
    if (selectedChanges.length === 0) return

    console.log(`Voting ${votingPower[0]} power for changes:`, selectedChanges)

    // Update local state to reflect vote
    setMyVote({
      changes: selectedChanges,
      power: votingPower[0]
    })

    setShowVoteInterface(false)
  }

  const getStatusColor = () => {
    switch (rebalancing.status) {
      case 'ending-soon': return 'text-red-400 border-red-400/30'
      case 'ended': return 'text-slate-400 border-slate-400/30'
      default: return 'text-brand border-brand/30'
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'remove': return 'border-red-500/30 bg-red-500/10'
      case 'add': return 'border-brand/30 bg-brand/10'
      case 'adjust': return 'border-brand/30 bg-brand/10'
      default: return 'border-teal'
    }
  }

  // Clean ticker: remove _INDEX suffix
  const cleanTicker = rebalancing.indexSymbol.replace(/_INDEX$/, '')

  return (
    <Card className="glass-card-dynamic">
      <CardContent className="p-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-bold text-white">{cleanTicker}</h3>
              {isExpanded && (
                <p className="text-slate-400 text-sm">{rebalancing.indexName} Rebalancing</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              {rebalancing.status === 'ending-soon' ? 'Ending Soon' :
               rebalancing.status === 'ended' ? 'Ended' : 'Active'}
            </Badge>
            {myVote && (
              <Badge className="bg-brand/20 text-brand border-brand/30">
                Voted
              </Badge>
            )}

            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-brand hover:bg-teal-elevated"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">

        {/* 현재 구성 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Current Composition
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {rebalancing.currentComposition.map((asset, index) => (
              <div key={index} className="p-3 bg-teal-elevated rounded-lg border border-teal">
                <div className="font-medium text-white text-sm">{asset.symbol}</div>
                <div className="text-xs text-slate-400 mb-1">{asset.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{asset.percentage}%</span>
                  <span className={`text-xs flex items-center gap-1 ${
                    asset.performance7d > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.performance7d > 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {Math.abs(asset.performance7d).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 제안된 변경사항 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">
            Proposed Changes
          </h4>
          
          <div className="space-y-3">
            {rebalancing.proposedChanges.map((change, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedChanges.includes(change.symbol)
                    ? 'border-brand bg-brand/10'
                    : `${getChangeColor(change.type)} hover:border-teal`
                }`}
                onClick={() => handleChangeToggle(change.symbol)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-white">
                      {change.type === 'remove' ? 'Remove' :
                       change.type === 'add' ? 'Add' : 'Adjust'} {change.symbol}
                    </div>
                    <div className="text-sm text-slate-400">{change.name}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">
                      {change.percentage.toFixed(1)}% Support
                    </div>
                    <div className="text-xs text-slate-400">
                      {change.votes.toLocaleString()} votes
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <Progress value={change.percentage} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{change.reason}</span>
                  <div className="flex items-center gap-2">
                    {change.currentPercentage && (
                      <span className="text-slate-400">
                        {change.currentPercentage}% → {change.proposedPercentage}%
                      </span>
                    )}
                    {!change.currentPercentage && change.type === 'add' && (
                      <span className="text-brand">
                        +{change.proposedPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 투표 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {rebalancing.totalVotes.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              Total Votes
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {(rebalancing.totalPower / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" />
              Voting Power
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-brand">
              {rebalancing.threshold}%
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Target className="w-3 h-3" />
              Pass Threshold
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {rebalancing.timeLeft}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Time Left
            </div>
          </div>
        </div>

        {/* 투표 인터페이스 */}
        {!myVote && (
          <div className="space-y-4">
            {!showVoteInterface ? (
              <Button
                onClick={() => setShowVoteInterface(true)}
                disabled={selectedChanges.length === 0 || rebalancing.status === 'ended'}
                className="w-full bg-[#50d2c1] hover:bg-brand text-black"
              >
                {selectedChanges.length > 0
                  ? `Vote for ${selectedChanges.length} Change${selectedChanges.length > 1 ? 's' : ''}`
                  : 'Select Changes to Vote'
                }
              </Button>
            ) : (
              <div className="space-y-4 p-4 bg-teal-elevated rounded-lg border border-teal">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Voting Power</span>
                  <span className="text-sm text-brand font-medium">
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

                <div className="flex gap-2">
                  <Button
                    onClick={handleVote}
                    className="flex-1 bg-[#50d2c1] hover:bg-brand text-black"
                  >
                    Confirm Vote
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowVoteInterface(false)}
                    className="border-teal text-slate-300 hover:bg-teal-elevated"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 이미 투표한 경우 */}
        {myVote && (
          <div className="p-4 bg-brand/10 rounded-lg border border-brand/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand" />
                <span className="text-brand font-medium">
                  You voted for {myVote.changes.length} change{myVote.changes.length > 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-brand font-semibold">
                {myVote.power.toLocaleString()} VP
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Changes: {myVote.changes.join(', ')}
            </div>
          </div>
        )}

        {/* 다음 리밸런싱 일정 */}
        <div className="mt-4 pt-4 border-t border-teal">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Next rebalancing scheduled:</span>
            <span className="text-brand font-medium">{rebalancing.nextRebalanceDate}</span>
          </div>
        </div>
          </div>
        )}

        {/* Collapsed State */}
        {!isExpanded && (
          <div className="space-y-4">
            {/* Proposed Changes Summary */}
            <div className="space-y-2">
              {rebalancing.proposedChanges.slice(0, 3).map((change, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-teal-elevated rounded">
                  <span className="font-medium text-white text-sm">{change.symbol}</span>
                  <span className="text-sm text-slate-300">
                    {change.type === 'add' && (
                      <span className="text-green-400">+{change.proposedPercentage}%</span>
                    )}
                    {change.type === 'remove' && change.currentPercentage && (
                      <span className="text-red-400">-{change.currentPercentage}%</span>
                    )}
                    {change.type === 'adjust' && change.currentPercentage && (
                      <>
                        <span className="text-slate-400">{change.currentPercentage}%</span>
                        <span className="text-slate-500 mx-1">→</span>
                        <span className={change.proposedPercentage > change.currentPercentage ? 'text-green-400' : 'text-red-400'}>
                          {change.proposedPercentage}%
                        </span>
                      </>
                    )}
                  </span>
                </div>
              ))}
              {rebalancing.proposedChanges.length > 3 && (
                <div className="text-center text-xs text-slate-400">
                  +{rebalancing.proposedChanges.length - 3} more changes
                </div>
              )}
            </div>

            {/* Key Stats Preview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-teal-elevated rounded-lg">
                <div className="text-sm font-bold text-white">
                  {rebalancing.totalVotes.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Votes</div>
              </div>
              <div className="text-center p-2 bg-teal-elevated rounded-lg">
                <div className="text-sm font-bold text-white">
                  {rebalancing.threshold}%
                </div>
                <div className="text-xs text-slate-400">Threshold</div>
              </div>
              <div className="text-center p-2 bg-teal-elevated rounded-lg">
                <div className="text-sm font-bold text-white">
                  {rebalancing.timeLeft}
                </div>
                <div className="text-xs text-slate-400">Time Left</div>
              </div>
            </div>

            {/* Action Button */}
            {!myVote ? (
              <Button
                onClick={() => setIsExpanded(true)}
                className="w-full bg-brand/20 hover:bg-brand/30 text-brand border border-brand/30"
              >
                View Details & Vote
              </Button>
            ) : (
              <div className="p-3 bg-brand/10 rounded-lg border border-brand/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-brand" />
                    <span className="text-sm text-brand font-medium">
                      Voted for {myVote.changes.length} change{myVote.changes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-sm text-brand font-semibold">
                    {myVote.power.toLocaleString()} VP
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}