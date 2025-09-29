'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Flame,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Clock,
  Award,
  Target,
  Zap,
  Eye,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { TopTrader, TraderFilter, TraderSort } from '@/lib/types/index-trading'
import { allMockIndices } from '@/lib/data/mock-indices'
import { TraderCard } from './trader-card'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TopTradersProps {
  traders: TopTrader[]
  onViewPortfolio: (trader: TopTrader) => void
  onViewProfile?: (trader: TopTrader) => void
  className?: string
  showFilters?: boolean
  maxDisplay?: number
  variant?: 'default' | 'compact'
  initialTimeframe?: TimeframeOption
}

type TimeframeOption = '24h' | '7d' | '30d'
type SortDirection = 'asc' | 'desc'

const timeframeOptions: Array<{
  key: TimeframeOption
  label: string
  description: string
}> = [
  { key: '24h', label: '24H', description: 'Last 24 hours performance' },
  { key: '7d', label: '7D', description: 'Last 7 days performance' },
  { key: '30d', label: '30D', description: 'Last 30 days performance' }
]

const filterOptions: Array<{
  key: TraderFilter
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = [
  { key: 'all', label: 'All Traders', icon: Users, description: 'All active traders' },
  { key: 'top-gainers', label: 'Top Gainers', icon: TrendingUp, description: 'Highest PnL performers' },
  { key: 'high-winrate', label: 'High Win Rate', icon: Target, description: 'Best win rate traders' },
  { key: 'new-traders', label: 'New Traders', icon: Star, description: 'Recently joined traders' },
  { key: 'most-followed', label: 'Most Followed', icon: Users, description: 'Most popular traders' }
]

const sortOptions: Array<{
  key: TraderSort
  label: string
  description: string
}> = [
  { key: 'pnl', label: 'PnL', description: 'Sort by profit and loss' },
  { key: 'winrate', label: 'Win Rate', description: 'Sort by win percentage' },
  { key: 'followers', label: 'Followers', description: 'Sort by follower count' },
  { key: 'trades', label: 'Trades', description: 'Sort by total trades' },
  { key: 'rank', label: 'Rank', description: 'Sort by current rank' }
]

// 순위 변화 애니메이션 컴포넌트
function RankChangeIndicator({ 
  previousRank, 
  currentRank 
}: { 
  previousRank?: number
  currentRank: number 
}) {
  if (!previousRank || previousRank === currentRank) return null
  
  const isUp = previousRank > currentRank
  const change = Math.abs(previousRank - currentRank)
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: isUp ? -180 : 180 }}
      animate={{ scale: 1, rotate: 0 }}
      className={cn(
        "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-semibold",
        isUp 
          ? "bg-green-500/20 text-green-400" 
          : "bg-red-500/20 text-red-400"
      )}
    >
      {isUp ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      <span>{change}</span>
    </motion.div>
  )
}

// 신규 트레이더 하이라이트
function NewTraderHighlight({ trader }: { trader: TopTrader }) {
  if (!trader.isNewTrader) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute -top-1 -right-1 z-10"
    >
      <div className="relative">
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 text-xs">
          <Star className="w-3 h-3 mr-1" />
          NEW
        </Badge>
        {/* 펄스 효과 */}
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
      </div>
    </motion.div>
  )
}

// 메인 Top Traders 컴포넌트
export function TopTraders({
  traders,
  onViewPortfolio,
  onViewProfile,
  className,
  showFilters = true,
  maxDisplay = 50,
  variant = 'default',
  initialTimeframe = '24h',
}: TopTradersProps) {
  const isCompact = variant === 'compact'
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(initialTimeframe)
  const [selectedFilter, setSelectedFilter] = useState<TraderFilter>('all')
  const [sortBy, setSortBy] = useState<TraderSort>(isCompact ? 'pnl' : 'rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>(isCompact ? 'desc' : 'asc')
  const [filteredTraders, setFilteredTraders] = useState<TopTrader[]>(traders)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [expandedView, setExpandedView] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter and sort traders
  useEffect(() => {
    let filtered = [...traders]
    
    // Apply category filter
    switch (selectedFilter) {
      case 'top-gainers':
        const pnlField = selectedTimeframe === '24h' ? 'pnl24h' 
                        : selectedTimeframe === '7d' ? 'pnl7d' 
                        : 'pnl30d'
        filtered = filtered.filter(trader => trader[pnlField] > 0)
        break
      case 'high-winrate':
        filtered = filtered.filter(trader => trader.winRate > 70)
        break
      case 'new-traders':
        filtered = filtered.filter(trader => trader.isNewTrader)
        break
      case 'most-followed':
        // Keep all for followers sorting
        break
      default:
        // 'all' - no additional filtering
        break
    }

    // Apply text search
    const q = search.trim().toLowerCase()
    if (q) {
      filtered = filtered.filter((t) => {
        const ens = t.ens?.toLowerCase() || ''
        const addr = t.address?.toLowerCase() || ''
        const id = t.id?.toLowerCase() || ''
        return ens.includes(q) || addr.includes(q) || id.includes(q)
      })
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'pnl':
          const pnlFieldSort = selectedTimeframe === '24h' 
                                ? (isCompact ? 'pnlPercentage24h' : 'pnl24h') 
                                : selectedTimeframe === '7d' 
                                  ? (isCompact ? 'pnlPercentage7d' : 'pnl7d') 
                                  : (isCompact ? 'pnlPercentage30d' : 'pnl30d')
          comparison = (a[pnlFieldSort] || 0) - (b[pnlFieldSort] || 0)
          break
        case 'winrate':
          comparison = a.winRate - b.winRate
          break
        case 'followers':
          comparison = a.followersCount - b.followersCount
          break
        case 'trades':
          comparison = a.totalTrades - b.totalTrades
          break
        case 'rank':
        default:
          comparison = a.rank - b.rank
          break
      }
      
      return sortDirection === 'desc' ? -comparison : comparison
    })
    
    // Limit display
    filtered = filtered.slice(0, expandedView ? maxDisplay : Math.min(maxDisplay, 20))
    
    setFilteredTraders(filtered)
  }, [traders, selectedFilter, sortBy, sortDirection, selectedTimeframe, expandedView, maxDisplay, search])

  // Handle sort option change with default direction
  const handleSortChange = (newSortBy: TraderSort) => {
    setSortBy(newSortBy)
    // Set appropriate default direction for new sort option
    setSortDirection(newSortBy === 'rank' ? 'asc' : 'desc')
  }

  // Simulate refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const formatPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
  const formatUsd = (v: number) => `${v >= 0 ? '+' : '-'}$${Math.abs(v).toLocaleString()}`
  const getRoiForTimeframe = (t: TopTrader) => {
    return selectedTimeframe === '24h' ? t.pnlPercentage24h : selectedTimeframe === '7d' ? t.pnlPercentage7d : t.pnlPercentage30d
  }

  // Global rank ordering for compact podium/list
  const rankAll = useMemo(() => {
    return [...traders].sort((a, b) => (a.rank || 0) - (b.rank || 0))
  }, [traders])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Skeletons */}
      {(!mounted || isRefreshing) && variant === 'compact' && (
        <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
          {/* Podium skeleton */}
          <div className="p-4 space-y-3">
            <div className="flex justify-center">
              <div className="w-full xl:w-2/3 2xl:w-1/2 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-slate-800"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/2"/>
                    <div className="h-3 bg-slate-800 rounded w-1/3"/>
                  </div>
                  <div className="h-5 bg-slate-800 rounded w-24"/>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {[0,1].map(i => (
                <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-slate-800"/>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-1/2"/>
                      <div className="h-3 bg-slate-800 rounded w-1/4"/>
                    </div>
                    <div className="h-4 bg-slate-800 rounded w-16"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Rows skeleton */}
          <div className="divide-y divide-slate-800">
            {Array.from({length: 6}).map((_,i) => (
              <div key={`s-${i}`} className="px-4 py-3">
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-6 text-slate-800">&nbsp;</div>
                  <div className="w-8 h-8 rounded-full bg-slate-800"/>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-800 rounded w-1/2"/>
                  </div>
                  <div className="h-4 bg-slate-800 rounded w-24"/>
                </div>
                <div className="mt-2 pl-9 flex items-center justify-between animate-pulse">
                  <div className="flex gap-1">
                    <div className="h-4 w-12 bg-slate-800 rounded"/>
                    <div className="h-4 w-12 bg-slate-800 rounded"/>
                  </div>
                  <div className="h-3 w-32 bg-slate-800 rounded"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Header with Stats */}
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Top Traders
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <Link
            href="/traders"
            className="inline-flex items-center justify-center h-8 px-2.5 rounded-md bg-brand text-black hover:bg-brand-hover text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            role="button"
          >
            Leaderboard
          </Link>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={cn(
              "w-4 h-4 mr-2",
              isRefreshing && "animate-spin"
            )} />
            Refresh
          </Button>
          <div className="ml-auto w-full sm:w-64">
            <Input
              placeholder="Search traders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
              aria-label="Search traders"
            />
          </div>
        </div>
        {/* Removed last updated to declutter header */}
      </div>

      {/* Default variant skeletons (list) */}
      {(!mounted || isRefreshing) && variant !== 'compact' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {Array.from({length: 8}).map((_, i) => (
              <div key={`d-s-${i}`} className="px-4 py-3">
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-6 h-4 bg-slate-800 rounded"/>
                  <div className="w-8 h-8 rounded-full bg-slate-800"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3"/>
                    <div className="h-3 bg-slate-800 rounded w-1/4"/>
                  </div>
                  <div className="h-4 bg-slate-800 rounded w-24"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeframe Tabs (hidden in compact variant) */}
      {!isCompact && (
        <div className={cn("flex gap-1 p-1 rounded-lg", 'bg-slate-900/50')}>
          {timeframeOptions.map(({ key, label, description }) => (
            <Button
              key={key}
              size="sm"
              variant={selectedTimeframe === key ? "default" : "ghost"}
              className={cn(
                "flex-1 text-xs h-8 transition-all duration-200",
                selectedTimeframe === key 
                  ? "bg-brand text-black hover:bg-brand-hover" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
              onClick={() => setSelectedTimeframe(key)}
              title={description}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {/* Compact table view for landing: Top 3 thick rows (no podium) */}
      {isCompact ? (
        <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
          {rankAll.length > 0 && (
            <>
              {/* Top 3 — Thick rows */}
              <div className="divide-y divide-slate-800">
                {rankAll.slice(0,3).map((t) => (
                  <button
                    key={t.id}
                    className="w-full text-left px-4 py-4 hover:bg-slate-900/50 transition-colors"
                    onClick={() => onViewPortfolio(t)}
                    aria-label={`Open ${t.ens || t.address} portfolio`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 text-slate-500 font-mono pt-1">{t.rank}</div>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-slate-300 ring-1 ring-slate-700">
                        {t.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{(t.ens || t.address).slice(2,4).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-white font-semibold text-[15px]">{t.ens || `${t.address.slice(0,6)}...${t.address.slice(-4)}`}</span>
                          {/* Medal badge for top 3 */}
                          {t.rank === 1 && (
                            <Badge variant="outline" className="text-[10px] text-yellow-300 border-yellow-400/30">🥇</Badge>
                          )}
                          {t.rank === 2 && (
                            <Badge variant="outline" className="text-[10px] text-slate-300 border-slate-600">🥈</Badge>
                          )}
                          {t.rank === 3 && (
                            <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-600/30">🥉</Badge>
                          )}
                          {t.badges?.includes('🔥') && <span className="text-orange-400 text-xs">🔥</span>}
                        </div>
                        {/* Win/Followers moved to line 2 for consistency */}
                      </div>
                      <div className="text-right">
                        <div className={cn('text-base font-semibold', (t.pnl24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>{formatUsd(t.pnl24h||0)}</div>
                        <div className={cn('text-xs', (t.pnlPercentage24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>{formatPct(t.pnlPercentage24h||0)}</div>
                      </div>
                    </div>
                    <div className="mt-3 pl-9 flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {t.tradingIndices.slice(0,2).map(idxId => {
                          const m = allMockIndices.find(x => x.id === idxId)
                          const label = m?.symbol || idxId.toUpperCase()
                          return (
                            <Link
                              key={idxId}
                              href={`/trading?index=${idxId}`}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700 hover:border-slate-600 hover:text-white"
                              aria-label={`Trade ${label}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {label}
                            </Link>
                          )
                        })}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span>Win {Math.round(t.winRate)}%</span>
                        <span>{t.followersCount?.toLocaleString() ?? 0} followers</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {/* Strong separator between top3 and the rest */}
              <div className="h-px bg-slate-700/60" role="separator" aria-label="Top 3 separator" />
              {/* Rows 4–7 — compact rich rows */}
              <div className="divide-y divide-slate-800">
                {rankAll.slice(3, 7).map((t, idx) => (
                  <div key={t.id} className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-slate-500 font-mono">{t.rank}</div>
                      <button
                        className="flex items-center gap-3 group min-w-0 flex-1 text-left"
                        onClick={() => onViewPortfolio(t)}
                        aria-label={`Open ${t.ens || t.address} portfolio`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-slate-300">
                          {t.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{(t.ens || t.address).slice(2,4).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="truncate text-white font-medium">{t.ens || `${t.address.slice(0,6)}...${t.address.slice(-4)}`}</span>
                      </button>
                      <div className="ml-auto flex items-baseline gap-2">
                        <span className={cn('text-sm font-semibold', (t.pnl24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>{formatUsd(t.pnl24h||0)}</span>
                        <span className={cn('text-xs', (t.pnlPercentage24h||0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                          ({formatPct(t.pnlPercentage24h||0)})
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 pl-9 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {t.tradingIndices.slice(0,2).map(idxId => {
                          const m = allMockIndices.find(x => x.id === idxId)
                          const label = m?.symbol || idxId.toUpperCase()
                          return (
                            <Link
                              key={idxId}
                              href={`/trading?index=${idxId}`}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700 hover:border-slate-600 hover:text-white"
                              aria-label={`Trade ${label}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {label}
                            </Link>
                          )
                        })}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span>Win {Math.round(t.winRate)}%</span>
                        <span>{t.followersCount?.toLocaleString() ?? 0} followers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
      {/* Filters */}
      {showFilters && (
        <div className="space-y-3">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Filter className="w-3 h-3" />
              Filter:
            </div>
            {filterOptions.map(({ key, label, icon: Icon, description }) => (
              <Button
                key={key}
                size="sm"
                variant={selectedFilter === key ? "default" : "outline"}
                className={cn(
                  "text-xs transition-all duration-200",
                  selectedFilter === key 
                    ? "bg-brand text-black hover:bg-brand-hover" 
                    : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
                onClick={() => setSelectedFilter(key)}
                title={description}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            {/* Sort Direction Toggle */}
            <Button
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
              title={`Sort ${sortDirection === 'desc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'desc' ? 
                <ArrowDown className="w-3 h-3" /> : 
                <ArrowUp className="w-3 h-3" />
              }
            </Button>

            {/* Sort By Dropdown */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-7 w-24 text-xs border-slate-700 bg-slate-800/50 text-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {sortOptions.map(({ key, label, description }) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="text-xs text-slate-300 focus:bg-slate-700 focus:text-white"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Traders List */}
      <AnimatePresence mode="wait">
        {filteredTraders.length > 0 ? (
          <motion.div 
            key="traders-list"
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTraders.map((trader, i) => (
              <motion.div
                key={trader.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: Math.min(i * 0.03, 0.3) // Cap delay at 300ms
                }}
                className="relative"
              >
                {/* 순위/하이라이트는 compact 모드에서 비활성화 */}
                {!isCompact && (
                  <div className="absolute top-2 left-2 z-10">
                    <RankChangeIndicator 
                      previousRank={trader.rank + Math.floor(Math.random() * 5) - 2}
                      currentRank={trader.rank}
                    />
                  </div>
                )}
                {!isCompact && <NewTraderHighlight trader={trader} />}
                
                <div
                  onClick={isCompact ? () => onViewPortfolio(trader) : undefined}
                  role={isCompact ? 'button' : undefined}
                  tabIndex={isCompact ? 0 : undefined}
                  className={isCompact ? 'cursor-pointer' : undefined}
                >
                  <TraderCard 
                    trader={trader} 
                    onViewPortfolio={onViewPortfolio}
                    onViewProfile={onViewProfile}
                    timeframe={selectedTimeframe}
                    showPnLChart={!expandedView}
                    variant={expandedView ? "detailed" : "default"}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <Card className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No traders found
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Try adjusting your filter criteria or timeframe
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedFilter('all')
                        setSelectedTimeframe('24h')
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      {filteredTraders.length >= 20 && (
        <div className="text-center pt-4">
          <Button
            onClick={() => setExpandedView(!expandedView)}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            {expandedView ? 'Show Less' : `Show All ${traders.length} Traders`}
            <ChevronDown className={cn(
              "w-4 h-4 ml-2 transition-transform",
              expandedView && "rotate-180"
            )} />
          </Button>
        </div>
      )}
        </>
      )}
    </div>
  )
}

export default TopTraders
