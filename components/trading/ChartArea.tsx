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
    <div className="bg-slate-950">
      {/* Info Sub-tabs */}
      <div className="border-b border-slate-700">
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
      <div className="p-4 space-y-4">
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
            <InfoTabContent />
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