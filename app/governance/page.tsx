'use client'

import { Header } from '@/components/layout/Header'
import { GovernanceLayout } from '@/components/governance/GovernanceLayout'

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <GovernanceLayout />
    </div>
  )
}