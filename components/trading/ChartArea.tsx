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
              <div className="text-center text-slate-400">
                <div className="text-lg mb-2">Trade History</div>
                <div className="text-sm text-slate-500">No trade history</div>
              </div>
            </div>
          )}

          {activeTab === 'Funding History' && (
            <div className="p-4">
              <div className="text-center text-slate-400">
                <div className="text-lg mb-2">Funding History</div>
                <div className="text-sm text-slate-500">Funding payments will appear here</div>
              </div>
            </div>
          )}

          {activeTab === 'Market Data' && (
            <div className="p-4">
              <div className="text-center text-slate-400">
                <div className="text-lg mb-2">Market Data</div>
                <div className="text-sm text-slate-500">Advanced market statistics</div>
              </div>
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="p-4">
              <div className="text-center text-slate-400">
                <div className="text-lg mb-2">Analytics</div>
                <div className="text-sm text-slate-500">Trading analytics and insights</div>
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