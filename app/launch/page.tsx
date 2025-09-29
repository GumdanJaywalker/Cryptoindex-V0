'use client'

import { Header } from '@/components/layout/Header'
import LeftSidebar from '@/components/sidebar/LeftSidebar'
import { IndexBuilderWizard } from '@/components/launch/IndexBuilderWizard'
import { IndexCreatorOverview } from '@/components/launch/IndexCreatorOverview'

export default function LaunchIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] gap-5 items-start">
          <div className="order-2 lg:order-1"><LeftSidebar /></div>
          <main className="order-1 lg:order-2 max-w-7xl mx-auto w-full px-2 lg:px-0">
            <IndexBuilderWizard />
            <IndexCreatorOverview />
          </main>
        </div>
      </div>
    </div>
  )
}
