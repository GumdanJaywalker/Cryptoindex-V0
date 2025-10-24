'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Settings,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Layers,
  Zap,
  Target
} from 'lucide-react'
import { useCurrency } from '@/lib/hooks/useCurrency'

const mockAsks = [
  { price: 1.2578, size: 987.3, total: 22456.7, isMyOrder: false, isLarge: false },
  { price: 1.2567, size: 1234.5, total: 21469.4, isMyOrder: false, isLarge: false },
  { price: 1.2556, size: 2345.6, total: 20234.9, isMyOrder: true, isLarge: false },
  { price: 1.2545, size: 3456.7, total: 17889.3, isMyOrder: false, isLarge: false },
  { price: 1.2534, size: 4567.8, total: 14432.6, isMyOrder: false, isLarge: true },
  { price: 1.2523, size: 5678.9, total: 9864.8, isMyOrder: false, isLarge: false },
  { price: 1.2512, size: 2134.6, total: 4185.9, isMyOrder: false, isLarge: false },
  { price: 1.2501, size: 2051.3, total: 2051.3, isMyOrder: false, isLarge: false },
]

const mockBids = [
  { price: 1.2500, size: 1876.4, total: 1876.4, isMyOrder: false, isLarge: false },
  { price: 1.2489, size: 1234.5, total: 3110.9, isMyOrder: false, isLarge: false },
  { price: 1.2478, size: 2345.6, total: 5456.5, isMyOrder: false, isLarge: false },
  { price: 1.2467, size: 3456.7, total: 8913.2, isMyOrder: true, isLarge: false },
  { price: 1.2456, size: 4567.8, total: 13481.0, isMyOrder: false, isLarge: true },
  { price: 1.2445, size: 5678.9, total: 19159.9, isMyOrder: false, isLarge: false },
  { price: 1.2434, size: 3210.1, total: 22370.0, isMyOrder: false, isLarge: false },
  { price: 1.2423, size: 2987.5, total: 25357.5, isMyOrder: false, isLarge: false },
]

const mockWhaleAlerts = [
  { time: '14:23:45', amount: '$125K', type: 'BUY', impact: 'Medium' },
  { time: '14:21:12', amount: '$89K', type: 'SELL', impact: 'Low' },
]

export function OrderBook() {
  const { formatPrice, currency } = useCurrency()
  const [grouping, setGrouping] = useState('0.01')
  const [showMyOrders, setShowMyOrders] = useState(true)
  const [showWhaleAlerts, setShowWhaleAlerts] = useState(true)
  
  const spread = 1.2523 - 1.2512
  const spreadPercentage = ((spread / 1.2512) * 100).toFixed(4)
  const midPrice = ((1.2523 + 1.2512) / 2).toFixed(4)
  
  const groupingOptions = ['0.01', '0.1', '1']
  
  const handlePriceClick = (price: number) => {
    // This would normally set the price in the trading panel
    console.log('Set price to:', price)
  }

  return (
    <div className="h-full bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3">
        <h3 className="text-sm font-medium text-white flex items-center">
          <BarChart3 className="w-3 h-3 mr-1" />
          Order Book
        </h3>
        <div className="flex items-center gap-2">
          <Select value={grouping} onValueChange={setGrouping}>
            <SelectTrigger className="h-6 w-16 bg-slate-800 border-slate-700 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {groupingOptions.map((option) => (
                <SelectItem key={option} value={option} className="text-white focus:bg-slate-700 text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMyOrders(!showMyOrders)}
            className="h-6 px-2 text-xs"
          >
            <Eye className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="h-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>Mid: <span className="text-white font-mono">{formatPrice(parseFloat(midPrice))}</span></span>
          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
            {grouping}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {showMyOrders && <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs px-1 py-0 h-4">My Orders</Badge>}
          {showWhaleAlerts && <Badge variant="outline" className="text-orange-400 border-orange-400/30 text-xs px-1 py-0 h-4">Whale Alert</Badge>}
        </div>
      </div>

      {/* Column Headers */}
      <div className="h-6 bg-slate-900 border-b border-slate-800 flex items-center px-3 text-xs text-slate-400">
        <div className="flex-1">Price ({currency})</div>
        <div className="flex-1 text-right">Size</div>
        <div className="flex-1 text-right">Total</div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 flex flex-col-reverse px-2 py-0.5 space-y-reverse space-y-0 overflow-y-auto min-h-0">
          {mockAsks.map((ask, index) => {
            const depth = (ask.total / 20000) * 100 // Calculate depth percentage
            return (
              <div 
                key={index} 
                className="relative flex items-center text-xs hover:bg-slate-800/50 py-0 rounded cursor-pointer group"
                onClick={() => handlePriceClick(ask.price)}
              >
                {/* Depth bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-red-500/10 rounded"
                  style={{ width: `${depth}%` }}
                />
                
                <div className={`flex-1 font-mono ${ask.isMyOrder ? 'text-blue-400 font-semibold' : 'text-red-400'}`}>
                  {formatPrice(ask.price)}
                </div>
                <div className="flex-1 text-right text-slate-300 font-mono">
                  {ask.size.toFixed(1)}
                  {ask.isLarge && <Zap className="w-3 h-3 inline ml-1 text-orange-400" />}
                </div>
                <div className="flex-1 text-right text-slate-400 font-mono">{ask.total.toFixed(1)}</div>
                <div className="w-8 flex justify-center">
                  {ask.isMyOrder && <Target className="w-3 h-3 text-blue-400" />}
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-slate-800 text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                  <div>Click to set price</div>
                  <div className="text-slate-400">Est. slippage: ~0.02%</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Spread */}
        <div className="h-8 flex items-center justify-center border-y border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <div>
              Spread: <span className="text-white font-mono">{formatPrice(spread)}</span>
              <span className="text-slate-500 ml-1">({spreadPercentage}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-slate-300">{formatPrice(mockBids[0].price)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-slate-300">{formatPrice(mockAsks[mockAsks.length - 1].price)}</span>
            </div>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 flex flex-col px-2 py-0.5 space-y-0 overflow-y-auto min-h-0">
          {mockBids.map((bid, index) => {
            const depth = (bid.total / 20000) * 100 // Calculate depth percentage
            return (
              <div 
                key={index} 
                className="relative flex items-center text-xs hover:bg-slate-800/50 py-0 rounded cursor-pointer group"
                onClick={() => handlePriceClick(bid.price)}
              >
                {/* Depth bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-green-500/10 rounded"
                  style={{ width: `${depth}%` }}
                />
                
                <div className={`flex-1 font-mono ${bid.isMyOrder ? 'text-blue-400 font-semibold' : 'text-green-400'}`}>
                  {formatPrice(bid.price)}
                </div>
                <div className="flex-1 text-right text-slate-300 font-mono">
                  {bid.size.toFixed(1)}
                  {bid.isLarge && <Zap className="w-3 h-3 inline ml-1 text-orange-400" />}
                </div>
                <div className="flex-1 text-right text-slate-400 font-mono">{bid.total.toFixed(1)}</div>
                <div className="w-8 flex justify-center">
                  {bid.isMyOrder && <Target className="w-3 h-3 text-blue-400" />}
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-slate-800 text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                  <div>Click to set price</div>
                  <div className="text-slate-400">Est. slippage: ~0.02%</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Whale Alerts Section */}
      {showWhaleAlerts && (
        <div className="h-12 border-t border-slate-800 bg-slate-900/50 p-1.5 flex-shrink-0">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            <span className="text-xs font-medium text-white">Whale Alert</span>
          </div>
          <div className="space-y-0.5 overflow-y-auto h-7">
            {mockWhaleAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{alert.time}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 h-3 ${
                      alert.type === 'BUY' 
                        ? 'text-green-400 border-green-400/30' 
                        : 'text-red-400 border-red-400/30'
                    }`}
                  >
                    {alert.type}
                  </Badge>
                  <span className="text-white font-mono">{alert.amount}</span>
                </div>
                <Badge variant="outline" className="text-orange-400 border-orange-400/30 text-xs px-1 py-0 h-3">
                  {alert.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}