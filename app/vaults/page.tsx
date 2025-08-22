'use client'

import { Header } from '@/components/layout/header'
import { VaultsLayout } from '@/components/vaults/VaultsLayout'

export default function VaultsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-14">
      <Header />
      <VaultsLayout />
    </div>
  )
}