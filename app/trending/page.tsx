'use client'

import { Header } from '@/components/layout/header'
import { TrendingLayout } from '@/components/trending/TrendingLayout'

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-14">
      <Header />
      <TrendingLayout />
    </div>
  )
}