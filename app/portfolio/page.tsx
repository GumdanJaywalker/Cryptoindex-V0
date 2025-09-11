'use client'

import { Header } from '@/components/layout/Header'
import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'
import LeftSidebar from '@/components/sidebar/LeftSidebar'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] gap-5 items-start">
          <div className="order-2 lg:order-1"><LeftSidebar /></div>
          <div className="order-1 lg:order-2 max-w-6xl mx-auto w-full px-2 lg:px-0">
            <PortfolioLayout />
          </div>
        </div>
      </div>
    </div>
  )
}
