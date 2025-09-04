'use client';

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  BarChart3,
  Target,
  Calendar,
  PieChart,
  Activity,
  ExternalLink,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  History,
  Plus,
  Minus,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  TrendingDown as TrendingDownIcon2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Layers,
  Volume2,
  Waves,
  Eye,
  Scale,
  Brain,
  Signal,
  Radar,
  Bot,
  Sparkles,
  MousePointer,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Search
} from 'lucide-react'

// Mock data for each tab
const mockPositions = [
  {
    id: '1',
    symbol: 'MEME_INDEX',
    side: 'Buy',
    size: 1.5,
    entryPrice: 2.45,
    currentPrice: 2.67,
    pnl: 330.00,
    pnlPercent: 8.98,
    margin: 245.25,
    leverage: '10x',
    liquidationPrice: 2.21,
    adlRank: 2,
    fundingRate: 0.0123
  },
  {
    id: '2', 
    symbol: 'DOG_INDEX',
    side: 'Sell',
    size: 0.8,
    entryPrice: 1.82,
    currentPrice: 1.73,
    pnl: 72.00,
    pnlPercent: 4.95,
    margin: 145.60,
    leverage: '5x',
    liquidationPrice: 2.01,
    adlRank: 3,
    fundingRate: -0.0087
  }
]

const mockOrders = [
  {
    id: '1',
    symbol: 'CAT_INDEX',
    side: 'Buy',
    type: 'Limit',
    size: 2.0,
    price: 1.45,
    filled: 0,
    status: 'Open',
    time: '14:23:15'
  },
  {
    id: '2',
    symbol: 'AI_INDEX', 
    side: 'Sell',
    type: 'Stop',
    size: 1.2,
    price: 3.21,
    filled: 0,
    status: 'Pending',
    time: '14:20:08'
  }
]

const mockIndexComposition = [
  { 
    symbol: 'DOGE', 
    weight: 25.4, 
    change24h: 8.2, 
    price: 0.085, 
    allocation: 15420,
    marketCap: 12.5e9, // 12.5B
    volume24h: 850.2e6, // 850.2M
    quantity: 181176 // tokens held
  },
  { 
    symbol: 'SHIB', 
    weight: 18.7, 
    change24h: -2.1, 
    price: 0.00001243, 
    allocation: 11340,
    marketCap: 7.3e9,
    volume24h: 245.7e6,
    quantity: 912450000 // tokens held
  },
  { 
    symbol: 'PEPE', 
    weight: 15.9, 
    change24h: 12.5, 
    price: 0.00000876, 
    allocation: 9640,
    marketCap: 3.7e9,
    volume24h: 180.5e6,
    quantity: 1100000000 // tokens held
  },
  { 
    symbol: 'FLOKI', 
    weight: 12.3, 
    change24h: 5.7, 
    price: 0.000245, 
    allocation: 7460,
    marketCap: 2.3e9,
    volume24h: 95.2e6,
    quantity: 30449000 // tokens held
  },
  { 
    symbol: 'BONK', 
    weight: 11.2, 
    change24h: -1.8, 
    price: 0.0000156, 
    allocation: 6790,
    marketCap: 1.1e9,
    volume24h: 65.8e6,
    quantity: 435256000 // tokens held
  },
  { 
    symbol: 'WIF', 
    weight: 8.8, 
    change24h: 15.3, 
    price: 2.45, 
    allocation: 5330,
    marketCap: 2.4e9,
    volume24h: 125.6e6,
    quantity: 2175 // tokens held
  },
  { 
    symbol: 'MEME', 
    weight: 7.7, 
    change24h: -4.2, 
    price: 0.0234, 
    allocation: 4670,
    marketCap: 345e6,
    volume24h: 28.9e6,
    quantity: 199573 // tokens held
  }
]



// Mock data for market data
const mockMarketData = {
  orderBookDepth: {
    spreadInfo: {
      bidAskSpread: 0.0012, // 0.12%
      midPrice: 2.4567,
      spreadTrend: 'tightening' // 'widening' | 'tightening' | 'stable'
    },
    depthAnalysis: {
      bid5Depth: 125670, // USDC value at 5 levels
      ask5Depth: 98230,
      bid10Depth: 234560,
      ask10Depth: 189340,
      imbalanceRatio: 1.28 // bid/ask ratio
    },
    whaleOrders: [
      { side: 'buy', size: 45000, price: 2.4520, impact: 0.19, time: '2m ago' },
      { side: 'sell', size: 67800, price: 2.4590, impact: 0.24, time: '5m ago' },
      { side: 'buy', size: 23400, price: 2.4500, impact: 0.12, time: '8m ago' }
    ]
  },
  volumeAnalysis: {
    hourlyVolume: [
      { hour: '00:00', volume: 1.2e6, buyRatio: 0.52 },
      { hour: '01:00', volume: 0.8e6, buyRatio: 0.48 },
      { hour: '02:00', volume: 0.6e6, buyRatio: 0.45 },
      { hour: '03:00', volume: 0.9e6, buyRatio: 0.58 },
      { hour: '04:00', volume: 1.5e6, buyRatio: 0.62 },
      { hour: '05:00', volume: 2.1e6, buyRatio: 0.67 }
    ],
    volumeStats: {
      total24h: 24.7e6,
      buyVolume: 13.2e6,
      sellVolume: 11.5e6,
      buyRatio: 53.4,
      avgTradeSize: 2340,
      medianTradeSize: 890
    }
  },
  volatilityMetrics: {
    historicalVol: {
      current: 0.142, // 14.2%
      trend: 'increasing',
      weekHigh: 0.156,
      weekLow: 0.087
    },
    impliedVol: 0.165, // from options if available
    garchPrediction: {
      nextHour: 0.148,
      next4Hours: 0.151,
      nextDay: 0.159,
      confidence: 0.78
    },
    volatilityRank: 67 // percentile vs 252-day history
  }
}



// Mock data for order history
const mockOrderHistory = [
  {
    id: 'ORD001',
    time: '2024-01-20 14:23:15',
    symbol: 'MEME_INDEX',
    type: 'Limit',
    side: 'Buy',
    requestedPrice: 2.45,
    filledPrice: 2.44,
    quantity: 1.5,
    filled: 1.5,
    fillRate: 100,
    status: 'Filled',
    fee: 3.66,
    feeType: 'maker',
    slippage: -0.41, // negative = better execution
    marketImpact: 0.12
  },
  {
    id: 'ORD002',
    time: '2024-01-20 13:45:08',
    symbol: 'DOG_INDEX',
    type: 'Market',
    side: 'Sell',
    requestedPrice: null, // market order
    filledPrice: 1.73,
    quantity: 0.8,
    filled: 0.8,
    fillRate: 100,
    status: 'Filled',
    fee: 1.38,
    feeType: 'taker',
    slippage: 0.58, // positive = worse execution
    marketImpact: 0.08
  },
  {
    id: 'ORD003',
    time: '2024-01-20 12:30:22',
    symbol: 'CAT_INDEX',
    type: 'Limit',
    side: 'Buy',
    requestedPrice: 1.45,
    filledPrice: 0,
    quantity: 2.0,
    filled: 0,
    fillRate: 0,
    status: 'Cancelled',
    fee: 0,
    feeType: null,
    slippage: null,
    marketImpact: null
  },
  {
    id: 'ORD004',
    time: '2024-01-19 16:15:45',
    symbol: 'AI_INDEX',
    type: 'Stop',
    side: 'Sell',
    requestedPrice: 3.21,
    filledPrice: 3.19,
    quantity: 1.2,
    filled: 1.2,
    fillRate: 100,
    status: 'Filled',
    fee: 3.83,
    feeType: 'taker',
    slippage: 0.62,
    marketImpact: 0.15
  },
  {
    id: 'ORD005',
    time: '2024-01-19 10:20:18',
    symbol: 'MEME_INDEX',
    type: 'Limit',
    side: 'Buy',
    requestedPrice: 2.30,
    filledPrice: 0,
    quantity: 3.0,
    filled: 0,
    fillRate: 0,
    status: 'Expired',
    fee: 0,
    feeType: null,
    slippage: null,
    marketImpact: null
  }
];

export function TradingBottomTabs() {
  const [activeTab, setActiveTab] = useState('positions')

  // 서버와 클라이언트에서 동일한 값 사용
  const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalMargin = mockPositions.reduce((sum, pos) => sum + pos.margin, 0);
  const winningPositions = mockPositions.filter(p => p.pnl > 0).length;
  const avgReturn = mockPositions.length > 0 ? mockPositions.reduce((sum, pos) => sum + pos.pnlPercent, 0) / mockPositions.length : 0;

  return (
    <div className="min-h-[50vh] bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 bg-secondary border-b border-slate-700 rounded-none w-full">
          <TabsTrigger value="positions" className="text-xs data-[state=active]:bg-brand">
            Positions
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs data-[state=active]:bg-brand">
            Open Orders
          </TabsTrigger>
          <TabsTrigger value="orderHistory" className="text-xs data-[state=active]:bg-brand">
            Order History
          </TabsTrigger>
          <TabsTrigger value="market" className="text-xs data-[state=active]:bg-brand">
            Market Data
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-xs data-[state=active]:bg-brand">
            Assets
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-background">
          {/* Positions Tab - Enhanced with detailed information */}
          <TabsContent value="positions" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Active Positions</h3>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  {mockPositions.length} Open
                </Badge>
              </div>
              
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-2 text-xs text-slate-400 px-2 py-1 border-b border-slate-700">
                  <div>Symbol</div>
                  <div className="text-center">Side/Size</div>
                  <div className="text-center">Entry</div>
                  <div className="text-center">Mark</div>
                  <div className="text-center">P&L</div>
                  <div className="text-center">Margin</div>
                  <div className="text-center">Liq. Price</div>
                  <div className="text-center">ADL</div>
                  <div className="text-center">Funding</div>
                </div>

                {/* Position Rows */}
                {mockPositions.map((position) => {
                  const getADLColor = (rank: number) => {
                    switch (rank) {
                      case 1: return 'text-green-400 bg-green-400/10 border-green-400/30'
                      case 2: return 'text-green-400 bg-green-400/10 border-green-400/30'
                      case 3: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                      case 4: return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
                      case 5: return 'text-red-400 bg-red-400/10 border-red-400/30'
                      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30'
                    }
                  }

                  return (
                    <Card key={position.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                      <CardContent className="p-3">
                        <div className="grid grid-cols-9 gap-2 items-center text-xs">
                          {/* Symbol */}
                          <div>
                            <div className="font-semibold text-white">{position.symbol}</div>
                            <div className="text-slate-400">{position.leverage}</div>
                          </div>

                          {/* Side/Size */}
                          <div className="text-center">
                            <Badge 
                              variant="outline" 
                              className={`text-xs mb-1 ${
                                position.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
                              }`}
                            >
                              {position.side}
                            </Badge>
                            <div className="text-white font-medium">{Math.abs(position.size).toFixed(1)}</div>
                          </div>

                          {/* Entry Price */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.entryPrice.toFixed(3)}</div>
                          </div>

                          {/* Mark Price */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.currentPrice.toFixed(3)}</div>
                            <div className={`text-xs ${
                              position.currentPrice > position.entryPrice 
                                ? (position.side === 'Buy' ? 'text-green-400' : 'text-red-400')
                                : (position.side === 'Buy' ? 'text-red-400' : 'text-green-400')
                            }`}>
                              {((position.currentPrice - position.entryPrice) / position.entryPrice * 100).toFixed(2)}%
                            </div>
                          </div>

                          {/* P&L */}
                          <div className="text-center">
                            <div className={`font-semibold ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                            </div>
                            <div className={`text-xs ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                            </div>
                          </div>

                          {/* Margin */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.margin.toFixed(0)}</div>
                          </div>

                          {/* Liquidation Price */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.liquidationPrice.toFixed(3)}</div>
                            <div className="text-xs text-slate-400">
                              {position.currentPrice !== 0 ? (Math.abs((position.liquidationPrice - position.currentPrice) / position.currentPrice) * 100).toFixed(1) : '0.0'}%
                            </div>
                          </div>

                          {/* ADL Rank */}
                          <div className="text-center">
                            <Badge variant="outline" className={`text-xs ${getADLColor(position.adlRank)}`}>
                              {position.adlRank}
                            </Badge>
                          </div>

                          {/* Funding */}
                          <div className="text-center">
                            <div className={`text-xs font-medium ${
                              position.fundingRate >= 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {position.fundingRate >= 0 ? '+' : ''}{(position.fundingRate * 100).toFixed(4)}%
                            </div>
                            {/* Next funding time not tracked in mock; hide sublabel */}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-slate-700">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-green-400 hover:bg-green-400/10">
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-red-400 hover:bg-red-400/10">
                            <Minus className="w-3 h-3 mr-1" />
                            Reduce
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-slate-400 hover:bg-slate-400/10">
                            <X className="w-3 h-3 mr-1" />
                            Close
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-400 hover:bg-blue-400/10">
                            <Target className="w-3 h-3 mr-1" />
                            TP/SL
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactionHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Transaction History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    <Clock className="w-3 h-3 mr-1" />
                    All Transactions
                  </Badge>
                </div>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-center">
                  <div className="text-lg text-slate-400 mb-2">No transaction history</div>
                  <div className="text-sm text-slate-500">
                    Your transaction history will appear here when you start trading.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Position History Tab */}
          <TabsContent value="positionHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Position History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Closed Positions
                  </Badge>
                </div>
              </div>

              {/* Mock Position History */}
              <div className="space-y-2">
                {[
                  {
                    symbol: 'MEME_INDEX',
                    side: 'Buy',
                    openTime: '2024-01-19 14:30:22',
                    closeTime: '2024-01-20 09:15:33',
                    size: 2.5,
                    entryPrice: 2.34,
                    exitPrice: 2.67,
                    pnl: 825.00,
                    pnlPercent: 14.1,
                    duration: '18h 45m'
                  },
                  {
                    symbol: 'DOG_INDEX',
                    side: 'Sell',
                    openTime: '2024-01-18 10:20:15',
                    closeTime: '2024-01-19 16:45:12',
                    size: 1.8,
                    entryPrice: 1.89,
                    exitPrice: 1.73,
                    pnl: 288.00,
                    pnlPercent: 8.4,
                    duration: '1d 6h 25m'
                  },
                  {
                    symbol: 'CAT_INDEX',
                    side: 'Buy',
                    openTime: '2024-01-17 08:15:44',
                    closeTime: '2024-01-18 12:30:18',
                    size: 3.2,
                    entryPrice: 1.15,
                    exitPrice: 1.08,
                    pnl: -224.00,
                    pnlPercent: -6.1,
                    duration: '1d 4h 15m'
                  }
                ].map((position, index) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={position.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}
                          >
                            {position.side}
                          </Badge>
                          <span className="font-semibold text-white">{position.symbol}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-400">
                            +${position.pnl.toFixed(2)} ({position.pnlPercent}%)
                          </div>
                          <div className="text-xs text-slate-400">
                            Size: {position.size} • Entry: ${position.entryPrice}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Assets Overview</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Portfolio
                  </Badge>
                </div>
              </div>


              {/* Asset List */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Assets</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { asset: 'USDC', balance: 8234.12, locked: 1234.56, total: 9468.68 },
                      { asset: 'MEME_INDEX', balance: 1.5, locked: 0, total: 1.5 },
                      { asset: 'DOG_INDEX', balance: 0, locked: 0.8, total: 0.8 },
                      { asset: 'CAT_INDEX', balance: 2.0, locked: 0, total: 2.0 }
                    ].map((asset, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {asset.asset[0]}
                          </div>
                          <span className="font-medium text-white text-sm">{asset.asset}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white font-medium">
                            {asset.asset === 'USDC' ? `${asset.total.toLocaleString()}` : asset.total.toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-400">
                            Available: {asset.asset === 'USDC' ? `${asset.balance.toLocaleString()}` : asset.balance.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Open Orders Tab */}
          <TabsContent value="orders" className="h-auto m-0 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Open Orders</h3>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                  {mockOrders.length} Orders
                </Badge>
              </div>
              
              <div className="space-y-2">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={order.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}
                          >
                            {order.side}
                          </Badge>
                          <span className="font-semibold text-white">{order.symbol}</span>
                          <span className="text-xs text-slate-400">{order.type}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-white">
                            {order.size} @ ${order.price}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.time} • {order.status}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orderHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Order History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {mockOrderHistory.length} Orders
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Order Statistics Summary */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Filled Orders</div>
                  <div className="text-sm font-semibold text-green-400">
                    {mockOrderHistory.filter(o => o.status === 'Filled').length}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Cancelled</div>
                  <div className="text-sm font-semibold text-orange-400">
                    {mockOrderHistory.filter(o => o.status === 'Cancelled').length}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Expired</div>
                  <div className="text-sm font-semibold text-red-400">
                    {mockOrderHistory.filter(o => o.status === 'Expired').length}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Fill Rate</div>
                  <div className="text-sm font-semibold text-white">
                    {mockOrderHistory.length > 0 ? ((mockOrderHistory.filter(o => o.status === 'Filled').length / mockOrderHistory.length) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>

              {/* Order History Table */}
              <div className="space-y-2">
                {mockOrderHistory.map((order) => (
                  <Card key={order.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              order.status === 'Filled' ? 'text-green-400 border-green-400/30' :
                              order.status === 'Cancelled' ? 'text-orange-400 border-orange-400/30' :
                              'text-red-400 border-red-400/30'
                            }`}
                          >
                            {order.status}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${order.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                          >
                            {order.side}
                          </Badge>
                          <span className="font-semibold text-white text-sm">{order.symbol}</span>
                          <span className="text-xs text-slate-400">{order.type}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-slate-400">{order.time}</div>
                          <div className="text-xs text-slate-300">ID: {order.id}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Requested Price</div>
                          <div className="text-white font-medium">
                            {order.requestedPrice ? `$${order.requestedPrice}` : 'Market'}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Filled Price</div>
                          <div className="text-white font-medium">
                            {order.filledPrice > 0 ? `$${order.filledPrice}` : '-'}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Quantity</div>
                          <div className="text-white font-medium">
                            {order.filled}/{order.quantity} ({order.fillRate}%)
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">
                            {order.status === 'Filled' ? 'Fee' : 'Status'}
                          </div>
                          <div className="text-white font-medium">
                            {order.status === 'Filled' ? (
                              <div className="flex items-center gap-1">
                                <span>${order.fee}</span>
                                <Badge variant="outline" className={`text-xs ${
                                  order.feeType === 'maker' ? 'text-blue-400 border-blue-400/30' : 'text-purple-400 border-purple-400/30'
                                }`}>
                                  {order.feeType}
                                </Badge>
                              </div>
                            ) : order.status}
                          </div>
                        </div>
                      </div>

                      {/* Execution Analysis (only for filled orders) */}
                      {order.status === 'Filled' && (
                        <div className="mt-3 pt-2 border-t border-slate-700">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Slippage:</span>
                                <span className={`font-medium ${
                                  (order.slippage ?? 0) < 0 ? 'text-green-400' : 
                                  (order.slippage ?? 0) > 0.5 ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                  {(order.slippage ?? 0) > 0 ? '+' : ''}{order.slippage ?? 0}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Impact:</span>
                                <span className="text-white font-medium">{order.marketImpact}%</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-xs text-blue-400 hover:text-blue-300 h-5 px-2">
                              <ExternalLink className="w-2 h-2 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center pt-2">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                  Load More Orders
                </Button>
              </div>
            </div>
          </TabsContent>


          {/* Market Data Tab with Sub-tabs */}
          <TabsContent value="market" className="h-full m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Market Data Analysis</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    <Eye className="w-3 h-3 mr-1" />
                    Real-time
                  </Badge>
                </div>
              </div>

              {/* Market Data Sub-tabs */}
              <Tabs defaultValue="orderbook" className="w-full">
                <TabsList className="grid grid-cols-4 bg-muted/30 rounded-md w-full max-w-lg">
                  <TabsTrigger value="orderbook" className="text-xs data-[state=active]:bg-brand">
                    Order Book
                  </TabsTrigger>
                  <TabsTrigger value="toptraders" className="text-xs data-[state=active]:bg-brand">
                    Top Traders
                  </TabsTrigger>
                  <TabsTrigger value="holders" className="text-xs data-[state=active]:bg-brand">
                    Holders
                  </TabsTrigger>
                  <TabsTrigger value="whales" className="text-xs data-[state=active]:bg-brand">
                    Whale Alert
                  </TabsTrigger>
                </TabsList>

                {/* Order Book & Volume Sub-tab */}
                <TabsContent value="orderbook" className="mt-4 space-y-4">
                  {/* Depth Analysis */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-semibold text-white">Order Book Depth Analysis</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Bid/Ask Spread</div>
                          <div className={`text-sm font-semibold ${
                            mockMarketData.orderBookDepth.spreadInfo.spreadTrend === 'tightening' ? 'text-green-400' :
                            mockMarketData.orderBookDepth.spreadInfo.spreadTrend === 'widening' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {(mockMarketData.orderBookDepth.spreadInfo.bidAskSpread * 100).toFixed(3)}%
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            {mockMarketData.orderBookDepth.spreadInfo.spreadTrend}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Mid Price</div>
                          <div className="text-sm font-semibold text-white">
                            ${mockMarketData.orderBookDepth.spreadInfo.midPrice}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">5L Depth</div>
                          <div className="text-sm font-semibold text-white">
                            ${(mockMarketData.orderBookDepth.depthAnalysis.bid5Depth / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-slate-400">Bid side</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Imbalance</div>
                          <div className={`text-sm font-semibold ${
                            mockMarketData.orderBookDepth.depthAnalysis.imbalanceRatio > 1.2 ? 'text-green-400' :
                            mockMarketData.orderBookDepth.depthAnalysis.imbalanceRatio < 0.8 ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {mockMarketData.orderBookDepth.depthAnalysis.imbalanceRatio.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-400">Bid/Ask</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Volume Analysis */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Volume2 className="w-4 h-4 text-green-400" />
                        <h4 className="text-sm font-semibold text-white">Volume Analysis</h4>
                      </div>
                      
                      {/* Volume Statistics */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">24h Volume</div>
                          <div className="text-sm font-semibold text-white">
                            ${(mockMarketData.volumeAnalysis.volumeStats.total24h / 1e6).toFixed(1)}M
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Buy Volume</div>
                          <div className="text-sm font-semibold text-green-400">
                            ${(mockMarketData.volumeAnalysis.volumeStats.buyVolume / 1e6).toFixed(1)}M
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Sell Volume</div>
                          <div className="text-sm font-semibold text-red-400">
                            ${(mockMarketData.volumeAnalysis.volumeStats.sellVolume / 1e6).toFixed(1)}M
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Buy Ratio</div>
                          <div className={`text-sm font-semibold ${
                            mockMarketData.volumeAnalysis.volumeStats.buyRatio > 55 ? 'text-green-400' :
                            mockMarketData.volumeAnalysis.volumeStats.buyRatio < 45 ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {mockMarketData.volumeAnalysis.volumeStats.buyRatio.toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Avg Size</div>
                          <div className="text-sm font-semibold text-white">
                            ${mockMarketData.volumeAnalysis.volumeStats.avgTradeSize.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Median</div>
                          <div className="text-sm font-semibold text-white">
                            ${mockMarketData.volumeAnalysis.volumeStats.medianTradeSize.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Hourly Volume Breakdown */}
                      <div>
                        <div className="text-xs font-medium text-white mb-2">Hourly Volume (Last 6h)</div>
                        <div className="space-y-1">
                          {mockMarketData.volumeAnalysis.hourlyVolume.map((hour, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 w-12">{hour.hour}</span>
                                <Progress value={(hour.volume / 2.5e6) * 100} className="h-2 w-20" />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white">
                                  ${(hour.volume / 1e6).toFixed(1)}M
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${hour.buyRatio > 0.5 ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                                >
                                  {(hour.buyRatio * 100).toFixed(0)}% Buy
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Volatility Metrics */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Waves className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-semibold text-white">Volatility Analysis</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Historical Vol</div>
                          <div className={`text-sm font-semibold ${
                            mockMarketData.volatilityMetrics.historicalVol.trend === 'increasing' ? 'text-red-400' :
                            mockMarketData.volatilityMetrics.historicalVol.trend === 'decreasing' ? 'text-green-400' :
                            'text-yellow-400'
                          }`}>
                            {(mockMarketData.volatilityMetrics.historicalVol.current * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            {mockMarketData.volatilityMetrics.historicalVol.trend}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Implied Vol</div>
                          <div className="text-sm font-semibold text-orange-400">
                            {(mockMarketData.volatilityMetrics.impliedVol * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-400">Options based</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Vol Rank</div>
                          <div className={`text-sm font-semibold ${
                            mockMarketData.volatilityMetrics.volatilityRank > 70 ? 'text-red-400' :
                            mockMarketData.volatilityMetrics.volatilityRank > 30 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {mockMarketData.volatilityMetrics.volatilityRank}th
                          </div>
                          <div className="text-xs text-slate-400">percentile</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-xs text-slate-400">Week Range</div>
                          <div className="text-sm font-semibold text-white">
                            {(mockMarketData.volatilityMetrics.historicalVol.weekLow * 100).toFixed(1)}% - {(mockMarketData.volatilityMetrics.historicalVol.weekHigh * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* GARCH Predictions */}
                      <div>
                        <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                          <Target className="w-3 h-3 text-cyan-400" />
                          GARCH Model Predictions
                          <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/30 ml-auto">
                            {(mockMarketData.volatilityMetrics.garchPrediction.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-slate-900/50 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Next Hour</div>
                            <div className="text-sm font-semibold text-cyan-400">
                              {(mockMarketData.volatilityMetrics.garchPrediction.nextHour * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Next 4h</div>
                            <div className="text-sm font-semibold text-cyan-400">
                              {(mockMarketData.volatilityMetrics.garchPrediction.next4Hours * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Next Day</div>
                            <div className="text-sm font-semibold text-cyan-400">
                              {(mockMarketData.volatilityMetrics.garchPrediction.nextDay * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Holders Sub-tab */}
                {/* Top Traders Sub-tab */}
                <TabsContent value="toptraders" className="mt-4 space-y-4">
                  {/* Top Index Derivatives Traders */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-semibold text-white">Top Index Derivatives Traders</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Active Traders</div>
                          <div className="text-sm font-semibold text-white">2,847</div>
                          <div className="text-xs text-green-400">+127 (24h)</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Pro Traders</div>
                          <div className="text-sm font-semibold text-orange-400">8.3%</div>
                          <div className="text-xs text-slate-400">&gt;$50K volume</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Medium Traders</div>
                          <div className="text-sm font-semibold text-blue-400">24.7%</div>
                          <div className="text-xs text-slate-400">$5K-50K volume</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Retail Traders</div>
                          <div className="text-sm font-semibold text-green-400">67.0%</div>
                          <div className="text-xs text-slate-400">&lt;$5K volume</div>
                        </div>
                      </div>
                      
                      {/* Top Traders by Performance */}
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-white mb-2">Top MEME_INDEX Traders (24h)</div>
                        <div className="space-y-1">
                          {[
                            { rank: 1, address: '0xA1b2...F8d9', volume: '$324.5K', pnl: '+$32.4K', pnlPercent: '+11.1%', winRate: '78%' },
                            { rank: 2, address: '0xC3e4...A2b6', volume: '$289.3K', pnl: '+$28.9K', pnlPercent: '+11.1%', winRate: '82%' },
                            { rank: 3, address: '0xE5f6...C4d8', volume: '$276.8K', pnl: '-$8.1K', pnlPercent: '-2.9%', winRate: '45%' },
                            { rank: 4, address: '0xG7h8...E6f0', volume: '$215.2K', pnl: '+$19.8K', pnlPercent: '+10.2%', winRate: '71%' },
                            { rank: 5, address: '0xI9j0...G8h2', volume: '$198.9K', pnl: '+$14.2K', pnlPercent: '+7.7%', winRate: '69%' }
                          ].map((trader, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                  {trader.rank}
                                </div>
                                <span className="text-xs text-slate-400 font-mono">{trader.address}</span>
                                <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30">
                                  MEME
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white font-medium">{trader.volume}</div>
                                <div className={`text-xs ${trader.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                  {trader.pnl} ({trader.pnlPercent})
                                </div>
                                <div className="text-xs text-slate-400">Win: {trader.winRate}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-xs font-medium text-white mb-2 mt-4">Top AI_INDEX Traders (24h)</div>
                        <div className="space-y-1">
                          {[
                            { rank: 1, address: '0xB2c3...H9e1', volume: '$298.7K', pnl: '+$35.6K', pnlPercent: '+13.5%', winRate: '85%' },
                            { rank: 2, address: '0xD4e5...J1f3', volume: '$267.2K', pnl: '+$31.2K', pnlPercent: '+13.2%', winRate: '76%' },
                            { rank: 3, address: '0xF6g7...L3h5', volume: '$231.5K', pnl: '+$16.8K', pnlPercent: '+7.8%', winRate: '72%' },
                          ].map((trader, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                  {trader.rank}
                                </div>
                                <span className="text-xs text-slate-400 font-mono">{trader.address}</span>
                                <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30">
                                  AI
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white font-medium">{trader.volume}</div>
                                <div className={`text-xs ${trader.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                  {trader.pnl} ({trader.pnlPercent})
                                </div>
                                <div className="text-xs text-slate-400">Win: {trader.winRate}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trading Activity & Strategies */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-semibold text-white">Trading Activity & Strategies</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-white mb-2">Popular Strategies (24h)</div>
                          <div className="space-y-2">
                            {[
                              { strategy: 'Buy MEME + Sell AI', traders: 142, avgPnl: '+8.2%', volume: '$3.2M' },
                              { strategy: 'AI Index Momentum', traders: 89, avgPnl: '+5.7%', volume: '$2.1M' },
                              { strategy: 'Dog vs Cat Pair', traders: 67, avgPnl: '+3.4%', volume: '$1.8M' },
                              { strategy: 'Multi-Index Hedge', traders: 34, avgPnl: '+12.1%', volume: '$1.2M' }
                            ].map((item, index) => (
                              <div key={index} className="bg-slate-900/50 rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-white font-medium">{item.strategy}</span>
                                  <span className="text-xs text-green-400">{item.avgPnl}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>{item.traders} traders</span>
                                  <span>{item.volume} volume</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-white mb-2">Recent Big Trades</div>
                          <div className="space-y-1">
                            {[
                              { time: '14:23', trader: '0xA1b2...F8d9', action: 'Buy MEME_INDEX', size: '$145.2K', leverage: '5x' },
                              { time: '13:57', trader: '0xB2c3...H9e1', action: 'Sell AI_INDEX', size: '$132.8K', leverage: '3x' },
                              { time: '13:12', trader: '0xC3e4...A2b6', action: 'Buy DOG_INDEX', size: '$98.5K', leverage: '10x' },
                              { time: '12:45', trader: '0xD4e5...J1f3', action: 'Buy MEME_INDEX', size: '$167.3K', leverage: '2x' }
                            ].map((trade, index) => (
                              <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">{trade.time}</span>
                                  <span className="text-xs text-slate-400 font-mono">{trade.trader}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-white font-medium">{trade.size}</div>
                                  <div className={`text-xs ${trade.action.startsWith('Buy') ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.action} {trade.leverage}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Holders Sub-tab */}
                <TabsContent value="holders" className="mt-4 space-y-4">
                  {/* Holder Analysis */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-semibold text-white">Holder Analysis</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Total Holders</div>
                          <div className="text-sm font-semibold text-white">
    12,456
                          </div>
                          <div className="text-xs text-green-400">
                            +234 (24h)
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Whales</div>
                          <div className="text-sm font-semibold text-orange-400">
                            15.2%
                          </div>
                          <div className="text-xs text-slate-400">&gt;$100K</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Medium</div>
                          <div className="text-sm font-semibold text-blue-400">
                            35.8%
                          </div>
                          <div className="text-xs text-slate-400">$10K-100K</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Small</div>
                          <div className="text-sm font-semibold text-green-400">
                            49.0%
                          </div>
                          <div className="text-xs text-slate-400">&lt;$10K</div>
                        </div>
                      </div>
                      
                      {/* Top Holders */}
                      <div>
                        <div className="text-xs font-medium text-white mb-2">Top Holders</div>
                        <div className="space-y-1">
                          {[
                            { address: '0xa1b2c3...', balance: 2.5e6, percentage: 8.7, change: 12500 },
                            { address: '0xb2c3d4...', balance: 1.8e6, percentage: 6.2, change: -5600 },
                            { address: '0xc3d4e5...', balance: 1.4e6, percentage: 4.9, change: 8900 },
                            { address: '0xd4e5f6...', balance: 1.1e6, percentage: 3.8, change: 0 }
                          ].map((holder, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                  {index + 1}
                                </div>
                                <span className="text-xs text-slate-400 font-mono">{holder.address}</span>
                                <span className="text-xs text-slate-300">{holder.percentage}%</span>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white font-medium">
                                  ${(holder.balance / 1e6).toFixed(1)}M
                                </div>
                                <div className={`text-xs ${
                                  holder.change > 0 ? 'text-green-400' : 
                                  holder.change < 0 ? 'text-red-400' : 'text-slate-400'
                                }`}>
                                  {holder.change > 0 ? '+' : ''}{holder.change.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flow Analysis */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowUpDown className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-semibold text-white">Money Flow Analysis</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Net Flow 24h</div>
                          <div className={`text-sm font-semibold ${
                            'text-green-400'
                          }`}>
                            +$1.2M
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            accumulation
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Inflow</div>
                          <div className="text-sm font-semibold text-green-400">
                            $2.8M
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Outflow</div>
                          <div className="text-sm font-semibold text-red-400">
                            $1.6M
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Exchange Flow</div>
                          <div className="text-sm font-semibold text-white">
                            +$0.35M
                          </div>
                          <div className="text-xs text-slate-400">Net out</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Whale Alert Sub-tab */}
                <TabsContent value="whales" className="mt-4 space-y-4">
                  {/* Large Order Detection */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Scale className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-semibold text-white">Large Order Detection</h4>
                      </div>
                      
                      <div className="space-y-2">
                        {mockMarketData.orderBookDepth.whaleOrders.map((order, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-3">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${order.side === 'buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                              >
                                {order.side.toUpperCase()}
                              </Badge>
                              <div>
                                <div className="text-sm text-white font-medium">${order.size.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">@ ${order.price}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-orange-400 font-medium">{order.impact}% impact</div>
                              <div className="text-xs text-slate-400">{order.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Large Transactions */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Radar className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-semibold text-white">Large Transactions (&gt;$50K)</h4>
                      </div>
                      
                      <div className="space-y-2">
                        {[
                          { hash: '0x1a2b3c...', amount: 125000, type: 'Buy', wallet: '0x4d5e6f...', time: '3m ago', impact: 0.45 },
                          { hash: '0x2b3c4d...', amount: 89000, type: 'Sell', wallet: '0x5e6f7a...', time: '8m ago', impact: 0.32 },
                          { hash: '0x3c4d5e...', amount: 234000, type: 'Buy', wallet: '0x6f7a8b...', time: '15m ago', impact: 0.78 }
                        ].map((tx, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-3">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${tx.type === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                              >
                                {tx.type}
                              </Badge>
                              <div>
                                <div className="text-sm text-white font-medium">${tx.amount.toLocaleString()}</div>
                                <div className="text-xs text-slate-400 font-mono">{tx.wallet}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-orange-400 font-medium">{tx.impact}% impact</div>
                              <div className="text-xs text-slate-400">{tx.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-slate-700">
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs w-full">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View All Transactions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Whale Activity Summary */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-semibold text-white">Whale Activity Summary</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Large Buys</div>
                          <div className="text-sm font-semibold text-green-400">
                            2
                          </div>
                          <div className="text-xs text-slate-400">Last 24h</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Large Sells</div>
                          <div className="text-sm font-semibold text-red-400">
                            1
                          </div>
                          <div className="text-xs text-slate-400">Last 24h</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Total Volume</div>
                          <div className="text-sm font-semibold text-white">
                            $0.45M
                          </div>
                          <div className="text-xs text-slate-400">Whale trades</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">Avg Impact</div>
                          <div className="text-sm font-semibold text-orange-400">
                            0.52%
                          </div>
                          <div className="text-xs text-slate-400">Price impact</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>


        </div>
      </Tabs>
    </div>
  )
}
