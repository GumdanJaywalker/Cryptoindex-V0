'use client'

import { Header } from '@/components/layout/header'
import { TradingLayout } from '@/components/trading/TradingLayout'

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-14">
      <Header />
      <TradingLayout />
    </div>
  )
}