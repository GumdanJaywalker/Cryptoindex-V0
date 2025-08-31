'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  ExternalLink
} from 'lucide-react'

// Import mock data and types
import { allMockIndices, mockTopTraders, mockMarketStats } from '@/lib/data/mock-indices'
import { MemeIndex, TopTrader, TraderFilter } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Header } from '@/components/layout/Header'

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

// Simple sparkline component using SVG
function Sparkline({ data, className }: { data: number[], className?: string }) {
  if (!data || data.length === 0) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = range === 0 ? 50 : 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  const isPositive = data[data.length - 1] > data[0]
  
  return (
    <svg className={cn("w-full h-8", className)} viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth="2"
        points={points}
      />
    </svg>
  )
}

// Legacy IndexCard component - now using enhanced version from components/trading/index-card.tsx

// Legacy TraderCard has been replaced with new TraderCard component

// Main Landing Page Component
export default function Home() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState<MemeIndex | null>(null)
  
  // Memoized data processing - increased to show more cards
  const topIndices = useMemo(() => 
    allMockIndices.slice(0, 16), 
    []
  )
  
  const topGainers = useMemo(() => 
    allMockIndices
      .filter(index => index.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 3), 
    [allMockIndices]
  )
  
  const marketCapFormatted = useMemo(() => 
    `$${(mockMarketStats.totalMarketCap / 1e9).toFixed(1)}B`,
    [mockMarketStats.totalMarketCap]
  )
  
  const handleIndexSelect = useCallback((index: MemeIndex) => {
    setSelectedIndex(index)
    // Navigate to trading page with selected index
    window.location.href = `/trading?index=${index.id}`
  }, [])
  
  const handleViewPortfolio = useCallback((trader: TopTrader) => {
    // Navigate to trader's portfolio page
    console.log('View portfolio:', trader)
    window.location.href = `/portfolio?trader=${trader.id}`
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
      <div className="px-6 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_400px] gap-6">
          
          {/* Left Sidebar - Stats & Quick Access (Hidden on mobile, shows after main content) */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search indices..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand/50 focus:bg-slate-800/70 transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Market Stats Card */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Market Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Volume 24H</span>
                  <span className="text-white font-medium">$12.4M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Active Indices</span>
                  <span className="text-brand font-medium">16</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Top Gainer</span>
                  <span className="text-green-400 font-medium">+24.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total TVL</span>
                  <span className="text-white font-medium">$2.8B</span>
                </div>
              </div>
            </div>

            {/* Top Movers Card - 브랜드 색상 단순화 */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Top Movers</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-brand/5 hover:border-brand/20 border border-transparent transition-colors">
                  <span className="text-white text-sm">DOG_INDEX</span>
                  <span className="text-brand font-semibold">+24.8%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-brand/5 hover:border-brand/20 border border-transparent transition-colors">
                  <span className="text-white text-sm">PEPE_INDEX</span>
                  <span className="text-brand font-semibold">+18.2%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-800/30 hover:border-slate-600 border border-transparent transition-colors">
                  <span className="text-white text-sm">CAT_INDEX</span>
                  <span className="text-slate-400 font-semibold">-12.4%</span>
                </div>
              </div>
            </div>

            {/* Mini Portfolio Card */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Portfolio</h3>
                <Link href="/portfolio" className="text-brand text-xs hover:text-brand/80 transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Total Value</span>
                  <span className="text-white font-semibold">$8,492.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Today's P&L</span>
                  <span className="text-green-400 font-semibold">+$342.18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Total Return</span>
                  <span className="text-green-400 font-semibold">+12.4%</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-slate-400 text-sm">Active Positions</span>
                  <span className="text-brand font-semibold">3</span>
                </div>
                <div className="mt-3">
                  <Link href="/trading" className="block w-full">
                    <button className="w-full px-4 py-2 bg-brand/10 border border-brand/30 rounded-lg text-brand hover:bg-brand/20 transition-colors text-sm font-medium">
                      Start Trading
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity Card - 브랜드 색상 단순화 */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DOG_INDEX</span>
                  <span className="text-brand font-medium">+12.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CAT_INDEX</span>
                  <span className="text-slate-500 font-medium">-3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PEPE_INDEX</span>
                  <span className="text-brand font-medium">+8.7%</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                  <span className="text-slate-400">New Position</span>
                  <span className="text-brand font-medium text-xs">2m ago</span>
                </div>
              </div>
            </div>

            {/* Price Alerts Card - 브랜드 색상 단순화 */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Price Alerts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                  <span className="text-slate-400">DOG_INDEX</span>
                  <span className="text-brand font-medium">$1.25</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                  <span className="text-slate-400">SHIBA_INDEX</span>
                  <span className="text-brand font-medium">$0.89</span>
                </div>
                <button className="w-full px-3 py-2 text-xs text-brand border border-brand/30 rounded-lg hover:bg-brand/10 transition-colors">
                  + Add Alert
                </button>
              </div>
            </div>
          </div>
          
          {/* Center - Trending Indices (First on mobile) */}
          <div className="space-y-6 overflow-visible order-1 lg:order-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  📈 HyperIndex Trading
                </h1>
                <p className="text-slate-400">
                  Trade curated baskets of viral meme coins on Hyper Network with leverage up to 20x
                </p>
              </div>
            </div>
            
            {/* Enhanced Trending Indices Component */}
            <TrendingIndices 
              indices={allMockIndices}
              onIndexSelect={handleIndexSelect}
            />
            
          </div>
          
          {/* Right Side - Top Traders (Second on mobile) */}
          <div className="space-y-6 order-3 lg:order-3">
            {/* Enhanced Top Traders Component */}
            <TopTraders 
              traders={mockTopTraders}
              onViewPortfolio={handleViewPortfolio}
              showFilters={false} // Keep simple on main page
              maxDisplay={8} // Display only 8 traders on main page
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
    </div>
  )
}