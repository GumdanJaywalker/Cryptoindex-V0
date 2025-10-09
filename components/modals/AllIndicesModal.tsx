'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  Filter,
  Flame,
  Star,
  Activity,
  BarChart3,
  Building2,
  Crown,
  Zap,
  ArrowUp,
  ArrowDown,
  Search
} from 'lucide-react'
import { MemeIndex, IndexFilter, SortOption } from '@/lib/types/index-trading'
import { IndexRow } from '@/components/trading/index-row'
import { cn } from '@/lib/utils'

interface AllIndicesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  indices: MemeIndex[]
  initialFilter?: IndexFilter
  onIndexSelect?: (index: MemeIndex) => void
}

type SortDirection = 'asc' | 'desc'

const filterOptions: Array<{
  key: IndexFilter
  label: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}> = [
  { key: 'all', label: 'All', icon: BarChart3 },
  { key: 'favorites', label: 'Favorites', icon: Star },
  { key: 'hot', label: 'Hot', icon: Flame },
  { key: 'new', label: 'New', icon: Star },
  { key: 'gainers', label: 'Top Gainers', icon: TrendingUp },
  { key: 'losers', label: 'Top Losers', icon: TrendingDown },
  { key: 'high-volume', label: 'High Volume', icon: Activity },
  { key: 'layer-1', label: 'Layer 1', icon: Building2, color: 'text-blue-400 border-blue-400' },
  { key: 'layer-2', label: 'Layer 2', icon: Crown, color: 'text-orange-400 border-orange-400' },
  { key: 'layer-3', label: 'Layer 3', icon: Zap, color: 'text-red-400 border-red-400' }
]

export function AllIndicesModal({ 
  open, 
  onOpenChange, 
  indices, 
  initialFilter = 'gainers',
  onIndexSelect 
}: AllIndicesModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<IndexFilter>(initialFilter)
  const [sortBy, setSortBy] = useState<SortOption>('change')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  const handleHeaderClick = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedIndices = (indices || [])
    .filter((index) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !index.name.toLowerCase().includes(query) &&
          !index.symbol.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Category filter
      switch (selectedFilter) {
        case 'all':
          return true
        case 'favorites':
          return index.isFavorite
        case 'hot':
          return index.trending
        case 'new':
          return index.isNew
        case 'gainers':
          return (index.change24h || 0) > 0
        case 'losers':
          return (index.change24h || 0) < 0
        case 'high-volume':
          return (index.volume24h || 0) > 1000000
        case 'layer-1':
          return index.layer === 1
        case 'layer-2':
          return index.layer === 2
        case 'layer-3':
          return index.layer === 3
        default:
          return true
      }
    })
    .sort((a, b) => {
      let aVal = 0
      let bVal = 0

      switch (sortBy) {
        case 'name':
          return sortDirection === 'desc' 
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
        case 'change':
          aVal = a.change24h || 0
          bVal = b.change24h || 0
          break
        case 'volume':
          aVal = a.volume24h || 0
          bVal = b.volume24h || 0
          break
        case 'price':
          aVal = a.currentPrice || 0
          bVal = b.currentPrice || 0
          break
        case 'marketCap':
          aVal = a.marketCap || 0
          bVal = b.marketCap || 0
          break
      }
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-950 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">All Indices</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search indices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 flex-wrap">
            {filterOptions.map(({ key, label, icon: Icon, color }) => (
              <Button
                key={key}
                size="sm"
                variant={selectedFilter === key ? "default" : "ghost"}
                className={cn(
                  "text-xs h-7 px-3 transition-all duration-200",
                  selectedFilter === key 
                    ? key.startsWith('layer-') && color
                      ? `bg-transparent border ${color} hover:bg-opacity-10`
                      : "bg-brand text-black hover:bg-brand-hover"
                    : key.startsWith('layer-') && color
                      ? `${color} hover:bg-opacity-10`
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                onClick={() => setSelectedFilter(key as IndexFilter)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <div className="max-h-[calc(90vh-300px)] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="sticky top-0 z-10 bg-slate-900/95 hover:bg-slate-900/95">
                    <TableHead 
                      className="w-[300px] text-xs text-slate-400 font-medium cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleHeaderClick('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortBy === 'name' && (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[120px] text-xs text-slate-400 font-medium">Chart</TableHead>
                    <TableHead 
                      className="w-[100px] text-xs text-slate-400 font-medium text-right cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleHeaderClick('price')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Price
                        {sortBy === 'price' && (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[100px] text-xs text-slate-400 font-medium text-right cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleHeaderClick('change')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        24h%
                        {sortBy === 'change' && (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[120px] text-xs text-slate-400 font-medium text-right cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleHeaderClick('volume')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Volume
                        {sortBy === 'volume' && (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[120px] text-xs text-slate-400 font-medium text-right cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleHeaderClick('marketCap')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        MCap
                        {sortBy === 'marketCap' && (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-xs text-slate-400 font-medium text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedIndices.length > 0 ? (
                    filteredAndSortedIndices.map((index, idx) => (
                      <IndexRow
                        key={index.id}
                        index={index}
                        onSelect={(i) => {
                          onIndexSelect?.(i)
                          onOpenChange(false)
                        }}
                        rank={idx + 1}
                        showQuickTrade={true}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        No indices found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-slate-400 text-center">
            Showing {filteredAndSortedIndices.length} of {indices?.length || 0} indices
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
