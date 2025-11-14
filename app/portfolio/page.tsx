'use client'

import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-teal-base text-white">
      <div className="px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <PortfolioLayout />
        </div>
      </div>
    </div>
  )
}
