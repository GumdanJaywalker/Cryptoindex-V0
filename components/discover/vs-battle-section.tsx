'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BattleCard } from './battle-card'
import { Flame, Filter } from 'lucide-react'

type FilterType = 'all' | 'not-voted' | 'voted' | 'ending-soon'

// Helper function to calculate hours until end
function getHoursUntilEnd(endsAt: string): number {
  const now = Date.now()
  const end = new Date(endsAt).getTime()
  return (end - now) / (1000 * 60 * 60)
}

interface BattleTheme {
  name: string
  emoji: string
  assets: string[]
  votes: number
  votingPower: number
}

interface BattleData {
  indexSymbol: string
  indexName: string
  themeA: BattleTheme
  themeB: BattleTheme
  endsAt: string
  status: 'active' | 'upcoming' | 'completed'
  totalVotingPower: number
  myVote?: 'themeA' | 'themeB' // Track user's vote
}

interface VsBattleSectionProps {
  battles?: BattleData[]
}

// Mock battle data - Theme battles (winner takes all)
const mockBattles: BattleData[] = [
  {
    indexSymbol: 'DVSC',
    indexName: 'Dog vs Cat Index',
    themeA: {
      name: 'Dog Memes',
      emoji: '🐶',
      assets: ['DOGE', 'SHIB', 'WIF'],
      votes: 12450,
      votingPower: 45000,
    },
    themeB: {
      name: 'Cat Memes',
      emoji: '🐱',
      assets: ['POPCAT', 'MEW', 'CAT'],
      votes: 9876,
      votingPower: 35000,
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    status: 'active',
    totalVotingPower: 89420,
    myVote: 'themeA' // User voted for Dog Memes
  },
  {
    indexSymbol: 'FVWI',
    indexName: 'Frog vs Wojak Index',
    themeA: {
      name: 'Frog Memes',
      emoji: '🐸',
      assets: ['PEPE', 'APU', 'FROG'],
      votes: 18234,
      votingPower: 67000,
    },
    themeB: {
      name: 'Wojak Memes',
      emoji: '😔',
      assets: ['WOJAK', 'BOBO', 'NPC'],
      votes: 15678,
      votingPower: 58000,
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    status: 'active',
    totalVotingPower: 78923,
    // No vote yet
  },
  {
    indexSymbol: 'AVGI',
    indexName: 'AI vs Gaming Index',
    themeA: {
      name: 'AI Tokens',
      emoji: '🤖',
      assets: ['TAO', 'FET', 'RNDR'],
      votes: 8765,
      votingPower: 32000,
    },
    themeB: {
      name: 'Gaming Tokens',
      emoji: '🎮',
      assets: ['AXS', 'SAND', 'IMX'],
      votes: 11234,
      votingPower: 41000,
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: 'active',
    totalVotingPower: 34560,
  },
  {
    indexSymbol: 'MVUI',
    indexName: 'Meme vs Utility Index',
    themeA: {
      name: 'Pure Memes',
      emoji: '😂',
      assets: ['DOGE', 'PEPE', 'SHIB'],
      votes: 14532,
      votingPower: 52000,
    },
    themeB: {
      name: 'Utility Tokens',
      emoji: '⚙️',
      assets: ['LINK', 'UNI', 'AAVE'],
      votes: 13876,
      votingPower: 48000,
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    status: 'active',
    totalVotingPower: 67890,
  },
  {
    indexSymbol: 'SVDI',
    indexName: 'Solana vs DeFi Index',
    themeA: {
      name: 'Solana Memes',
      emoji: '☀️',
      assets: ['BONK', 'WIF', 'MYRO'],
      votes: 6543,
      votingPower: 24000,
    },
    themeB: {
      name: 'DeFi Blue Chips',
      emoji: '💎',
      assets: ['AAVE', 'MKR', 'CRV'],
      votes: 5432,
      votingPower: 20000,
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    status: 'upcoming',
    totalVotingPower: 45670,
  },
]

export function VsBattleSection({ battles = mockBattles }: VsBattleSectionProps) {
  const [filterType, setFilterType] = useState<FilterType>('all')

  // Filter and sort battles
  const filteredBattles = useMemo(() => {
    let filtered = battles.filter(b => b.status !== 'upcoming' && b.status !== 'completed')

    // Apply filter
    if (filterType === 'not-voted') {
      filtered = filtered.filter(battle => !battle.myVote)
    } else if (filterType === 'voted') {
      filtered = filtered.filter(battle => battle.myVote)
    } else if (filterType === 'ending-soon') {
      filtered = filtered.filter(battle => getHoursUntilEnd(battle.endsAt) < 24)
    }

    // Sort: not voted first, then by time left
    return filtered.sort((a, b) => {
      // Priority 1: Not voted first
      const aVoted = !!a.myVote
      const bVoted = !!b.myVote
      if (aVoted !== bVoted) {
        return aVoted ? 1 : -1
      }

      // Priority 2: Less time left first
      const aTime = getHoursUntilEnd(a.endsAt)
      const bTime = getHoursUntilEnd(b.endsAt)
      return aTime - bTime
    })
  }, [battles, filterType])

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          VS Battles
        </h2>
        <p className="text-slate-400 mt-1">
          Layer 2 indexes battle for asset rebalancing
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
          className={filterType === 'all' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
        >
          All
        </Button>
        <Button
          variant={filterType === 'not-voted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('not-voted')}
          className={filterType === 'not-voted' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
        >
          Not Voted
        </Button>
        <Button
          variant={filterType === 'voted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('voted')}
          className={filterType === 'voted' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
        >
          Voted
        </Button>
        <Button
          variant={filterType === 'ending-soon' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('ending-soon')}
          className={filterType === 'ending-soon' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
        >
          Ending Soon
        </Button>
      </div>

      {/* Battle Grid */}
      {filteredBattles.length === 0 ? (
        <Card className="glass-card-dynamic">
          <CardContent className="p-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">No battles found</h3>
              <p className="text-sm text-slate-400">
                No {filterType === 'all' ? '' : filterType} battles at the moment
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredBattles.map((battle, index) => (
            <BattleCard
              key={index}
              indexSymbol={battle.indexSymbol}
              indexName={battle.indexName}
              themeA={battle.themeA}
              themeB={battle.themeB}
              endsAt={battle.endsAt}
              status={battle.status}
              totalVotingPower={battle.totalVotingPower}
            />
          ))}
        </div>
      )}
    </div>
  )
}
