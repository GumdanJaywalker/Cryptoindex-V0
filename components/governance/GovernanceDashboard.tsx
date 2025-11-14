'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Vote, Trophy, Zap, TrendingUp, Target, Info } from 'lucide-react'

const userVotingStats = {
  activeProposals: 8, // Total active proposals (all ongoing votes)
  myVotes: 3, // Proposals user has voted on
  weeklyEarnings: 0, // Coming Soon - TGE required
  rank: 142,
  totalVoters: 8924
}

// Calculate participation rate
const participationRate = ((userVotingStats.myVotes / userVotingStats.activeProposals) * 100).toFixed(1)

export const currentWeekVotes = [
  {
    type: 'rebalancing-battle',
    title: 'DOG_INDEX: DOGE vs Chinese Rapping Dog',
    subtitle: 'Which dog meme deserves higher allocation?',
    timeLeft: '4d 8h',
    myVote: 'Chinese Rapping Dog (+15%)',
    myPower: 3000,
    status: 'active' as const,
    battleEmoji: ''
  },
  {
    type: 'rebalancing-battle',
    title: 'CAT_INDEX: Piano Cat vs Grumpy Cat',
    subtitle: 'Battle for the top spot in cat index',
    timeLeft: '2d 14h',
    myVote: 'Piano Cat (+20%)',
    myPower: 2500,
    status: 'active' as const,
    battleEmoji: ''
  },
  {
    type: 'rebalancing-battle',
    title: 'PEPE_INDEX: Rare Pepe vs Sad Pepe',
    subtitle: 'Final battle for quarterly dominance',
    timeLeft: '1d 3h',
    myVote: 'Rare Pepe (+25%)',
    myPower: 1800,
    status: 'ending-soon' as const,
    battleEmoji: ''
  }
]

export function GovernanceDashboard() {
  return (
    <div className="space-y-6">
      {/* 헤더 - 브랜드 색상 단순화 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Votes Hub</h1>
          <p className="text-slate-400 mt-1">Shape the future of meme coin indexes</p>
        </div>
        <Badge variant="outline" className="text-brand border-white/10">
          <Vote className="w-3 h-3 mr-1" />
          Active Voter
        </Badge>
      </div>

      {/* 투표권 요약 카드들 - 브랜드 색상 통일 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        <Card className="glass-card-dynamic border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Vote className="w-5 h-5 text-brand" />
              <Badge variant="outline" className="text-brand border-white/10 text-xs">
                Live
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {userVotingStats.activeProposals}
            </div>
            <div className="text-sm text-slate-400">
              Active Proposals
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-brand" />
              <Badge variant="outline" className="text-brand border-white/10 text-xs">
                {participationRate}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {userVotingStats.myVotes}
            </div>
            <div className="text-sm text-slate-400">
              My Votes
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-brand" />
              <Badge variant="outline" className="text-brand border-white/10 text-xs">
                Coming Soon
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1 flex items-baseline gap-1">
              <span>0</span>
              <span className="text-brand text-lg">HIDE</span>
            </div>
            <div className="text-sm text-slate-400 flex items-center gap-1">
              Voting Rewards
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">Earn $HIDE by voting in the 'In' DAO.</p>
                      <p className="text-xs text-slate-400">Native token rewards will be available after TGE (Token Generation Event).</p>
                      <p className="text-xs text-slate-400">Currently unavailable during beta phase.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-brand" />
              <Badge variant="outline" className="text-brand border-white/10 text-xs">
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

    </div>
  )
}
