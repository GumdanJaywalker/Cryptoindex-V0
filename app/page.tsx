'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Import data sources and types
import { getAllIndexes } from '@/lib/data/unified-indexes'
import { mockTopTraders } from '@/lib/data/mock-indexes'
import { MemeIndex, TopTrader } from '@/lib/types/index-trading'
import { IndexData } from '@/lib/types/index'
import { convertMemeIndexToIndexData } from '@/lib/utils/index-converter'
import { IndexCarousel } from '@/components/landing/IndexCarousel'
import { TraderCarousel } from '@/components/landing/TraderCarousel'
import IndexDetailsModal from '@/components/portfolio/IndexDetailsModal'

// Dynamic imports for performance optimization
const SmartFloatingTradeButton = dynamic(() => import('@/components/mobile/floating-trade-button').then(mod => ({ default: mod.SmartFloatingTradeButton })), {
  ssr: false
})

// Main Landing Page Component
export default function Home() {
  const router = useRouter()
  const [allIndexes, setAllIndexes] = useState<MemeIndex[]>([])
  const [selectedIndex, setSelectedIndex] = useState<IndexData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Load unified indexes on mount
  useEffect(() => {
    setAllIndexes(getAllIndexes())
  }, [])

  const handleIndexClick = useCallback((index: MemeIndex) => {
    // Convert MemeIndex to IndexData for the modal
    const indexData = convertMemeIndexToIndexData(index)
    setSelectedIndex(indexData)
    setModalOpen(true)
  }, [])

  const handleQuickTrade = useCallback((type: 'buy' | 'sell') => {
    if (!selectedIndex) return
    console.log(`Quick ${type} trade for ${selectedIndex.symbol}`)
    // Navigate to trading page with quick trade action
    router.push(`/trade?index=${selectedIndex.symbol}&action=${type}`)
  }, [selectedIndex, router])
  
  return (
    <div className="min-h-screen bg-teal-base text-white relative">
      {/* Main Content */}
      <div className="px-4 lg:px-6 py-8 bg-teal-base relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left - Trending Indices */}
          <div className="space-y-4">
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Trending Indexes
                </h2>
                <p className="text-slate-400 text-sm">
                  Explore the hottest crypto indexes right now
                </p>
              </div>
              <IndexCarousel
                indexes={allIndexes.slice(0, 12)}
                onCardClick={handleIndexClick}
              />
            </div>
          </div>

          {/* Right - Top Performers */}
          <div className="space-y-4">
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Top Performers
                </h2>
                <p className="text-slate-400 text-sm">
                  Most profitable traders this week
                </p>
              </div>
              <TraderCarousel
                traders={mockTopTraders.slice(0, 12)}
                autoRotate={true}
                autoRotateInterval={5000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating trade button */}
      <SmartFloatingTradeButton
        onQuickTrade={handleQuickTrade}
        selectedIndex={selectedIndex?.symbol || 'MEME'}
        position="bottom-right"
        autoHide={true}
      />

      {/* Index details modal */}
      <IndexDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        index={selectedIndex}
      />
    </div>
  )
}
