'use client'

import { Header } from '@/components/layout/Header'
import LeftSidebar from '@/components/sidebar/LeftSidebar'
import { IndexBuilderWizard } from '@/components/launch/IndexBuilderWizard'
import { IndexCreatorOverview } from '@/components/launch/IndexCreatorOverview'

export default function LaunchIndexPage() {
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
          <main className="order-1 lg:order-2 max-w-7xl mx-auto w-full">
            <IndexBuilderWizard />
            <IndexCreatorOverview />
          </main>
        </div>
      </div>
    </div>
  )
}
