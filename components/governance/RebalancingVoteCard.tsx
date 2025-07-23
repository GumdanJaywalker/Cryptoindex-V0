'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Clock, 
  Users, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
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
  const [selectedChanges, setSelectedChanges] = useState<string[]>(rebalancing.myVote?.changes || [])
  const [votingPower, setVotingPower] = useState([rebalancing.myVote?.power || 1000])
  const [showVoteInterface, setShowVoteInterface] = useState(false)

  const maxVotingPower = 5000

  const handleChangeToggle = (changeId: string) => {
    if (rebalancing.myVote) return // Already voted
    
    setSelectedChanges(prev => 
      prev.includes(changeId) 
        ? prev.filter(id => id !== changeId)
        : [...prev, changeId]
    )
  }

  const handleVote = () => {
    if (selectedChanges.length === 0) return
    
    console.log(`Voting ${votingPower[0]} power for changes:`, selectedChanges)
    setShowVoteInterface(false)
  }

  const getStatusColor = () => {
    switch (rebalancing.status) {
      case 'ending-soon': return 'text-red-400 border-red-400/30'
      case 'ended': return 'text-slate-400 border-slate-400/30'
      default: return 'text-green-400 border-green-400/30'
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'remove': return <XCircle className="w-4 h-4 text-red-400" />
      case 'add': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'adjust': return <RefreshCw className="w-4 h-4 text-blue-400" />
      default: return null
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'remove': return 'border-red-500/30 bg-red-500/10'
      case 'add': return 'border-green-500/30 bg-green-500/10'
      case 'adjust': return 'border-blue-500/30 bg-blue-500/10'
      default: return 'border-slate-700'
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/30 transition-all duration-200">
      <CardContent className="p-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{rebalancing.emoji}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{rebalancing.indexName}</h3>
              <p className="text-slate-400 text-sm">{rebalancing.indexSymbol} Rebalancing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              {rebalancing.status === 'ending-soon' ? 'Ending Soon' : 
               rebalancing.status === 'ended' ? 'Ended' : 'Active'}
            </Badge>
            {rebalancing.myVote && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Voted
              </Badge>
            )}
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-6">{rebalancing.description}</p>

        {/* 현재 구성 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Current Composition
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {rebalancing.currentComposition.map((asset, index) => (
              <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
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
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Proposed Changes
          </h4>
          
          <div className="space-y-3">
            {rebalancing.proposedChanges.map((change, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedChanges.includes(change.symbol)
                    ? 'border-purple-500 bg-purple-500/10'
                    : `${getChangeColor(change.type)} hover:border-slate-600`
                }`}
                onClick={() => handleChangeToggle(change.symbol)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getChangeIcon(change.type)}
                    <div>
                      <div className="font-medium text-white">
                        {change.type === 'remove' ? 'Remove' : 
                         change.type === 'add' ? 'Add' : 'Adjust'} {change.symbol}
                      </div>
                      <div className="text-sm text-slate-400">{change.name}</div>
                    </div>
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
                      <span className="text-green-400">
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
            <div className="text-lg font-bold text-purple-400">
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
        {!rebalancing.myVote && (
          <div className="space-y-4">
            {!showVoteInterface ? (
              <Button 
                onClick={() => setShowVoteInterface(true)}
                disabled={selectedChanges.length === 0 || rebalancing.status === 'ended'}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {selectedChanges.length > 0 
                  ? `Vote for ${selectedChanges.length} Change${selectedChanges.length > 1 ? 's' : ''}` 
                  : 'Select Changes to Vote'
                }
              </Button>
            ) : (
              <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Voting Power</span>
                  <span className="text-sm text-purple-400 font-medium">
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
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Confirm Vote
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowVoteInterface(false)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 이미 투표한 경우 */}
        {rebalancing.myVote && (
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium">
                  You voted for {rebalancing.myVote.changes.length} change{rebalancing.myVote.changes.length > 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-purple-400 font-semibold">
                {rebalancing.myVote.power.toLocaleString()} VP
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Changes: {rebalancing.myVote.changes.join(', ')}
            </div>
          </div>
        )}

        {/* 다음 리밸런싱 일정 */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Next rebalancing scheduled:</span>
            <span className="text-blue-400 font-medium">{rebalancing.nextRebalanceDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}