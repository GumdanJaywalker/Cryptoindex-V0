'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useCurrency } from '@/lib/hooks/useCurrency'
import {
  MessageSquare,
  Users,
  Waves,
  Trophy,
  TrendingUp,
  TrendingDown,
  Eye,
  AlertTriangle,
  Crown,
  Zap,
  Target
} from 'lucide-react'

// Mock data for different tabs
const mockFeedItems = [
  { 
    type: 'whale', 
    message: 'Whale Alert: Large MEME_INDEX purchase detected', 
    time: '2m ago', 
    value: '+$125K',
    sentiment: 'bullish' 
  },
  { 
    type: 'pnl', 
    message: '@crypto_king realized massive gains on DOG_INDEX', 
    time: '5m ago', 
    value: '+234%',
    sentiment: 'bullish' 
  },
  { 
    type: 'sentiment', 
    message: 'Market sentiment shifting bullish on AI_INDEX', 
    time: '8m ago', 
    value: '85%',
    sentiment: 'bullish' 
  },
  { 
    type: 'holder', 
    message: 'Top holder @whale_007 increased CAT_INDEX position', 
    time: '12m ago', 
    value: '+5.2%',
    sentiment: 'neutral' 
  },
]

const mockTopHolders = [
  { rank: 1, address: '0x1a2b...c3d4', percentage: 12.5, value: 2450000, change24h: 2.3, isWhale: true },
  { rank: 2, address: '0x5e6f...g7h8', percentage: 8.7, value: 1698000, change24h: -1.2, isWhale: true },
  { rank: 3, address: '0x9i0j...k1l2', percentage: 6.3, value: 1230000, change24h: 0.8, isWhale: false },
  { rank: 4, address: '0xm3n4...o5p6', percentage: 5.1, value: 996000, change24h: 4.5, isWhale: false },
  { rank: 5, address: '0xq7r8...s9t0', percentage: 4.8, value: 936000, change24h: -0.5, isWhale: false },
]

const mockWhaleAlerts = [
  { 
    type: 'buy', 
    amount: 250000, 
    asset: 'MEME_INDEX', 
    address: '0x1a2b...c3d4', 
    time: '3m ago',
    impact: 'high',
    price: 2.45 
  },
  { 
    type: 'sell', 
    amount: 180000, 
    asset: 'DOG_INDEX', 
    address: '0x5e6f...g7h8', 
    time: '12m ago',
    impact: 'medium',
    price: 1.82 
  },
  { 
    type: 'buy', 
    amount: 320000, 
    asset: 'AI_INDEX', 
    address: '0x9i0j...k1l2', 
    time: '25m ago',
    impact: 'high',
    price: 3.21 
  },
  { 
    type: 'transfer', 
    amount: 150000, 
    asset: 'CAT_INDEX', 
    address: '0xm3n4...o5p6', 
    time: '1h ago',
    impact: 'low',
    price: 1.56 
  },
]

const mockPnlLeaderboard = [
  { rank: 1, trader: '@crypto_king', pnl: 45600, pnlPercent: 234.5, trades: 12, winRate: 85.7, badge: 'legend' },
  { rank: 2, trader: '@whale_master', pnl: 32400, pnlPercent: 189.2, trades: 8, winRate: 78.3, badge: 'expert' },
  { rank: 3, trader: '@moon_rider', pnl: 28900, pnlPercent: 167.8, trades: 15, winRate: 71.2, badge: 'expert' },
  { rank: 4, trader: '@diamond_hands', pnl: 21700, pnlPercent: 134.6, trades: 9, winRate: 82.1, badge: 'pro' },
  { rank: 5, trader: '@bull_slayer', pnl: 18300, pnlPercent: 121.4, trades: 6, winRate: 89.5, badge: 'pro' },
]

export function CommunityFeed() {
  const [activeTab, setActiveTab] = useState('feed')
  const { formatBalance, formatPrice, formatPnL, formatVolume } = useCurrency()

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'legend': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'expert': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'pro': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      default: return 'bg-teal-card/70 text-slate-300'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="h-full bg-teal-base flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Tab Headers */}
        <TabsList className="grid grid-cols-4 bg-teal-card border-b border-teal rounded-none h-8">
          <TabsTrigger value="feed" className="text-xs data-[state=active]:bg-blue-600 px-1">
            <MessageSquare className="w-3 h-3 mr-1" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="holders" className="text-xs data-[state=active]:bg-purple-600 px-1">
            <Users className="w-3 h-3 mr-1" />
            Holders
          </TabsTrigger>
          <TabsTrigger value="whale" className="text-xs data-[state=active]:bg-orange-600 px-1">
            <Waves className="w-3 h-3 mr-1" />
            Whale
          </TabsTrigger>
          <TabsTrigger value="pnl" className="text-xs data-[state=active]:bg-green-600 px-1">
            <Trophy className="w-3 h-3 mr-1" />
            P&L
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          {/* Community Feed Tab */}
          <TabsContent value="feed" className="h-full m-0">
            <div className="h-full flex flex-col">
              {/* Market Sentiment Bar */}
              <div className="bg-teal-card border-b border-teal p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Market Sentiment</span>
                  <Badge className="bg-green-600 text-white text-xs">Bullish 78%</Badge>
                </div>
                <Progress value={78} className="h-1" />
              </div>

              {/* Feed Items */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {mockFeedItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-teal-card rounded-lg p-2 hover:bg-teal-card/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'whale' ? 'bg-orange-400' :
                          item.type === 'pnl' ? 'bg-green-400' :
                          item.type === 'sentiment' ? 'bg-yellow-400' :
                          'bg-purple-400'
                        }`}></div>
                        <span className="text-xs text-slate-400">{item.time}</span>
                      </div>
                      <div className={`text-xs font-mono ${
                        item.value.startsWith('+') ? 'text-green-400' : 
                        item.value.startsWith('-') ? 'text-red-400' : 'text-white'
                      }`}>
                        {item.value}
                      </div>
                    </div>
                    <div className="text-xs text-white">
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Top Holders Tab */}
          <TabsContent value="holders" className="h-full m-0 p-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Top Holders</span>
                <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                  Top 5
                </Badge>
              </div>
              
              {mockTopHolders.map((holder) => (
                <div key={holder.rank} className="bg-teal-card rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {holder.rank}
                      </div>
                      {holder.isWhale && <Crown className="w-3 h-3 text-yellow-400" />}
                      <span className="text-xs font-mono text-slate-300">
                        {holder.address}
                      </span>
                    </div>
                    <div className={`text-xs ${holder.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holder.change24h >= 0 ? '+' : ''}{holder.change24h}%
                    </div>
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{holder.percentage}%</span>
                      <span className="text-white">{formatBalance(holder.value)}</span>
                    </div>
                    <Progress value={holder.percentage} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Whale Alert Tab */}
          <TabsContent value="whale" className="h-full m-0 p-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Whale Alerts</span>
                <Badge variant="outline" className="text-orange-400 border-orange-400/30 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              
              {mockWhaleAlerts.map((alert, index) => (
                <div key={index} className="bg-teal-card rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        alert.type === 'buy' ? 'bg-green-600' : 
                        alert.type === 'sell' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {alert.type === 'buy' ? (
                          <TrendingUp className="w-2 h-2 text-white" />
                        ) : alert.type === 'sell' ? (
                          <TrendingDown className="w-2 h-2 text-white" />
                        ) : (
                          <Zap className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span className="text-xs capitalize text-white font-medium">
                        {alert.type}
                      </span>
                      <Badge className={`text-xs ${getImpactColor(alert.impact)}`} variant="outline">
                        {alert.impact}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>
                  
                  <div className="text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>{formatBalance(alert.amount)} {alert.asset}</span>
                      <span>@ {formatPrice(alert.price)}</span>
                    </div>
                    <div className="text-slate-500 mt-1 font-mono">
                      {alert.address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* P&L Leaderboard Tab */}
          <TabsContent value="pnl" className="h-full m-0 p-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">P&L Leaders</span>
                <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                  24h
                </Badge>
              </div>
              
              {mockPnlLeaderboard.map((trader) => (
                <div key={trader.rank} className="bg-teal-card rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {trader.rank}
                      </div>
                      <span className="text-xs font-medium text-white">
                        {trader.trader}
                      </span>
                      <Badge className={`text-xs ${getBadgeColor(trader.badge)}`}>
                        {trader.badge}
                      </Badge>
                    </div>
                    <div className="text-xs text-green-400 font-mono">
                      +{trader.pnlPercent}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">PnL:</span>
                      <span className="text-green-400 ml-1">+{formatBalance(trader.pnl)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Trades:</span>
                      <span className="text-white ml-1">{trader.trades}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Win:</span>
                      <span className="text-blue-400 ml-1">{trader.winRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>

        {/* Bottom Stats Bar */}
        <div className="h-8 bg-teal-card border-t border-teal flex items-center px-2 text-xs">
          <div className="flex space-x-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-400">Online:</span>
              <span className="text-green-400">1,234</span>
            </div>
            <div>
              <span className="text-slate-400">24h Vol:</span>
              <span className="text-white ml-1">$2.4M</span>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}