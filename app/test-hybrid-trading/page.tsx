'use client'

import { useEffect, useState } from 'react'
import HybridOrderBook from '@/components/test/HybridOrderBook'
import HybridTradingPanel from '@/components/test/HybridTradingPanel'
import HybridRecentTrades from '@/components/test/HybridRecentTrades'
import HybridOpenOrders from '@/components/test/HybridOpenOrders'
import AMMPoolStatus from '@/components/test/AMMPoolStatus'

export default function TestHybridTradingPage() {
  const [selectedPair, setSelectedPair] = useState('HYPERINDEX-USDC')
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Loading Hybrid Trading System...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🚀 HyperIndex Hybrid DEX - Testing</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Mode: AMM + Orderbook Hybrid</span>
          <span>•</span>
          <span>Pair: {selectedPair}</span>
          <span>•</span>
          <span className="text-green-400">● Mock Trading Environment</span>
        </div>
      </div>

      {/* Trading Interface Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
        
        {/* Left Column - OrderBook & AMM Pool */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* AMM Pool Status */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-400">
              🏦 AMM Pool
            </h2>
            <AMMPoolStatus pair={selectedPair} refreshKey={refreshKey} />
          </div>

          {/* Order Book */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center text-green-400">
              📖 Order Book
            </h2>
            <HybridOrderBook pair={selectedPair} refreshKey={refreshKey} />
          </div>
        </div>

        {/* Middle Column - Trading Panel */}
        <div className="xl:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center text-purple-400">
              💰 Hybrid Trading
            </h2>
            <div className="flex-1">
              <HybridTradingPanel 
                pair={selectedPair} 
                userId="550e8400-e29b-41d4-a716-446655440000"
                onOrderPlaced={handleRefresh}
              />
            </div>
          </div>
        </div>

        {/* Right Columns - Recent Trades & Orders */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Recent Trades */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center text-yellow-400">
              📊 Recent Trades
            </h2>
            <HybridRecentTrades pair={selectedPair} refreshKey={refreshKey} />
          </div>

          {/* Open Orders */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center text-red-400">
              📋 My Orders
            </h2>
            <HybridOpenOrders 
              userId="550e8400-e29b-41d4-a716-446655440000" 
              onOrderCancelled={handleRefresh}
              refreshKey={refreshKey}
            />
          </div>

        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🔧 Debug Info</h3>
          <div className="text-sm text-gray-400 grid grid-cols-2 gap-4">
            <div>
              <strong>Mode:</strong> Hybrid Trading (AMM + Orderbook)
            </div>
            <div>
              <strong>User ID:</strong> 550e8400-e29b-41d4-a716-446655440000
            </div>
            <div>
              <strong>Auth Token:</strong> dev-token
            </div>
            <div>
              <strong>Pair:</strong> {selectedPair}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}