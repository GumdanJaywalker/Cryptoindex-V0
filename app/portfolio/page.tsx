'use client'

import { Header } from '@/components/layout/header'
import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-14">
      <Header />
      <PortfolioLayout />
    </div>
  )
}