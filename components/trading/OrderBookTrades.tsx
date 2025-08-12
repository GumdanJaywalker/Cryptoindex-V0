'use client'

import { useState } from 'react'

// Mock data for orderbook
const mockOrderBook = {
  bids: [
    { price: 43.237, size: 1.00, total: 506.73 },
    { price: 43.236, size: 22.42, total: 505.73 },
    { price: 43.235, size: 152.87, total: 483.31 },
    { price: 43.233, size: 13.50, total: 330.44 },
    { price: 43.232, size: 40.90, total: 316.94 },
    { price: 43.231, size: 12.83, total: 276.04 },
    { price: 43.230, size: 18.28, total: 263.21 },
    { price: 43.228, size: 215.75, total: 244.93 },
    { price: 43.227, size: 10.00, total: 29.18 },
    { price: 43.225, size: 16.88, total: 19.18 },
  ],
  asks: [
    { price: 43.225, size: 16.88, total: 19.18 },
    { price: 43.227, size: 10.00, total: 29.18 },
    { price: 43.228, size: 215.75, total: 244.93 },
    { price: 43.230, size: 18.28, total: 263.21 },
    { price: 43.231, size: 12.83, total: 276.04 },
    { price: 43.232, size: 40.90, total: 316.94 },
    { price: 43.233, size: 13.50, total: 330.44 },
    { price: 43.235, size: 152.87, total: 483.31 },
    { price: 43.236, size: 22.42, total: 505.73 },
    { price: 43.237, size: 1.00, total: 506.73 },
  ]
}

// Mock data for recent trades
const mockTrades = [
  { price: 43.217, size: 3.04, time: '14:23:07', type: 'sell' },
  { price: 43.216, size: 1.43, time: '14:23:06', type: 'sell' },
  { price: 43.216, size: 0.89, time: '14:23:06', type: 'sell' },
  { price: 43.218, size: 0.81, time: '14:23:05', type: 'buy' },
  { price: 43.221, size: 2.64, time: '14:23:04', type: 'buy' },
  { price: 43.220, size: 12.20, time: '14:23:04', type: 'buy' },
  { price: 43.220, size: 0.81, time: '14:23:04', type: 'buy' },
  { price: 43.215, size: 0.89, time: '14:23:03', type: 'sell' },
  { price: 43.220, size: 17.97, time: '14:23:02', type: 'buy' },
  { price: 43.221, size: 0.81, time: '14:23:02', type: 'buy' },
  { price: 43.217, size: 0.89, time: '14:23:00', type: 'sell' },
  { price: 43.217, size: 0.89, time: '14:23:00', type: 'sell' },
  { price: 43.219, size: 0.80, time: '14:23:00', type: 'buy' },
  { price: 43.215, size: 26.11, time: '14:22:59', type: 'sell' },
  { price: 43.218, size: 12.14, time: '14:22:59', type: 'buy' },
]

export function OrderBookTrades() {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook')

  return (
    <div className="bg-slate-950">
      {/* Tab Header */}
      <div className="flex border-b border-slate-700 bg-slate-900">
        <button
          onClick={() => setActiveTab('orderbook')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'orderbook'
              ? 'text-white bg-slate-800 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Order Book
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'trades'
              ? 'text-white bg-slate-800 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Trades
        </button>
      </div>

      {/* Content */}
      <div className="h-[75vh] bg-slate-950">
        {activeTab === 'orderbook' ? (
          <OrderBookContent />
        ) : (
          <TradesContent />
        )}
      </div>
    </div>
  )
}

function OrderBookContent() {
  return (
    <div className="bg-slate-950 h-full flex flex-col">
      {/* Headers */}
      <div className="px-2 py-2 grid grid-cols-3 text-sm text-slate-400 border-b border-slate-700 bg-slate-950">
        <div className="text-left">Price</div>
        <div className="text-left">Size (HYPE)</div>
        <div className="text-left">Total (HYPE)</div>
      </div>

      {/* Asks (매도) - 위쪽 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        <div className="px-2 py-1 space-y-px">
          {/* 100개의 asks 데이터 - 역순(높은 가격부터) */}
          {[...Array(100)].map((_, i) => {
            const basePrice = 43.400;
            const price = basePrice - i * 0.001; // 역순으로 높은 가격부터
            const size = 1.0 + (i * 0.5) % 50;
            const total = 100.0 + (i * 12.3) % 500;
            return (
              <div key={`ask-${i}`} className="grid grid-cols-3 text-sm py-0.5 hover:bg-slate-800/50">
                <div className="text-left text-red-400 font-mono">${price.toFixed(3)}</div>
                <div className="text-left text-white font-mono">{size.toFixed(2)}</div>
                <div className="text-left text-slate-300 font-mono">{total.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spread - 가운데 고정 */}
      <div className="px-2 py-3 text-center border-y border-slate-700 bg-slate-800/50 flex-shrink-0">
        <div className="text-xs text-slate-400">Spread</div>
        <div className="text-sm text-white font-mono font-bold">$43.200</div>
        <div className="text-xs text-slate-400">0.002 (0.005%)</div>
      </div>

      {/* Bids (매수) - 아래쪽 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        <div className="px-2 py-1 space-y-px">
          {/* 100개의 bids 데이터 - 순서(높은 가격부터) */}
          {[...Array(100)].map((_, i) => {
            const basePrice = 43.199;
            const price = basePrice - i * 0.001; // 높은 가격부터 낮은 가격으로
            const size = 1.0 + (i * 0.7) % 50;
            const total = 100.0 + (i * 15.7) % 500;
            return (
              <div key={`bid-${i}`} className="grid grid-cols-3 text-sm py-0.5 hover:bg-slate-800/50">
                <div className="text-left text-green-400 font-mono">${price.toFixed(3)}</div>
                <div className="text-left text-white font-mono">{size.toFixed(2)}</div>
                <div className="text-left text-slate-300 font-mono">{total.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

function TradesContent() {
  return (
    <div className="bg-slate-950 h-full">
      {/* Headers */}
      <div className="px-2 py-2 grid grid-cols-3 text-sm text-slate-400 border-b border-slate-700 bg-slate-950">
        <div className="text-left">Price</div>
        <div className="text-left">Size (HYPE)</div>
        <div className="text-left">Time</div>
      </div>

      {/* Trades List - 스크롤 가능 */}
      <div className="overflow-y-auto max-h-[65vh] bg-slate-950">
        <div className="px-2 py-1">
          {[...mockTrades, ...mockTrades, ...mockTrades].map((trade, index) => (
            <div key={index} className="grid grid-cols-3 text-sm py-1 hover:bg-slate-800/50">
              <div className={`text-left font-mono ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                ${trade.price.toFixed(3)}
              </div>
              <div className="text-left text-white font-mono">{trade.size.toFixed(2)}</div>
              <div className="text-left text-slate-300 font-mono text-xs">{trade.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
