'use client'

import { Header } from '@/components/layout/Header'
import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'
import LeftSidebar from '@/components/sidebar/LeftSidebar'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-4 pt-4 pb-4 lg:pb-0">
        <div className="grid grid-cols-1
          lg:grid-cols-[260px_1fr]
          xl:grid-cols-[280px_1fr]
          2xl:grid-cols-[300px_1fr]
          gap-3 items-start lg:items-stretch">
          <div className="order-2 lg:order-1"><LeftSidebar /></div>
          <div className="order-1 lg:order-2 max-w-6xl mx-auto w-full">
            <PortfolioLayout />
          </div>
        </div>
      </div>
    </div>
  )
}
