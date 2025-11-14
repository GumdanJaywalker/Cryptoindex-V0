'use client'

import { Footer } from '@/components/layout/Footer'
import { GovernanceLayout } from '@/components/governance/GovernanceLayout'

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-teal-base text-white pt-16">
      <div className="px-4 lg:px-4 pt-1 pb-24">
        <div className="max-w-7xl mx-auto w-full">
          <GovernanceLayout />
        </div>
      </div>
      <Footer />
    </div>
  )
}
