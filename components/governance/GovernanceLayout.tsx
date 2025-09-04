'use client'

import { GovernanceDashboard } from './GovernanceDashboard'
import { ProposalsSection } from './ProposalsSection'

export function GovernanceLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GovernanceDashboard />

        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-brand">⚖️</span>
              Governance Proposals
            </h2>
            <p className="text-slate-400 mt-2">
              Snapshot → Voting → Timelock → Multisig → Execute
            </p>
          </div>
          <ProposalsSection />
        </div>
      </div>
    </div>
  )
}
