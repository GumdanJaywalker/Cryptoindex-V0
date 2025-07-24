'use client'

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
  Activity
} from 'lucide-react'

// Mock data for each tab
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
    liquidationPrice: 2.21
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
    liquidationPrice: 2.01
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
  { symbol: 'DOGE', weight: 25.4, change24h: 8.2, price: 0.085, allocation: 15420 },
  { symbol: 'SHIB', weight: 18.7, change24h: -2.1, price: 0.00001243, allocation: 11340 },
  { symbol: 'PEPE', weight: 15.9, change24h: 12.5, price: 0.00000876, allocation: 9640 },
  { symbol: 'FLOKI', weight: 12.3, change24h: 5.7, price: 0.000245, allocation: 7460 },
  { symbol: 'BONK', weight: 11.2, change24h: -1.8, price: 0.0000156, allocation: 6790 },
  { symbol: 'WIF', weight: 8.8, change24h: 15.3, price: 2.45, allocation: 5330 },
  { symbol: 'MEME', weight: 7.7, change24h: -4.2, price: 0.0234, allocation: 4670 }
]

export function TradingBottomTabs() {
  const [activeTab, setActiveTab] = useState('positions')

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid grid-cols-8 bg-slate-800 border-b border-slate-700 rounded-none rounded-t-lg">
          <TabsTrigger value="positions" className="text-xs data-[state=active]:bg-blue-600">
            Positions
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs data-[state=active]:bg-blue-600">
            Orders
          </TabsTrigger>
          <TabsTrigger value="orderHistory" className="text-xs data-[state=active]:bg-blue-600">
            Order History
          </TabsTrigger>
          <TabsTrigger value="tradeHistory" className="text-xs data-[state=active]:bg-blue-600">
            Trades
          </TabsTrigger>
          <TabsTrigger value="composition" className="text-xs data-[state=active]:bg-blue-600">
            Composition
          </TabsTrigger>
          <TabsTrigger value="funding" className="text-xs data-[state=active]:bg-blue-600">
            Funding
          </TabsTrigger>
          <TabsTrigger value="market" className="text-xs data-[state=active]:bg-blue-600">
            Market
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-blue-600">
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          {/* Positions Tab */}
          <TabsContent value="positions" className="h-full m-0 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Active Positions</h3>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  {mockPositions.length} Open
                </Badge>
              </div>
              
              <div className="space-y-2">
                {mockPositions.map((position) => (
                  <Card key={position.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={position.side === 'Long' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}
                          >
                            {position.side} {position.leverage}
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
          <TabsContent value="orderHistory" className="h-full m-0 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Order History</h3>
                <p className="text-xs text-slate-500">Your recent order history will appear here</p>
              </div>
            </div>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="tradeHistory" className="h-full m-0 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Trade History</h3>
                <p className="text-xs text-slate-500">Your executed trades will appear here</p>
              </div>
            </div>
          </TabsContent>

          {/* Index Composition Tab - 핵심 차별화 기능 */}
          <TabsContent value="composition" className="h-full m-0 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Index Composition</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    <PieChart className="w-3 h-3 mr-1" />
                    7 Assets
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Calendar className="w-3 h-3 mr-1" />
                    History
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {mockIndexComposition.map((asset, index) => (
                  <Card key={asset.symbol} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-white">{asset.symbol}</span>
                          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {asset.weight}%
                          </Badge>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </div>
                          <div className="text-xs text-slate-400">
                            ${asset.price}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Progress value={asset.weight} className="h-1" />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Allocation: ${asset.allocation.toLocaleString()}</span>
                          <span>Weight: {asset.weight}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Funding History Tab */}
          <TabsContent value="funding" className="h-full m-0 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Funding History</h3>
                <p className="text-xs text-slate-500">Funding payments history will appear here</p>
              </div>
            </div>
          </TabsContent>

          {/* Market Data Tab */}
          <TabsContent value="market" className="h-full m-0 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Market Data</h3>
                <p className="text-xs text-slate-500">Advanced market data will appear here</p>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="h-full m-0 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Target className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Analytics</h3>
                <p className="text-xs text-slate-500">Advanced analytics and insights will appear here</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}