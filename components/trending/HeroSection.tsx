'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Volume2, DollarSign, Activity } from 'lucide-react'

const hotIndex = {
  symbol: 'DOGE_INDEX',
  name: 'Doggy Meme Index',
  price: 2.847,
  change24h: 34.82,
  volume24h: 2847000,
  marketCap: 847000000,
  description: 'The ultimate collection of dog-themed meme coins including DOGE, SHIB, and emerging pups'
}

const marketStats = [
  {
    label: 'Total Market Cap',
    value: '$24.7B',
    change: '+12.4%',
    positive: true,
    icon: DollarSign
  },
  {
    label: '24h Volume',
    value: '$8.9B',
    change: '+8.7%',
    positive: true,
    icon: Volume2
  },
  {
    label: 'Active Indexes',
    value: '156',
    change: '+5',
    positive: true,
    icon: Activity
  },
  {
    label: 'Top Gainer',
    value: 'CAT_INDEX',
    change: '+67.8%',
    positive: true,
    icon: TrendingUp
  }
]

export function HeroSection() {
  return (
    <div className="mb-12">
      {/* 오늘의 핫 인덱스 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-bold text-white">Today's Hottest Index</h2>
        </div>
        
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* 인덱스 정보 */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center text-2xl">
                    🐕
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{hotIndex.name}</h3>
                    <p className="text-slate-400 text-sm">{hotIndex.symbol}</p>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    HOT
                  </Badge>
                </div>
                
                <p className="text-slate-300 mb-4">
                  {hotIndex.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">${hotIndex.price.toFixed(3)}</div>
                    <div className="text-xs text-slate-400">Current Price</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xl font-bold">+{hotIndex.change24h}%</span>
                    </div>
                    <div className="text-xs text-slate-400">24h Change</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      ${(hotIndex.volume24h / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-slate-400">24h Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      ${(hotIndex.marketCap / 1000000000).toFixed(1)}B
                    </div>
                    <div className="text-xs text-slate-400">Market Cap</div>
                  </div>
                </div>
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex flex-col gap-3">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
                  Trade Now
                </Button>
                <Button variant="outline" size="lg" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시장 요약 */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-blue-400" />
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        stat.positive 
                          ? 'text-green-400 border-green-400/30' 
                          : 'text-red-400 border-red-400/30'
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}