'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
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
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'

import { MemeIndex, IndexFilter, SortOption } from '@/lib/types/index-trading'
import { IndexRow } from './index-row'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeInUp } from '@/lib/animations/micro-interactions'

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
}> = [
  { key: 'all', label: 'All', icon: BarChart3, description: 'All available indices' },
  { key: 'hot', label: 'Hot', icon: Flame, description: 'Trending and popular' },
  { key: 'new', label: 'New', icon: Star, description: 'Recently launched' },
  { key: 'gainers', label: 'Top Gainers', icon: TrendingUp, description: 'Best performing 24h' },
  { key: 'losers', label: 'Top Losers', icon: TrendingDown, description: 'Worst performing 24h' },
  { key: 'high-volume', label: 'High Volume', icon: Activity, description: 'Most active trading' }
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
  const [sortBy, setSortBy] = useState<SortOption>('name') // Changed to name for consistent sorting
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredIndices, setFilteredIndices] = useState<MemeIndex[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // Initialize client-side time to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  // Initialize filtered indices when component mounts
  useEffect(() => {
    if (indices.length > 0 && filteredIndices.length === 0) {
      setFilteredIndices([...indices].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [indices, filteredIndices.length])

  // Simplified filter and sort - show all indices by default
  useEffect(() => {
    if (!indices.length) return
    
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
      }
    }
    
    // Simple sorting by name for consistency
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
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
    
    setFilteredIndices(filtered)
  }, [indices, selectedFilter, sortBy, sortDirection, searchQuery])

  // Handle sort option change
  const handleSort = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      // Toggle direction if same sort option
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      // Set new sort option with default desc direction
      setSortBy(newSortBy)
      setSortDirection('desc')
    }
  }

  // Simulate refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🔥 Trending Indices
            <Badge variant="outline" className="text-xs">
              {filteredIndices.length}
            </Badge>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {mounted && lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          <RefreshCw className={cn(
            "w-4 h-4 mr-2",
            isRefreshing && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search indices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map(({ key, label, icon: Icon, description }) => (
          <Button
            key={key}
            size="sm"
            variant={selectedFilter === key ? "default" : "outline"}
            className={cn(
              "text-xs transition-all duration-200",
              selectedFilter === key 
                ? "bg-brand text-black hover:bg-brand-hover" 
                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            onClick={() => setSelectedFilter(key as IndexFilter)}
            title={description}
          >
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <ArrowUpDown className="w-3 h-3" />
          Sort by:
        </div>
        {sortOptions.map(({ key, label, description }) => (
          <Button
            key={key}
            size="sm"
            variant="ghost"
            className={cn(
              "text-xs h-7 px-2 transition-all duration-200",
              sortBy === key 
                ? "text-brand bg-brand/10" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
            onClick={() => handleSort(key)}
            title={description}
          >
            {label}
            {sortBy === key && (
              <motion.div
                key={`sort-indicator-${key}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1"
              >
                {sortDirection === 'desc' ? 
                  <TrendingDown className="w-3 h-3" /> : 
                  <TrendingUp className="w-3 h-3" />
                }
              </motion.div>
            )}
          </Button>
        ))}
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

      {/* Indices Table Header */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-t-lg">
        <div className="flex items-center px-4 py-3 text-xs text-slate-400 font-medium">
          <div className="w-8 text-center">#</div>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="min-w-0 flex-1">Name</div>
            <div className="w-20 text-center">Chart</div>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div className="w-24">Price</div>
            <div className="w-20">24h%</div>
            <div className="w-20">Volume</div>
            <div className="w-20">MCap</div>
            <div className="w-16">Actions</div>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Indices Rows */}
      <AnimatePresence mode="wait">
        {filteredIndices.length > 0 ? (
          <motion.div 
            key={`indices-rows-${selectedFilter}-${sortBy}-${sortDirection}`}
            className="bg-slate-900/20 border border-t-0 border-slate-800 rounded-b-lg overflow-hidden"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {filteredIndices.map((index, i) => (
              <IndexRow
                key={index.id}
                index={index} 
                onSelect={onIndexSelect}
                rank={i + 1}
                showQuickTrade={true}
              />
            ))}
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More Button (for future pagination) */}
      {filteredIndices.length > 0 && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            disabled
          >
            <Clock className="w-4 h-4 mr-2" />
            Load More (Coming Soon)
          </Button>
        </div>
      )}
    </div>
  )
}

export default TrendingIndices