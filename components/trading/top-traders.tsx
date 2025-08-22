'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown,
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
  ChevronDown
} from 'lucide-react'
import { TopTrader, TraderFilter, TraderSort } from '@/lib/types/index-trading'
import { TraderCard } from './trader-card'
import { cn } from '@/lib/utils'

interface TopTradersProps {
  traders: TopTrader[]
  onViewPortfolio: (trader: TopTrader) => void
  onViewProfile?: (trader: TopTrader) => void
  className?: string
  showFilters?: boolean
  maxDisplay?: number
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
  { key: 'most-followed', label: 'Most Followed', icon: Crown, description: 'Most popular traders' }
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
  maxDisplay = 50
}: TopTradersProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('24h')
  const [selectedFilter, setSelectedFilter] = useState<TraderFilter>('all')
  const [sortBy, setSortBy] = useState<TraderSort>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filteredTraders, setFilteredTraders] = useState<TopTrader[]>(traders)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [expandedView, setExpandedView] = useState(false)

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
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'pnl':
          const pnlFieldSort = selectedTimeframe === '24h' ? 'pnl24h' 
                              : selectedTimeframe === '7d' ? 'pnl7d' 
                              : 'pnl30d'
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
  }, [traders, selectedFilter, sortBy, sortDirection, selectedTimeframe, expandedView, maxDisplay])

  // Handle sort option change
  const handleSort = (newSortBy: TraderSort) => {
    if (sortBy === newSortBy) {
      // Toggle direction if same sort option
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      // Set new sort option with appropriate default direction
      setSortBy(newSortBy)
      setSortDirection(newSortBy === 'rank' ? 'asc' : 'desc')
    }
  }

  // Simulate refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Top Traders
            <Badge variant="outline" className="text-xs">
              {filteredTraders.length}
            </Badge>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Last updated: {mounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          <RefreshCw className={cn(
            "w-4 h-4 mr-2",
            isRefreshing && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>

      {/* Timeframe Tabs */}
      <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg">
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
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <ArrowUpDown className="w-3 h-3" />
              Sort by:
            </div>
            {sortOptions.map(({ key, label, description }) => (
              <Button
                key={key}
                size="sm"
                variant="ghost"
                className={cn(
                  "text-xs h-7 px-2 transition-all duration-200",
                  sortBy === key 
                    ? "text-brand bg-brand/10" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                onClick={() => handleSort(key)}
                title={description}
              >
                {label}
                {sortBy === key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1"
                  >
                    {sortDirection === 'desc' ? 
                      <TrendingDown className="w-3 h-3" /> : 
                      <TrendingUp className="w-3 h-3" />
                    }
                  </motion.div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Traders List */}
      <AnimatePresence mode="wait">
        {filteredTraders.length > 0 ? (
          <motion.div 
            key="traders-list"
            className="space-y-3"
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
                {/* 순위 변화 표시 */}
                <div className="absolute top-2 left-2 z-10">
                  <RankChangeIndicator 
                    previousRank={trader.rank + Math.floor(Math.random() * 5) - 2} // Mock previous rank
                    currentRank={trader.rank}
                  />
                </div>
                
                {/* 신규 트레이더 하이라이트 */}
                <NewTraderHighlight trader={trader} />
                
                <TraderCard 
                  trader={trader} 
                  onViewPortfolio={onViewPortfolio}
                  onViewProfile={onViewProfile}
                  timeframe={selectedTimeframe}
                  showPnLChart={!expandedView}
                  variant={expandedView ? "detailed" : "default"}
                />
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
    </div>
  )
}

export default TopTraders