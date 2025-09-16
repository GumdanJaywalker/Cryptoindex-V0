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
  ExternalLink,
  TrendingUp,
  BarChart3,
  Layers,
  CircleDollarSign
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NetworkStatusWidget from '@/components/sidebar/NetworkStatusWidget'
import { useMarketTrends } from '@/hooks/use-market-data'
import { usePriceAlertsStore } from '@/lib/store/price-alerts'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

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
  const [addAlertOpen, setAddAlertOpen] = useState(false)
  const [alertSymbol, setAlertSymbol] = useState('DOG_INDEX')
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above')
  const [alertPrice, setAlertPrice] = useState('1.00')
  const { alerts, addAlert, removeAlert, toggleActive } = usePriceAlertsStore()
  const { addToast } = useToast()
  
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
      <div className="px-4 lg:px-6 lg:pr-4 py-8 pt-24">
        <div className="grid grid-cols-1 
          lg:grid-cols-[minmax(234px,270px)_minmax(660px,1fr)_minmax(380px,475px)] 
          xl:grid-cols-[minmax(234px,288px)_minmax(792px,1fr)_minmax(380px,512px)] 
          2xl:grid-cols-[minmax(252px,306px)_minmax(968px,1fr)_minmax(400px,548px)] 
          gap-5 xl:gap-6 2xl:gap-8 items-start">
          
          {/* Left Sidebar - Stats & Quick Access (Hidden on mobile, shows after main content) */}
          <div className="space-y-6 order-2 lg:order-1 max-h-[calc(100vh-8rem)] overflow-auto overscroll-contain scrollbar-thin lg:pr-4 lg:border-r lg:border-slate-800">

            {/* Network Status (mock) */}
            <NetworkStatusWidget />

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
                  <span className="text-slate-400 text-sm">Top Gainer 1H</span>
                  <span className="text-green-400 font-medium">+24.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total TVL</span>
                  <span className="text-white font-medium">$2.8B</span>
                </div>
              </div>
            </div>

            {/* Top Movers Card - 브랜드 색상 단순화 */}
            {(() => {
              const trends1h = useMarketTrends('1h')
              const movers = trends1h.data?.topGainers || []
              return (
                <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Top Gainers (1h)</h3>
                  <div className="space-y-2">
                    {trends1h.isLoading && (
                      <div className="text-slate-400 text-sm">Loading…</div>
                    )}
                    {!trends1h.isLoading && movers.length === 0 && (
                      <div className="text-slate-400 text-sm">No data</div>
                    )}
                    {movers.slice(0, 3).map((idx) => (
                      <div key={idx.id} className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-800/30 hover:border-slate-700 border border-transparent transition-colors">
                        <span className="text-white text-sm">{idx.symbol}</span>
                        <span className={`font-semibold ${idx.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {idx.change24h >= 0 ? '+' : ''}{idx.change24h.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

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
                {/* Removed sidebar Start Trading button for cleaner layout */}
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
                  <span className="text-green-400 font-medium">+12.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CAT_INDEX</span>
                  <span className="text-red-400 font-medium">-3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PEPE_INDEX</span>
                  <span className="text-green-400 font-medium">+8.7%</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                  <span className="text-slate-400">New Position</span>
                  <span className="text-brand font-medium text-xs">2m ago</span>
                </div>
              </div>
            </div>

            {/* Price Alerts Card */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Price Alerts</h3>
              <div className="space-y-2 text-sm">
                {alerts.length === 0 ? (
                  <div className="text-slate-400 text-xs">No alerts yet. Create your first alert.</div>
                ) : (
                  alerts.slice(0, 6).map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{a.symbol}</span>
                        <span className="text-slate-400">{a.condition === 'above' ? 'above' : 'below'}</span>
                        <span className="text-brand font-medium">${a.price.toLocaleString()}</span>
                        {!a.active && <span className="text-[10px] text-slate-400">(paused)</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-800"
                          onClick={() => toggleActive(a.id)}
                        >
                          {a.active ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded border border-red-500/40 text-red-300 hover:bg-red-500/10"
                          onClick={() => removeAlert(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <Dialog open={addAlertOpen} onOpenChange={setAddAlertOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full px-3 py-2 text-xs text-brand border border-brand/30 rounded-lg hover:bg-brand/10 transition-colors">
                      + Add Alert
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-950 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Add Price Alert</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-slate-300 text-xs">Symbol</Label>
                          <Input value={alertSymbol} onChange={(e) => setAlertSymbol(e.target.value.toUpperCase())} />
                        </div>
                        <div>
                          <Label className="text-slate-300 text-xs">Condition</Label>
                          <Select value={alertCondition} onValueChange={(v) => setAlertCondition(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="above">Above</SelectItem>
                              <SelectItem value="below">Below</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-300 text-xs">Price (USD)</Label>
                          <Input value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setAddAlertOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-brand text-black hover:bg-brand-hover"
                          onClick={() => {
                            const sym = alertSymbol.trim().toUpperCase()
                            const priceNum = Number(alertPrice)
                            if (!sym || !Number.isFinite(priceNum) || priceNum <= 0) {
                              addToast(createErrorToast('Invalid alert', 'Enter a valid symbol and price'))
                              return
                            }
                            const saved = addAlert({ symbol: sym, condition: alertCondition, price: priceNum })
                            addToast(createSuccessToast('Alert added', `${saved.symbol} ${saved.condition} $${saved.price}`))
                            setAddAlertOpen(false)
                          }}
                        >
                          Save Alert
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
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
          <div className="space-y-6 order-3 lg:order-3 -mt-[2%]">
            {/* Enhanced Top Traders Component */}
            <TopTraders 
              traders={mockTopTraders}
              onViewPortfolio={handleViewPortfolio}
              showFilters={false}
              maxDisplay={7}
              variant="compact"
              initialTimeframe="7d"
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
