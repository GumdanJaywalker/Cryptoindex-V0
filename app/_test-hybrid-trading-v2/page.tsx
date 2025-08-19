'use client'

import { useState } from 'react'
import HybridTradingPanelV2 from '@/components/test/HybridTradingPanelV2'
import HybridOrderBookV2 from '@/components/test/HybridOrderBookV2'
import HybridRecentTradesV2 from '@/components/test/HybridRecentTradesV2'
import AMMPoolStatusV2 from '@/components/test/AMMPoolStatusV2'
import TradingStatsV2 from '@/components/test/TradingStatsV2'

export default function TestHybridTradingV2() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOrderPlaced = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            🚀 HyperIndex Hybrid Trading System V2
          </h1>
          <p className="text-gray-400">
            Advanced chunk-based routing: AMM + Off-chain Orderbook with smart order splitting
          </p>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔥 V2 New Features:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Smart Order Splitting:</strong> Large orders split into optimal chunks</li>
              <li><strong>Real-time Price Tracking:</strong> Each chunk evaluated separately</li>
              <li><strong>Dynamic Routing:</strong> AMM ↔ Orderbook switching within single order</li>
              <li><strong>Chunk Analytics:</strong> Detailed execution statistics</li>
              <li><strong>Slippage Protection:</strong> Maximum chunk size limits</li>
            </ul>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trading Panel */}
          <div className="lg:col-span-1">
            <HybridTradingPanelV2 
              onOrderPlaced={handleOrderPlaced}
              refreshKey={refreshKey}
            />
          </div>

          {/* Middle Column - Orderbook & AMM Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📖 Off-chain Orderbook</h2>
              <HybridOrderBookV2 
                pair="HYPERINDEX-USDC" 
                refreshKey={refreshKey}
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🏦 Mock AMM Pool Status</h2>
              <AMMPoolStatusV2 
                pair="HYPERINDEX-USDC" 
                refreshKey={refreshKey}
              />
            </div>
          </div>

          {/* Right Column - Recent Trades & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Recent Trades (Hybrid)</h2>
              <HybridRecentTradesV2 
                pair="HYPERINDEX-USDC" 
                refreshKey={refreshKey}
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📈 Trading Statistics V2</h2>
              <TradingStatsV2 
                pair="HYPERINDEX-USDC" 
                refreshKey={refreshKey}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="text-center text-sm text-gray-400">
            <p>
              🔬 <strong>Testing Environment:</strong> Off-chain orderbook + Mock AMM simulation
            </p>
            <p className="mt-1">
              V2 Features: Chunk-based routing, Real-time price tracking, Advanced analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}