'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Vote, Trophy, Clock, Zap, Target, TrendingUp } from 'lucide-react'

const userVotingStats = {
  totalVotingPower: 12500,
  activeVotes: 3,
  weeklyEarnings: 847.50,
  successRate: 78.5,
  rank: 142,
  totalVoters: 8924
}

const currentWeekVotes = [
  {
    type: 'battle',
    title: 'Trump vs Elon',
    timeLeft: '2d 14h',
    myVote: 'Trump',
    myPower: 2500,
    status: 'active'
  },
  {
    type: 'rebalancing',
    title: 'DOG_INDEX Rebalancing',
    timeLeft: '4d 8h',
    myVote: 'Remove SHIB',
    myPower: 3000,
    status: 'active'
  },
  {
    type: 'battle',
    title: 'Cats vs Dogs Final',
    timeLeft: '1d 3h',
    myVote: 'Dogs',
    myPower: 1800,
    status: 'ending-soon'
  }
]

export function GovernanceDashboard() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Governance Hub</h1>
          <p className="text-slate-400 mt-1">Shape the future of meme coin indexes</p>
        </div>
        <Badge variant="outline" className="text-purple-400 border-purple-400/30">
          <Vote className="w-3 h-3 mr-1" />
          Active Voter
        </Badge>
      </div>

      {/* 투표권 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                +12%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {userVotingStats.totalVotingPower.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              Total Voting Power
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                {userVotingStats.successRate}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {userVotingStats.activeVotes}
            </div>
            <div className="text-sm text-slate-400">
              Active Votes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                This Week
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${userVotingStats.weeklyEarnings}
            </div>
            <div className="text-sm text-slate-400">
              Voting Rewards
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                Top 2%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              #{userVotingStats.rank}
            </div>
            <div className="text-sm text-slate-400">
              Global Rank
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 이번 주 투표 현황 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">My Active Votes This Week</h2>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              View History
            </Button>
          </div>
          
          <div className="space-y-3">
            {currentWeekVotes.map((vote, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    vote.status === 'ending-soon' ? 'bg-red-400' : 'bg-green-400'
                  }`} />
                  <div>
                    <div className="font-medium text-white">{vote.title}</div>
                    <div className="text-sm text-slate-400">
                      Voted for: <span className="text-blue-400">{vote.myVote}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {vote.myPower.toLocaleString()} VP
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {vote.timeLeft}
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`${
                      vote.status === 'ending-soon' 
                        ? 'text-red-400 border-red-400/30' 
                        : 'text-green-400 border-green-400/30'
                    }`}
                  >
                    {vote.status === 'ending-soon' ? 'Ending Soon' : 'Active'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* 전체 통계 */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                You're ranked #{userVotingStats.rank} out of {userVotingStats.totalVoters.toLocaleString()} voters
              </span>
              <span className="text-blue-400 font-medium">
                Success Rate: {userVotingStats.successRate}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}