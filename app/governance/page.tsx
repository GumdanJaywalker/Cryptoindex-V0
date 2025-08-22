'use client'

import { Header } from '@/components/layout/header'
import { GovernanceLayout } from '@/components/governance/GovernanceLayout'

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-14">
      <Header />
      <GovernanceLayout />
    </div>
  )
}