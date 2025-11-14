'use client'

import { GovernanceDashboard } from './GovernanceDashboard'
import { RebalancingVotesSection } from './RebalancingVotesSection'
import { VsBattleSection } from '../discover/vs-battle-section'
import { CompletedRebalancingSection } from './CompletedRebalancingSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function GovernanceLayout() {
  return (
    <div className="min-h-screen bg-teal-base">
      <div className="space-y-8">
        {/* Dashboard - Statistics */}
        <GovernanceDashboard />

        {/* Rebalancing Votes Section Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Rebalancing Votes
          </h2>
          <p className="text-slate-400 mt-2">
            Vote on asset allocation changes and composition rebalancing
          </p>
        </div>

        {/* Tabs: Proposals / VS Battles */}
        <Tabs defaultValue="proposals" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="proposals" className="glass-tab-small-brand">
              Proposals
            </TabsTrigger>
            <TabsTrigger value="battles" className="glass-tab-small-brand">
              VS Battles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="tab-content-animate mt-6">
            <RebalancingVotesSection />
          </TabsContent>

          <TabsContent value="battles" className="tab-content-animate mt-6">
            <VsBattleSection />
          </TabsContent>
        </Tabs>

        {/* Completed Rebalancing Section */}
        <CompletedRebalancingSection />
      </div>
    </div>
  )
}
