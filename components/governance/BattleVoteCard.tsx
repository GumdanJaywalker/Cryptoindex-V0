'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Flame,
  Target,
  Zap,
  Star
} from 'lucide-react'

interface BattleVoteCardProps {
  battle: {
    id: string
    title: string
    subtitle: string
    optionA: {
      name: string
      emoji: string
      votes: number
      percentage: number
      color: string
    }
    optionB: {
      name: string
      emoji: string
      votes: number
      percentage: number
      color: string
    }
    totalVotes: number
    totalPower: number
    timeLeft: string
    endDate: string
    status: 'active' | 'ending-soon' | 'ended'
    myVote?: {
      option: 'A' | 'B'
      power: number
    }
    rewards: {
      winner: number
      participation: number
    }
    description: string
    isHot?: boolean
  }
}

export function BattleVoteCard({ battle }: BattleVoteCardProps) {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(battle.myVote?.option || null)
  const [votingPower, setVotingPower] = useState([battle.myVote?.power || 1000])
  const [showVoteInterface, setShowVoteInterface] = useState(false)

  const maxVotingPower = 5000 // User's max available voting power
  
  const handleVote = () => {
    if (!selectedOption) return
    
    // Here would be the actual voting logic
    console.log(`Voting ${votingPower[0]} power for option ${selectedOption}`)
    setShowVoteInterface(false)
  }

  const getStatusColor = () => {
    switch (battle.status) {
      case 'ending-soon': return 'text-red-400 border-red-400/30'
      case 'ended': return 'text-slate-400 border-slate-400/30'
      default: return 'text-green-400 border-green-400/30'
    }
  }

  const getStatusText = () => {
    switch (battle.status) {
      case 'ending-soon': return 'Ending Soon'
      case 'ended': return 'Ended'
      default: return 'Active'
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/30 transition-all duration-200">
      <CardContent className="p-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">{battle.title}</h3>
            {battle.isHot && <Flame className="w-5 h-5 text-orange-400" />}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {battle.myVote && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Voted
              </Badge>
            )}
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-4">{battle.subtitle}</p>

        {/* 배틀 옵션들 */}
        <div className="space-y-4 mb-6">
          {/* Option A */}
          <div 
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedOption === 'A' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => !battle.myVote && setSelectedOption('A')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{battle.optionA.emoji}</div>
                <div>
                  <div className="font-semibold text-white">{battle.optionA.name}</div>
                  <div className="text-sm text-slate-400">
                    {battle.optionA.votes.toLocaleString()} votes
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {battle.optionA.percentage.toFixed(1)}%
                </div>
                {battle.optionA.percentage > battle.optionB.percentage && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    Leading
                  </div>
                )}
              </div>
            </div>
            
            <Progress 
              value={battle.optionA.percentage} 
              className="h-2"
              style={{
                background: 'rgb(30 41 59)',
              }}
            />
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 px-4 py-1">
              VS
            </Badge>
          </div>

          {/* Option B */}
          <div 
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedOption === 'B' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => !battle.myVote && setSelectedOption('B')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{battle.optionB.emoji}</div>
                <div>
                  <div className="font-semibold text-white">{battle.optionB.name}</div>
                  <div className="text-sm text-slate-400">
                    {battle.optionB.votes.toLocaleString()} votes
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {battle.optionB.percentage.toFixed(1)}%
                </div>
                {battle.optionB.percentage > battle.optionA.percentage && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    Leading
                  </div>
                )}
              </div>
            </div>
            
            <Progress 
              value={battle.optionB.percentage} 
              className="h-2"
            />
          </div>
        </div>

        {/* 배틀 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {battle.totalVotes.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              Total Votes
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {(battle.totalPower / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" />
              Voting Power
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              ${battle.rewards.winner}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />
              Winner Reward
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {battle.timeLeft}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Time Left
            </div>
          </div>
        </div>

        {/* 투표 인터페이스 */}
        {!battle.myVote && (
          <div className="space-y-4">
            {!showVoteInterface ? (
              <Button 
                onClick={() => setShowVoteInterface(true)}
                disabled={!selectedOption || battle.status === 'ended'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {selectedOption ? `Vote for ${selectedOption === 'A' ? battle.optionA.name : battle.optionB.name}` : 'Select Option to Vote'}
              </Button>
            ) : (
              <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Voting Power</span>
                  <span className="text-sm text-blue-400 font-medium">
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
        {battle.myVote && (
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">
                  You voted for {battle.myVote.option === 'A' ? battle.optionA.name : battle.optionB.name}
                </span>
              </div>
              <span className="text-blue-400 font-semibold">
                {battle.myVote.power.toLocaleString()} VP
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}