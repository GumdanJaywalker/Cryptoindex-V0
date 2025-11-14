'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Vote, 
  Zap, 
  Target, 
  Clock,
  Trophy,
  TrendingUp,
  AlertCircle,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react'

const votingData = {
  totalVotingPower: 12500,
  availableVotingPower: 7800,
  lockedVotingPower: 4700,
  votingRank: 142,
  totalVoters: 8924,
  weeklyRewards: 847.50,
  totalRewards: 5247.80,
  successRate: 78.5,
  activeVotes: 3,
  weeklyEarnings: {
    battle: 423.50,
    rebalancing: 298.80,
    bonus: 125.20
  }
}

const indexHoldings = [
  {
    symbol: 'DOG_INDEX',
    name: 'Doggy Meme Index',
    emoji: '🐕',
    holdings: 150.0,
    votingPower: 3750,
    lockedPower: 2500,
    nextVote: '2d 14h',
    recentEarnings: 234.50,
    performance: 16.2
  },
  {
    symbol: 'CAT_INDEX',
    name: 'Kitty Meme Index',
    emoji: '🐱',
    holdings: 200.0,
    votingPower: 2800,
    lockedPower: 1800,
    nextVote: '1d 8h',
    recentEarnings: 189.30,
    performance: 8.7
  },
  {
    symbol: 'AI_INDEX',
    name: 'AI Revolution Index',
    emoji: '🤖',
    holdings: 75.0,
    votingPower: 3200,
    lockedPower: 400,
    nextVote: '4d 18h',
    recentEarnings: 298.40,
    performance: 12.4
  },
  {
    symbol: 'MEME_INDEX',
    name: 'Ultimate Meme Index',
    emoji: '🎭',
    holdings: 300.0,
    votingPower: 2750,
    lockedPower: 0,
    nextVote: '6d 12h',
    recentEarnings: 125.30,
    performance: -3.2
  }
]

const upcomingVotes = [
  {
    type: 'battle',
    title: 'Trump vs Elon Final',
    timeLeft: '2d 14h',
    recommendedPower: 2500,
    potentialReward: 450,
    priority: 'high'
  },
  {
    type: 'rebalancing',
    title: 'CAT_INDEX Rebalancing',
    timeLeft: '1d 8h',
    recommendedPower: 1800,
    potentialReward: 280,
    priority: 'medium'
  },
  {
    type: 'battle',
    title: 'AI vs Memes',
    timeLeft: '5d 21h',
    recommendedPower: 1200,
    potentialReward: 320,
    priority: 'low'
  }
]

export function VotingPowerManager() {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null)

  const powerUtilization = (votingData.lockedVotingPower / votingData.totalVotingPower) * 100

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Vote className="w-6 h-6 text-slate-400" />
            Voting Power Management
          </h2>
          <p className="text-slate-400 mt-1">Optimize your governance participation and rewards</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className="text-blue-400 border-blue-400/30"
          >
            Rank #{votingData.votingRank}
          </Badge>
          <Button variant="outline" size="sm" className="border-teal text-slate-300 hover:bg-teal-card/50">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* 투표권 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Total</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {votingData.totalVotingPower.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Voting Power</div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Available</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {votingData.availableVotingPower.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Ready to Use</div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">This Week</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${votingData.weeklyRewards}</div>
            <div className="text-sm text-slate-400">Rewards Earned</div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Success</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{votingData.successRate}%</div>
            <div className="text-sm text-slate-400">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* 투표권 사용률 */}
      <Card className="glass-card-dynamic border-teal">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Power Utilization</h3>
            <span className="text-sm text-slate-400">
              {votingData.lockedVotingPower.toLocaleString()} / {votingData.totalVotingPower.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-3">
            <Progress value={powerUtilization} className="h-3" />
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Available: {votingData.availableVotingPower.toLocaleString()}</span>
              <span className="text-slate-300">Locked: {votingData.lockedVotingPower.toLocaleString()}</span>
            </div>
          </div>

          {/* 수익 분해 */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-teal-card/50 rounded-lg">
              <div className="text-lg font-bold text-white">
                ${votingData.weeklyEarnings.battle}
              </div>
              <div className="text-xs text-slate-400">Battle Votes</div>
            </div>
            <div className="text-center p-3 bg-teal-card/50 rounded-lg">
              <div className="text-lg font-bold text-white">
                ${votingData.weeklyEarnings.rebalancing}
              </div>
              <div className="text-xs text-slate-400">Rebalancing</div>
            </div>
            <div className="text-center p-3 bg-teal-card/50 rounded-lg">
              <div className="text-lg font-bold text-white">
                ${votingData.weeklyEarnings.bonus}
              </div>
              <div className="text-xs text-slate-400">Bonus</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 인덱스별 투표권 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card-dynamic border-teal">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              Index Holdings & Voting Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indexHoldings.map((index, i) => (
                <div key={i} className="p-4 bg-teal-card/50 rounded-lg border border-teal">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{index.emoji}</div>
                      <div>
                        <div className="font-medium text-white">{index.symbol}</div>
                        <div className="text-xs text-slate-400">{index.holdings} tokens</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-blue-400">
                        {index.votingPower.toLocaleString()} VP
                      </div>
                      <div className={`text-xs ${
                        index.performance >= 0 ? 'hl-accent-green' : 'hl-accent-red'
                      }`}>
                        {index.performance >= 0 ? '+' : ''}{index.performance}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400">Locked</div>
                      <div className="text-yellow-400 font-medium">
                        {index.lockedPower.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Next Vote</div>
                      <div className="text-white font-medium">{index.nextVote}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Earnings</div>
                      <div className="hl-accent-green font-medium">
                        +${index.recentEarnings}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 예정된 투표 */}
        <Card className="glass-card-dynamic border-teal">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Upcoming Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingVotes.map((vote, i) => (
                <div key={i} className="p-4 bg-teal-card/50 rounded-lg border border-teal">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-white">{vote.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            vote.type === 'battle' 
                              ? 'text-orange-400 border-orange-400/30' 
                              : 'text-purple-400 border-purple-400/30'
                          }`}
                        >
                          {vote.type === 'battle' ? '🥊 Battle' : '⚖️ Rebalancing'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            vote.priority === 'high' 
                              ? 'text-red-400 border-red-400/30'
                              : vote.priority === 'medium'
                              ? 'text-yellow-400 border-yellow-400/30'
                              : 'text-green-400 border-green-400/30'
                          }`}
                        >
                          {vote.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {vote.timeLeft}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400">Recommended</div>
                      <div className="text-blue-400 font-medium">
                        {vote.recommendedPower.toLocaleString()} VP
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Potential Reward</div>
                      <div className="hl-accent-green font-medium">
                        ${vote.potentialReward}
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Set Reminder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 투표 최적화 제안 */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-indigo-400 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Optimization Suggestions</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• <strong>Reallocate Power:</strong> Consider reducing MEME_INDEX voting power due to recent underperformance</p>
                <p>• <strong>Upcoming Opportunity:</strong> Trump vs Elon battle has high reward potential - allocate 2500 VP</p>
                <p>• <strong>Diversification:</strong> Your voting is well-distributed across indexes for risk management</p>
                <p>• <strong>Timing:</strong> 3 votes ending within 48 hours - ensure sufficient available power</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
