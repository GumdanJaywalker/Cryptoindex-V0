'use client'

import { useState, useEffect } from 'react'

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
const chartTypes = ['Candlestick', 'Line', 'Area']
const tabs = [
  'Positions',
  'Open Orders', 
  'Order History',
  'Trade History',
  'Index Composition',
  'Funding History',
  'Market Data',
  'Analytics'
]

export function ChartArea() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [selectedChartType, setSelectedChartType] = useState('Candlestick')
  const [activeTab, setActiveTab] = useState('Positions')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Chart Controls */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 space-x-4">
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

      {/* Chart Area (70% height) */}
      <div className="flex-[0.7] bg-slate-950 border-b border-slate-800 flex items-center justify-center">
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

      {/* Bottom Tabs Area (30% height) */}
      <div className="flex-[0.3] flex flex-col">
        {/* Tab Headers */}
        <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center">
          <div className="flex space-x-1 px-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm whitespace-nowrap rounded transition-colors ${
                  activeTab === tab
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
        <div className="flex-1 bg-slate-950">
          {!isMounted ? (
            <div className="p-4">
              <div className="text-center text-slate-400">
                <div className="text-lg mb-2">Loading...</div>
                <div className="text-sm text-slate-500">Initializing interface</div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'Positions' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Positions</h3>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">PnL: </span>
                  <span className="text-green-400 font-mono">+$234.56 (+12.34%)</span>
                </div>
              </div>

              {/* Positions Table */}
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-10 gap-2 p-3 text-xs font-medium text-slate-400 bg-slate-800 border-b border-slate-700">
                  <div className="col-span-2">Symbol</div>
                  <div className="text-center">Size</div>
                  <div className="text-center">Entry Price</div>
                  <div className="text-center">Mark Price</div>
                  <div className="text-center">Liq. Price</div>
                  <div className="text-center">PnL</div>
                  <div className="text-center">ROE%</div>
                  <div className="text-center">Margin</div>
                  <div className="text-center">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-800">
                  {[
                    {
                      symbol: 'DOG_INDEX',
                      side: 'Long',
                      size: '125.50',
                      entryPrice: '1.2345',
                      markPrice: '1.2567',
                      liqPrice: '1.0234',
                      pnl: '+27.83',
                      pnlPercent: '+2.25',
                      roe: '+18.45',
                      margin: '156.23',
                      leverage: '10x'
                    },
                    {
                      symbol: 'CAT_INDEX',
                      side: 'Short',
                      size: '89.75',
                      entryPrice: '0.8765',
                      markPrice: '0.8543',
                      liqPrice: '1.1234',
                      pnl: '+19.92',
                      pnlPercent: '+2.54',
                      roe: '+25.67',
                      margin: '78.43',
                      leverage: '15x'
                    }
                  ].map((position, index) => (
                    <div key={index} className="grid grid-cols-10 gap-2 p-3 text-xs hover:bg-slate-800/50 transition-colors">
                      {/* Symbol & Side */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            position.side === 'Long' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {position.side}
                          </div>
                          <div>
                            <div className="text-white font-medium">{position.symbol}</div>
                            <div className="text-slate-400">{position.leverage}</div>
                          </div>
                        </div>
                      </div>

                      {/* Size */}
                      <div className="text-center">
                        <div className="text-white font-mono">{position.size}</div>
                        <div className="text-slate-400">USDC</div>
                      </div>

                      {/* Entry Price */}
                      <div className="text-center">
                        <div className="text-white font-mono">${position.entryPrice}</div>
                      </div>

                      {/* Mark Price */}
                      <div className="text-center">
                        <div className="text-white font-mono">${position.markPrice}</div>
                      </div>

                      {/* Liquidation Price */}
                      <div className="text-center">
                        <div className="text-red-400 font-mono">${position.liqPrice}</div>
                      </div>

                      {/* PnL */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          position.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${position.pnl}
                        </div>
                        <div className={`text-xs ${
                          position.pnlPercent.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ({position.pnlPercent}%)
                        </div>
                      </div>

                      {/* ROE% */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          position.roe.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {position.roe}%
                        </div>
                      </div>

                      {/* Margin */}
                      <div className="text-center">
                        <div className="text-white font-mono">${position.margin}</div>
                      </div>

                      {/* Actions */}
                      <div className="text-center">
                        <div className="flex justify-center space-x-1">
                          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors">
                            TP/SL
                          </button>
                          <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors">
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Position Summary */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Margin</div>
                  <div className="text-sm font-mono text-white">$234.66</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Free Balance</div>
                  <div className="text-sm font-mono text-white">$1,765.34</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total PnL</div>
                  <div className="text-sm font-mono text-green-400">+$47.75</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Margin Ratio</div>
                  <div className="text-sm font-mono text-white">12.34%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Index Composition' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">DOG_INDEX Composition</h3>
                <div className="text-xs text-slate-400">Last updated: 2m ago</div>
              </div>
              
              <div className="space-y-2">
                {[
                  { symbol: 'DOGE', name: 'Dogecoin', weight: 35.5, change: '+2.34%', price: '$0.08234' },
                  { symbol: 'SHIB', name: 'Shiba Inu', weight: 28.2, change: '-1.45%', price: '$0.000024' },
                  { symbol: 'FLOKI', name: 'Floki Inu', weight: 15.8, change: '+5.67%', price: '$0.000045' },
                  { symbol: 'BONK', name: 'Bonk', weight: 12.3, change: '+3.21%', price: '$0.000012' },
                  { symbol: 'WIF', name: 'Dogwifhat', weight: 8.2, change: '-0.89%', price: '$2.34' }
                ].map((asset, index) => (
                  <div key={index} className="flex items-center justify-between py-2 hover:bg-slate-800/50 rounded px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{asset.symbol}</div>
                        <div className="text-xs text-slate-400">{asset.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="text-right">
                        <div className="text-white font-mono">{asset.weight}%</div>
                        <div className="text-slate-400">Weight</div>
                      </div>
                      <div className={`text-right ${
                        asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <div className="font-mono">{asset.change}</div>
                        <div className="text-slate-400">24h</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono">{asset.price}</div>
                        <div className="text-slate-400">Price</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Diversification Score:</span>
                  <span className="text-green-400 font-medium">85/100</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Open Orders' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Open Orders</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors">
                    Cancel All
                  </button>
                  <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition-colors">
                    Hide Other Pairs
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-2 p-3 text-xs font-medium text-slate-400 bg-slate-800 border-b border-slate-700">
                  <div className="col-span-2">Symbol/Type</div>
                  <div className="text-center">Side</div>
                  <div className="text-center">Amount</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Trigger</div>
                  <div className="text-center">Filled</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-800">
                  {[
                    {
                      symbol: 'DOG_INDEX',
                      type: 'Limit',
                      side: 'Buy',
                      amount: '50.00',
                      price: '1.2100',
                      trigger: '-',
                      filled: '0%',
                      status: 'New',
                      time: '14:32:15'
                    },
                    {
                      symbol: 'CAT_INDEX',
                      type: 'Stop',
                      side: 'Sell',
                      amount: '25.50',
                      price: '0.8900',
                      trigger: '0.8950',
                      filled: '32%',
                      status: 'Partially Filled',
                      time: '13:45:22'
                    },
                    {
                      symbol: 'DOG_INDEX',
                      type: 'OCO',
                      side: 'Sell',
                      amount: '75.25',
                      price: '1.2800',
                      trigger: '1.1800',
                      filled: '0%',
                      status: 'New',
                      time: '12:18:45'
                    }
                  ].map((order, index) => (
                    <div key={index} className="grid grid-cols-9 gap-2 p-3 text-xs hover:bg-slate-800/50 transition-colors">
                      {/* Symbol & Type */}
                      <div className="col-span-2">
                        <div className="flex flex-col">
                          <div className="text-white font-medium">{order.symbol}</div>
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-400">{order.type}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-500 text-xs">{order.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Side */}
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.side === 'Buy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.side}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="text-center">
                        <div className="text-white font-mono">{order.amount}</div>
                        <div className="text-slate-400">USDC</div>
                      </div>

                      {/* Price */}
                      <div className="text-center">
                        <div className="text-white font-mono">${order.price}</div>
                      </div>

                      {/* Trigger */}
                      <div className="text-center">
                        <div className="text-white font-mono">
                          {order.trigger === '-' ? '-' : `$${order.trigger}`}
                        </div>
                      </div>

                      {/* Filled */}
                      <div className="text-center">
                        <div className="text-white">{order.filled}</div>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'New' 
                            ? 'bg-blue-500/20 text-blue-400'
                            : order.status === 'Partially Filled'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="text-center">
                        <div className="flex justify-center space-x-1">
                          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors">
                            Edit
                          </button>
                          <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders Summary */}
              <div className="mt-4 flex justify-between items-center text-xs">
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Total Orders:</span>
                    <span className="text-white font-medium">3</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Buy Orders:</span>
                    <span className="text-green-400 font-medium">1</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Sell Orders:</span>
                    <span className="text-red-400 font-medium">2</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Total Value:</span>
                  <span className="text-white font-mono">$150.75 USDC</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Order History' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Order History</h3>
                <div className="flex items-center space-x-2">
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>All Status</option>
                    <option>Filled</option>
                    <option>Cancelled</option>
                    <option>Rejected</option>
                  </select>
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>

              {/* Order History Table */}
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-10 gap-2 p-3 text-xs font-medium text-slate-400 bg-slate-800 border-b border-slate-700">
                  <div className="col-span-2">Time/Symbol</div>
                  <div className="text-center">Type</div>
                  <div className="text-center">Side</div>
                  <div className="text-center">Amount</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Filled</div>
                  <div className="text-center">Fee</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Trigger</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-800">
                  {[
                    {
                      time: '2024-01-15 14:32:15',
                      symbol: 'DOG_INDEX',
                      type: 'Market',
                      side: 'Buy',
                      amount: '100.00',
                      price: '1.2345',
                      filled: '100.00',
                      fee: '0.12',
                      status: 'Filled',
                      trigger: '-'
                    },
                    {
                      time: '2024-01-15 13:45:22',
                      symbol: 'CAT_INDEX',
                      type: 'Limit',
                      side: 'Sell',
                      amount: '50.00',
                      price: '0.8765',
                      filled: '50.00',
                      fee: '0.044',
                      status: 'Filled',
                      trigger: '-'
                    },
                    {
                      time: '2024-01-15 12:18:45',
                      symbol: 'DOG_INDEX',
                      type: 'Stop',
                      side: 'Sell',
                      amount: '75.25',
                      price: '1.1800',
                      filled: '0.00',
                      fee: '0.00',
                      status: 'Cancelled',
                      trigger: '1.2000'
                    },
                    {
                      time: '2024-01-15 11:30:12',
                      symbol: 'MEME_INDEX',
                      type: 'Limit',
                      side: 'Buy',
                      amount: '200.00',
                      price: '2.1500',
                      filled: '125.50',
                      fee: '0.27',
                      status: 'Partially Filled',
                      trigger: '-'
                    },
                    {
                      time: '2024-01-15 10:15:33',
                      symbol: 'CAT_INDEX',
                      type: 'Market',
                      side: 'Buy',
                      amount: '80.00',
                      price: '0.8900',
                      filled: '80.00',
                      fee: '0.071',
                      status: 'Filled',
                      trigger: '-'
                    }
                  ].map((order, index) => (
                    <div key={index} className="grid grid-cols-10 gap-2 p-3 text-xs hover:bg-slate-800/50 transition-colors">
                      {/* Time & Symbol */}
                      <div className="col-span-2">
                        <div className="flex flex-col">
                          <div className="text-white font-medium">{order.symbol}</div>
                          <div className="text-slate-400 text-xs">{order.time}</div>
                        </div>
                      </div>

                      {/* Type */}
                      <div className="text-center">
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                          {order.type}
                        </span>
                      </div>

                      {/* Side */}
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.side === 'Buy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.side}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="text-center">
                        <div className="text-white font-mono">{order.amount}</div>
                        <div className="text-slate-400">USDC</div>
                      </div>

                      {/* Price */}
                      <div className="text-center">
                        <div className="text-white font-mono">${order.price}</div>
                      </div>

                      {/* Filled */}
                      <div className="text-center">
                        <div className="text-white font-mono">{order.filled}</div>
                        <div className="text-slate-400">
                          {((parseFloat(order.filled) / parseFloat(order.amount)) * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Fee */}
                      <div className="text-center">
                        <div className="text-white font-mono">${order.fee}</div>
                        <div className="text-slate-400">USDC</div>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'Filled' 
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'Cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : order.status === 'Partially Filled'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Trigger */}
                      <div className="text-center">
                        <div className="text-white font-mono">
                          {order.trigger === '-' ? '-' : `$${order.trigger}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Summary */}
              <div className="mt-4 flex justify-between items-center text-xs">
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Total Orders:</span>
                    <span className="text-white font-medium">5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Filled:</span>
                    <span className="text-green-400 font-medium">3</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Cancelled:</span>
                    <span className="text-red-400 font-medium">1</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Partial:</span>
                    <span className="text-yellow-400 font-medium">1</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Total Fees:</span>
                    <span className="text-white font-mono">$0.505 USDC</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Trade History' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Trade History</h3>
                <div className="flex items-center space-x-2">
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>All Symbols</option>
                    <option>DOG_INDEX</option>
                    <option>CAT_INDEX</option>
                    <option>MEME_INDEX</option>
                  </select>
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>Last 24h</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
              </div>

              {/* Trade History Table */}
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-2 p-3 text-xs font-medium text-slate-400 bg-slate-800 border-b border-slate-700">
                  <div>Time</div>
                  <div>Symbol</div>
                  <div className="text-center">Side</div>
                  <div className="text-center">Size</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Fee</div>
                  <div className="text-center">PnL</div>
                  <div className="text-center">Funding</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-800">
                  {[
                    {
                      time: '14:32:15',
                      symbol: 'DOG_INDEX',
                      side: 'Buy',
                      size: '100.00',
                      price: '1.2345',
                      fee: '0.12345',
                      pnl: '+27.83',
                      funding: '-0.0034',
                      realizedPnl: true
                    },
                    {
                      time: '13:45:22',
                      symbol: 'CAT_INDEX', 
                      side: 'Sell',
                      size: '50.00',
                      price: '0.8765',
                      fee: '0.04383',
                      pnl: '+19.92',
                      funding: '+0.0021',
                      realizedPnl: true
                    },
                    {
                      time: '12:30:45',
                      symbol: 'DOG_INDEX',
                      side: 'Buy',
                      size: '75.25',
                      price: '1.1987',
                      fee: '0.09024',
                      pnl: '-12.45',
                      funding: '-0.0028',
                      realizedPnl: false
                    },
                    {
                      time: '11:15:33',
                      symbol: 'MEME_INDEX',
                      side: 'Sell',
                      size: '200.00',
                      price: '2.1500',
                      fee: '0.43000',
                      pnl: '+156.78',
                      funding: '+0.0089',
                      realizedPnl: true
                    }
                  ].map((trade, index) => (
                    <div key={index} className="grid grid-cols-8 gap-2 p-3 text-xs hover:bg-slate-800/50 transition-colors">
                      {/* Time */}
                      <div>
                        <div className="text-white font-mono">{trade.time}</div>
                      </div>

                      {/* Symbol */}
                      <div>
                        <div className="text-white font-medium">{trade.symbol}</div>
                      </div>

                      {/* Side */}
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.side === 'Buy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side}
                        </span>
                      </div>

                      {/* Size */}
                      <div className="text-center">
                        <div className="text-white font-mono">{trade.size}</div>
                        <div className="text-slate-400">USDC</div>
                      </div>

                      {/* Price */}
                      <div className="text-center">
                        <div className="text-white font-mono">${trade.price}</div>
                      </div>

                      {/* Fee */}
                      <div className="text-center">
                        <div className="text-white font-mono">${trade.fee}</div>
                      </div>

                      {/* PnL */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          trade.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${trade.pnl}
                        </div>
                        {trade.realizedPnl && (
                          <div className="text-xs text-slate-400">Realized</div>
                        )}
                      </div>

                      {/* Funding */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          trade.funding.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.funding}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade Summary */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Trades</div>
                  <div className="text-sm font-mono text-white">4</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Volume</div>
                  <div className="text-sm font-mono text-white">$425.25</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Fees</div>
                  <div className="text-sm font-mono text-red-400">-$0.69</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Net PnL</div>
                  <div className="text-sm font-mono text-green-400">+$191.08</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Funding History' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Funding History</h3>
                <div className="flex items-center space-x-2">
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>All Symbols</option>
                    <option>DOG_INDEX</option>
                    <option>CAT_INDEX</option>
                    <option>MEME_INDEX</option>
                  </select>
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>

              {/* Funding Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Funding Paid</div>
                  <div className="text-sm font-mono text-red-400">-$12.45</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Funding Received</div>
                  <div className="text-sm font-mono text-green-400">+$8.73</div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Net Funding</div>
                  <div className="text-sm font-mono text-red-400">-$3.72</div>
                </div>
              </div>

              {/* Funding History Table */}
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-2 p-3 text-xs font-medium text-slate-400 bg-slate-800 border-b border-slate-700">
                  <div>Funding Time</div>
                  <div>Symbol</div>
                  <div className="text-center">Position Size</div>
                  <div className="text-center">Funding Rate</div>
                  <div className="text-center">Funding Fee</div>
                  <div className="text-center">Mark Price</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-800">
                  {[
                    {
                      time: '2024-01-15 16:00:00',
                      symbol: 'DOG_INDEX',
                      positionSize: '+125.50',
                      fundingRate: '0.0045',
                      fundingFee: '-0.56',
                      markPrice: '1.2567'
                    },
                    {
                      time: '2024-01-15 08:00:00',
                      symbol: 'DOG_INDEX',
                      positionSize: '+125.50',
                      fundingRate: '0.0032',
                      fundingFee: '-0.40',
                      markPrice: '1.2234'
                    },
                    {
                      time: '2024-01-15 00:00:00',
                      symbol: 'CAT_INDEX',
                      positionSize: '-89.75',
                      fundingRate: '-0.0021',
                      fundingFee: '+0.19',
                      markPrice: '0.8543'
                    },
                    {
                      time: '2024-01-14 16:00:00',
                      symbol: 'DOG_INDEX',
                      positionSize: '+125.50',
                      fundingRate: '0.0067',
                      fundingFee: '-0.84',
                      markPrice: '1.2108'
                    },
                    {
                      time: '2024-01-14 08:00:00',
                      symbol: 'CAT_INDEX',
                      positionSize: '-89.75',
                      fundingRate: '-0.0034',
                      fundingFee: '+0.31',
                      markPrice: '0.8792'
                    },
                    {
                      time: '2024-01-14 00:00:00',
                      symbol: 'MEME_INDEX',
                      positionSize: '+200.00',
                      fundingRate: '0.0089',
                      fundingFee: '-1.78',
                      markPrice: '2.1230'
                    }
                  ].map((funding, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 p-3 text-xs hover:bg-slate-800/50 transition-colors">
                      {/* Funding Time */}
                      <div>
                        <div className="text-white font-mono text-xs">{funding.time.split(' ')[0]}</div>
                        <div className="text-slate-400 text-xs">{funding.time.split(' ')[1]}</div>
                      </div>

                      {/* Symbol */}
                      <div>
                        <div className="text-white font-medium">{funding.symbol}</div>
                      </div>

                      {/* Position Size */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          funding.positionSize.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {funding.positionSize}
                        </div>
                        <div className="text-slate-400">USDC</div>
                      </div>

                      {/* Funding Rate */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          funding.fundingRate.startsWith('-') ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {funding.fundingRate}%
                        </div>
                      </div>

                      {/* Funding Fee */}
                      <div className="text-center">
                        <div className={`font-mono ${
                          funding.fundingFee.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${funding.fundingFee}
                        </div>
                      </div>

                      {/* Mark Price */}
                      <div className="text-center">
                        <div className="text-white font-mono">${funding.markPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Funding Info */}
              <div className="mt-4 bg-slate-900 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="text-xs text-slate-400">Next Funding</div>
                      <div className="text-sm text-white font-mono">2h 34m 12s</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Current Rate</div>
                      <div className="text-sm text-green-400 font-mono">0.0023%</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Funding occurs every 8 hours at 00:00, 08:00, 16:00 UTC
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Market Data' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Market Data</h3>
                <div className="flex items-center space-x-2">
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>DOG_INDEX</option>
                    <option>CAT_INDEX</option>
                    <option>MEME_INDEX</option>
                    <option>AI_INDEX</option>
                  </select>
                </div>
              </div>

              {/* Market Overview */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Price Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">24h High:</span>
                      <span className="text-white font-mono">$1.2890</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">24h Low:</span>
                      <span className="text-white font-mono">$1.1234</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">24h Change:</span>
                      <span className="text-green-400 font-mono">+5.67%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">7d Change:</span>
                      <span className="text-green-400 font-mono">+12.34%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">30d Change:</span>
                      <span className="text-red-400 font-mono">-3.21%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Volume & Interest</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">24h Volume:</span>
                      <span className="text-white font-mono">$2.45M</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Open Interest:</span>
                      <span className="text-white font-mono">$892.3K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Long/Short Ratio:</span>
                      <span className="text-white font-mono">1.23</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Funding Rate:</span>
                      <span className="text-green-400 font-mono">0.0023%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Next Funding:</span>
                      <span className="text-white font-mono">2h 34m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Depth */}
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-white mb-3">Market Depth</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Buy Orders */}
                  <div>
                    <div className="text-xs text-green-400 font-medium mb-2">Bids</div>
                    <div className="space-y-1">
                      {[
                        { price: '1.2340', size: '2.5K', total: '3.1K' },
                        { price: '1.2339', size: '1.8K', total: '5.6K' },
                        { price: '1.2338', size: '3.2K', total: '8.8K' },
                        { price: '1.2337', size: '1.1K', total: '9.9K' }
                      ].map((order, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-green-400 font-mono">${order.price}</span>
                          <span className="text-white font-mono">{order.size}</span>
                          <span className="text-slate-400 font-mono">{order.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sell Orders */}
                  <div>
                    <div className="text-xs text-red-400 font-medium mb-2">Asks</div>
                    <div className="space-y-1">
                      {[
                        { price: '1.2341', size: '1.9K', total: '1.9K' },
                        { price: '1.2342', size: '2.7K', total: '4.6K' },
                        { price: '1.2343', size: '1.4K', total: '6.0K' },
                        { price: '1.2344', size: '2.1K', total: '8.1K' }
                      ].map((order, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-red-400 font-mono">${order.price}</span>
                          <span className="text-white font-mono">{order.size}</span>
                          <span className="text-slate-400 font-mono">{order.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Activity */}
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Trading Activity (Last 1h)</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-400">Total Trades</div>
                    <div className="text-sm font-mono text-white">1,247</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400">Buy Trades</div>
                    <div className="text-sm font-mono text-green-400">743</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400">Sell Trades</div>
                    <div className="text-sm font-mono text-red-400">504</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400">Buy/Sell Ratio</div>
                    <div className="text-sm font-mono text-white">1.47</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Analytics</h3>
                <div className="flex items-center space-x-2">
                  <select className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Trading Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total PnL:</span>
                      <span className="text-green-400 font-mono">+$1,234.56</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className="text-white font-mono">67.3%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Avg Win:</span>
                      <span className="text-green-400 font-mono">+$45.23</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Avg Loss:</span>
                      <span className="text-red-400 font-mono">-$23.87</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Profit Factor:</span>
                      <span className="text-white font-mono">2.89</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Risk Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Sharpe Ratio:</span>
                      <span className="text-white font-mono">1.47</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Max Drawdown:</span>
                      <span className="text-red-400 font-mono">-8.45%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Volatility:</span>
                      <span className="text-white font-mono">15.67%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Beta:</span>
                      <span className="text-white font-mono">0.89</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">VaR (95%):</span>
                      <span className="text-red-400 font-mono">-$89.34</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Trading Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Trades:</span>
                      <span className="text-white font-mono">156</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Winning Trades:</span>
                      <span className="text-green-400 font-mono">105</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Losing Trades:</span>
                      <span className="text-red-400 font-mono">51</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Avg Hold Time:</span>
                      <span className="text-white font-mono">4h 23m</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Volume:</span>
                      <span className="text-white font-mono">$45.2K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-white mb-3">Top Performing Assets</h4>
                <div className="space-y-2">
                  {[
                    { symbol: 'DOG_INDEX', pnl: '+$456.78', trades: 23, winRate: '78.3%' },
                    { symbol: 'CAT_INDEX', pnl: '+$234.56', trades: 18, winRate: '72.2%' },
                    { symbol: 'MEME_INDEX', pnl: '+$189.34', trades: 15, winRate: '66.7%' },
                    { symbol: 'AI_INDEX', pnl: '-$45.23', trades: 8, winRate: '37.5%' }
                  ].map((asset, index) => (
                    <div key={index} className="flex items-center justify-between py-2 hover:bg-slate-800/50 rounded px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                        </div>
                        <div className="text-sm font-medium text-white">{asset.symbol}</div>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="text-right">
                          <div className={`font-mono ${
                            asset.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {asset.pnl}
                          </div>
                          <div className="text-slate-400">PnL</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-mono">{asset.trades}</div>
                          <div className="text-slate-400">Trades</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-mono">{asset.winRate}</div>
                          <div className="text-slate-400">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategy Insights */}
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Strategy Insights</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Best Time to Trade</div>
                    <div className="text-sm text-white">16:00 - 20:00 UTC</div>
                    <div className="text-xs text-slate-500">Highest win rate during this period</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Optimal Position Size</div>
                    <div className="text-sm text-white">$150 - $200</div>
                    <div className="text-xs text-slate-500">Best risk-adjusted returns</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Recommended Leverage</div>
                    <div className="text-sm text-white">5x - 8x</div>
                    <div className="text-xs text-slate-500">Balances risk and reward</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Market Correlation</div>
                    <div className="text-sm text-white">0.73 with BTC</div>
                    <div className="text-xs text-slate-500">Strong positive correlation</div>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}