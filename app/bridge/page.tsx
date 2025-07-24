'use client'

import { Header } from '@/components/layout/Header'
import { BridgeLayout } from '@/components/bridge/BridgeLayout'

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <BridgeLayout />
    </div>
  )
}