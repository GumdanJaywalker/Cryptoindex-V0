"use client"

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TraderPortfolioPublic from '@/components/portfolio/TraderPortfolioPublic'

export default function TraderPortfolioPage({ params }: { params: { id: string } }) {
  const traderId = params.id
  return (
    <div className="min-h-screen bg-teal-base text-white">
      <div className="px-4 lg:px-6 py-8 max-w-7xl mx-auto">
        <TraderPortfolioPublic traderId={traderId} />
      </div>
    </div>
  )
}
