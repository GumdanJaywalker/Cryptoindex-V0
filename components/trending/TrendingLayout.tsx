'use client'

import { useState } from 'react'
import { FilterBar } from './FilterBar'
import { HeroSection } from './HeroSection'
import { CategorySections } from './CategorySections'

export function TrendingLayout() {
  const [filters, setFilters] = useState({
    timeframe: '24h',
    sortBy: 'volume',
    category: 'all'
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-6 py-8">
        {/* 상단 필터 바 */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />
        
        {/* 히어로 섹션 */}
        <HeroSection />
        
        {/* 카테고리별 섹션 */}
        <CategorySections filters={filters} />
      </div>
    </div>
  )
}