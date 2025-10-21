'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BattleCard } from './battle-card'
import { Flame, Filter } from 'lucide-react'

interface BattleAsset {
  symbol: string
  name: string
  votes: number
  votingPower: number
  proposedChange: number
  emoji: string
}

interface BattleData {
  indexSymbol: string
  indexName: string
  assetA: BattleAsset
  assetB: BattleAsset
  endsAt: string
  status: 'active' | 'upcoming' | 'completed'
  totalVotingPower: number
}

interface VsBattleSectionProps {
  battles?: BattleData[]
}

// Mock battle data
const mockBattles: BattleData[] = [
  {
    indexSymbol: 'DOGIDX',
    indexName: '🐕 Dog Memes Index',
    assetA: {
      symbol: 'DOGE',
      name: 'Dogecoin',
      votes: 12450,
      votingPower: 45000,
      proposedChange: 15,
      emoji: '🐕',
    },
    assetB: {
      symbol: 'SHIB',
      name: 'Shiba Inu',
      votes: 9876,
      votingPower: 35000,
      proposedChange: -15,
      emoji: '🦴',
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    status: 'active',
    totalVotingPower: 89420,
  },
  {
    indexSymbol: 'FROGIDX',
    indexName: '🐸 Frog Memes Index',
    assetA: {
      symbol: 'PEPE',
      name: 'Pepe',
      votes: 18234,
      votingPower: 67000,
      proposedChange: 20,
      emoji: '🐸',
    },
    assetB: {
      symbol: 'WOJAK',
      name: 'Wojak',
      votes: 15678,
      votingPower: 58000,
      proposedChange: -20,
      emoji: '😰',
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    status: 'active',
    totalVotingPower: 78923,
  },
  {
    indexSymbol: 'GMEIDX',
    indexName: '🎮 Gaming Memes Index',
    assetA: {
      symbol: 'AXS',
      name: 'Axie Infinity',
      votes: 8765,
      votingPower: 32000,
      proposedChange: 10,
      emoji: '🎮',
    },
    assetB: {
      symbol: 'SAND',
      name: 'The Sandbox',
      votes: 11234,
      votingPower: 41000,
      proposedChange: -10,
      emoji: '🏖️',
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: 'active',
    totalVotingPower: 34560,
  },
  {
    indexSymbol: 'AIIDX',
    indexName: '🤖 AI Memes Index',
    assetA: {
      symbol: 'TAO',
      name: 'Bittensor',
      votes: 6543,
      votingPower: 24000,
      proposedChange: 12,
      emoji: '🤖',
    },
    assetB: {
      symbol: 'FET',
      name: 'Fetch.ai',
      votes: 5432,
      votingPower: 20000,
      proposedChange: -12,
      emoji: '🧠',
    },
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    status: 'upcoming',
    totalVotingPower: 45670,
  },
]

export function VsBattleSection({ battles = mockBattles }: VsBattleSectionProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>(
    'all'
  )

  const filteredBattles =
    statusFilter === 'all'
      ? battles
      : battles.filter((battle) => battle.status === statusFilter)

  const activeBattleCount = battles.filter((b) => b.status === 'active').length
  const upcomingBattleCount = battles.filter((b) => b.status === 'upcoming').length

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Flame className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">VS Battles Arena</CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  Layer 2 indices battle for asset rebalancing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                {activeBattleCount} Active
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                {upcomingBattleCount} Upcoming
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className={
              statusFilter === 'all'
                ? 'bg-brand text-slate-950 hover:bg-brand/90'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }
          >
            All ({battles.length})
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
            className={
              statusFilter === 'active'
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }
          >
            Active ({activeBattleCount})
          </Button>
          <Button
            variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('upcoming')}
            className={
              statusFilter === 'upcoming'
                ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-600'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }
          >
            Upcoming ({upcomingBattleCount})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
            className={
              statusFilter === 'completed'
                ? 'bg-slate-600 text-white hover:bg-slate-700'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Battle Grid */}
      {filteredBattles.length === 0 ? (
        <Card className="bg-slate-900/30 border-slate-700">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No battles found</h3>
              <p className="text-sm text-slate-400">
                No {statusFilter === 'all' ? '' : statusFilter} battles at the moment
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBattles.map((battle, index) => (
            <BattleCard
              key={index}
              indexSymbol={battle.indexSymbol}
              indexName={battle.indexName}
              assetA={battle.assetA}
              assetB={battle.assetB}
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
