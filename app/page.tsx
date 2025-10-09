'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Import mock data and types
import { allMockIndices, mockTopTraders, mockMarketStats } from '@/lib/data/mock-indices'
import { MemeIndex, TopTrader } from '@/lib/types/index-trading'
import TraderDetailsModal from '@/components/trading/trader-details-modal'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Header } from '@/components/layout/Header'
import LeftSidebar from '@/components/sidebar/LeftSidebar'

// Dynamic imports for performance optimization - load after scroll
const TrendingIndices = dynamic(() => import('@/components/trading/trending-indices'), {
  loading: () => (
    <div className="h-96 bg-slate-900/30 rounded-xl border border-slate-800 animate-pulse flex items-center justify-center">
      <div className="text-slate-400">Loading indices...</div>
    </div>
  ),
  ssr: false
})

const TopTraders = dynamic(() => import('@/components/trading/top-traders'), {
  loading: () => (
    <div className="h-96 bg-slate-900/30 rounded-xl border border-slate-800 animate-pulse flex items-center justify-center">
      <div className="text-slate-400">Loading traders...</div>
    </div>
  ),
  ssr: false
})

const MouseParticles = dynamic(() => import('@/components/ui/3d-effects').then(mod => ({ default: mod.MouseParticles })), {
  ssr: false
})

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
  const [traderModalOpen, setTraderModalOpen] = useState(false)
  const [selectedTrader, setSelectedTrader] = useState<TopTrader | null>(null)
  
  const handleIndexSelect = useCallback((index: MemeIndex) => {
    setSelectedIndex(index)
    // Navigate to trading page with selected index
    window.location.href = `/trading?index=${index.id}`
  }, [])
  
  const handleViewPortfolio = useCallback((trader: TopTrader) => {
    // Open trader details modal from Top Traders
    setSelectedTrader(trader)
    setTraderModalOpen(true)
  }, [])

  const handleQuickTrade = useCallback((type: 'buy' | 'sell') => {
    const index = selectedIndex || allMockIndices[0]
    console.log(`Quick ${type} trade for ${index.symbol}`)
    // Navigate to trading page with quick trade action
    router.push(`/trading?index=${index.id}&action=${type}`)
  }, [selectedIndex, allMockIndices, router])

  const handleStartTrading = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    console.log('Navigating to trading page')
    
    // 더 강력한 네비게이션 방법 사용
    try {
      router.push('/trading')
    } catch (error) {
      console.error('Router push failed, using window.location:', error)
      window.location.href = '/trading'
    }
  }, [router])
  
  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {/* Animated Background */}
      <AnimatedBackground variant="combined" intensity="medium" />
      
      {/* 3D Background Grid */}
      <Background3DGrid />
      
      {/* Mouse tracking particles - disabled for cleaner UX */}
      {/* <MouseParticles 
        particleCount={15}
        colors={['#8BD6FF', '#7BC9FF', '#A5E0FF', '#10b981', '#ef4444']}
        size={6}
      /> */}
      
      {/* Unified Header */}
      <Header />
      
      {/* Main Content */}
      <div className="px-[4vw] lg:px-[3vw] lg:pr-[1.5vw] pt-[1.5vw] pb-4 lg:pb-0 lg:h-[calc(100vh-4rem)] -mt-4 lg:overflow-hidden">
        <div className="grid grid-cols-1 
          lg:grid-cols-[minmax(220px,26vw)_minmax(52vw,1fr)_minmax(22vw,28vw)] 
          xl:grid-cols-[minmax(220px,24vw)_minmax(54vw,1fr)_minmax(22vw,28vw)] 
          2xl:grid-cols-[minmax(220px,22vw)_minmax(60vw,1fr)_minmax(22vw,28vw)] 
          gap-1 xl:gap-2 2xl:gap-3 items-start lg:items-stretch lg:h-full">
          
          {/* Left Sidebar - Stats & Quick Access (Hidden on mobile, shows after main content) */}
          <div className="order-2 lg:order-1">
            <LeftSidebar />
          </div>
          
          {/* Center - Trending Indices (First on mobile) */}
          <div className="space-y-6 order-1 lg:order-2 flex flex-col h-[calc(100vh-8rem)] min-h-0">
            {/* Hero CTAs removed (moved next to search in Trending) */}

            {/* KPI strip removed (duplicated in sidebar to maximize indices viewport) */}

            {/* Enhanced Trending Indices Component (card handles its own scroll) */}
            <div id="indices-section" className="min-h-0 flex-1">
              <TrendingIndices
                indices={allMockIndices}
                onIndexSelect={handleIndexSelect}
              />
            </div>
            
          </div>
          
          {/* Right Side - Top Traders (Second on mobile) */}
          <div className="space-y-4 order-3 lg:order-3 lg:-ml-[2vw]">
            {/* Enhanced Top Traders Component */}
            <TopTraders 
              traders={mockTopTraders}
              onViewPortfolio={handleViewPortfolio}
              showFilters={false}
              maxDisplay={7}
              variant="compact"
              initialTimeframe="7d"
              className="scale-[0.9] origin-top-right"
            />
            
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

      {/* Trader details modal */}
      <TraderDetailsModal
        open={traderModalOpen}
        onOpenChange={setTraderModalOpen}
        trader={selectedTrader}
      />
    </div>
  )
}
