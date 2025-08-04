'use client'

import { useState, useEffect } from 'react'
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

// Static mock data to prevent SSR hydration issues
const mockCandleData = [
  { timestamp: new Date('2024-08-04T10:00:00Z'), open: 1.2567, high: 1.2634, low: 1.2489, close: 1.2598, volume: 125000 },
  { timestamp: new Date('2024-08-04T11:00:00Z'), open: 1.2598, high: 1.2712, low: 1.2534, close: 1.2687, volume: 142000 },
  { timestamp: new Date('2024-08-04T12:00:00Z'), open: 1.2687, high: 1.2756, low: 1.2621, close: 1.2734, volume: 98000 },
  { timestamp: new Date('2024-08-04T13:00:00Z'), open: 1.2734, high: 1.2823, low: 1.2698, close: 1.2789, volume: 187000 },
  { timestamp: new Date('2024-08-04T14:00:00Z'), open: 1.2789, high: 1.2834, low: 1.2723, close: 1.2801, volume: 156000 }
]

// Generate mock data function for client-side rendering
const generateMockCandleData = () => {
  const data = []
  let basePrice = 1.2567
  const now = new Date()
  
  for (let i = 50; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const open = basePrice + (Math.random() - 0.5) * 0.02
    const volatility = 0.01 + Math.random() * 0.02
    const high = open + Math.random() * volatility
    const low = open - Math.random() * volatility
    const close = low + Math.random() * (high - low)
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: 50000 + Math.random() * 200000
    })
    
    basePrice = close + (Math.random() - 0.5) * 0.01
  }
  
  return data
}



// Mock Candlestick Chart Component
function CandlestickChart({ data, chartType, timeframe }: { data: any[], chartType: string, timeframe: string }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const svgWidth = 800
  const svgHeight = 400
  const margin = { top: 20, right: 60, bottom: 40, left: 60 }
  const chartWidth = svgWidth - margin.left - margin.right
  const chartHeight = svgHeight - margin.top - margin.bottom
  
  const maxPrice = Math.max(...data.map(d => d.high))
  const minPrice = Math.min(...data.map(d => d.low))
  const priceRange = maxPrice - minPrice
  const padding = priceRange * 0.1
  
  const yScale = (price: number) => {
    return margin.top + ((maxPrice + padding - price) / (priceRange + 2 * padding)) * chartHeight
  }
  
  const xScale = (index: number) => {
    return margin.left + (index / (data.length - 1)) * chartWidth
  }

  // Use static values for SSR compatibility, then update on client
  const currentPrice = isClient ? (data[data.length - 1]?.close || 1.2567) : 1.2567
  const previousPrice = isClient ? (data[data.length - 2]?.close || 1.2500) : 1.2500
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100)

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading chart...</div>
      </div>
    )
  }

  if (chartType === 'Line' || chartType === 'Area') {
    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.close)}`).join(' ')
    
    return (
      <div className="w-full h-full bg-slate-950 relative">
        {/* Price Info Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-4 bg-slate-900/80 rounded-lg p-3">
            <div>
              <div className="text-xs text-slate-400">DOG_INDEX • {timeframe}</div>
              <div className="text-2xl font-bold text-white">${currentPrice.toFixed(4)}</div>
            </div>
            <div className={`text-right ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <div className="text-sm font-semibold">
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(4)}
              </div>
              <div className="text-xs">
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </div>
            </div>
            <div className="text-right text-slate-400">
              <div className="text-xs">24h Vol</div>
              <div className="text-sm font-semibold text-white">$2.4M</div>
            </div>
          </div>
        </div>

        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgb(51 65 85)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} stopOpacity={chartType === 'Area' ? "0.4" : "0.3"}/>
              <stop offset="100%" stopColor={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Y-axis price labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(ratio => {
            const price = minPrice + ratio * (maxPrice - minPrice)
            const y = yScale(price)
            return (
              <g key={ratio}>
                <line x1={margin.left} y1={y} x2={svgWidth - margin.right} y2={y} stroke="rgb(71 85 105)" strokeWidth="0.5" />
                <text x={svgWidth - margin.right + 5} y={y + 4} fill="rgb(148 163 184)" fontSize="11" fontFamily="monospace">
                  ${price.toFixed(4)}
                </text>
              </g>
            )
          })}
          
          {/* Area chart gradient (only for Area type) */}
          {chartType === 'Area' && (
            <path 
              d={`${pathData} L ${xScale(data.length - 1)} ${svgHeight - margin.bottom} L ${margin.left} ${svgHeight - margin.bottom} Z`} 
              fill="url(#lineGradient)" 
            />
          )}
          
          {/* Line chart */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} 
            strokeWidth="2" 
          />
          
          {/* Price points */}
          {data.map((d, i) => (
            <circle 
              key={i}
              cx={xScale(i)} 
              cy={yScale(d.close)} 
              r="2" 
              fill={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} 
              opacity={i === data.length - 1 ? 1 : 0}
            />
          ))}
        </svg>
      </div>
    )
  }

  // Candlestick Chart (default)
  return (
    <div className="w-full h-full bg-slate-950 relative">
      {/* Price Info Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-4 bg-slate-900/80 rounded-lg p-3">
          <div>
            <div className="text-xs text-slate-400">DOG_INDEX • {timeframe}</div>
            <div className="text-2xl font-bold text-white">${currentPrice.toFixed(4)}</div>
          </div>
          <div className={`text-right ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <div className="text-sm font-semibold">
              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(4)}
            </div>
            <div className="text-xs">
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
          </div>
          <div className="text-right text-slate-400">
            <div className="text-xs">24h Vol</div>
            <div className="text-sm font-semibold text-white">$2.4M</div>
          </div>
        </div>
      </div>

      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgb(51 65 85)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Y-axis price labels */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map(ratio => {
          const price = minPrice + ratio * (maxPrice - minPrice)
          const y = yScale(price)
          return (
            <g key={ratio}>
              <line x1={margin.left} y1={y} x2={svgWidth - margin.right} y2={y} stroke="rgb(71 85 105)" strokeWidth="0.5" />
              <text x={svgWidth - margin.right + 5} y={y + 4} fill="rgb(148 163 184)" fontSize="11" fontFamily="monospace">
                ${price.toFixed(4)}
              </text>
            </g>
          )
        })}
        
        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = xScale(index)
          const isGreen = candle.close > candle.open
          const bodyTop = yScale(Math.max(candle.open, candle.close))
          const bodyBottom = yScale(Math.min(candle.open, candle.close))
          const bodyHeight = bodyBottom - bodyTop
          const wickTop = yScale(candle.high)
          const wickBottom = yScale(candle.low)
          
          return (
            <g key={index}>
              {/* Wick */}
              <line 
                x1={x} y1={wickTop} x2={x} y2={wickBottom} 
                stroke={isGreen ? "rgb(34 197 94)" : "rgb(239 68 68)"} 
                strokeWidth="1" 
              />
              {/* Body */}
              <rect 
                x={x - 3} y={bodyTop} width="6" height={Math.max(bodyHeight, 1)}
                fill={isGreen ? "rgb(34 197 94)" : "rgb(239 68 68)"}
                opacity={bodyHeight < 2 ? 1 : 0.9}
              />
            </g>
          )
        })}
        
        {/* Volume bars at bottom */}
        {data.map((candle, index) => {
          const x = xScale(index)
          const maxVolume = Math.max(...data.map(d => d.volume))
          const volumeHeight = (candle.volume / maxVolume) * 60
          const volumeY = svgHeight - margin.bottom - volumeHeight
          const isGreen = candle.close > candle.open
          
          return (
            <rect 
              key={`vol-${index}`}
              x={x - 2} y={volumeY} width="4" height={volumeHeight}
              fill={isGreen ? "rgb(34 197 94)" : "rgb(239 68 68)"}
              opacity="0.3"
            />
          )
        })}
      </svg>
    </div>
  )
}

const mockIndexComposition = [
  { symbol: 'DOGE', weight: 25.4, change24h: 8.2, price: 0.085 },
  { symbol: 'SHIB', weight: 18.7, change24h: -2.1, price: 0.00001243 },
  { symbol: 'PEPE', weight: 15.9, change24h: 12.5, price: 0.00000876 },
  { symbol: 'FLOKI', weight: 12.3, change24h: 5.7, price: 0.000245 },
  { symbol: 'BONK', weight: 11.2, change24h: -1.8, price: 0.0000156 },
  { symbol: 'WIF', weight: 8.8, change24h: 15.3, price: 2.45 },
  { symbol: 'MEME', weight: 7.7, change24h: -4.2, price: 0.0234 }
]

// Info Tab Content Component
function InfoTabContent() {
  const [activeInfoTab, setActiveInfoTab] = useState('Index Info')
  const infoTabs = ['Index Info', 'Token Info', 'Composition', 'Trading Rules', 'Performance']

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Info Sub-tabs */}
      <div className="border-b border-slate-700 flex-shrink-0">
        <div className="flex px-4">
          {infoTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveInfoTab(tab)}
              className={`px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                activeInfoTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Info Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-350px)]">
        {activeInfoTab === 'Index Info' && (
          <div className="space-y-4">
            {/* Basic Index Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-white">DOG_INDEX</h4>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    👑 No.1
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Market Capitalization</div>
                    <div className="text-sm font-semibold text-white">$147.8M</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Total Assets</div>
                    <div className="text-sm font-semibold text-white">7</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Index Inception</div>
                    <div className="text-sm font-semibold text-white">2024-01-15</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Rebalance Frequency</div>
                    <div className="text-sm font-semibold text-white">Weekly</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Management Fee</div>
                    <div className="text-sm font-semibold text-white">0.75% p.a.</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Settlement Currency</div>
                    <div className="text-sm font-semibold text-white">USDC</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700">
                  <h5 className="text-xs font-semibold text-white mb-2">Description</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The DOG_INDEX tracks the performance of the most popular dog-themed meme cryptocurrencies. 
                    This diversified index includes tokens like DOGE, SHIB, FLOKI, BONK, and other canine-inspired 
                    cryptocurrencies, providing exposure to this growing sector with automatic rebalancing.
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 cursor-pointer hover:underline">Whitepaper</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 cursor-pointer hover:underline">Index Methodology</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeInfoTab === 'Token Info' && (
          <div className="space-y-4">
            {/* Token Narrative */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-orange-400" />
                  <h4 className="text-sm font-semibold text-white">Token Narrative</h4>
                  <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">
                    🐕 Dog Themed
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold text-white mb-2">Market Narrative</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The dog-themed cryptocurrency sector represents one of the most culturally significant movements in crypto, 
                      led by the original meme coin Dogecoin. This narrative combines internet culture, community-driven adoption, 
                      and celebrity endorsements to create a unique investment thesis around digital assets that celebrate 
                      "man's best friend."
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-white mb-2">Key Drivers</h5>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div>
                        <div>
                          <div className="text-xs text-white font-medium">Community Strength</div>
                          <div className="text-xs text-slate-400">Strong, loyal communities with viral social media presence</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div>
                        <div>
                          <div className="text-xs text-white font-medium">Cultural Impact</div>
                          <div className="text-xs text-slate-400">Mainstream recognition and celebrity endorsements (Elon Musk, etc.)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div>
                        <div>
                          <div className="text-xs text-white font-medium">Utility Evolution</div>
                          <div className="text-xs text-slate-400">Expanding from memes to DeFi, payments, and gaming applications</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5"></div>
                        <div>
                          <div className="text-xs text-white font-medium">Market Cycles</div>
                          <div className="text-xs text-slate-400">Strong correlation with retail sentiment and bull market phases</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-white mb-2">Investment Thesis</h5>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        Dog-themed tokens serve as a gateway for new crypto users, often representing their first exposure 
                        to digital assets. The narrative benefits from:
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1 ml-3">
                        <li>• Broad retail appeal and mainstream media coverage</li>
                        <li>• Network effects from strong community engagement</li>
                        <li>• Diversification across multiple successful projects (DOGE, SHIB, FLOKI, etc.)</li>
                        <li>• Potential for institutional adoption as crypto acceptance grows</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Market Sentiment */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-white">Current Market Sentiment</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Social Mentions (24h)</div>
                      <div className="text-sm font-semibold text-white">42.3K</div>
                      <div className="text-xs text-green-400">+18.4%</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Sentiment Score</div>
                      <div className="text-sm font-semibold text-green-400">Bullish</div>
                      <div className="text-xs text-slate-400">7.2/10</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Trend Strength</div>
                      <div className="text-sm font-semibold text-orange-400">Strong</div>
                      <div className="text-xs text-slate-400">Above average</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Narrative Phase</div>
                      <div className="text-sm font-semibold text-blue-400">Growth</div>
                      <div className="text-xs text-slate-400">Expanding utility</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Recent Catalysts</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white">• Major exchange listings for FLOKI</span>
                      <span className="text-xs text-slate-400">2d ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white">• SHIB metaverse development update</span>
                      <span className="text-xs text-slate-400">5d ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white">• DOGE payment integration rumors</span>
                      <span className="text-xs text-slate-400">1w ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risks and Considerations */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="text-sm font-semibold text-white">Risks & Considerations</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3">
                    <div className="text-xs font-semibold text-red-400 mb-1">High Volatility</div>
                    <div className="text-xs text-slate-300">
                      Dog-themed tokens exhibit extreme price volatility and are heavily influenced by social sentiment
                    </div>
                  </div>
                  <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-3">
                    <div className="text-xs font-semibold text-orange-400 mb-1">Market Dependence</div>
                    <div className="text-xs text-slate-300">
                      Performance is highly correlated with overall crypto market conditions and retail sentiment
                    </div>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
                    <div className="text-xs font-semibold text-yellow-400 mb-1">Regulatory Risk</div>
                    <div className="text-xs text-slate-300">
                      Potential for increased regulatory scrutiny of meme-based cryptocurrencies
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeInfoTab === 'Composition' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Current Allocation</h4>
                  </div>
                  <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30">
                    Last Updated: 2h ago
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {mockIndexComposition.map((asset, index) => (
                    <div key={asset.symbol} className="bg-slate-900/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <span className="font-medium text-white">{asset.symbol}</span>
                          <span className="text-xs text-slate-400">${asset.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{asset.weight}%</span>
                          <div className={`text-xs font-medium ${
                            asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${asset.weight}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Rebalancing Information</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Next Rebalance:</span>
                      <span className="text-white ml-1">Mon, Aug 5</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Threshold:</span>
                      <span className="text-white ml-1">±5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeInfoTab === 'Trading Rules' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-green-400" />
                  <h4 className="text-sm font-semibold text-white">Trading Parameters</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Min. Trade Amount</span>
                      <span className="text-xs text-white">0.01 DOG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Max. Trade Amount</span>
                      <span className="text-xs text-white">10,000 DOG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Price Precision</span>
                      <span className="text-xs text-white">0.0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Quantity Precision</span>
                      <span className="text-xs text-white">0.01</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Trading Fee</span>
                      <span className="text-xs text-white">0.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Settlement Fee</span>
                      <span className="text-xs text-white">0.05%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Min. Order Value</span>
                      <span className="text-xs text-white">$10 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Max. Open Orders</span>
                      <span className="text-xs text-white">50</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Trading Hours</div>
                  <div className="text-xs text-white">24/7 - Continuous Trading</div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  * All fees are subject to change with 48h notice. Please refer to our fee schedule for the most up-to-date information.
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeInfoTab === 'Performance' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <h4 className="text-sm font-semibold text-white">Historical Performance</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">All-Time High</div>
                    <div className="text-sm font-semibold text-white">$2.8934</div>
                    <div className="text-xs text-slate-500">2024-03-14</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">All-Time Low</div>
                    <div className="text-sm font-semibold text-white">$0.8756</div>
                    <div className="text-xs text-slate-500">2024-02-08</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">7d Return</div>
                    <div className="text-sm font-semibold text-green-400">+12.34%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">30d Return</div>
                    <div className="text-sm font-semibold text-red-400">-3.21%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">90d Return</div>
                    <div className="text-sm font-semibold text-green-400">+45.67%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">YTD Return</div>
                    <div className="text-sm font-semibold text-green-400">+234.5%</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Risk Metrics</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">30d Volatility:</span>
                      <span className="text-white">28.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Drawdown:</span>
                      <span className="text-white">-18.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sharpe Ratio:</span>
                      <span className="text-white">1.42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Beta vs BTC:</span>
                      <span className="text-white">1.85</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export function ChartArea() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [selectedChartType, setSelectedChartType] = useState('Candlestick')
  const [activeChartTab, setActiveChartTab] = useState('Chart')
  
  const [chartData, setChartData] = useState(mockCandleData)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate new data when timeframe changes (client-side only)
  useEffect(() => {
    if (!isClient) return

    const getTimeframeData = (timeframe: string) => {
      const intervals = {
        '1m': 60,
        '5m': 300, 
        '15m': 900,
        '1h': 3600,
        '4h': 14400,
        '1d': 86400,
        '1w': 604800
      }
      
      const interval = intervals[timeframe as keyof typeof intervals] || 3600
      const dataPoints = timeframe === '1d' || timeframe === '1w' ? 30 : 50
      
      const data = []
      let basePrice = 1.2567
      const now = new Date()
      
      for (let i = dataPoints; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * interval * 1000)
        const open = basePrice + (Math.random() - 0.5) * 0.02
        const volatility = 0.005 + Math.random() * 0.015
        const high = open + Math.random() * volatility
        const low = open - Math.random() * volatility
        const close = low + Math.random() * (high - low)
        
        data.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume: 20000 + Math.random() * 180000
        })
        
        basePrice = close + (Math.random() - 0.5) * 0.008
      }
      
      return data
    }
    
    setChartData(getTimeframeData(selectedTimeframe))
  }, [selectedTimeframe, isClient])

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
        <div className="flex-1 bg-slate-950 overflow-hidden">
          {activeChartTab === 'Chart' && (
            <div className="h-full bg-slate-950 p-4">
              <CandlestickChart 
                data={chartData} 
                chartType={selectedChartType} 
                timeframe={selectedTimeframe}
              />
            </div>
          )}

          {activeChartTab === 'Info' && (
            <InfoTabContent />
          )}

          {activeChartTab === 'Trading Data' && (
            <div className="h-full overflow-y-auto p-4 space-y-4 bg-slate-950">
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