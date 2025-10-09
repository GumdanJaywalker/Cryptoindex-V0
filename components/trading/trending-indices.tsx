'use client'

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  Filter,
  Flame,
  Star,
  Activity,
  BarChart3,
  Clock,
  RefreshCw,
  Search,
  Building2,
  Crown,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { MemeIndex, IndexFilter, SortOption } from '@/lib/types/index-trading'
import useTradingStore from '@/lib/store/trading-store'
import { IndexRow } from './index-row'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { staggerContainer, fadeInUp } from '@/lib/animations/micro-interactions'
import { useVirtualList } from '@/lib/hooks/use-performance'

interface TrendingIndicesProps {
  indices: MemeIndex[]
  onIndexSelect: (index: MemeIndex) => void
  className?: string
}

type SortDirection = 'asc' | 'desc'

const filterOptions: Array<{
  key: IndexFilter
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color?: string
}> = [
  { key: 'all', label: 'All', icon: BarChart3, description: 'All available indices' },
  { key: 'favorites', label: 'Favorites', icon: Star, description: 'Your starred indices' },
  { key: 'hot', label: 'Hot', icon: Flame, description: 'Trending and popular' },
  { key: 'new', label: 'New', icon: Star, description: 'Recently launched' },
  { key: 'gainers', label: 'Top Gainers', icon: TrendingUp, description: 'Best performing 24h' },
  { key: 'losers', label: 'Top Losers', icon: TrendingDown, description: 'Worst performing 24h' },
  { key: 'high-volume', label: 'High Volume', icon: Activity, description: 'Most active trading' },
  { key: 'layer-1', label: 'Layer 1', icon: Building2, description: 'Institutional-grade indices (Low risk)', color: 'text-blue-400 border-blue-400' },
  { key: 'layer-2', label: 'Layer 2', icon: Crown, description: 'Mainstream meme indices (Medium risk)', color: 'text-orange-400 border-orange-400' },
  { key: 'layer-3', label: 'Layer 3', icon: Zap, description: 'Ultra-volatile launchpad (High risk)', color: 'text-red-400 border-red-400' }
]

const sortOptions: Array<{
  key: SortOption
  label: string
  description: string
}> = [
  { key: 'volume', label: 'Volume', description: 'Sort by 24h trading volume' },
  { key: 'change', label: 'Change', description: 'Sort by 24h price change' },
  { key: 'price', label: 'Price', description: 'Sort by current price' },
  { key: 'marketCap', label: 'Market Cap', description: 'Sort by market capitalization' },
  { key: 'name', label: 'Name', description: 'Sort alphabetically' }
]

export function TrendingIndices({ 
  indices, 
  onIndexSelect, 
  className 
}: TrendingIndicesProps) {
  const [selectedFilter, setSelectedFilter] = useState<IndexFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('marketCap')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredIndices, setFilteredIndices] = useState<MemeIndex[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const favorites = useTradingStore((s) => s.favorites)
  const isFavoritesEmpty = selectedFilter === 'favorites' && (!favorites || favorites.length === 0)

  // Initialize client-side time to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  // Removed initial "fill all" behavior to respect active filters (e.g., empty Favorites)

  // Simplified filter and sort - show all indices by default
  useEffect(() => {
    if (!indices.length) return

    // If Favorites filter is active but no favorites are set, show empty list
    if (selectedFilter === 'favorites' && (!favorites || favorites.length === 0)) {
      setFilteredIndices([])
      return
    }

    let filtered = [...indices]
    
    // Only apply search filter if there's actual search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(index => 
        index.name.toLowerCase().includes(query) ||
        index.symbol.toLowerCase().includes(query) ||
        index.description.toLowerCase().includes(query)
      )
    }
    
    // Only apply category filter if not 'all'
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'favorites':
          filtered = filtered.filter(index => favorites.includes(index.id))
          break
        case 'hot':
          filtered = filtered.filter(index => index.isHot)
          break
        case 'new':
          filtered = filtered.filter(index => index.isNew)
          break
        case 'gainers':
          filtered = filtered.filter(index => index.change24h > 0)
          break
        case 'losers':
          filtered = filtered.filter(index => index.change24h < 0)
          break
        case 'layer-1':
          filtered = filtered.filter(index => index.layerInfo?.layer === 'layer-1')
          break
        case 'layer-2':
          filtered = filtered.filter(index => index.layerInfo?.layer === 'layer-2')
          break
        case 'layer-3':
          filtered = filtered.filter(index => index.layerInfo?.layer === 'layer-3')
          break
      }
    }
    
    // Sorting
    filtered.sort((a, b) => {
      // Refined default sort for HOT/NEW filters
      if (sortBy === 'name') {
        if (selectedFilter === 'hot') {
          const ah = a.heatScore ?? (a.isHot ? 100 : 0)
          const bh = b.heatScore ?? (b.isHot ? 100 : 0)
          return bh - ah || a.name.localeCompare(b.name)
        }
        if (selectedFilter === 'new') {
          const ac = a.createdAt ?? 0
          const bc = b.createdAt ?? 0
          return bc - ac || a.name.localeCompare(b.name)
        }
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      // For other sorts, ensure we have valid values
      let aVal = 0, bVal = 0
      switch (sortBy) {
        case 'volume':
          aVal = a.volume24h || 0
          bVal = b.volume24h || 0
          break
        case 'change':
          aVal = a.change24h || 0
          bVal = b.change24h || 0
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
    
    // Favorites-first ordering within the current filtered set
    if (selectedFilter !== 'favorites' && favorites && favorites.length) {
      const favSet = new Set(favorites)
      const favs = filtered.filter(i => favSet.has(i.id))
      const rest = filtered.filter(i => !favSet.has(i.id))
      filtered = [...favs, ...rest]
    }

    setFilteredIndices(filtered)
  }, [indices, selectedFilter, sortBy, sortDirection, searchQuery, favorites])
  // Measure container height for virtualization (robust on mount + resize)
  useEffect(() => {
    if (!containerEl) return
    const ro = new ResizeObserver(() => {
      setContainerHeight(containerEl.clientHeight)
    })
    // Initial measure and observe
    setContainerHeight(containerEl.clientHeight)
    ro.observe(containerEl)
    return () => ro.disconnect()
  }, [containerEl])

  const ROW_HEIGHT = 50
  const { visibleItems, totalHeight, onScroll } = useVirtualList(
    filteredIndices,
    ROW_HEIGHT,
    containerHeight,
    6
  )
  const startIndex = visibleItems.length ? visibleItems[0].index : 0
  const endIndex = visibleItems.length ? visibleItems[visibleItems.length - 1].index : -1
  const topSpacer = startIndex * ROW_HEIGHT
  const bottomSpacer = Math.max(0, filteredIndices.length - endIndex - 1) * ROW_HEIGHT

  const handleHeaderClick = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortDirection('desc')
    }
  }

  // Favorites-first ordering is automatic; no manual toggle persisted

  // Simulate refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-3", className)}>

      {/* Search + CTAs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative max-w-md flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search indices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/trading">
            <Button className="bg-brand text-black hover:bg-brand-hover">Start Trading</Button>
          </Link>
          <Link href="/launch">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">Launch Index</Button>
          </Link>
          {/* Removed View Indices button to simplify landing CTAs */}
        </div>
      </div>

      {/* Filter and Sort Options - Combined Line */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Filter Tabs - Compact */}
        <div className="flex items-center gap-1">
          {filterOptions.map(({ key, label, icon: Icon, description, color }) => (
            <Button
              key={key}
              size="sm"
              variant={selectedFilter === key ? "default" : "ghost"}
              className={cn(
                "text-xs h-6 px-2 transition-all duration-200",
                selectedFilter === key 
                  ? key.startsWith('layer-') && color
                    ? `bg-transparent border ${color} hover:bg-opacity-10`
                    : "bg-brand text-black hover:bg-brand-hover"
                  : key.startsWith('layer-') && color
                    ? `${color} hover:bg-opacity-10`
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
              onClick={() => setSelectedFilter(key as IndexFilter)}
              title={description}
            >
              {label}
            </Button>
          ))}
        </div>


      </div>

      {/* Results Info */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Search className="w-4 h-4" />
          <span>
            Found {filteredIndices.length} result{filteredIndices.length !== 1 ? 's' : ''} 
            for "{searchQuery}"
          </span>
          {filteredIndices.length === 0 && (
            <Button
              onClick={() => setSearchQuery('')}
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2 ml-2 text-brand hover:text-brand-hover"
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Card-constrained internal scroll area */}
      <div className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          {filteredIndices.length > 0 ? (
            <motion.div 
              key={`indices-table-${selectedFilter}-${sortBy}-${sortDirection}`}
              ref={setContainerEl}
              onScroll={onScroll}
              className="bg-slate-900/20 border border-slate-800 rounded-lg overflow-auto overscroll-contain scrollbar-thin min-h-[320px]"
              style={{ height: 'calc(100vh - 16rem)' }}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Table containerClassName="relative w-full overflow-visible">
                <TableHeader>
                  <TableRow className="sticky top-0 z-20 bg-slate-900/80 hover:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
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
                  {topSpacer > 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div style={{ height: topSpacer }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {visibleItems.map(({ item, index }) => (
                    <IndexRow
                      key={item.id}
                      index={item}
                      onSelect={onIndexSelect}
                      rank={index + 1}
                      showQuickTrade={true}
                    />
                  ))}
                  {bottomSpacer > 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div style={{ height: bottomSpacer }} />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <Card className="bg-slate-900/30 border-slate-800">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center gap-4">
                    {isFavoritesEmpty ? (
                      <>
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            No favorites yet
                          </h3>
                          <p className="text-slate-400 text-sm mb-4">
                            Star indices to see them here. Click the star icon on any row.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={() => setSelectedFilter('all' as IndexFilter)}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Browse indices
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            No indices found
                          </h3>
                          <p className="text-slate-400 text-sm mb-4">
                            Try adjusting your search or filter criteria
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setSearchQuery('')}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Clear search
                            </Button>
                            <Button
                              onClick={() => setSelectedFilter('all' as IndexFilter)}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Show all
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Virtualized list removes the need for a manual load-more */}
    </div>
  )
}

export default TrendingIndices
