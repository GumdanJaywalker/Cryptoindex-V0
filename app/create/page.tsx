'use client'

import { Header } from '@/components/layout/Header'
import { IndexBuilderWizard } from '@/components/create/IndexBuilderWizard'
import { IndexCreatorOverview } from '@/components/create/IndexCreatorOverview'

export default function CreateIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <IndexBuilderWizard />
        <IndexCreatorOverview />
      </main>
    </div>
  )
}
