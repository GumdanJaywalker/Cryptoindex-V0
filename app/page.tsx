'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Import mock data and types
import { allMockIndices, mockTopTraders } from '@/lib/data/mock-indexes'
import { MemeIndex, TopTrader } from '@/lib/types/index-trading'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Header } from '@/components/layout/Header'
import LeftSidebar from '@/components/sidebar/LeftSidebar'
import { IndexCarousel } from '@/components/landing/IndexCarousel'
import { TraderCarousel } from '@/components/landing/TraderCarousel'
import IndexDetailModal from '@/components/modals/IndexDetailModal'

// Dynamic imports for performance optimization
const Background3DGrid = dynamic(() => import('@/components/ui/3d-effects').then(mod => ({ default: mod.Background3DGrid })), {
  ssr: false
})

const SmartFloatingTradeButton = dynamic(() => import('@/components/mobile/floating-trade-button').then(mod => ({ default: mod.SmartFloatingTradeButton })), {
  ssr: false
})

// Main Landing Page Component
export default function Home() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState<MemeIndex | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleIndexClick = useCallback((index: MemeIndex) => {
    setSelectedIndex(index)
    setModalOpen(true)
  }, [])

  const handleQuickTrade = useCallback((type: 'buy' | 'sell') => {
    const index = selectedIndex || allMockIndices[0]
    console.log(`Quick ${type} trade for ${index.symbol}`)
    // Navigate to trading page with quick trade action
    router.push(`/trading?index=${index.id}&action=${type}`)
  }, [selectedIndex, router])
  
  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground variant="combined" intensity="medium" />
        <Background3DGrid />
      </div>

      {/* Unified Header */}
      <Header />

      {/* Main Content */}
      <div className="px-4 lg:px-4 pt-16 pb-4 lg:pb-0 bg-slate-950 relative z-10 min-h-screen">
        <div className="grid grid-cols-1
          lg:grid-cols-[260px_1fr_340px]
          xl:grid-cols-[280px_1fr_360px]
          2xl:grid-cols-[300px_1fr_380px]
          gap-4 items-center">

          {/* Left Sidebar - Stats & Quick Access */}
          <div className="order-2 lg:order-1">
            <LeftSidebar />
          </div>

          {/* Center - Trending Indices Carousel (2x2 Grid) */}
          <div className="space-y-4 order-1 lg:order-2 pb-8">
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Trending Indexes
                </h2>
                <p className="text-slate-400 text-sm">
                  Explore the hottest meme coin indices right now
                </p>
              </div>
              <IndexCarousel
                indices={allMockIndices.slice(0, 12)}
                onCardClick={handleIndexClick}
              />
            </div>
          </div>

          {/* Right Side - Top Performers Carousel */}
          <div className="space-y-4 order-3 lg:order-3 lg:sticky lg:top-20 pb-8">
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
                traders={mockTopTraders.slice(0, 5)}
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
      <IndexDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        index={selectedIndex}
      />
    </div>
  )
}
