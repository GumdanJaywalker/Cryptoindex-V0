'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowUpDown, 
  Clock, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  Zap,
  Network,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react'

const networkData = {
  totalVolume24h: 2847500,
  totalTransactions: 15847,
  avgProcessingTime: 2.3,
  activeBridges: 6,
  hyperliquidBalance: 125430.85,
  pendingTransactions: 3
}

const supportedNetworks = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: 'bg-blue-500',
    icon: '🔵',
    assets: ['ETH', 'USDC'],
    status: 'active',
    fee: 0.1,
    minAmount: 0.01,
    avgTime: '3-5 min',
    liquidity: 15000000
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    color: 'bg-red-500',
    icon: '🔴',
    assets: ['ETH', 'USDC', 'ARB'],
    status: 'active',
    fee: 0.05,
    minAmount: 1,
    avgTime: '1-2 min',
    liquidity: 8500000
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    color: 'bg-orange-500',
    icon: '🟡',
    assets: ['BTC'],
    status: 'active',
    fee: 0.0005,
    minAmount: 0.001,
    avgTime: '10-15 min',
    liquidity: 5200000
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: 'bg-purple-500',
    icon: '🟣',
    assets: ['SOL', 'USDC'],
    status: 'active',
    fee: 0.01,
    minAmount: 0.1,
    avgTime: '30 sec',
    liquidity: 3800000
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    color: 'bg-indigo-500',
    icon: '🟢',
    assets: ['MATIC', 'USDC'],
    status: 'maintenance',
    fee: 0.02,
    minAmount: 1,
    avgTime: '2-3 min',
    liquidity: 2100000
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'BASE',
    color: 'bg-blue-600',
    icon: '🔷',
    assets: ['ETH', 'USDC'],
    status: 'coming',
    fee: 0.03,
    minAmount: 1,
    avgTime: '1-2 min',
    liquidity: 0
  }
]

export function BridgeDashboard() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Hyperliquid Bridge</h1>
          <p className="text-slate-400 mt-1">Seamlessly transfer assets to and from Hyperliquid</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Activity className="w-4 h-4 mr-2" />
            Status
          </Button>
        </div>
      </div>

      {/* 메인 통계 카드들 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 24h 볼륨 */}
        <Card className="bg-gradient-to-br from-blue-950/50 to-slate-900 border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpDown className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                24h
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              ${networkData.totalVolume24h.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              Bridge Volume
            </div>
          </CardContent>
        </Card>

        {/* 내 잔고 */}
        <Card className="bg-gradient-to-br from-green-950/50 to-slate-900 border-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                USDC
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              ${networkData.hyperliquidBalance.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              Hyperliquid Balance
            </div>
          </CardContent>
        </Card>

        {/* 평균 처리 시간 */}
        <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                Avg
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              {networkData.avgProcessingTime}m
            </div>
            <div className="text-sm text-slate-400">
              Processing Time
            </div>
          </CardContent>
        </Card>

        {/* 대기 중 거래 */}
        <Card className="bg-gradient-to-br from-yellow-950/50 to-slate-900 border-yellow-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                Pending
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              {networkData.pendingTransactions}
            </div>
            <div className="text-sm text-slate-400">
              My Transactions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 지원 네트워크 현황 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Supported Networks</h2>
                <p className="text-sm text-slate-400">Bridge assets from these networks to Hyperliquid</p>
              </div>
            </div>
            
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              {supportedNetworks.filter(n => n.status === 'active').length}/{supportedNetworks.length} Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedNetworks.map((network) => (
              <Card key={network.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{network.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white">{network.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {network.assets.map((asset, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-slate-300 border-slate-600">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        network.status === 'active' ? 'text-green-400 border-green-400/30' :
                        network.status === 'maintenance' ? 'text-yellow-400 border-yellow-400/30' :
                        'text-gray-400 border-gray-400/30'
                      }`}
                    >
                      {network.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {network.status === 'maintenance' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {network.status === 'coming' && <Clock className="w-3 h-3 mr-1" />}
                      {network.status === 'active' ? 'Active' : 
                       network.status === 'maintenance' ? 'Maintenance' : 'Coming Soon'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fee:</span>
                      <span className="text-white">{network.fee}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min Amount:</span>
                      <span className="text-white">{network.minAmount} {network.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Time:</span>
                      <span className="text-white">{network.avgTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Liquidity:</span>
                      <span className="text-white">
                        {network.liquidity > 0 
                          ? `$${(network.liquidity / 1000000).toFixed(1)}M` 
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 중요 공지사항 */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-1">Hyperliquid Native Bridge</h4>
              <p className="text-xs text-blue-200">
                All trades execute on Hyperliquid. This bridge converts external assets to USDC for seamless trading. 
                Withdrawals convert back to your preferred network and asset.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}