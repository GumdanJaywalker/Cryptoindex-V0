'use client'

import { Header } from '@/components/layout/Header'
import { VaultsLayout } from '@/components/vaults/VaultsLayout'

export default function VaultsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <VaultsLayout />
    </div>
  )
}