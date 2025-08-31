'use client'

import { RebalancingVotesSection } from './RebalancingVotesSection'
import { GovernanceDashboard } from './GovernanceDashboard'

export function GovernanceLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Governance Dashboard Header - PC Optimized */}
        <GovernanceDashboard />
        
        {/* Rebalancing Votes Section - Full Width for PC */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-brand">⚖️🥊</span>
              Index Rebalancing Battles
            </h2>
            <p className="text-slate-400 mt-2">
              Vote on meme battles within each index to determine composition weights and allocations
            </p>
          </div>
          <RebalancingVotesSection />
        </div>
      </div>
    </div>
  )
}