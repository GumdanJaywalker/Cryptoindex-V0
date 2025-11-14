"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { IndexList } from '@/components/discover/index-list'
import { AdvancedFiltersModal, type AdvancedFilters } from '@/components/discover/advanced-filters-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MemeIndex } from '@/lib/types/index-trading'
import { getAllIndexes } from '@/lib/data/unified-indexes'

// Main content component
function DiscoverPageContent() {
  const router = useRouter()
  const [allIndexes, setAllIndexes] = useState<MemeIndex[]>([])
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    compositionCoins: [],
    compositionMatchMode: 'any',
  })

  // Load unified indexes on mount
  useEffect(() => {
    setAllIndexes(getAllIndexes())
  }, [])

  // Apply advanced filters to indexes
  const filteredIndexes = useMemo(() => {
    let filtered = [...allIndexes]

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
  }, [allIndexes, advancedFilters])

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
    <div className="min-h-screen bg-teal-base text-white">
      <main className="px-4 lg:px-6 py-8">
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
              indexes={filteredIndexes}
              onIndexSelect={handleIndexSelect}
              onAdvancedFiltersClick={() => setAdvancedFiltersOpen(true)}
              advancedFilterCount={advancedFilterCount}
            />
        </div>
      </main>

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
