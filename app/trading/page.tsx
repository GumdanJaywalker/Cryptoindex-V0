'use client'

import { Header } from '@/components/layout/Header'
import { TradingLayout } from '@/components/trading/TradingLayout'

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <TradingLayout />
    </div>
  )
}