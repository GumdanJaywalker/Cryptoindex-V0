'use client'

import { Header } from '@/components/layout/Header'
import { TrendingLayout } from '@/components/trending/TrendingLayout'

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <TrendingLayout />
    </div>
  )
}