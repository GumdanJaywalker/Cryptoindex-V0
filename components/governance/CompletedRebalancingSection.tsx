'use client'

import { useState, useMemo } from 'react'
import { CompletedRebalancingCard } from './CompletedRebalancingCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

type FilterType = 'all' | 'proposal' | 'vs-battle'

// Mock completed rebalancing data
const mockCompletedRebalancings = [
  {
    id: 'dog-index-q4-2024',
    indexName: 'Doggy Index',
    indexSymbol: 'DOG_INDEX',
    completedDate: 'Jan 10, 2025',
    result: 'passed' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'remove' as const, symbol: 'SHIB', name: 'Shiba Inu', from: 25, to: 0 },
      { type: 'add' as const, symbol: 'BRETT', name: 'Brett', to: 15 },
      { type: 'adjust' as const, symbol: 'WIF', name: 'Dogwifhat', from: 8, to: 20 }
    ],
    totalVotes: 5647,
    totalPower: 45230000,
    passPercentage: 72.5
  },
  {
    id: 'cat-index-jan-2025',
    indexName: 'Kitty Index',
    indexSymbol: 'CAT_INDEX',
    completedDate: 'Jan 8, 2025',
    result: 'passed' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'remove' as const, symbol: 'PURR', name: 'Purr', from: 10, to: 0 },
      { type: 'adjust' as const, symbol: 'POPCAT', name: 'Popcat', from: 25, to: 35 }
    ],
    totalVotes: 4708,
    totalPower: 38940000,
    passPercentage: 68.2
  },
  {
    id: 'dog-vs-shib-dec-2024',
    indexName: 'Doggy Index',
    indexSymbol: 'DOG_INDEX',
    completedDate: 'Dec 28, 2024',
    result: 'passed' as const,
    type: 'vs-battle' as const,
    changes: [
      { type: 'adjust' as const, symbol: 'DOGE', name: 'Dogecoin', from: 30, to: 35 },
      { type: 'adjust' as const, symbol: 'SHIB', name: 'Shiba Inu', from: 30, to: 25 }
    ],
    totalVotes: 8234,
    totalPower: 62340000,
    passPercentage: 64.8
  },
  {
    id: 'ai-index-nov-2024',
    indexName: 'AI Revolution Index',
    indexSymbol: 'AI_INDEX',
    completedDate: 'Nov 15, 2024',
    result: 'rejected' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'adjust' as const, symbol: 'TAO', name: 'Bittensor', from: 20, to: 30 },
      { type: 'add' as const, symbol: 'PRIME', name: 'Echelon Prime', to: 8 }
    ],
    totalVotes: 3456,
    totalPower: 28120000,
    passPercentage: 48.3
  },
  {
    id: 'frog-index-oct-2024',
    indexName: 'Frog Memes Index',
    indexSymbol: 'FROG_INDEX',
    completedDate: 'Oct 20, 2024',
    result: 'passed' as const,
    type: 'vs-battle' as const,
    changes: [
      { type: 'adjust' as const, symbol: 'PEPE', name: 'Pepe', from: 40, to: 50 },
      { type: 'adjust' as const, symbol: 'WOJAK', name: 'Wojak', from: 30, to: 20 }
    ],
    totalVotes: 9876,
    totalPower: 75430000,
    passPercentage: 71.2
  },
  {
    id: 'gaming-index-oct-2024',
    indexName: 'Gaming Memes Index',
    indexSymbol: 'GME_INDEX',
    completedDate: 'Oct 10, 2024',
    result: 'passed' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'add' as const, symbol: 'IMX', name: 'Immutable X', to: 15 },
      { type: 'adjust' as const, symbol: 'AXS', name: 'Axie Infinity', from: 35, to: 25 }
    ],
    totalVotes: 6543,
    totalPower: 48920000,
    passPercentage: 69.7
  },
  {
    id: 'meme-index-sep-2024',
    indexName: 'Meme Lords Index',
    indexSymbol: 'MEME_INDEX',
    completedDate: 'Sep 25, 2024',
    result: 'rejected' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'remove' as const, symbol: 'FLOKI', name: 'Floki Inu', from: 15, to: 0 },
      { type: 'add' as const, symbol: 'BONK', name: 'Bonk', to: 20 }
    ],
    totalVotes: 4321,
    totalPower: 32140000,
    passPercentage: 42.8
  },
  {
    id: 'ai-vs-fet-sep-2024',
    indexName: 'AI Revolution Index',
    indexSymbol: 'AI_INDEX',
    completedDate: 'Sep 15, 2024',
    result: 'passed' as const,
    type: 'vs-battle' as const,
    changes: [
      { type: 'adjust' as const, symbol: 'TAO', name: 'Bittensor', from: 20, to: 25 },
      { type: 'adjust' as const, symbol: 'FET', name: 'Fetch.ai', from: 25, to: 20 }
    ],
    totalVotes: 7654,
    totalPower: 58920000,
    passPercentage: 65.4
  },
  {
    id: 'dog-index-aug-2024',
    indexName: 'Doggy Index',
    indexSymbol: 'DOG_INDEX',
    completedDate: 'Aug 28, 2024',
    result: 'passed' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'add' as const, symbol: 'WIF', name: 'Dogwifhat', to: 10 },
      { type: 'adjust' as const, symbol: 'DOGE', name: 'Dogecoin', from: 40, to: 35 }
    ],
    totalVotes: 8901,
    totalPower: 68340000,
    passPercentage: 73.6
  },
  {
    id: 'cat-vs-mew-aug-2024',
    indexName: 'Kitty Index',
    indexSymbol: 'CAT_INDEX',
    completedDate: 'Aug 15, 2024',
    result: 'passed' as const,
    type: 'vs-battle' as const,
    changes: [
      { type: 'adjust' as const, symbol: 'CAT', name: "Simon's Cat", from: 30, to: 35 },
      { type: 'adjust' as const, symbol: 'MEW', name: 'Cat in a Dogs World', from: 25, to: 20 }
    ],
    totalVotes: 5432,
    totalPower: 42180000,
    passPercentage: 61.3
  },
  {
    id: 'gaming-index-jul-2024',
    indexName: 'Gaming Memes Index',
    indexSymbol: 'GME_INDEX',
    completedDate: 'Jul 30, 2024',
    result: 'rejected' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'remove' as const, symbol: 'SAND', name: 'The Sandbox', from: 20, to: 0 },
      { type: 'add' as const, symbol: 'GALA', name: 'Gala', to: 18 }
    ],
    totalVotes: 3987,
    totalPower: 29870000,
    passPercentage: 47.2
  },
  {
    id: 'frog-index-jul-2024',
    indexName: 'Frog Memes Index',
    indexSymbol: 'FROG_INDEX',
    completedDate: 'Jul 18, 2024',
    result: 'passed' as const,
    type: 'proposal' as const,
    changes: [
      { type: 'adjust' as const, symbol: 'PEPE', name: 'Pepe', from: 35, to: 40 },
      { type: 'add' as const, symbol: 'APU', name: 'Apu Apustaja', to: 10 }
    ],
    totalVotes: 7234,
    totalPower: 56780000,
    passPercentage: 68.9
  }
]

const ITEMS_PER_PAGE = 12

export function CompletedRebalancingSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and search
  const filteredData = useMemo(() => {
    let filtered = mockCompletedRebalancings

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.indexName.toLowerCase().includes(query) ||
        item.indexSymbol.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, filterType])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredData, currentPage])

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter: FilterType) => {
    setFilterType(newFilter)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Rebalancing Completed</h2>
        <p className="text-slate-400 mt-1">
          Browse past rebalancing proposals and their outcomes
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by index name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 glass-input border-teal text-white placeholder:text-slate-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
            className={filterType === 'all' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
          >
            All
          </Button>
          <Button
            variant={filterType === 'proposal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('proposal')}
            className={filterType === 'proposal' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
          >
            Proposals
          </Button>
          <Button
            variant={filterType === 'vs-battle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('vs-battle')}
            className={filterType === 'vs-battle' ? 'bg-brand hover:bg-brand/90 text-black' : 'border-teal text-slate-300 hover:bg-teal-elevated'}
          >
            VS Battles
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-brand border-brand/30">
          {filteredData.length} Results
        </Badge>
      </div>

      {/* Grid */}
      {paginatedData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No completed rebalancing found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((rebalancing) => (
            <CompletedRebalancingCard key={rebalancing.id} rebalancing={rebalancing} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-teal text-slate-300 hover:bg-teal-elevated disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? 'bg-brand hover:bg-brand/90 text-black min-w-[32px]'
                    : 'border-teal text-slate-300 hover:bg-teal-elevated min-w-[32px]'
                }
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="border-teal text-slate-300 hover:bg-teal-elevated disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
