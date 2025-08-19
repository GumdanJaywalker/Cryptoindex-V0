'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import TestOrderBook from '@/components/test/TestOrderBook'
import TestTradingPanel from '@/components/test/TestTradingPanel'
import TestRecentTrades from '@/components/test/TestRecentTrades'
import TestOpenOrders from '@/components/test/TestOpenOrders'

export default function TestTradingPage() {
  const router = useRouter()
  const { ready, authenticated, user, login } = usePrivy()
  const [selectedPair, setSelectedPair] = useState('HYPERINDEX-USDC')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/privy-login')
    }
  }, [ready, authenticated, router])

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <button 
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
          >
            Login to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">HyperIndex DEX - Test Trading</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>User: {user.email?.address || user.wallet?.address}</span>
          <span>•</span>
          <span>Pair: {selectedPair}</span>
          <span>•</span>
          <span className="text-green-400">● Connected</span>
        </div>
      </div>

      {/* Trading Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        
        {/* Left Column - OrderBook */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 h-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Order Book</h2>
            <TestOrderBook pair={selectedPair} />
          </div>
        </div>

        {/* Middle Column - Trading Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center">Trading Panel</h2>
            <div className="flex-1">
              <TestTradingPanel 
                pair={selectedPair} 
                userId={user.id} 
                onOrderPlaced={() => {
                  // Refresh other components
                  window.location.reload() // Simple refresh for testing
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Recent Trades & Orders */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Recent Trades */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center">Recent Trades</h2>
            <TestRecentTrades pair={selectedPair} />
          </div>

          {/* Open Orders */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center">My Orders</h2>
            <TestOpenOrders 
              userId={user.id} 
              onOrderCancelled={() => {
                // Refresh other components
                window.location.reload() // Simple refresh for testing
              }}
            />
          </div>

        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
          <div className="text-sm text-gray-400 grid grid-cols-2 gap-4">
            <div>
              <strong>User ID:</strong> {user.id}
            </div>
            <div>
              <strong>Email:</strong> {user.email?.address || 'N/A'}
            </div>
            <div>
              <strong>Wallet:</strong> {user.wallet?.address || user.linkedAccounts?.find(acc => acc.type === 'wallet')?.address || 'N/A'}
            </div>
            <div>
              <strong>Chain:</strong> HyperEVM Testnet (998)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}