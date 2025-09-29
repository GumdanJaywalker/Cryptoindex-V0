'use client'

import { Header } from '@/components/layout/Header'
import LeftSidebar from '@/components/sidebar/LeftSidebar'
import { IndexBuilderWizard } from '@/components/launch/IndexBuilderWizard'
import { IndexCreatorOverview } from '@/components/launch/IndexCreatorOverview'

export default function LaunchIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-[4vw] lg:px-[3vw] lg:pr-[1.5vw] py-[1.5vw]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,26vw)_minmax(52vw,1fr)] gap-3 xl:gap-4 2xl:gap-6 items-start lg:items-stretch">
          <div className="order-2 lg:order-1 lg:self-stretch"><LeftSidebar /></div>
          <main className="order-1 lg:order-2 max-w-7xl mx-auto w-full px-2 lg:px-0">
            <IndexBuilderWizard />
            <IndexCreatorOverview />
          </main>
        </div>
      </div>
    </div>
  )
}
