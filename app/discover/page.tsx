"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { LeftSidebar } from '@/components/sidebar/LeftSidebar'
import { StickyFooter } from '@/components/layout/Footer'
import { IndexList } from '@/components/discover/index-list'
import { AdvancedFiltersModal, type AdvancedFilters } from '@/components/discover/advanced-filters-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MemeIndex } from '@/lib/types/index-trading'
import { allMockIndices } from '@/lib/data/mock-indexes'

// Main content component
function DiscoverPageContent() {
  const router = useRouter()
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    compositionCoins: [],
    compositionMatchMode: 'any',
  })

  // Apply advanced filters to indices
  const filteredIndices = useMemo(() => {
    let filtered = [...allMockIndices]

    // Composition filter
    if (advancedFilters.compositionCoins.length > 0) {
      filtered = filtered.filter(index => {
        const indexCoins = index.assets.map(a => a.symbol)
        if (advancedFilters.compositionMatchMode === 'all') {
          return advancedFilters.compositionCoins.every(coin => indexCoins.includes(coin))
        } else {
          return advancedFilters.compositionCoins.some(coin => indexCoins.includes(coin))
        }
      })
    }

    // NAV filter
    if (advancedFilters.navMin !== undefined) {
      filtered = filtered.filter(index => index.tvl >= advancedFilters.navMin!)
    }
    if (advancedFilters.navMax !== undefined) {
      filtered = filtered.filter(index => index.tvl <= advancedFilters.navMax!)
    }

    // Performance 24h filter
    if (advancedFilters.performance24hMin !== undefined) {
      filtered = filtered.filter(index => index.change24h >= advancedFilters.performance24hMin!)
    }
    if (advancedFilters.performance24hMax !== undefined) {
      filtered = filtered.filter(index => index.change24h <= advancedFilters.performance24hMax!)
    }

    // Performance 7d filter
    if (advancedFilters.performance7dMin !== undefined) {
      filtered = filtered.filter(index => index.change7d >= advancedFilters.performance7dMin!)
    }
    if (advancedFilters.performance7dMax !== undefined) {
      filtered = filtered.filter(index => index.change7d <= advancedFilters.performance7dMax!)
    }

    // Volume filter
    if (advancedFilters.volumeMin !== undefined) {
      filtered = filtered.filter(index => index.volume24h >= advancedFilters.volumeMin!)
    }

    // Liquidity filter (TVL)
    if (advancedFilters.liquidityMin !== undefined) {
      filtered = filtered.filter(index => index.tvl >= advancedFilters.liquidityMin!)
    }

    return filtered
  }, [advancedFilters])

  // Count active advanced filters
  const advancedFilterCount = useMemo(() => {
    let count = 0
    if (advancedFilters.compositionCoins.length > 0) count++
    if (advancedFilters.navMin !== undefined || advancedFilters.navMax !== undefined) count++
    if (advancedFilters.performance24hMin !== undefined || advancedFilters.performance24hMax !== undefined ||
        advancedFilters.performance7dMin !== undefined || advancedFilters.performance7dMax !== undefined ||
        advancedFilters.performance30dMin !== undefined || advancedFilters.performance30dMax !== undefined) count++
    if (advancedFilters.volumeMin !== undefined || advancedFilters.liquidityMin !== undefined) count++
    return count
  }, [advancedFilters])

  const handleIndexSelect = useCallback((index: MemeIndex) => {
    router.push(`/trading?index=${index.symbol}`)
  }, [router])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] 2xl:grid-cols-[320px_1fr] gap-0">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="pt-16 px-4 lg:px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-1">
                Discover Indexes
              </h1>
              <p className="text-sm text-slate-400">
                Explore curated meme coin indexes with advanced filtering
              </p>
            </div>

            {/* Index List Component */}
            <IndexList
              indices={filteredIndices}
              onIndexSelect={handleIndexSelect}
              onAdvancedFiltersClick={() => setAdvancedFiltersOpen(true)}
              advancedFilterCount={advancedFilterCount}
            />
          </div>
        </main>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        open={advancedFiltersOpen}
        onClose={() => setAdvancedFiltersOpen(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />
    </div>
  )
}

// Main export with Suspense boundary
export default function DiscoverPage() {
  return <DiscoverPageContent />
}
