'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Crown,
  FolderOpen,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Zap,
  Star,
  Trophy,
  Diamond,
  Flame,
  Target,
  BarChart3,
  Calendar,
  Percent
} from 'lucide-react'
import { TopTrader } from '@/lib/types/index-trading'
import { cn } from '@/lib/utils'
import { 
  AnimatedNumber, 
  AnimatedPercentage, 
  usePriceFlash,
  scaleHover,
  fadeInUp,
  AnimatedBadge
} from '@/lib/animations/micro-interactions'

interface TraderCardProps {
  trader: TopTrader
  onViewPortfolio: (trader: TopTrader) => void
  onViewProfile?: (trader: TopTrader) => void
  variant?: 'default' | 'compact' | 'detailed'
  timeframe?: '24h' | '7d' | '30d'
  showPnLChart?: boolean
  className?: string
}

// PnL 차트 컴포넌트 (간단한 스파크라인)
function PnLSparkline({ 
  data, 
  className,
  isPositive = true
}: { 
  data: number[], 
  className?: string,
  isPositive?: boolean
}) {
  if (!data || data.length === 0) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = range === 0 ? 50 : 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  const strokeColor = isPositive ? "#10b981" : "#ef4444"
  
  return (
    <div className={cn("relative", className)}>
      <svg className="w-full h-6" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* 배경 그라디언트 */}
        <defs>
          <linearGradient id={`pnl-gradient-${data[0]}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* 배경 영역 */}
        <polygon
          fill={`url(#pnl-gradient-${data[0]})`}
          points={`0,100 ${points} 100,100`}
        />
        
        {/* 메인 라인 */}
        <motion.polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* 끝점 도트 */}
        <motion.circle
          cx={100}
          cy={range === 0 ? 50 : 100 - ((data[data.length - 1] - min) / range) * 100}
          r="1.5"
          fill={strokeColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
      </svg>
    </div>
  )
}

// 순위 배지 컴포넌트
function RankBadge({ rank, className }: { rank: number, className?: string }) {
  if (rank <= 3) {
    const medals = ['🥇', '🥈', '🥉']
    const colors = [
      'from-yellow-500 to-orange-500',
      'from-gray-400 to-gray-500', 
      'from-amber-600 to-yellow-700'
    ]
    
    return (
      <div className={cn(
        `w-8 h-8 bg-gradient-to-br ${colors[rank - 1]} rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg`,
        className
      )}>
        {medals[rank - 1]}
      </div>
    )
  }
  
  if (rank <= 10) {
    return (
      <div className={cn(
        "w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg",
        className
      )}>
        #{rank}
      </div>
    )
  }
  
  return (
    <div className={cn(
      "w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white",
      className
    )}>
      #{rank}
    </div>
  )
}

// 지갑 주소 마스킹 유틸리티
function formatAddress(address: string, ensName?: string): string {
  if (ensName) return ensName
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 배지 아이콘 매핑
const badgeIcons = {
  '🥇': Crown,
  '🥈': Trophy, 
  '🥉': Star,
  '🔥': Flame,
  '⭐': Star,
  '💎': Diamond
}

// 메인 트레이더 카드 컴포넌트
export function TraderCard({
  trader,
  onViewPortfolio,
  onViewProfile,
  variant = 'default',
  timeframe = '24h',
  showPnLChart = true,
  className
}: TraderCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // 시간대별 PnL 선택
  const pnl = timeframe === '24h' ? trader.pnl24h 
             : timeframe === '7d' ? trader.pnl7d 
             : trader.pnl30d
  const pnlPercentage = timeframe === '24h' ? trader.pnlPercentage24h
                       : timeframe === '7d' ? trader.pnlPercentage7d
                       : trader.pnlPercentage30d
  
  const isPositivePnL = pnl >= 0
  
  // Mock PnL 차트 데이터 생성
  const mockPnLData = Array.from({ length: 24 }, (_, i) => {
    const base = trader.pnl24h
    const volatility = Math.abs(base) * 0.3
    return base + (Math.random() - 0.5) * volatility
  })
  
  const cardVariants = {
    ...fadeInUp,
    rest: { 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    hover: { 
      scale: 1.03, 
      y: -8,
      rotateX: 2,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        className={`perspective-1000 ${className}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-brand/10">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RankBadge rank={trader.rank} />
                <div>
                  <div className="text-xs font-medium text-white">
                    {formatAddress(trader.address, trader.ens)}
                  </div>
                  <div className="text-xs text-slate-400">{trader.followersCount} followers</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "text-xs font-semibold",
                  isPositivePnL ? "text-green-400" : "text-red-400"
                )}>
                  <AnimatedNumber 
                    value={pnl}
                    prefix={isPositivePnL ? '+$' : '-$'}
                    duration={800}
                  />
                </div>
                <div className="text-xs text-slate-400">
                  <AnimatedNumber 
                    value={trader.winRate}
                    decimals={1}
                    suffix="%"
                    duration={600}
                    enableFlash={false}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`perspective-1000 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-900/80 relative overflow-hidden group backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-brand/5">
        {/* 배경 그라데이션 효과 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />
        
        <CardContent className="p-4 relative z-10">
          {/* 헤더 - 순위, 주소, 배지 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <RankBadge rank={trader.rank} />
              
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-white">
                    {formatAddress(trader.address, trader.ens)}
                  </div>
                  {trader.isNewTrader && (
                    <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      NEW
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{trader.followersCount.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>{trader.totalTrades} trades</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 배지들 */}
            <div className="flex gap-1">
              {trader.badges?.map((badge, i) => {
                const IconComponent = badgeIcons[badge as keyof typeof badgeIcons]
                return (
                  <motion.div
                    key={i}
                    className="text-sm"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {IconComponent ? <IconComponent className="w-4 h-4 text-yellow-500" /> : badge}
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* PnL 통계 */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <div className="text-xs text-slate-400">PnL ({timeframe})</div>
              <div className={cn(
                "text-sm font-bold",
                isPositivePnL ? "text-green-400" : "text-red-400"
              )}>
                <AnimatedNumber 
                  value={pnl}
                  prefix={isPositivePnL ? '+$' : '-$'}
                  duration={1000}
                />
              </div>
              <div className={cn(
                "text-xs",
                isPositivePnL ? "text-green-400" : "text-red-400"
              )}>
                <AnimatedPercentage 
                  value={pnlPercentage}
                  showSign={true}
                  className="text-xs"
                />
              </div>
            </div>
            
            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Win Rate
              </div>
              <div className="text-sm font-bold text-white">
                <AnimatedNumber 
                  value={trader.winRate}
                  decimals={1}
                  suffix="%"
                  duration={800}
                  enableFlash={false}
                />
              </div>
              <div className="text-xs text-slate-400">
                <AnimatedNumber 
                  value={Math.round(trader.totalTrades * trader.winRate / 100)}
                  suffix=" wins"
                  duration={600}
                  enableFlash={false}
                />
              </div>
            </div>
            
            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Total PnL
              </div>
              <div className={cn(
                "text-sm font-bold",
                trader.totalPnl >= 0 ? "text-green-400" : "text-red-400"
              )}>
                <AnimatedNumber 
                  value={trader.totalPnl}
                  prefix={trader.totalPnl >= 0 ? '+$' : '-$'}
                  duration={1200}
                />
              </div>
              <div className={cn(
                "text-xs",
                trader.totalPnlPercentage >= 0 ? "text-green-400" : "text-red-400"
              )}>
                <AnimatedPercentage 
                  value={trader.totalPnlPercentage}
                  showSign={true}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
          
          {/* PnL 차트 */}
          {showPnLChart && variant !== 'compact' && (
            <div className="mb-3">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                PnL Trend ({timeframe})
              </div>
              <PnLSparkline 
                data={mockPnLData} 
                isPositive={isPositivePnL}
                className="opacity-80"
              />
            </div>
          )}
          
          {/* 포트폴리오 정보 */}
          <div className="bg-slate-800/30 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <div className="text-slate-400">Portfolio Value</div>
              <div className="text-white font-medium">
                ${(trader.totalPnl + 100000).toLocaleString()} {/* 가상의 초기 자본 + 총 수익 */}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <div className="text-slate-400">Active Positions</div>
              <div className="text-white">{trader.tradingIndices.length} indices</div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <div className="text-slate-400">Avg. Position Size</div>
              <div className="text-white">${(Math.abs(trader.totalPnl) / trader.totalTrades * 5).toFixed(0)}</div>
            </div>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-brand text-black hover:bg-brand-hover text-xs h-8 font-semibold"
              onClick={(e) => {
                e.stopPropagation()
                onViewPortfolio(trader)
              }}
            >
              <FolderOpen className="w-3 h-3 mr-1" />
              View Portfolio
            </Button>
            
            {onViewProfile && (
              <Button 
                size="sm" 
                variant="outline" 
                className="px-2 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProfile(trader)
                }}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {/* 호버시 추가 정보 */}
          <AnimatePresence>
            {isHovered && variant === 'detailed' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-700 pt-2 mt-2"
              >
                <div className="text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Active since:</span>
                    <span>{trader.isNewTrader ? 'This week' : 'Long time'}</span>
                  </div>
                  {trader.tradingIndices.length > 0 && (
                    <div className="flex justify-between mt-1">
                      <span>Trading:</span>
                      <span>{trader.tradingIndices.length} indices</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TraderCard