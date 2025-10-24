'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useCurrency } from '@/lib/hooks/useCurrency'

// Mock whale transaction data
const mockWhaleTransactions = [
  {
    id: '1',
    type: 'buy',
    amount: 125000,
    price: 43.235,
    value: 5404375,
    time: '2분 전',
    address: '0x1a2b...3c4d',
    exchange: 'Binance'
  },
  {
    id: '2',
    type: 'sell',
    amount: 89000,
    price: 43.221,
    value: 3846669,
    time: '5분 전',
    address: '0x5e6f...7g8h',
    exchange: 'Coinbase'
  },
  {
    id: '3',
    type: 'buy',
    amount: 67500,
    price: 43.240,
    value: 2918700,
    time: '8분 전',
    address: '0x9i0j...1k2l',
    exchange: 'Kraken'
  },
  {
    id: '4',
    type: 'sell',
    amount: 156000,
    price: 43.198,
    value: 6739088,
    time: '12분 전',
    address: '0x3m4n...5o6p',
    exchange: 'Hyperliquid'
  },
  {
    id: '5',
    type: 'buy',
    amount: 45200,
    price: 43.250,
    value: 1955300,
    time: '15분 전',
    address: '0x7q8r...9s0t',
    exchange: 'OKX'
  }
]

export function WhaleAlert() {
  const { formatPrice, formatBalance } = useCurrency()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="h-96 bg-background flex flex-col border-muted-foreground/30 border rounded-sm">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-border flex items-center gap-2 bg-secondary flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-brand" />
        <h3 className="text-sm font-medium text-foreground">Whale Alert</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content - 고정 높이에서 내부 스크롤 */}
      <div className="flex-1 overflow-y-auto bg-background scrollbar-thin scrollbar-track-background scrollbar-thumb-muted-foreground/30 hover:scrollbar-thumb-muted-foreground/50">
        {/* 실제 거래 데이터 (스크롤로 확인 가능) */}
        {[...mockWhaleTransactions, ...mockWhaleTransactions, ...mockWhaleTransactions].map((tx, index) => {
          const isLargeTransaction = isClient && tx.value > 5000000; // $5M+ transactions get special treatment, only on client
          return (
          <div key={`${tx.id}-${index}`} className={`px-3 ${index === 0 ? 'pt-0.5 pb-2' : 'py-2'} border-b border-border/50 hover:bg-accent/50 transition-colors ${isLargeTransaction ? 'border-l-2 border-l-brand bg-brand/5' : ''}`}>
            {/* Transaction Type & Amount */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {tx.type === 'buy' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs font-medium ${
                  tx.type === 'buy' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.type.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{tx.time}</span>
            </div>

            {/* Amount & Price */}
            <div className="mb-1">
              <div className="text-sm text-foreground font-medium">
                {formatNumber(tx.amount)} HYPE
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
