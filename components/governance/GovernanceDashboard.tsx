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
    type: 'rebalancing-battle',
    title: 'DOG_INDEX: DOGE vs Chinese Rapping Dog',
    subtitle: 'Which dog meme deserves higher allocation?',
    timeLeft: '4d 8h',
    myVote: 'Chinese Rapping Dog (+15%)',
    myPower: 3000,
    status: 'active',
    battleEmoji: '🐕 vs 🎤🐕'
  },
  {
    type: 'rebalancing-battle', 
    title: 'CAT_INDEX: Piano Cat vs Grumpy Cat',
    subtitle: 'Battle for the top spot in cat index',
    timeLeft: '2d 14h',
    myVote: 'Piano Cat (+20%)',
    myPower: 2500,
    status: 'active',
    battleEmoji: '🎹🐱 vs 😾'
  },
  {
    type: 'rebalancing-battle',
    title: 'PEPE_INDEX: Rare Pepe vs Sad Pepe',
    subtitle: 'Final battle for quarterly dominance',
    timeLeft: '1d 3h',
    myVote: 'Rare Pepe (+25%)',
    myPower: 1800,
    status: 'ending-soon',
    battleEmoji: '✨🐸 vs 😢🐸'
  }
]

export function GovernanceDashboard() {
  return (
    <div className="space-y-6">
      {/* 헤더 - 브랜드 색상 단순화 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Governance Hub</h1>
          <p className="text-slate-400 mt-1">Shape the future of meme coin indexes</p>
        </div>
        <Badge variant="outline" className="text-brand border-brand/30">
          <Vote className="w-3 h-3 mr-1" />
          Active Voter
        </Badge>
      </div>

      {/* 투표권 요약 카드들 - 브랜드 색상 통일 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-slate-900/50 border-brand/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-brand" />
              <Badge variant="outline" className="text-brand border-brand/30 text-xs">
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

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
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

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
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

        <Card className="bg-slate-900/50 border-brand/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-brand" />
              <Badge variant="outline" className="text-brand border-brand/30 text-xs">
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
            <h2 className="text-xl font-bold text-white">My Active Rebalancing Votes</h2>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              View History
            </Button>
          </div>
          
          <div className="space-y-3">
            {currentWeekVotes.map((vote, index) => (
              <div key={index} className={`p-4 bg-slate-800/30 rounded-lg border transition-colors hover:bg-slate-800/50 ${
                vote.status === 'ending-soon' 
                  ? 'border-brand/50 bg-brand/5' 
                  : 'border-slate-700 hover:border-brand/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{vote.battleEmoji}</div>
                    <div>
                      <div className="font-medium text-white">{vote.title}</div>
                      <div className="text-xs text-slate-400">{vote.subtitle}</div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      vote.status === 'ending-soon' 
                        ? 'text-brand border-brand/40 bg-brand/10' 
                        : 'text-slate-400 border-slate-600'
                    }`}
                  >
                    {vote.status === 'ending-soon' ? 'Ending Soon' : 'Active'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-500">My Vote:</span>
                    <span className="text-brand font-medium ml-2">{vote.myVote}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{vote.myPower.toLocaleString()} VP</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {vote.timeLeft}
                    </span>
                  </div>
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