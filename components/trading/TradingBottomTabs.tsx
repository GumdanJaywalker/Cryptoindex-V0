'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  BarChart3,
  Target,
  Activity,
  ExternalLink,
  Plus,
  Minus,
  X,
  Shield
} from 'lucide-react'

// Mock data for positions - enhanced with more detailed information
const mockPositions = [
  {
    id: '1',
    symbol: 'MEME_INDEX',
    side: 'Long',
    size: 1.5,
    entryPrice: 2.45,
    currentPrice: 2.67,
    pnl: 330.00,
    pnlPercent: 8.98,
    margin: 245.25,
    leverage: '10x',
    liquidationPrice: 2.21,
    adlRank: 2,
    fundingRate: 0.0045,
    nextFunding: '7h 23m'
  },
  {
    id: '2', 
    symbol: 'DOG_INDEX',
    side: 'Short',
    size: 0.8,
    entryPrice: 1.82,
    currentPrice: 1.73,
    pnl: 72.00,
    pnlPercent: 4.95,
    margin: 145.60,
    leverage: '5x',
    liquidationPrice: 2.01,
    adlRank: 1,
    fundingRate: -0.0023,
    nextFunding: '7h 23m'
  },
  {
    id: '3',
    symbol: 'CAT_INDEX',
    side: 'Long',
    size: 2.0,
    entryPrice: 1.18,
    currentPrice: 1.234,
    pnl: 108.00,
    pnlPercent: 4.6,
    margin: 246.80,
    leverage: '8x',
    liquidationPrice: 0.944,
    adlRank: 3,
    fundingRate: 0.0078,
    nextFunding: '7h 23m'
  },
  {
    id: '4',
    symbol: 'AI_INDEX',
    side: 'Short',
    size: -0.75,
    entryPrice: 6.89,
    currentPrice: 6.789,
    pnl: 75.75,
    pnlPercent: 1.5,
    margin: 509.18,
    leverage: '12x',
    liquidationPrice: 7.545,
    adlRank: 4,
    fundingRate: 0.0034,
    nextFunding: '7h 23m'
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
]

// Mock data for trade history  
const mockTradeHistory = [
  {
    id: 'TRD001',
    time: '2024-01-20 14:23:15',
    symbol: 'MEME_INDEX',
    side: 'Buy',
    price: 2.44,
    quantity: 1.5,
    value: 3.66,
    fee: 3.66,
    feeType: 'maker',
    realizedPnL: null, // position still open
    tradeId: 'HYP_12345678'
  },
  {
    id: 'TRD002',
    time: '2024-01-20 13:45:08', 
    symbol: 'DOG_INDEX',
    side: 'Sell',
    price: 1.73,
    quantity: 0.8,
    value: 1.384,
    fee: 1.38,
    feeType: 'taker',
    realizedPnL: 45.67, // closed position
    tradeId: 'HYP_12345679'
  },
  {
    id: 'TRD003',
    time: '2024-01-19 16:15:45',
    symbol: 'AI_INDEX', 
    side: 'Sell',
    price: 3.19,
    quantity: 1.2,
    value: 3.828,
    fee: 3.83,
    feeType: 'taker',
    realizedPnL: -12.34, // loss
    tradeId: 'HYP_12345680'
  },
  {
    id: 'TRD004',
    time: '2024-01-19 11:30:22',
    symbol: 'CAT_INDEX',
    side: 'Buy',
    price: 1.42,
    quantity: 1.5,
    value: 2.13,
    fee: 2.13,
    feeType: 'maker',
    realizedPnL: null,
    tradeId: 'HYP_12345681'
  },
  {
    id: 'TRD005',
    time: '2024-01-18 15:45:10',
    symbol: 'MEME_INDEX',
    side: 'Sell',
    price: 2.38,
    quantity: 0.5,
    value: 1.19,
    fee: 1.19,
    feeType: 'taker',
    realizedPnL: 23.45,
    tradeId: 'HYP_12345682'
  }
]

// Mock trading statistics
const mockTradingStats = {
  totalTrades: 47,
  totalVolume: 125670,
  winRate: 68.1,
  avgReturn: 4.2,
  totalFees: 234.56,
  totalPnL: 1456.78,
  bestTrade: 89.23,
  worstTrade: -34.56,
  avgHoldTime: '2.3 days',
  profitFactor: 1.85,
  monthlyStats: [
    { month: 'Jan 2024', trades: 12, volume: 28450, pnl: 234.56, winRate: 75.0 },
    { month: 'Dec 2023', trades: 15, volume: 35670, pnl: 345.67, winRate: 66.7 },
    { month: 'Nov 2023', trades: 20, volume: 61550, pnl: 876.55, winRate: 65.0 }
  ]
}

export function TradingBottomTabs() {
  const [activeTab, setActiveTab] = useState('positions')
  const [mounted, setMounted] = useState(false)

  // 클라이언트 사이드에서만 동적 계산 수행
  useEffect(() => {
    setMounted(true)
  }, [])

  // 서버사이드에서는 기본값 사용, 클라이언트에서만 동적 계산
  const totalPnL = mounted ? mockPositions.reduce((sum, pos) => sum + pos.pnl, 0) : 0
  const totalMargin = mounted ? mockPositions.reduce((sum, pos) => sum + pos.margin, 0) : 0
  const winningPositions = mounted ? mockPositions.filter(p => p.pnl > 0).length : 0
  const avgReturn = mounted ? (mockPositions.reduce((sum, pos) => sum + pos.pnlPercent, 0) / mockPositions.length) : 0

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid grid-cols-8 bg-slate-800 border-b border-slate-700 rounded-none rounded-t-lg">
          <TabsTrigger value="positions" className="text-xs data-[state=active]:bg-blue-600">
            Positions
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs data-[state=active]:bg-blue-600">
            Open Orders
          </TabsTrigger>
          <TabsTrigger value="orderHistory" className="text-xs data-[state=active]:bg-blue-600">
            Order History
          </TabsTrigger>
          <TabsTrigger value="tradeHistory" className="text-xs data-[state=active]:bg-blue-600">
            Trade History
          </TabsTrigger>
          <TabsTrigger value="transactionHistory" className="text-xs data-[state=active]:bg-blue-600">
            Transaction History
          </TabsTrigger>
          <TabsTrigger value="positionHistory" className="text-xs data-[state=active]:bg-blue-600">
            Position History
          </TabsTrigger>
          <TabsTrigger value="marketData" className="text-xs data-[state=active]:bg-blue-600">
            Market Data
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-xs data-[state=active]:bg-blue-600">
            Assets
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          {/* Positions Tab - Enhanced with detailed information */}
          <TabsContent value="positions" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Active Positions</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {mockPositions.length} Open
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${
                      totalPnL >= 0 
                        ? 'text-green-400 border-green-400/30' 
                        : 'text-red-400 border-red-400/30'
                    }`}
                  >
                    Total P&L: {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                  </Badge>
                </div>
              </div>

              {/* Detailed Position Table */}
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
                                position.side === 'Long' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
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
                                ? (position.side === 'Long' ? 'text-green-400' : 'text-red-400')
                                : (position.side === 'Long' ? 'text-red-400' : 'text-green-400')
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
                              {(Math.abs((position.liquidationPrice - position.currentPrice) / position.currentPrice) * 100).toFixed(1)}%
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
                            <div className="text-xs text-slate-400">{position.nextFunding}</div>
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

              {/* Risk Management Summary */}
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <h4 className="text-sm font-semibold text-white">Risk Management</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Portfolio Margin</div>
                      <div className="text-sm font-semibold text-white">
                        ${totalMargin.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Avg Leverage</div>
                      <div className="text-sm font-semibold text-orange-400">
                        {mounted ? (mockPositions.reduce((sum, pos) => sum + parseInt(pos.leverage), 0) / mockPositions.length).toFixed(1) : '0.0'}x
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Highest ADL</div>
                      <div className={`text-sm font-semibold ${
                        mounted && Math.max(...mockPositions.map(p => p.adlRank)) >= 4 ? 'text-red-400' : 
                        mounted && Math.max(...mockPositions.map(p => p.adlRank)) >= 3 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {mounted ? Math.max(...mockPositions.map(p => p.adlRank)) : 1}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Funding Impact</div>
                      <div className={`text-sm font-semibold ${
                        mounted && mockPositions.reduce((sum, pos) => sum + pos.fundingRate, 0) >= 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {mounted ? (mockPositions.reduce((sum, pos) => sum + pos.fundingRate, 0) >= 0 ? '+' : '') : ''}{mounted ? (mockPositions.reduce((sum, pos) => sum + pos.fundingRate, 0) * 100).toFixed(3) : '0.000'}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactionHistory" className="h-full m-0 p-4 overflow-y-auto">
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
          <TabsContent value="positionHistory" className="h-full m-0 p-4 overflow-y-auto">
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
                    side: 'Long',
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
                    side: 'Short',
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
                    side: 'Long',
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
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${position.side === 'Long' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                          >
                            {position.side}
                          </Badge>
                          <span className="font-semibold text-white text-sm">{position.symbol}</span>
                          <span className="text-xs text-slate-400">{position.size} USDC</span>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${
                            position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </div>
                          <div className={`text-xs ${
                            position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Entry Price</div>
                          <div className="text-white font-medium">${position.entryPrice}</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Exit Price</div>
                          <div className="text-white font-medium">${position.exitPrice}</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Duration</div>
                          <div className="text-white font-medium">{position.duration}</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Closed</div>
                          <div className="text-white font-medium">{position.closeTime.split(' ')[0]}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="h-full m-0 p-4 overflow-y-auto">
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

              {/* Account Summary */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Account Summary</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Balance</div>
                      <div className="text-sm font-semibold text-white">$12,543.67</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Available</div>
                      <div className="text-sm font-semibold text-green-400">$8,234.12</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">In Orders</div>
                      <div className="text-sm font-semibold text-yellow-400">$1,234.56</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">In Positions</div>
                      <div className="text-sm font-semibold text-blue-400">$3,074.99</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
          <TabsContent value="orders" className="h-full m-0 p-4">
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
          <TabsContent value="orderHistory" className="h-full m-0 p-4 overflow-y-auto">
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
                    {((mockOrderHistory.filter(o => o.status === 'Filled').length / mockOrderHistory.length) * 100).toFixed(1)}%
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
                                  order.slippage < 0 ? 'text-green-400' : 
                                  order.slippage > 0.5 ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                  {order.slippage > 0 ? '+' : ''}{order.slippage}%
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
            </div>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="tradeHistory" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Trade History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    <Activity className="w-3 h-3 mr-1" />
                    {mockTradeHistory.length} Trades
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>

              {/* Trading Statistics Summary */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Trading Performance</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Trades</div>
                      <div className="text-sm font-semibold text-white">
                        {mockTradingStats.totalTrades}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Win Rate</div>
                      <div className="text-sm font-semibold text-green-400">
                        {mockTradingStats.winRate}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total P&L</div>
                      <div className="text-sm font-semibold text-green-400">
                        +${mockTradingStats.totalPnL}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Volume</div>
                      <div className="text-sm font-semibold text-white">
                        ${(mockTradingStats.totalVolume / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Avg Return</div>
                      <div className="text-sm font-semibold text-blue-400">
                        +{mockTradingStats.avgReturn}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Fees</div>
                      <div className="text-sm font-semibold text-orange-400">
                        ${mockTradingStats.totalFees}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Best Trade</div>
                      <div className="text-sm font-semibold text-green-400">
                        +${mockTradingStats.bestTrade}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Profit Factor</div>
                      <div className="text-sm font-semibold text-cyan-400">
                        {mockTradingStats.profitFactor}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trade History Table */}
              <div className="space-y-2">
                {mockTradeHistory.map((trade) => (
                  <Card key={trade.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${trade.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                          >
                            {trade.side}
                          </Badge>
                          <span className="font-semibold text-white text-sm">{trade.symbol}</span>
                          <div className="text-xs text-slate-400">
                            {trade.quantity} @ ${trade.price}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-slate-400">{trade.time}</div>
                          <div className="text-xs text-slate-300">ID: {trade.tradeId}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Trade Value</div>
                          <div className="text-white font-medium">
                            ${trade.value.toFixed(3)}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Fee</div>
                          <div className="text-white font-medium">
                            <div className="flex items-center gap-1">
                              <span>${trade.fee}</span>
                              <Badge variant="outline" className={`text-xs ${
                                trade.feeType === 'maker' ? 'text-blue-400 border-blue-400/30' : 'text-purple-400 border-purple-400/30'
                              }`}>
                                {trade.feeType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Realized P&L</div>
                          <div className="font-medium">
                            {trade.realizedPnL !== null ? (
                              <span className={trade.realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {trade.realizedPnL >= 0 ? '+' : ''}${trade.realizedPnL}
                              </span>
                            ) : (
                              <span className="text-slate-400">Open</span>
                            )}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Trade ID</div>
                          <div className="text-white font-medium font-mono text-xs">
                            {trade.tradeId.split('_')[1]}
                          </div>
                        </div>
                      </div>

                      {/* Trade Analysis */}
                      <div className="mt-3 pt-2 border-t border-slate-700">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            {trade.realizedPnL !== null && (
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Return:</span>
                                <span className={`font-medium ${
                                  trade.realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {trade.realizedPnL >= 0 ? '+' : ''}{((trade.realizedPnL / trade.value) * 100).toFixed(2)}%
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Side:</span>
                              <span className={`font-medium ${
                                trade.side === 'Buy' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {trade.side === 'Buy' ? 'Long' : 'Short'}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs text-blue-400 hover:text-blue-300 h-5 px-2">
                            <ExternalLink className="w-2 h-2 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Market Data Tab - Holders, Whale, P&L Information */}
          <TabsContent value="marketData" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Market Data & Analysis</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Live Data
                  </Badge>
                </div>
              </div>

              {/* Top Holders Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-white">Top Holders</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { rank: 1, address: '0x4030...0b6112', percentage: 12.5, amount: '$2,450,000' },
                      { rank: 2, address: '0xaaaea...b56ba3', percentage: 7.6, amount: '$1,532,000' },
                      { rank: 3, address: '0xa4030...10e4b0', percentage: 5.2, amount: '$1,040,000' },
                      { rank: 4, address: '0x8878...f19265', percentage: 3.1, amount: '$620,000' },
                      { rank: 5, address: '0x1234...567890', percentage: 2.8, amount: '$560,000' }
                    ].map((holder) => (
                      <div key={holder.rank} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {holder.rank}
                          </div>
                          <div className="font-mono text-sm text-white">{holder.address}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white font-medium">{holder.percentage}%</div>
                          <div className="text-xs text-slate-400">{holder.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Whale Activity Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Whale Activity</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { type: 'BUY', amount: '$125K', time: '14:23:45', address: '0x1234...567890', price: '$1.2500' },
                      { type: 'SELL', amount: '$89K', time: '14:15:23', address: '0xabcd...123456', price: '$1.2501' },
                      { type: 'BUY', amount: '$67K', time: '14:08:12', address: '0x9876...543210', price: '$1.2472' },
                      { type: 'SELL', amount: '$234K', time: '13:55:30', address: '0xdef0...987654', price: '$1.2489' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              activity.type === 'BUY' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
                            }`}
                          >
                            {activity.type}
                          </Badge>
                          <div className="font-mono text-sm text-white">{activity.address}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white font-medium">{activity.amount}</div>
                          <div className="text-xs text-slate-400">{activity.time} @ {activity.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* P&L Distribution */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">P&L Distribution</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Profitable Addresses</div>
                      <div className="text-sm font-semibold text-green-400">68.2%</div>
                      <div className="text-xs text-slate-500">11,423 addresses</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Loss-making Addresses</div>
                      <div className="text-sm font-semibold text-red-400">31.8%</div>
                      <div className="text-xs text-slate-500">5,321 addresses</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Avg Profit</div>
                      <div className="text-sm font-semibold text-green-400">+$2,341</div>
                      <div className="text-xs text-slate-500">per address</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Avg Loss</div>
                      <div className="text-sm font-semibold text-red-400">-$1,156</div>
                      <div className="text-xs text-slate-500">per address</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Sentiment */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <h4 className="text-sm font-semibold text-white">Market Sentiment</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Fear & Greed Index</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-orange-400">42</span>
                        <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">
                          Fear
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Social Sentiment</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-400">Bullish 78%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Active Traders (24h)</span>
                      <span className="text-sm font-semibold text-white">1,234</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}