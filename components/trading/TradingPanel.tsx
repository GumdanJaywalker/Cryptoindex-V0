'use client'

import { useState } from 'react'

const orderTypes = ['Market', 'Limit', 'Stop', 'OCO']
const leverageOptions = [1, 2, 5, 10, 20, 50]

export function TradingPanel() {
  const [side, setSide] = useState<'Long' | 'Short'>('Long')
  const [orderType, setOrderType] = useState('Market')
  const [leverage, setLeverage] = useState(10)
  const [price, setPrice] = useState('1.2345')
  const [size, setSize] = useState('')
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-3">
        <h3 className="text-sm font-medium text-white">Trading Panel</h3>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Long/Short Tabs */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setSide('Long')}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
              side === 'Long'
                ? 'bg-green-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Long
          </button>
          <button
            onClick={() => setSide('Short')}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
              side === 'Short'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Short
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {orderTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Leverage */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Leverage: {leverage}x</label>
          <div className="flex space-x-1">
            {leverageOptions.map((lev) => (
              <button
                key={lev}
                onClick={() => setLeverage(lev)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  leverage === lev
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        {orderType !== 'Market' && (
          <div>
            <label className="block text-xs text-slate-400 mb-1">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="0.0000"
            />
          </div>
        )}

        {/* Size */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Size (USDC)</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="0.00"
          />
          <div className="flex space-x-1 mt-1">
            {[25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* TP/SL */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={takeProfitEnabled}
              onChange={(e) => setTakeProfitEnabled(e.target.checked)}
              className="rounded"
            />
            <label className="text-xs text-slate-400">Take Profit</label>
          </div>
          {takeProfitEnabled && (
            <input
              type="text"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="0.0000"
            />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={stopLossEnabled}
              onChange={(e) => setStopLossEnabled(e.target.checked)}
              className="rounded"
            />
            <label className="text-xs text-slate-400">Stop Loss</label>
          </div>
          {stopLossEnabled && (
            <input
              type="text"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="0.0000"
            />
          )}
        </div>

        {/* Execute Button */}
        <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          side === 'Long'
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-red-600 hover:bg-red-500 text-white'
        }`}>
          {side} DOG_INDEX
        </button>

        {/* Order Preview */}
        <div className="bg-slate-900 rounded-lg p-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Est. Fee:</span>
            <span className="text-white">$0.12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Liq. Price:</span>
            <span className="text-yellow-400">$1.1234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Margin:</span>
            <span className="text-white">$123.45</span>
          </div>
        </div>
      </div>
    </div>
  )
}