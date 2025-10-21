"use client";

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { LeftSidebar } from '@/components/sidebar/LeftSidebar'
import { StickyFooter } from '@/components/layout/Footer'
import { LayerTabs } from '@/components/discover/layer-tabs'
import { IndexFilters } from '@/components/discover/index-filters'
import { IndexDetailCard } from '@/components/discover/index-detail-card'
import { VsBattleSection } from '@/components/discover/vs-battle-section'
import { VirtualizedIndexGrid } from '@/components/discover/virtualized-index-grid'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, TrendingUp, Flame, Rocket, X, Link2, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { IndexLayer, FilterOptions, SortOption } from '@/lib/types/discover'
import { allMockIndices } from '@/lib/data/mock-indices'
import { applyFilters, sortIndices } from '@/lib/utils/filter-indices'
import {
  encodeFiltersToURL,
  decodeFiltersFromURL,
  updateURL,
  getShareableURL,
} from '@/lib/utils/url-sync'
import { toast } from 'react-hot-toast'

export default function DiscoverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL on mount
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<IndexLayer | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    layers: ['layer-1', 'layer-2', 'layer-3'],
    searchQuery: '',
    compositionFilters: [],
    navFilter: null,
    performanceFilter: null,
    rebalancingFilter: null,
    battleFilter: null,
    graduationFilter: null,
  })

  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'volume-24h',
    direction: 'desc',
    label: '24h Volume (High to Low)',
  })

  // Restore state from URL on initial load
  useEffect(() => {
    if (!isInitialized) {
      const decoded = decodeFiltersFromURL(searchParams)
      setFilters(decoded.filters)
      setSortOption(decoded.sortOption)
      setSelectedLayer(decoded.selectedLayer)
      setSearchQuery(decoded.filters.searchQuery)
      setDebouncedSearchQuery(decoded.filters.searchQuery)
      setIsInitialized(true)
    }
  }, [searchParams, isInitialized])

  // Apply filters and sorting
  const filteredAndSortedIndices = useMemo(() => {
    // Update filters with debounced search query
    const activeFilters = {
      ...filters,
      searchQuery: debouncedSearchQuery,
    }

    // Apply all filters
    const filtered = applyFilters(allMockIndices, activeFilters, selectedLayer)

    // Apply sorting
    const sorted = sortIndices(filtered, sortOption)

    return sorted
  }, [filters, debouncedSearchQuery, selectedLayer, sortOption])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.compositionFilters.length > 0) count++
    if (filters.navFilter) count++
    if (filters.performanceFilter) count++
    if (filters.rebalancingFilter) count++
    if (filters.battleFilter) count++
    if (filters.graduationFilter) count++
    if (filters.minVolume24h) count++
    if (filters.minLiquidity) count++
    if (filters.minAge || filters.maxAge) count++
    return count
  }, [filters])

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync state changes to URL
  useEffect(() => {
    if (!isInitialized) return

    const updatedFilters = {
      ...filters,
      searchQuery: debouncedSearchQuery,
    }

    const params = encodeFiltersToURL(updatedFilters, sortOption, selectedLayer)
    updateURL(params)
  }, [filters, debouncedSearchQuery, sortOption, selectedLayer, isInitialized])

  // Copy shareable link to clipboard
  const handleCopyLink = () => {
    const updatedFilters = {
      ...filters,
      searchQuery: debouncedSearchQuery,
    }
    const params = encodeFiltersToURL(updatedFilters, sortOption, selectedLayer)
    const shareableURL = getShareableURL(params)

    navigator.clipboard.writeText(shareableURL).then(() => {
      toast.success('Link copied to clipboard!', {
        duration: 2000,
        position: 'bottom-center',
      })
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] 2xl:grid-cols-[320px_1fr] gap-0">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="pt-16 px-4 lg:px-6 pb-20 md:pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Discover Indexes
                  </h1>
                  <p className="text-lg text-slate-400">
                    Explore curated meme coin indexes across 3 layers
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-brand border-brand/30 px-3 py-1">
                    <Flame className="w-3 h-3 mr-1" />
                    127 Active Indexes
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Layer 1</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                        Institutional
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-slate-500">Low Risk • Monthly Rebalance</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Layer 2</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                        Battle
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white">68</div>
                    <div className="text-xs text-slate-500">Medium Risk • VS Battles</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Layer 3</span>
                      <Badge variant="outline" className="text-brand border-brand/30 text-xs">
                        Launchpad
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white">35</div>
                    <div className="text-xs text-slate-500">High Risk • Bonding Curve</div>
                  </CardContent>
                </Card>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search indexes or composition assets (e.g., 'DOGE')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 relative"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-brand text-slate-950 text-xs h-5 w-5 p-0 flex items-center justify-center">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sort
                </Button>

                <Button
                  variant="outline"
                  className="border-brand/30 text-brand hover:bg-brand/10"
                  onClick={handleCopyLink}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
              <div className="mb-6">
                <IndexFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            )}
            </div>

            {/* Layer Navigation Tabs */}
            <LayerTabs
              selectedLayer={selectedLayer}
              onLayerChange={setSelectedLayer}
            />

            {/* Content Area */}
            <div className="mt-6 space-y-8">
              {/* VS Battle Section (Layer 2 only) */}
              {selectedLayer === 'layer-2' && (
                <VsBattleSection />
              )}

              {/* Index List Header */}
              <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Showing <span className="text-brand font-medium">{filteredAndSortedIndices.length}</span>{' '}
                  {filteredAndSortedIndices.length === 1 ? 'index' : 'indices'}
                  {searchQuery && (
                    <span className="ml-1">
                      for &quot;<span className="text-white">{searchQuery}</span>&quot;
                    </span>
                  )}
                </p>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      layers: ['layer-1', 'layer-2', 'layer-3'],
                      searchQuery: '',
                      compositionFilters: [],
                      navFilter: null,
                      performanceFilter: null,
                      rebalancingFilter: null,
                      battleFilter: null,
                      graduationFilter: null,
                    })}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>

              {/* Index Grid */}
              {filteredAndSortedIndices.length === 0 ? (
                <Card className="bg-slate-900/30 border-slate-700">
                  <CardContent className="p-12">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No indices found</h3>
                      <p className="text-sm text-slate-400 mb-6">
                        Try adjusting your filters or search query
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('')
                          setFilters({
                            layers: ['layer-1', 'layer-2', 'layer-3'],
                            searchQuery: '',
                            compositionFilters: [],
                            navFilter: null,
                            performanceFilter: null,
                            rebalancingFilter: null,
                            battleFilter: null,
                            graduationFilter: null,
                          })
                        }}
                        className="border-slate-700 hover:bg-slate-800"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : filteredAndSortedIndices.length > 20 ? (
                // Use virtualized grid for large lists (> 20 indices)
                <VirtualizedIndexGrid
                  indices={filteredAndSortedIndices}
                  onIndexClick={(index) => router.push(`/trading?index=${index.symbol}`)}
                />
              ) : (
                // Use regular grid for small lists (<= 20 indices)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedIndices.map((index) => (
                    <IndexDetailCard
                      key={index.id}
                      index={index}
                      onClick={() => router.push(`/trading?index=${index.symbol}`)}
                    />
                  ))}
                </div>
              )}
              </div>
            </div>
 
        </main>
      </div>

      <StickyFooter />
    </div>
  )
}
