'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Activity,
  PieChart,
  Target,
  Crown,
  Flame
} from 'lucide-react'

// Mock data for professional exchange landing
const featuredIndices = [
  { 
    symbol: 'MEME_INDEX', 
    name: 'Meme Coin Index', 
    price: 2.67, 
    change24h: 12.4, 
    volume24h: 2450000,
    mcap: 45600000,
    assets: 7
  },
  { 
    symbol: 'DOG_INDEX', 
    name: 'Dog Token Index', 
    price: 1.73, 
    change24h: -3.2, 
    volume24h: 1890000,
    mcap: 34200000,
    assets: 5
  },
  { 
    symbol: 'AI_INDEX', 
    name: 'AI Token Index', 
    price: 3.21, 
    change24h: 8.7, 
    volume24h: 3120000,
    mcap: 67800000,
    assets: 8
  },
  { 
    symbol: 'CAT_INDEX', 
    name: 'Cat Token Index', 
    price: 1.56, 
    change24h: 5.3, 
    volume24h: 1560000,
    mcap: 28900000,
    assets: 6
  }
]

const marketStats = [
  { label: 'Total Trading Volume', value: '$12.4M', change: 15.2 },
  { label: 'Active Indices', value: '24', change: 8.3 },
  { label: 'Total Market Cap', value: '$245M', change: 6.7 },
  { label: 'Active Traders', value: '1,247', change: 12.1 }
]

const topPerformers = [
  { symbol: 'WIF_INDEX', change: 34.7, volume: 890000 },
  { symbol: 'BONK_INDEX', change: 28.3, volume: 670000 },
  { symbol: 'PEPE_INDEX', change: 23.1, volume: 1200000 }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-slate-950/50 to-slate-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Hyperliquid Native
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Market
                </Badge>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Meme Coin Index
                <br />
                <span className="text-blue-400">Derivatives</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 max-w-lg">
                Trade curated meme coin indexes with leverage, governance voting, and community-driven rebalancing on Hyperliquid.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/trading">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg px-8">
                    Start Trading
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/governance">
                  <Button size="lg" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 text-lg px-8">
                    <Crown className="w-5 h-5 mr-2" />
                    Governance
                  </Button>
                </Link>
              </div>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-green-400">$12.4M</div>
                  <div className="text-sm text-slate-400">24h Volume</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">1,247</div>
                  <div className="text-sm text-slate-400">Active Traders</div>
                </div>
              </div>
            </div>

            {/* Right: Featured Indices */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Featured Indices</h3>
                <Link href="/trending">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              {featuredIndices.map((index) => (
                <Card key={index.symbol} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/70">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <PieChart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{index.symbol}</div>
                          <div className="text-xs text-slate-400">{index.assets} Assets</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-white">${index.price.toFixed(2)}</div>
                        <div className={`text-sm ${index.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {index.change24h >= 0 ? '+' : ''}{index.change24h}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800">
                      <div>
                        <div className="text-xs text-slate-400">Volume</div>
                        <div className="text-sm text-white">${(index.volume24h / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Market Cap</div>
                        <div className="text-sm text-white">${(index.mcap / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {marketStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+{stat.change}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Next-Gen Index Trading
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Experience professional-grade derivatives trading with community governance and real-time rebalancing
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Index Composition */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dynamic Composition</h3>
              <p className="text-slate-400 mb-4">
                Real-time asset rebalancing based on community governance and market performance metrics.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">DOGE</span>
                  <span className="text-white">25.4%</span>
                </div>
                <Progress value={25.4} className="h-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">SHIB</span>
                  <span className="text-white">18.7%</span>
                </div>
                <Progress value={18.7} className="h-1" />
              </div>
            </CardContent>
          </Card>

          {/* Governance */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Battle Governance</h3>
              <p className="text-slate-400 mb-4">
                Vote on index compositions through battle systems and rebalancing proposals.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Active Proposals</span>
                  <Badge className="bg-orange-600 text-white">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Your Voting Power</span>
                  <span className="text-sm text-orange-400">1,247 votes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Trading */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro Trading Tools</h3>
              <p className="text-slate-400 mb-4">
                Advanced charts, order types, and risk management tools for professional traders.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Max Leverage</span>
                  <span className="text-sm text-green-400">50x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Order Types</span>
                  <span className="text-sm text-green-400">8+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Top Performers</h3>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Flame className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {topPerformers.map((performer, index) => (
              <Card key={performer.symbol} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        #{index + 1}
                      </div>
                      <span className="font-semibold text-white">{performer.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">+{performer.change}%</div>
                      <div className="text-xs text-slate-400">${(performer.volume / 1000).toFixed(0)}K vol</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of traders in the next evolution of meme coin trading
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trading">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg px-12">
                Launch Trading Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-12">
                <Users className="w-5 h-5 mr-2" />
                View Portfolio Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
