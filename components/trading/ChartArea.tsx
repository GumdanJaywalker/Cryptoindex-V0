'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Info, 
  BarChart3,
  Timer,
  DollarSign,
  Target,
  Activity,
  ExternalLink,
  Bell,
  Zap,
  History,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Shield,
  AlertTriangle,
  Eye,
  Volume2,
  Waves,
  Scale,
  Radar,
  Brain,
  Users,
  Plus,
  Minus,
  X
} from 'lucide-react'

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
const chartTypes = ['Candlestick', 'Line', 'Area']
const chartTabs = ['Chart', 'Info', 'Trading Data']

// Mock data for funding rate chart
const mockFundingRates = [
  { time: '00:00', rate: 0.0089, date: '2024-01-20' },
  { time: '08:00', rate: 0.0156, date: '2024-01-20' },
  { time: '16:00', rate: 0.0134, date: '2024-01-20' },
  { time: '00:00', rate: 0.0098, date: '2024-01-19' },
  { time: '08:00', rate: 0.0167, date: '2024-01-19' },
  { time: '16:00', rate: 0.0145, date: '2024-01-19' },
  { time: '00:00', rate: 0.0076, date: '2024-01-18' },
  { time: '08:00', rate: 0.0123, date: '2024-01-18' }
]

const mockIndexComposition = [
  { symbol: 'DOGE', weight: 25.4, change24h: 8.2, price: 0.085 },
  { symbol: 'SHIB', weight: 18.7, change24h: -2.1, price: 0.00001243 },
  { symbol: 'PEPE', weight: 15.9, change24h: 12.5, price: 0.00000876 },
  { symbol: 'FLOKI', weight: 12.3, change24h: 5.7, price: 0.000245 },
  { symbol: 'BONK', weight: 11.2, change24h: -1.8, price: 0.0000156 },
  { symbol: 'WIF', weight: 8.8, change24h: 15.3, price: 2.45 },
  { symbol: 'MEME', weight: 7.7, change24h: -4.2, price: 0.0234 }
]

export function ChartArea() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [selectedChartType, setSelectedChartType] = useState('Candlestick')
  const [activeChartTab, setActiveChartTab] = useState('Chart')

  return (
    <div className="flex flex-col bg-slate-950">
      {/* Chart Controls */}
      <div className="h-12 bg-slate-900 border-b border-slate-700 flex items-center px-4 space-x-4">
        {/* Timeframe Buttons */}
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Type Selector */}
        <div className="ml-auto flex space-x-2">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChartType(type)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedChartType === type
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col bg-slate-950">
        {/* Tab Headers */}
        <div className="h-10 bg-slate-900 border-b border-slate-700 flex items-center">
          <div className="flex space-x-1 px-4">
            {chartTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChartTab(tab)}
                className={`px-3 py-1 text-sm whitespace-nowrap rounded transition-colors ${
                  activeChartTab === tab
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[60vh] bg-slate-950">
          {activeChartTab === 'Chart' && (
            <div className="min-h-[400px] flex items-center justify-center bg-slate-950">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <div className="text-xl text-slate-400 mb-2">TradingView Chart</div>
                <div className="text-sm text-slate-500">
                  Advanced charting with indicators and drawing tools
                </div>
                <div className="mt-4 text-xs text-slate-600">
                  Current: {selectedChartType} - {selectedTimeframe}
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'Info' && (
            <div className="p-4 space-y-4 bg-slate-950">
              {/* Index Description */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-white">DOG_INDEX Information</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The DOG_INDEX tracks the performance of the most popular dog-themed meme cryptocurrencies. 
                    This diversified index includes tokens like DOGE, SHIB, FLOKI, BONK, and other canine-inspired 
                    cryptocurrencies, providing exposure to this growing sector of the crypto market with automatic 
                    rebalancing and professional risk management.
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-green-400" />
                      <span className="text-slate-400">7 Assets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-blue-400" />
                      <span className="text-slate-400">Auto-Rebalancing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-purple-400" />
                      <span className="text-slate-400">USDC Settlement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Index Composition */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-semibold text-white">Index Composition</h4>
                    </div>
                    <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30">
                      7 Assets
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {mockIndexComposition.map((asset, index) => (
                      <div key={asset.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <span className="font-medium text-white text-sm">{asset.symbol}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-300">{asset.weight}%</span>
                          <div className={`text-xs font-medium ${
                            asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Funding Rate */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <h4 className="text-sm font-semibold text-white">Funding Rate</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">+0.0125%</div>
                      <div className="text-xs text-slate-400">8h cycle</div>
                    </div>
                  </div>
                  
                  {/* Simple Funding Rate Chart */}
                  <div className="bg-slate-900/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Last 7 periods</span>
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">Next: 2h 15m</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between h-16 gap-1">
                      {mockFundingRates.slice(-7).map((rate, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full rounded-t ${
                              rate.rate > 0.01 ? 'bg-red-400' : 
                              rate.rate > 0.005 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                            style={{ height: `${Math.max((rate.rate / 0.02) * 100, 10)}%` }}
                          />
                          <div className="text-xs text-slate-400 mt-1">{rate.time}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2 text-xs text-slate-400 text-center">
                      Hyperliquid Network • 8h funding cycle
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeChartTab === 'Trading Data' && (
            <div className="p-4 space-y-4 bg-slate-950">
              {/* Market Statistics */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-semibold text-white">Market Statistics</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">24h Volume</div>
                      <div className="text-sm font-semibold text-white">$24.7M</div>
                      <div className="text-xs text-green-400">+15.3%</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Open Interest</div>
                      <div className="text-sm font-semibold text-white">$892.3K</div>
                      <div className="text-xs text-blue-400">Stable</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Long/Short Ratio</div>
                      <div className="text-sm font-semibold text-white">2.34</div>
                      <div className="text-xs text-green-400">Bullish</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Volatility (24h)</div>
                      <div className="text-sm font-semibold text-white">14.2%</div>
                      <div className="text-xs text-orange-400">High</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Analysis */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Price Analysis</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">24h High:</span>
                      <span className="text-xs text-white">$1.2890</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">24h Low:</span>
                      <span className="text-xs text-white">$1.1234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">7d Change:</span>
                      <span className="text-xs text-green-400">+12.34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">30d Change:</span>
                      <span className="text-xs text-red-400">-3.21%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Signals */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Active Signals</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-white">RSI Oversold</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                        Strong
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-white">Volume Breakout</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30">
                        Medium
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-white">MA Golden Cross</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                        Strong
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}