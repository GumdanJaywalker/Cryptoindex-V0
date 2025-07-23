'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target, 
  Calendar, 
  Star,
  MessageCircle,
  ExternalLink,
  Trophy,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react'

interface UserVaultsProps {
  compact?: boolean
  filters?: {
    search: string
    category: string
    sortBy: string
    riskLevel: string
    minAum: number
  }
}

const userVaults = [
  {
    id: 'crypto-professional',
    manager: {
      name: 'CryptoProfessional',
      avatar: '',
      verified: true,
      rating: 4.9,
      followers: 12847,
      experience: '3+ years',
      tradingStyle: 'Aggressive Growth'
    },
    vault: {
      name: 'Meme Index Master',
      description: 'High-performance meme coin index trading with advanced risk management',
      aum: 8500000,
      apy: 156.8,
      dailyPnl: 18450,
      weeklyPnl: 94720,
      monthlyPnl: 387650,
      maxDrawdown: -12.4,
      winRate: 78.5,
      sharpeRatio: 2.34,
      minDeposit: 100,
      risk: 'High',
      category: 'meme',
      participants: 1256,
      lockPeriod: 0,
      managementFee: 2,
      performanceFee: 25,
      inception: '2024-02-15'
    }
  },
  {
    id: 'ai-trade-bot',
    manager: {
      name: 'AITradeBot',
      avatar: '',
      verified: true,
      rating: 4.7,
      followers: 8934,
      experience: '2+ years',
      tradingStyle: 'Algorithmic'
    },
    vault: {
      name: 'AI Index Alpha',
      description: 'Machine learning powered trading across AI and tech meme coins',
      aum: 6200000,
      apy: 178.4,
      dailyPnl: 15680,
      weeklyPnl: 87340,
      monthlyPnl: 298450,
      maxDrawdown: -18.7,
      winRate: 72.3,
      sharpeRatio: 2.87,
      minDeposit: 500,
      risk: 'High',
      category: 'ai',
      participants: 487,
      lockPeriod: 7,
      managementFee: 2.5,
      performanceFee: 30,
      inception: '2024-01-20'
    }
  },
  {
    id: 'meme-king',
    manager: {
      name: 'MemeKing',
      avatar: '',
      verified: true,
      rating: 4.6,
      followers: 15672,
      experience: '4+ years',
      tradingStyle: 'Trend Following'
    },
    vault: {
      name: 'Animal Memes Fund',
      description: 'Specialized in animal-themed meme coins with community-driven analysis',
      aum: 4800000,
      apy: 132.7,
      dailyPnl: 12340,
      weeklyPnl: 67890,
      monthlyPnl: 234560,
      maxDrawdown: -15.2,
      winRate: 69.8,
      sharpeRatio: 2.12,
      minDeposit: 50,
      risk: 'High',
      category: 'meme',
      participants: 892,
      lockPeriod: 0,
      managementFee: 1.5,
      performanceFee: 20,
      inception: '2023-12-10'
    }
  },
  {
    id: 'safe-trader',
    manager: {
      name: 'SafeTrader',
      avatar: '',
      verified: true,
      rating: 4.8,
      followers: 6234,
      experience: '5+ years',
      tradingStyle: 'Conservative'
    },
    vault: {
      name: 'Conservative DeFi',
      description: 'Low-risk DeFi strategies with consistent returns and capital preservation',
      aum: 12800000,
      apy: 24.3,
      dailyPnl: 8520,
      weeklyPnl: 45670,
      monthlyPnl: 156780,
      maxDrawdown: -3.8,
      winRate: 85.7,
      sharpeRatio: 3.45,
      minDeposit: 25,
      risk: 'Low',
      category: 'defi',
      participants: 1834,
      lockPeriod: 0,
      managementFee: 1,
      performanceFee: 15,
      inception: '2023-09-05'
    }
  },
  {
    id: 'index-master',
    manager: {
      name: 'IndexMaster',
      avatar: '',
      verified: true,
      rating: 4.5,
      followers: 9876,
      experience: '3+ years',
      tradingStyle: 'Index Focused'
    },
    vault: {
      name: 'Diversified Index Pro',
      description: 'Multi-index arbitrage and rebalancing strategies for optimal returns',
      aum: 7300000,
      apy: 89.6,
      dailyPnl: 14230,
      weeklyPnl: 78450,
      monthlyPnl: 267890,
      maxDrawdown: -9.5,
      winRate: 74.2,
      sharpeRatio: 2.67,
      minDeposit: 200,
      risk: 'Medium',
      category: 'index',
      participants: 654,
      lockPeriod: 3,
      managementFee: 1.8,
      performanceFee: 22,
      inception: '2024-03-01'
    }
  },
  {
    id: 'whale-hunter',
    manager: {
      name: 'WhaleHunter',
      avatar: '',
      verified: false,
      rating: 4.2,
      followers: 3456,
      experience: '1+ years',
      tradingStyle: 'High Risk'
    },
    vault: {
      name: 'Moonshot Special',
      description: 'Ultra-high risk, ultra-high reward plays on emerging meme coins',
      aum: 2100000,
      apy: 245.7,
      dailyPnl: 23450,
      weeklyPnl: 123890,
      monthlyPnl: 445670,
      maxDrawdown: -34.6,
      winRate: 58.9,
      sharpeRatio: 1.89,
      minDeposit: 1000,
      risk: 'Extreme',
      category: 'meme',
      participants: 234,
      lockPeriod: 14,
      managementFee: 3,
      performanceFee: 35,
      inception: '2024-05-01'
    }
  }
]

export function UserVaults({ compact = false, filters }: UserVaultsProps) {
  // Filter and sort logic similar to ProtocolVaults
  let filteredVaults = userVaults
  
  if (filters) {
    filteredVaults = userVaults.filter(item => {
      const matchesSearch = !filters.search || 
        item.vault.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.manager.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.vault.description.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesCategory = filters.category === 'all' || item.vault.category === filters.category
      
      const matchesRisk = filters.riskLevel === 'all' || 
        item.vault.risk.toLowerCase() === filters.riskLevel.toLowerCase()
      
      const matchesAum = item.vault.aum >= filters.minAum
      
      return matchesSearch && matchesCategory && matchesRisk && matchesAum
    })

    // Sort vaults
    filteredVaults.sort((a, b) => {
      switch (filters.sortBy) {
        case 'apy': return b.vault.apy - a.vault.apy
        case 'pnl': return b.vault.monthlyPnl - a.vault.monthlyPnl
        case 'age': return new Date(a.vault.inception).getTime() - new Date(b.vault.inception).getTime()
        case 'followers': return b.manager.followers - a.manager.followers
        case 'sharpe': return b.vault.sharpeRatio - a.vault.sharpeRatio
        case 'aum': 
        default: return b.vault.aum - a.vault.aum
      }
    })
  }

  if (compact) {
    filteredVaults = filteredVaults.slice(0, 4)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Manager Vaults</h2>
            <p className="text-sm text-slate-400">Copy trade with top performing managers</p>
          </div>
        </div>
        
        {compact && (
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            View All
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        )}
      </div>

      {/* User Vaults 그리드 */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'}`}>
        {filteredVaults.map((item) => (
          <Card key={item.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6 space-y-4">
              {/* 매니저 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={item.manager.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                      {item.manager.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{item.manager.name}</span>
                      {item.manager.verified && (
                        <Badge variant="outline" className="text-xs text-green-400 border-green-400/30 px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{item.manager.rating}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{item.manager.followers.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    item.vault.risk === 'Low' ? 'text-green-400 border-green-400/30' :
                    item.vault.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/30' :
                    item.vault.risk === 'High' ? 'text-red-400 border-red-400/30' :
                    'text-pink-400 border-pink-400/30'
                  }`}
                >
                  {item.vault.risk}
                </Badge>
              </div>

              {/* Vault 이름 및 설명 */}
              <div>
                <h3 className="font-semibold text-white text-base mb-1">{item.vault.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{item.vault.description}</p>
              </div>

              {/* 주요 지표 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-lg font-bold text-green-400">{item.vault.apy.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-slate-400">APY</div>
                </div>
                
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <BarChart3 className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-lg font-bold text-white">{item.vault.sharpeRatio}</span>
                  </div>
                  <div className="text-xs text-slate-400">Sharpe</div>
                </div>
              </div>

              {/* 성과 통계 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Monthly P&L</span>
                  <span className="text-green-400">+${(item.vault.monthlyPnl / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Win Rate</span>
                  <span className="text-white">{item.vault.winRate}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Max Drawdown</span>
                  <span className="text-red-400">{item.vault.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">AUM</span>
                  <span className="text-white">${(item.vault.aum / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              {/* 투자 정보 */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Min Investment</span>
                  <span className="text-white">${item.vault.minDeposit}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Lock Period</span>
                  <span className="text-white">
                    {item.vault.lockPeriod === 0 ? 'None' : `${item.vault.lockPeriod}d`}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Fees</span>
                  <span className="text-white">{item.vault.managementFee}% + {item.vault.performanceFee}%</span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm">
                  <Target className="w-4 h-4 mr-2" />
                  Copy Trade
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{item.vault.participants} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Since {new Date(item.vault.inception).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredVaults.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Manager Vaults Found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters to see more results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}