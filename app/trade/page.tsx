'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { TradingLayout } from '@/components/trading/TradingLayout'
import { useTradingStore } from '@/lib/store/trading-store'

function SearchParamsHandler() {
  const searchParams = useSearchParams()
  const indexSymbol = searchParams.get('index')
  const setSelectedIndexSymbol = useTradingStore((state) => state.setSelectedIndexSymbol)

  useEffect(() => {
    if (indexSymbol) {
      setSelectedIndexSymbol(indexSymbol)
    }
  }, [indexSymbol, setSelectedIndexSymbol])

  return null
}

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-teal-base text-white">
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      <TradingLayout />
      <Footer />
    </div>
  )
}