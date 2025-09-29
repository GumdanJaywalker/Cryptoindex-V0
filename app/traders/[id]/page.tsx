"use client"

import { useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { useRouter, useSearchParams } from 'next/navigation'
import TraderPortfolioPublic from '@/components/portfolio/TraderPortfolioPublic'

export default function TraderPortfolioPage({ params }: { params: { id: string } }) {
  const traderId = params.id
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-[4vw] lg:px-[3vw] lg:pr-[1.5vw] py-[1.5vw] max-w-6xl mx-auto">
        <TraderPortfolioPublic traderId={traderId} />
      </div>
    </div>
  )
}
