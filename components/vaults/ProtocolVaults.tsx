'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar, 
  Zap,
  Building2,
  CheckCircle,
  ExternalLink,
  Info
} from 'lucide-react'

interface ProtocolVaultsProps {
  compact?: boolean
  filters?: {
    search: string
    category: string
    sortBy: string
    riskLevel: string
    minAum: number
  }
}

const protocolVaults = [
  {
    id: 'hlp-main',
    name: 'HyperLiquid Protocol Vault',
    description: 'Official protocol vault providing liquidity to HyperLiquid perpetual exchange',
    aum: 45800000,
    apy: 23.8,
    dailyPnl: 12450,
    weeklyPnl: 84730,
    monthlyPnl: 347820,
    tvl: 125000000,
    utilization: 76.5,
    minDeposit: 100,
    maxCapacity: 50000000,
    risk: 'Low',
    verified: true,
    category: 'protocol',
    features: ['Automated MM', 'Risk Management', 'Protocol Backed'],
    participants: 2847,
    lockPeriod: 0,
    withdrawalFee: 0,
    managementFee: 0,
    performanceFee: 15,
    inception: '2023-08-15'
  },
  {
    id: 'index-protocol',
    name: 'CryptoIndex Protocol Vault',
    description: 'Diversified meme coin index vault managed by protocol algorithms',
    aum: 18500000,
    apy: 67.3,
    dailyPnl: 8920,
    weeklyPnl: 62340,
    monthlyPnl: 198450,
    tvl: 32000000,
    utilization: 82.4,
    minDeposit: 50,
    maxCapacity: 25000000,
    risk: 'Medium',
    verified: true,
    category: 'index',
    features: ['Index Rebalancing', 'Governance Voting', 'Auto Compounding'],
    participants: 1256,
    lockPeriod: 0,
    withdrawalFee: 0.1,
    managementFee: 1,
    performanceFee: 20,
    inception: '2024-01-10'
  },
  {
    id: 'ai-protocol',
    name: 'AI Trading Protocol Vault',
    description: 'Advanced AI algorithms for automated trading across multiple indexes',
    aum: 9200000,
    apy: 94.7,
    dailyPnl: 15680,
    weeklyPnl: 89450,
    monthlyPnl: 287650,
    tvl: 15000000,
    utilization: 91.2,
    minDeposit: 500,
    maxCapacity: 12000000,
    risk: 'High',
    verified: true,
    category: 'ai',
    features: ['ML Algorithms', '24/7 Trading', 'Risk Optimization'],
    participants: 487,
    lockPeriod: 7,
    withdrawalFee: 0.2,
    managementFee: 2,
    performanceFee: 25,
    inception: '2024-03-01'
  },
  {
    id: 'defi-protocol',
    name: 'DeFi Yield Protocol Vault',
    description: 'Conservative yield farming across established DeFi protocols',
    aum: 12800000,
    apy: 15.4,
    dailyPnl: 5430,
    weeklyPnl: 34820,
    monthlyPnl: 127860,
    tvl: 20000000,
    utilization: 64.2,
    minDeposit: 25,
    maxCapacity: 20000000,
    risk: 'Low',
    verified: true,
    category: 'defi',
    features: ['Yield Farming', 'LP Strategies', 'Stable Returns'],
    participants: 1834,
    lockPeriod: 0,
    withdrawalFee: 0,
    managementFee: 0.5,
    performanceFee: 10,
    inception: '2023-11-20'
  }
]

export function ProtocolVaults({ compact = false, filters }: ProtocolVaultsProps) {
  // Filter vaults based on filters if provided
  let filteredVaults = protocolVaults
  
  if (filters) {
    filteredVaults = protocolVaults.filter(vault => {
      const matchesSearch = !filters.search || 
        vault.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        vault.description.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesCategory = filters.category === 'all' || vault.category === filters.category
      
      const matchesRisk = filters.riskLevel === 'all' || 
        vault.risk.toLowerCase() === filters.riskLevel.toLowerCase()
      
      const matchesAum = vault.aum >= filters.minAum
      
      return matchesSearch && matchesCategory && matchesRisk && matchesAum
    })

    // Sort vaults
    filteredVaults.sort((a, b) => {
      switch (filters.sortBy) {
        case 'apy': return b.apy - a.apy
        case 'pnl': return b.monthlyPnl - a.monthlyPnl
        case 'age': return new Date(a.inception).getTime() - new Date(b.inception).getTime()
        case 'followers': return b.participants - a.participants
        case 'aum': 
        default: return b.aum - a.aum
      }
    })
  }

  if (compact) {
    filteredVaults = filteredVaults.slice(0, 3)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Protocol Vaults</h2>
            <p className="text-sm text-slate-400">Official protocol-managed investment strategies</p>
          </div>
        </div>
        
        {compact && (
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            View All
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        )}
      </div>

      {/* Protocol Vaults 리스트 */}
      <div className="space-y-4">
        {filteredVaults.map((vault) => (
          <Card key={vault.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row gap-6">
                {/* 왼쪽: 기본 정보 */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{vault.name}</h3>
                          {vault.verified && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{vault.description}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`${
                        vault.risk === 'Low' ? 'text-green-400 border-green-400/30' :
                        vault.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/30' :
                        'text-red-400 border-red-400/30'
                      } text-xs`}
                    >
                      {vault.risk} Risk
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {vault.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-blue-400 border-blue-400/30">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* 용량 및 활용도 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Capacity Utilization</span>
                      <span className="text-white">{vault.utilization}%</span>
                    </div>
                    <Progress value={vault.utilization} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>AUM: ${(vault.aum / 1000000).toFixed(1)}M</span>
                      <span>Max: ${(vault.maxCapacity / 1000000).toFixed(0)}M</span>
                    </div>
                  </div>
                </div>

                {/* 가운데: 성과 지표 */}
                <div className="xl:w-80 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-lg font-bold text-green-400">{vault.apy}%</span>
                      </div>
                      <div className="text-xs text-slate-400">APY</div>
                    </div>
                    
                    <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-lg font-bold text-white">{vault.participants.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-400">Participants</div>
                    </div>
                  </div>

                  {/* P&L 통계 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Daily P&L</span>
                      <span className="text-green-400">+${vault.dailyPnl.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Weekly P&L</span>
                      <span className="text-green-400">+${vault.weeklyPnl.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Monthly P&L</span>
                      <span className="text-green-400">+${vault.monthlyPnl.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 투자 정보 및 액션 */}
                <div className="xl:w-64 space-y-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Min Deposit</span>
                      <span className="text-white">${vault.minDeposit}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Lock Period</span>
                      <span className="text-white">
                        {vault.lockPeriod === 0 ? 'None' : `${vault.lockPeriod} days`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Management Fee</span>
                      <span className="text-white">{vault.managementFee}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Performance Fee</span>
                      <span className="text-white">{vault.performanceFee}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Target className="w-4 h-4 mr-2" />
                      Invest Now
                    </Button>
                    
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                      <Info className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      Since {new Date(vault.inception).toLocaleDateString()}
                    </div>
                  </div>
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
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Protocol Vaults Found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters to see more results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}