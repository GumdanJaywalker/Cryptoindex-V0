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
  Zap,
  Users,
  Crown,
  Activity,
  BarChart3,
  Copy,
  ExternalLink,
  TrendingUp
} from 'lucide-react'

// Import mock data and types
import { allMockIndices, mockTopTraders, mockMarketStats } from '@/lib/data/mock-indices'
import { MemeIndex, TopTrader, TraderFilter } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { AnimatedBackground } from '@/components/ui/animated-background'

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
      
      {/* Hero Stats Bar - hidden on mobile (shown in MobileStatusBar) */}
      <div className="bg-slate-900/30 border-b border-slate-800 hidden md:block relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* HyperIndex Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">HyperIndex</h1>
                  <p className="text-xs text-slate-400">Hyper Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-400">24h Volume:</span>
                <span className="text-sm font-semibold text-white">
                  ${(mockMarketStats.totalVolume24h / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">Active Traders:</span>
                <span className="text-sm font-semibold text-white">
                  {mockMarketStats.activeTraders.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-400">Total TVL:</span>
                <span className="text-sm font-semibold text-white">
                  ${(mockMarketStats.totalTVL / 1000000000).toFixed(2)}B
                </span>
              </div>
            </div>
            <Link href="/trading">
              <Button 
                className="bg-brand text-black hover:bg-brand-hover cursor-pointer"
                type="button"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Trading
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          
          {/* Left Side - Trending Indices (70%) */}
          <div className="space-y-6 overflow-visible">
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
            
            {/* View All Button */}
            <div className="text-center">
              <Link href="/trending">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  View All Indices
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Side - Top Traders (30%) */}
          <div className="space-y-6">
            {/* Enhanced Top Traders Component */}
            <TopTraders 
              traders={mockTopTraders}
              onViewPortfolio={handleViewPortfolio}
              showFilters={false} // Keep simple on main page
              maxDisplay={8} // Display only 8 traders on main page
            />
            
            {/* Quick Access Links */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">Quick Access</h3>
              <div className="space-y-2">
                <Link href="/portfolio" className="flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors">
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link href="/governance" className="flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors">
                  <span>Governance</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link href="/vaults" className="flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors">
                  <span>Trading Vaults</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
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
    </div>
  )
}