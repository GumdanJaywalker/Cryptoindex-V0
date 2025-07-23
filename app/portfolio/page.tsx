'use client'

import { Header } from '@/components/layout/Header'
import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <PortfolioLayout />
    </div>
  )
}