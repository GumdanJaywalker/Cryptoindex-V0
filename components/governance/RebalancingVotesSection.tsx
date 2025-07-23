'use client'

import { RebalancingVoteCard } from './RebalancingVoteCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, Clock, AlertTriangle, RefreshCw } from 'lucide-react'

// Mock 데이터
const rebalancingVotes = [
  {
    id: 'dog-index-rebalancing',
    indexName: 'Doggy Index',
    indexSymbol: 'DOG_INDEX',
    emoji: '🐕',
    currentComposition: [
      { symbol: 'DOGE', name: 'Dogecoin', percentage: 35, performance7d: 12.4 },
      { symbol: 'SHIB', name: 'Shiba Inu', percentage: 25, performance7d: -8.2 },
      { symbol: 'FLOKI', name: 'Floki Inu', percentage: 20, performance7d: 15.7 },
      { symbol: 'BONK', name: 'Bonk', percentage: 12, performance7d: -12.3 },
      { symbol: 'WIF', name: 'Dogwifhat', percentage: 8, performance7d: 23.8 }
    ],
    proposedChanges: [
      {
        type: 'remove' as const,
        symbol: 'SHIB',
        name: 'Shiba Inu',
        currentPercentage: 25,
        proposedPercentage: 0,
        reason: 'Poor performance and declining community activity',
        votes: 3421,
        percentage: 68.5
      },
      {
        type: 'add' as const,
        symbol: 'BRETT',
        name: 'Brett',
        proposedPercentage: 15,
        reason: 'Strong community growth and meme potential',
        votes: 2847,
        percentage: 57.2
      },
      {
        type: 'adjust' as const,
        symbol: 'WIF',
        name: 'Dogwifhat',
        currentPercentage: 8,
        proposedPercentage: 20,
        reason: 'Exceptional performance and viral growth',
        votes: 4156,
        percentage: 83.4
      }
    ],
    totalVotes: 5647,
    totalPower: 45230000,
    timeLeft: '4d 8h',
    endDate: '2024-01-17',
    status: 'active' as const,
    myVote: {
      changes: ['SHIB', 'WIF'],
      power: 3000
    },
    threshold: 60,
    description: 'Quarterly rebalancing for DOG_INDEX based on performance metrics and community sentiment.',
    nextRebalanceDate: 'April 15, 2024'
  },
  {
    id: 'cat-index-rebalancing',
    indexName: 'Kitty Index',
    indexSymbol: 'CAT_INDEX',
    emoji: '🐱',
    currentComposition: [
      { symbol: 'CAT', name: 'Simon\'s Cat', percentage: 30, performance7d: 8.4 },
      { symbol: 'POPCAT', name: 'Popcat', percentage: 25, performance7d: 18.7 },
      { symbol: 'MEW', name: 'Cat in a Dogs World', percentage: 20, performance7d: -5.2 },
      { symbol: 'MICHI', name: 'Michi', percentage: 15, performance7d: 12.1 },
      { symbol: 'PURR', name: 'Purr', percentage: 10, performance7d: -15.8 }
    ],
    proposedChanges: [
      {
        type: 'remove' as const,
        symbol: 'PURR',
        name: 'Purr',
        currentPercentage: 10,
        proposedPercentage: 0,
        reason: 'Consistently poor performance and low liquidity',
        votes: 2156,
        percentage: 45.8
      },
      {
        type: 'add' as const,
        symbol: 'GRUMPY',
        name: 'Grumpy Cat',
        proposedPercentage: 12,
        reason: 'New cat meme with strong backing',
        votes: 1847,
        percentage: 39.2
      },
      {
        type: 'adjust' as const,
        symbol: 'POPCAT',
        name: 'Popcat',
        currentPercentage: 25,
        proposedPercentage: 35,
        reason: 'Outstanding performance deserves higher allocation',
        votes: 3421,
        percentage: 72.8
      }
    ],
    totalVotes: 4708,
    totalPower: 38940000,
    timeLeft: '6d 15h',
    endDate: '2024-01-19',
    status: 'active' as const,
    threshold: 55,
    description: 'Monthly rebalancing proposal for CAT_INDEX focusing on performance optimization.',
    nextRebalanceDate: 'February 19, 2024'
  },
  {
    id: 'ai-index-rebalancing',
    indexName: 'AI Revolution Index',
    indexSymbol: 'AI_INDEX',
    emoji: '🤖',
    currentComposition: [
      { symbol: 'FET', name: 'Fetch.ai', percentage: 25, performance7d: 15.2 },
      { symbol: 'RNDR', name: 'Render', percentage: 20, performance7d: -3.4 },
      { symbol: 'TAO', name: 'Bittensor', percentage: 20, performance7d: 28.7 },
      { symbol: 'OCEAN', name: 'Ocean Protocol', percentage: 15, performance7d: 7.8 },
      { symbol: 'GRT', name: 'The Graph', percentage: 10, performance7d: -8.9 },
      { symbol: 'INJ', name: 'Injective', percentage: 10, performance7d: 12.3 }
    ],
    proposedChanges: [
      {
        type: 'adjust' as const,
        symbol: 'TAO',
        name: 'Bittensor',
        currentPercentage: 20,
        proposedPercentage: 30,
        reason: 'Leading AI token with exceptional growth',
        votes: 4892,
        percentage: 89.7
      },
      {
        type: 'add' as const,
        symbol: 'PRIME',
        name: 'Echelon Prime',
        proposedPercentage: 8,
        reason: 'Emerging AI gaming token with strong potential',
        votes: 2341,
        percentage: 43.0
      }
    ],
    totalVotes: 5456,
    totalPower: 52130000,
    timeLeft: '2d 21h',
    endDate: '2024-01-15',
    status: 'ending-soon' as const,
    threshold: 65,
    description: 'Emergency rebalancing for AI_INDEX due to significant market movements.',
    nextRebalanceDate: 'March 15, 2024'
  }
]

export function RebalancingVotesSection() {
  const activeVotes = rebalancingVotes.filter(vote => vote.status === 'active')
  const endingSoonVotes = rebalancingVotes.filter(vote => vote.status === 'ending-soon')

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            Rebalancing Votes
            <RefreshCw className="w-6 h-6 text-purple-400" />
          </h2>
          <p className="text-slate-400 mt-1">
            Vote on index composition changes based on performance and market conditions
          </p>
        </div>
        
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          Rebalancing History
        </Button>
      </div>

      {/* 곧 종료되는 리밸런싱 */}
      {endingSoonVotes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Ending Soon</h3>
            <Badge variant="outline" className="text-red-400 border-red-400/30">
              Urgent
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {endingSoonVotes.map((vote) => (
              <RebalancingVoteCard key={vote.id} rebalancing={vote} />
            ))}
          </div>
        </div>
      )}

      {/* 활성 리밸런싱 투표들 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Active Rebalancing</h3>
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              {activeVotes.length} Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <AlertTriangle className="w-4 h-4" />
            Changes require community consensus
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeVotes.map((vote) => (
            <RebalancingVoteCard key={vote.id} rebalancing={vote} />
          ))}
        </div>
      </div>

      {/* 리밸런싱 투표 설명 */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">How Rebalancing Works</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• <strong>Performance-Based:</strong> Changes proposed based on asset performance and market conditions</p>
                <p>• <strong>Community Consensus:</strong> Requires majority approval to implement changes</p>
                <p>• <strong>Multiple Changes:</strong> Vote for individual changes or combinations</p>
                <p>• <strong>Scheduled Updates:</strong> Regular rebalancing keeps indexes optimized</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}