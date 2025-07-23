'use client'

import { BattleVoteCard } from './BattleVoteCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, Clock, Trophy, TrendingUp } from 'lucide-react'

// Mock 데이터
const battleVotes = [
  {
    id: 'trump-vs-elon',
    title: 'Trump vs Elon',
    subtitle: 'Ultimate battle for meme supremacy',
    optionA: {
      name: 'Trump',
      emoji: '🇺🇸',
      votes: 8924,
      percentage: 67.3,
      color: 'red'
    },
    optionB: {
      name: 'Elon',
      emoji: '🚀',
      votes: 4337,
      percentage: 32.7,
      color: 'blue'
    },
    totalVotes: 13261,
    totalPower: 89240000,
    timeLeft: '2d 14h',
    endDate: '2024-01-15',
    status: 'active' as const,
    myVote: {
      option: 'A' as const,
      power: 2500
    },
    rewards: {
      winner: 5000,
      participation: 100
    },
    description: 'The ultimate showdown between political memes and tech memes. Winner takes all index allocation.',
    isHot: true
  },
  {
    id: 'cats-vs-dogs',
    title: 'Cats vs Dogs Final',
    subtitle: 'The eternal pet battle',
    optionA: {
      name: 'Cats',
      emoji: '🐱',
      votes: 5672,
      percentage: 45.2,
      color: 'purple'
    },
    optionB: {
      name: 'Dogs',
      emoji: '🐕',
      votes: 6884,
      percentage: 54.8,
      color: 'orange'
    },
    totalVotes: 12556,
    totalPower: 67340000,
    timeLeft: '1d 3h',
    endDate: '2024-01-13',
    status: 'ending-soon' as const,
    myVote: {
      option: 'B' as const,
      power: 1800
    },
    rewards: {
      winner: 3500,
      participation: 75
    },
    description: 'Classic battle between cat and dog themed meme coins. The winner gets 80% allocation in the ANIMAL_INDEX.',
    isHot: true
  },
  {
    id: 'apple-vs-google',
    title: 'Apple vs Google',
    subtitle: 'Tech giants clash',
    optionA: {
      name: 'Apple',
      emoji: '🍎',
      votes: 3421,
      percentage: 38.7,
      color: 'red'
    },
    optionB: {
      name: 'Google',
      emoji: '📱',
      votes: 5432,
      percentage: 61.3,
      color: 'blue'
    },
    totalVotes: 8853,
    totalPower: 45230000,
    timeLeft: '5d 18h',
    endDate: '2024-01-18',
    status: 'active' as const,
    rewards: {
      winner: 2800,
      participation: 60
    },
    description: 'Battle between Apple and Google themed tokens. Winner gets featured in TECH_INDEX.',
  },
  {
    id: 'pizza-vs-burger',
    title: 'Pizza vs Burger',
    subtitle: 'Food fight championship',
    optionA: {
      name: 'Pizza',
      emoji: '🍕',
      votes: 2156,
      percentage: 41.8,
      color: 'red'
    },
    optionB: {
      name: 'Burger',
      emoji: '🍔',
      votes: 3001,
      percentage: 58.2,
      color: 'yellow'
    },
    totalVotes: 5157,
    totalPower: 28940000,
    timeLeft: '3d 12h',
    endDate: '2024-01-16',
    status: 'active' as const,
    rewards: {
      winner: 1500,
      participation: 40
    },
    description: 'Food meme showdown! The winner joins the exclusive FOOD_MEME_INDEX.',
  }
]

export function BattleVotesSection() {
  const activeBattles = battleVotes.filter(battle => battle.status === 'active')
  const endingSoonBattles = battleVotes.filter(battle => battle.status === 'ending-soon')

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🥊</span>
            Battle Votes
            <Flame className="w-6 h-6 text-orange-400" />
          </h2>
          <p className="text-slate-400 mt-1">
            Winner-takes-all voting battles. Choose your side and go all-in!
          </p>
        </div>
        
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          View All Battles
        </Button>
      </div>

      {/* 곧 종료되는 배틀들 */}
      {endingSoonBattles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Ending Soon</h3>
            <Badge variant="outline" className="text-red-400 border-red-400/30">
              Urgent
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {endingSoonBattles.map((battle) => (
              <BattleVoteCard key={battle.id} battle={battle} />
            ))}
          </div>
        </div>
      )}

      {/* 활성 배틀들 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Active Battles</h3>
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              {activeBattles.length} Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <TrendingUp className="w-4 h-4" />
            Total Rewards: ${battleVotes.reduce((sum, battle) => sum + battle.rewards.winner, 0).toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeBattles.map((battle) => (
            <BattleVoteCard key={battle.id} battle={battle} />
          ))}
        </div>
      </div>

      {/* 배틀 투표 설명 */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">How Battle Votes Work</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• <strong>Winner-takes-all:</strong> Winning option gets 100% allocation in the target index</p>
                <p>• <strong>Voting Power:</strong> Use your VP to influence the outcome</p>
                <p>• <strong>Rewards:</strong> Winners share the reward pool, participation earns base rewards</p>
                <p>• <strong>Strategy:</strong> Vote early for better rewards, but watch the trends!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}