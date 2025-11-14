'use client'

import { useState, useEffect, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { useTradingStore } from '@/lib/store/trading-store'
import { getAllTradingIndexes } from '@/lib/data/launched-indexes'

// 🆕 Phase 6: Generate dynamic whale transactions based on selected index
// 🆕 Now uses constituent assets instead of index name
const generateWhaleTransactions = (symbol: string, currentPrice: number, assets: string[]) => {
  const cleanSymbol = symbol.replace('_INDEX', '')
  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Hyperliquid', 'OKX', 'Bybit', 'Gate.io']
  const times = ['2m ago', '5m ago', '8m ago', '12m ago', '15m ago', '18m ago', '22m ago', '25m ago', '30m ago', '35m ago']

  // Fallback to index name if no assets
  const symbolPool = assets.length > 0 ? assets : [cleanSymbol]

  // Generate base transactions
  const baseTransactions = [
    {
      type: 'buy' as const,
      amountRange: [100000, 200000],
      priceOffset: 0.002
    },
    {
      type: 'sell' as const,
      amountRange: [80000, 150000],
      priceOffset: -0.001
    },
    {
      type: 'buy' as const,
      amountRange: [50000, 100000],
      priceOffset: 0.003
    },
    {
      type: 'sell' as const,
      amountRange: [120000, 180000],
      priceOffset: -0.002
    },
    {
      type: 'buy' as const,
      amountRange: [40000, 80000],
      priceOffset: 0.001
    }
  ]

  return baseTransactions.map((base, index) => {
    const amount = Math.floor(base.amountRange[0] + Math.random() * (base.amountRange[1] - base.amountRange[0]))
    const price = currentPrice * (1 + base.priceOffset * (Math.random() - 0.5))
    const value = amount * price

    // Generate random address
    const randomHex = () => Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0')
    const address = `0x${randomHex()}...${randomHex()}`

    // 🆕 Randomly pick a constituent asset from the pool
    const randomAsset = symbolPool[Math.floor(Math.random() * symbolPool.length)]

    return {
      id: `${index + 1}`,
      type: base.type,
      amount,
      price,
      value,
      time: times[index % times.length],
      address,
      exchange: exchanges[index % exchanges.length],
      symbol: randomAsset  // 🆕 Use constituent asset instead of index name
    }
  })
}

export function WhaleAlert() {
  const { formatPrice, formatBalance } = useCurrency()
  const [isClient, setIsClient] = useState(false)

  // 🆕 Phase 6: Subscribe to Trading Store
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)
  const currentPrice = useTradingStore(state => state.currentPrice)

  // 🆕 Phase 6: Responsive visible count (4-7 items based on screen height)
  const [visibleCount, setVisibleCount] = useState(5)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 🆕 Phase 6: Adjust visible count based on screen height
  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight
      if (height >= 1080) {
        setVisibleCount(7)  // Large screens: 7 items
      } else if (height >= 900) {
        setVisibleCount(6)  // Medium screens: 6 items
      } else if (height >= 768) {
        setVisibleCount(5)  // Small screens: 5 items
      } else {
        setVisibleCount(4)  // Very small screens: 4 items
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 🆕 Phase 6: Generate dynamic transactions
  const whaleTransactions = useMemo(() => {
    // Get current index data to access constituent assets
    const allIndexes = getAllTradingIndexes()
    const currentIndex = allIndexes.find(idx => idx.symbol === selectedIndexSymbol)
    const assets = (currentIndex as any)?.assets || []

    return generateWhaleTransactions(selectedIndexSymbol, currentPrice, assets)
  }, [selectedIndexSymbol, currentPrice])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="h-full bg-background flex flex-col font-[Arial,sans-serif]">
      {/* Header - h-10 to match tabs */}
      <div className="h-10 px-3 border-b border-teal bg-teal-card flex items-center gap-2 flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-brand" />
        <h3 className="text-sm font-medium text-white">Whale Alert</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content - scrollable area with padding - 🆕 Limited items with repeat */}
      <div className="flex-1 overflow-y-auto bg-teal-base scrollbar-thin scrollbar-track-background scrollbar-thumb-muted-foreground/30 hover:scrollbar-thumb-muted-foreground/50">
        {/* 🆕 Phase 6: Display limited items (visibleCount * 3 for scroll effect) */}
        {/* ✅ Fix hydration: Only render on client */}
        {isClient && Array.from({ length: visibleCount * 3 }).map((_, repeatIndex) => {
          const tx = whaleTransactions[repeatIndex % whaleTransactions.length]
          const index = repeatIndex
          const isLargeTransaction = tx.value > 200000; // Large transactions (>200K value)

          return (
          <div key={`${tx.id}-${index}`} className={`px-3 ${index === 0 ? 'pt-2 pb-2' : 'py-2'} border-b border-teal/50 hover:bg-teal-elevated/50 transition-colors ${isLargeTransaction ? 'border-l-2 border-l-brand bg-brand/5' : ''}`}>
            {/* Transaction Type & Amount */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${
                  tx.type === 'buy' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.type.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{tx.time}</span>
            </div>

            {/* Amount & Price - 🆕 Display actual symbol */}
            <div className="mb-1">
              <div className="text-sm text-foreground font-medium">
                {formatNumber(tx.amount)} {tx.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                @ {formatPrice(tx.price)}
              </div>
            </div>

            {/* Value & Details */}
            <div className="flex items-center justify-between text-xs">
              <div className={`font-medium ${isLargeTransaction ? 'text-brand' : 'text-foreground'}`}>
                {formatBalance(tx.value)}
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">{tx.exchange}</div>
                <div className="text-muted-foreground/70 text-[10px]">{formatAddress(tx.address)}</div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
